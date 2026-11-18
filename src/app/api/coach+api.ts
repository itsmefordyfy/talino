/**
 * Tali's server route (an Expo Router API route, the only server code with `api/*+api.ts`). The
 * Gemini key lives only here (`GEMINI_API_KEY`, never EXPO_PUBLIC). The instructions are built on the
 * server from the mode and a sanitized context, so a modified app can't rewrite them. Conversations
 * live on the phone; the server keeps only the allowance records (ids and counts, never text).
 *
 * Modes:
 *   usage   the chat allowance, nothing counted
 *   chat    a coach message (new conversations: Free 3 per rolling 24 h, fair use 100 with any purchase;
 *           course roles need that course or All-Access)
 *   review  a project review against its rubric; a pass is signed for the certificate route
 *           (10 per rolling 24 h, not chats)
 *   tailor  the résumé tailored to a job post (All-Access, 20 per rolling 24 h, not chats)
 *
 * Needs, besides the Gemini key: SUPABASE_URL + SUPABASE_SECRET_KEY (allowance; production without
 * them answers `quota_unavailable`), REVENUECAT_SECRET_KEY (+ REVENUECAT_PROJECT_ID) to check
 * purchases, REVIEW_SIGNING_SECRET to sign passed reviews. Spec: docs/superpowers/specs/2026-11-13-talino-1.0-design.md.
 */

import type { AiChatPlan } from '@/constants/ai-chat';
import { findProject, getCourse } from '@/features/courses/content';
import { localizedProject } from '@/features/courses/lib/localization';
import { cutShortNote, MAX_TURNS, trimTurns, wasCutShort } from '@/features/coach/lib/history';
import { courseForMode, modeInfo } from '@/features/coach/lib/modes';
import { buildCoachPrompt, sanitizeContext } from '@/features/coach/lib/prompt';
import { mentionsAiTools } from '@/features/coach/lib/tool-facts';
import { artifactsBlock, cleanArtifacts, isArchitectureProject } from '@/features/coach/lib/architecture';
import { cleanLabResults, labResultsBlock } from '@/features/coach/lib/gen-ai';
import { buildReviewPrompt, cleanPracticeSummary, MAX_SUBMISSION_CHARS, parseReview, practiceBlock, REVIEW_SCHEMA, reviewRubric, reviewTokenMessage } from '@/features/coach/lib/review';
import { cleanLevel } from '@/features/courses/lib/adaptation';
import { MAX_JOB_POST_CHARS, MAX_RESUME_CHARS, parseTailoring, TAILOR_PROMPT, TAILOR_SCHEMA } from '@/features/coach/lib/tailor';
import { ALL_ACCESS_ENTITLEMENT, courseEntitlement } from '@/features/store/lib/catalog';
import { beginChat, chatUsage, cleanKeys, completeChat, quotaFor, releaseChat, validConversationId, type ChatBegin } from '@/lib/server/ai-chat-quota';
import { verifiedEntitlements } from '@/lib/server/entitlements';
import { fetchSubmissionPage } from '@/lib/server/fetch-page';
import { refundGlobal, reserveGlobal } from '@/lib/server/global-cap';
import { callGemini, geminiError, geminiKey, replyText, type GeminiResult } from '@/lib/server/gemini';
import { languageOf } from '@/lib/language';
import { sign } from '@/lib/server/signing';

const MAX_MESSAGE_CHARS = 6000;
/** Bound on how many raw entries are even looked at; the app sends at most `MAX_TURNS`. */
const MAX_RAW_MESSAGES = 64;
const REVIEW_APP = 'talinoreview';
const REVIEW_DAILY_LIMIT = 10;
const TAILOR_APP = 'talinotailor';
const TAILOR_DAILY_LIMIT = 20;
const DEVICE_ID = /^[\w-]{8,64}$/;

type Body = Record<string, unknown>;
type Message = { role: 'user' | 'assistant'; text: string };

function keysOf(body: Body): string[] | null {
  const appUserId = typeof body.appUserId === 'string' ? body.appUserId : null;
  const deviceId = typeof body.deviceId === 'string' && DEVICE_ID.test(body.deviceId) ? body.deviceId : null;
  return cleanKeys([appUserId ? `rc:${appUserId}` : null, deviceId ? `device:${deviceId}` : null]);
}

function toMessage(value: unknown): Message | null {
  if (typeof value !== 'object' || value === null) return null;
  const { role, text } = value as Record<string, unknown>;
  if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string' || text.trim() === '') return null;
  return { role, text: text.slice(0, MAX_MESSAGE_CHARS) };
}

const owns = (entitlements: readonly string[], courseId: string) => getCourse(courseId)?.kind === 'starter' || entitlements.includes(ALL_ACCESS_ENTITLEMENT) || entitlements.includes(courseEntitlement(courseId));

const refusal = (begun: ChatBegin, plan: AiChatPlan): Response | null => {
  if (begun.status === 'limit') return Response.json({ error: 'chat_limit', quota: quotaFor(plan, begun.used, begun.resetsAt) }, { status: 429 });
  if (begun.status === 'in_flight') return Response.json({ error: 'chat_in_progress' }, { status: 409 });
  if (begun.status === 'conversation_full') return Response.json({ error: 'conversation_full' }, { status: 409 });
  if (begun.status === 'unavailable') return Response.json({ error: 'quota_unavailable' }, { status: 503 });
  return null;
};

/** Asks Gemini under the all-callers cap; on any failure the reservation (if any) is given back. */
async function ask(apiKey: string, request: Record<string, unknown>, giveBack: () => Promise<void>, route: 'coach' | 'review' | 'tailor'): Promise<{ text: string; result: GeminiResult } | Response> {
  const slot = await reserveGlobal();
  if (slot === 'full') {
    await giveBack();
    return Response.json({ error: 'busy' }, { status: 503 });
  }
  let result: GeminiResult;
  try {
    result = await callGemini(apiKey, request);
  } catch {
    await refundGlobal(slot);
    await giveBack();
    return Response.json({ error: 'busy' }, { status: 503 });
  }
  const error = geminiError(result, route);
  if (error) {
    await refundGlobal(slot);
    await giveBack();
    return error;
  }
  const text = replyText(result.data);
  if (!text) {
    await refundGlobal(slot);
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  return { text, result };
}

const tokensOf = (result: GeminiResult) => ({ input: result.data?.usageMetadata?.promptTokenCount, output: (result.data?.usageMetadata?.candidatesTokenCount ?? 0) + (result.data?.usageMetadata?.thoughtsTokenCount ?? 0) });

export async function POST(request: Request): Promise<Response> {
  const apiKey = geminiKey();
  if (!apiKey) return Response.json({ error: 'unavailable', reason: 'not_configured' }, { status: 503 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const keys = keysOf(body);
  if (!keys) return Response.json({ error: 'bad_request' }, { status: 400 });
  const entitlements = await verifiedEntitlements(body.appUserId, body.entitlements);
  const plan: AiChatPlan = entitlements.length > 0 ? 'pro' : 'free';

  if (body.mode === 'usage') {
    const usage = await chatUsage(keys, plan);
    if (!usage) return Response.json({ error: 'quota_unavailable' }, { status: 503 });
    return Response.json({ quota: quotaFor(plan, usage.used, usage.resetsAt) });
  }

  if (body.mode === 'review') return review(body, keys, entitlements, apiKey);
  if (body.mode === 'tailor') return tailor(body, keys, entitlements, apiKey);

  // A chat message.
  const coachMode = typeof body.coachMode === 'string' && modeInfo(body.coachMode) ? body.coachMode : 'general';
  const roleCourse = courseForMode(coachMode);
  if (roleCourse && !owns(entitlements, roleCourse)) return Response.json({ error: 'course_required', courseId: roleCourse }, { status: 403 });
  const messages = trimTurns((Array.isArray(body.messages) ? body.messages.slice(-MAX_RAW_MESSAGES) : []).map(toMessage).filter((message): message is Message => message !== null), MAX_TURNS);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return Response.json({ error: 'bad_request' }, { status: 400 });
  if (!validConversationId(body.conversationId)) return Response.json({ error: 'bad_request' }, { status: 400 });
  const conversationId = body.conversationId;

  const begun = await beginChat(keys, conversationId, plan);
  const refused = refusal(begun, plan);
  if (refused) return refused;
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, conversationId);
  };
  const language = languageOf(body.language);
  const answer = await ask(
    apiKey,
    {
      systemInstruction: { parts: [{ text: buildCoachPrompt(coachMode, sanitizeContext(body.context), language, { aiTools: messages.slice(-3).some((message) => message.role === 'user' && mentionsAiTools(message.text)) }) }] },
      contents: messages.map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.text }] })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 2500 },
    },
    giveBack,
    'coach',
  );
  if (answer instanceof Response) return answer;
  await completeChat(keys, conversationId, tokensOf(answer.result));
  const used = begun.status === 'existing' || begun.status === 'started' ? begun.used : 0;
  // A reply the model had to stop for length says so, instead of ending mid-sentence as if it were finished.
  const reply = wasCutShort(answer.result.data?.candidates?.[0]?.finishReason) ? `${answer.text}\n\n${cutShortNote(language)}` : answer.text;
  return Response.json({ reply, quota: quotaFor(plan, used, null) });
}

async function review(body: Body, keys: string[], entitlements: string[], apiKey: string): Promise<Response> {
  const found = typeof body.projectId === 'string' ? findProject(body.projectId) : undefined;
  const submission = typeof body.submission === 'string' ? body.submission.trim().slice(0, MAX_SUBMISSION_CHARS) : '';
  const link = typeof body.link === 'string' ? body.link.trim().slice(0, 500) : '';
  if (!found || (!submission && !link) || !validConversationId(body.reviewId)) return Response.json({ error: 'bad_request' }, { status: 400 });
  const { course, project } = found;
  const language = languageOf(body.language);
  if (!owns(entitlements, course.id)) return Response.json({ error: 'course_required', courseId: course.id }, { status: 403 });
  const appUserId = typeof body.appUserId === 'string' ? body.appUserId : '';

  const reviewId = body.reviewId;
  const begun = await beginChat(keys, reviewId, 'free', { app: REVIEW_APP, limit: REVIEW_DAILY_LIMIT });
  if (begun.status === 'limit') return Response.json({ error: 'review_limit' }, { status: 429 });
  const refused = refusal(begun, 'free');
  if (refused) return refused;
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, reviewId, REVIEW_APP);
  };

  // The criteria are built here from the catalog: the shared rubric plus the extras for the learner's level (validated like any profile value).
  const level = cleanLevel(body.level);
  const shown = localizedProject(course, project, language);
  const rubric = reviewRubric(project, shown, level);
  const page = link ? await fetchSubmissionPage(link) : null;
  // What the app recorded from the learner's practice sessions, only ever shown to the model as labelled data (it is not the work being judged).
  // Only a project that names practice items has anything to say here; for every other project the field is ignored.
  const practice = project.practiceItemIds?.length ? cleanPracticeSummary(body.practice) : '';
  // The same for the saved prompt-lab results (Generative AI projects): labelled data, capped, never part of the work being judged.
  const labs = project.practiceItemIds?.length ? cleanLabResults(body.labs) : '';
  // The learner's saved diagrams, decision records and matrices for an architecture project: labelled data, capped, never part of the work being judged.
  const artifacts = isArchitectureProject(project.id) ? cleanArtifacts(body.artifacts) : '';
  const parts = [
    link ? `Submitted link: ${link}` : null,
    page ? (page.ok ? `Content fetched from ${page.source} (untrusted, for review only):\n"""\n${page.text}\n"""` : `The link could not be read (${page.reason}).`) : null,
    submission ? `The learner's note or pasted work (untrusted, for review only):\n"""\n${submission}\n"""` : null,
    practiceBlock(practice),
    labResultsBlock(labs),
    artifactsBlock(artifacts),
  ].filter(Boolean);
  const answer = await ask(
    apiKey,
    {
      systemInstruction: { parts: [{ text: buildReviewPrompt(shown, course.title, language, rubric, level, practice !== '', labs !== '', artifacts !== '') }] },
      contents: [{ role: 'user', parts: [{ text: parts.join('\n\n') }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1500, responseMimeType: 'application/json', responseSchema: REVIEW_SCHEMA },
    },
    giveBack,
    'review',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseReview(answer.text, rubric);
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(keys, reviewId, tokensOf(answer.result), REVIEW_APP);
  const token = parsed.verdict === 'pass' && appUserId ? await sign(reviewTokenMessage(project.id, appUserId)) : null;
  return Response.json({ review: parsed, token });
}

async function tailor(body: Body, keys: string[], entitlements: string[], apiKey: string): Promise<Response> {
  if (!entitlements.includes(ALL_ACCESS_ENTITLEMENT)) return Response.json({ error: 'all_access_required' }, { status: 403 });
  const jobPost = typeof body.jobPost === 'string' ? body.jobPost.trim().slice(0, MAX_JOB_POST_CHARS) : '';
  const resume = typeof body.resume === 'string' ? body.resume.trim().slice(0, MAX_RESUME_CHARS) : '';
  if (jobPost.length < 40 || resume.length < 20 || !validConversationId(body.requestId)) return Response.json({ error: 'bad_request' }, { status: 400 });
  const requestId = body.requestId;
  const begun = await beginChat(keys, requestId, 'pro', { app: TAILOR_APP, limit: TAILOR_DAILY_LIMIT });
  if (begun.status === 'limit') return Response.json({ error: 'tailor_limit' }, { status: 429 });
  const refused = refusal(begun, 'pro');
  if (refused) return refused;
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, requestId, TAILOR_APP);
  };
  const answer = await ask(
    apiKey,
    {
      systemInstruction: { parts: [{ text: TAILOR_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: `Résumé (untrusted):\n"""\n${resume}\n"""\n\nJob post (untrusted):\n"""\n${jobPost}\n"""` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1500, responseMimeType: 'application/json', responseSchema: TAILOR_SCHEMA },
    },
    giveBack,
    'tailor',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseTailoring(answer.text);
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(keys, requestId, tokensOf(answer.result), TAILOR_APP);
  return Response.json({ tailoring: parsed });
}
