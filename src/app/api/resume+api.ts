/**
 * The AI résumé builder's server route (an Expo Router API route; the Gemini key lives only here). It stores nothing: the
 * résumé, the job post and any uploaded file arrive in the request, are read in memory and are gone with the response.
 * Only the allowance counter (an id and a count, never text) is kept, like Tali's.
 *
 * Modes (every one is All-Access and counts once toward 40 a rolling 24 hours, not chats):
 *   generate  wording for the learner's own entries (optionally tailored to a job post)
 *   review    suggestions to accept or reject, and what is weak or missing
 *   improve   a rough description of one entry rewritten as bullets
 *   import    a pasted résumé, a PDF or a Word file read into the same shape as a résumé
 *   portfolio headline, about and project write-ups for the public portfolio, from the learner's own words and projects
 *   portfolio-review  a review of the whole portfolio: what is missing, wording the learner can apply, project order and what to lead with
 *   template  a message template (cover letter, proposal, follow-up…) rewritten for one situation, from the template and the learner's notes;
 *             their name and links are never sent (the app keeps them as tokens)
 *
 * The model is never given contact details or a name, and never asked for a résumé: it returns wording keyed by the ids of
 * the learner's own entries, and everything it writes is checked against the learner's facts (features/resume/lib/ai).
 * Needs what the coach route needs (GEMINI_API_KEY, SUPABASE_URL + SUPABASE_SECRET_KEY, REVENUECAT_SECRET_KEY).
 * Spec: docs/superpowers/specs/2026-11-14-ai-resume-builder-design.md.
 */

import { parseGenerated, parseImported, parseImproved, parseReview } from '@/features/resume/lib/ai';
import { generateUserText, importUserText, improveUserText, isImproveStyle, MAX_IMPORT_CHARS, MAX_JOB_CHARS, promptFor, reviewUserText, schemaFor, type AiMode } from '@/features/resume/lib/ai-prompts';
import { extractDocxText } from '@/features/resume/lib/docx';
import { cleanDraftInput, parseDraft, portfolioUserText } from '@/features/resume/lib/portfolio-ai';
import { cleanReviewInput, parseReview as parsePortfolioReview, reviewUserText as portfolioReviewUserText } from '@/features/resume/lib/portfolio-review';
import { cleanTemplateAiInput, isTemplateTone, parseTemplateAi, templateAiUserText } from '@/features/resume/lib/template-ai';
import { ENTRY_SECTIONS, oneLine, parseContent, type ResumeContent } from '@/features/resume/lib/document';
import { isResumeLevel } from '@/features/resume/lib/templates';
import { ALL_ACCESS_ENTITLEMENT } from '@/features/store/lib/catalog';
import { beginChat, cleanKeys, completeChat, releaseChat, validConversationId, type ChatBegin } from '@/lib/server/ai-chat-quota';
import { verifiedEntitlements } from '@/lib/server/entitlements';
import { refundGlobal, reserveGlobal } from '@/lib/server/global-cap';
import { callGemini, geminiError, geminiKey, replyText, type GeminiResult } from '@/lib/server/gemini';
import { inflateRaw } from '@/lib/server/inflate';
import { languageOf, type Language } from '@/lib/language';

// Letters only: the shared `ai_chat_*` SQL refuses any other app name ("bad app"), which the route used to report as "busy".
const APP = 'talinoresume';
const DAILY_LIMIT = 40;
const DEVICE_ID = /^[\w-]{8,64}$/;
const MODES: readonly AiMode[] = ['generate', 'review', 'improve', 'import', 'portfolio', 'portfolio-review', 'template'];
/** The biggest file accepted, and what that is as base64 (4 bytes for every 3). */
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BASE64 = Math.ceil(MAX_FILE_BYTES / 3) * 4;
const MIN_JOB_CHARS = 40;
const MIN_IMPORT_CHARS = 80;
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

type Body = Record<string, unknown>;
const fail = (error: string, status: number) => Response.json({ error }, { status });

function keysOf(body: Body): string[] | null {
  const appUserId = typeof body.appUserId === 'string' ? body.appUserId : null;
  const deviceId = typeof body.deviceId === 'string' && DEVICE_ID.test(body.deviceId) ? body.deviceId : null;
  return cleanKeys([appUserId ? `rc:${appUserId}` : null, deviceId ? `device:${deviceId}` : null]);
}

const refusal = (begun: ChatBegin): Response | null => {
  if (begun.status === 'limit') return fail('resume_limit', 429);
  if (begun.status === 'in_flight') return fail('chat_in_progress', 409);
  if (begun.status === 'conversation_full') return fail('chat_in_progress', 409);
  if (begun.status === 'unavailable') return fail('quota_unavailable', 503);
  return null;
};

/** Enough to write from: at least one entry, a skill or a summary. A name alone is not a résumé. */
const hasFacts = (content: ResumeContent) => ENTRY_SECTIONS.some((section) => content[section].length > 0) || content.skills.length > 0 || content.summary !== '';

/** The job post the learner pasted, or null when there is none; `undefined` when there is one but it is too short to use. */
function jobOf(value: unknown): { title: string; description: string } | null | undefined {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  const description = typeof record.description === 'string' ? record.description.trim().slice(0, MAX_JOB_CHARS) : '';
  if (description === '') return null;
  return description.length < MIN_JOB_CHARS ? undefined : { title: oneLine(record.title, 120), description };
}

type Prepared = { user: string; parts?: Record<string, unknown>[]; finish: (text: string) => Response | null; temperature: number; maxOutputTokens: number };

/** The text of an upload, or the document itself for a PDF; a refusal for anything else. Never keeps the file. */
async function readUpload(file: unknown): Promise<{ via: 'pdf'; data: string } | { via: 'docx'; text: string } | Response> {
  if (typeof file !== 'object' || file === null) return fail('bad_request', 400);
  const { name, mime, data } = file as Record<string, unknown>;
  if (typeof data !== 'string' || data === '') return fail('bad_request', 400);
  if (data.length > MAX_FILE_BASE64) return fail('file_too_large', 413);
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(data), (char) => char.charCodeAt(0));
  } catch {
    return fail('bad_request', 400);
  }
  if (bytes.length > MAX_FILE_BYTES) return fail('file_too_large', 413);
  const fileName = typeof name === 'string' ? name.toLowerCase() : '';
  const type = typeof mime === 'string' ? mime : '';
  // The bytes must really be what the name says: a renamed program or an image is refused.
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 1024));
  if ((fileName.endsWith('.pdf') || type === 'application/pdf') && head.includes('%PDF')) return { via: 'pdf', data };
  if ((fileName.endsWith('.docx') || type === DOCX_MIME) && bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const text = await extractDocxText(bytes, (packed) => inflateRaw(packed));
    if (!text || text.length < MIN_JOB_CHARS) return fail('unreadable_file', 422);
    return { via: 'docx', text: text.slice(0, MAX_IMPORT_CHARS) };
  }
  return fail('unsupported_file', 415);
}

async function prepare(mode: AiMode, body: Body, language: Language): Promise<Prepared | Response> {
  void language;
  if (mode === 'import') {
    const pasted = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_IMPORT_CHARS) : '';
    const finish = (via: string) => (text: string): Response | null => {
      const imported = parseImported(text);
      return imported ? Response.json({ imported, via }) : null;
    };
    if (body.file !== undefined) {
      const upload = await readUpload(body.file);
      if (upload instanceof Response) return upload;
      if (upload.via === 'pdf') {
        return { user: 'Read the attached résumé (untrusted) and copy its facts into the schema.', parts: [{ inlineData: { mimeType: 'application/pdf', data: upload.data } }], finish: finish('pdf'), temperature: 0, maxOutputTokens: 6000 };
      }
      return { user: importUserText(upload.text), finish: finish('docx'), temperature: 0, maxOutputTokens: 6000 };
    }
    if (pasted.length < MIN_IMPORT_CHARS) return fail('bad_request', 400);
    return { user: importUserText(pasted), finish: finish('text'), temperature: 0, maxOutputTokens: 6000 };
  }

  if (mode === 'improve') {
    const section = body.section;
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 2000) : '';
    if ((section !== 'achievements' && !ENTRY_SECTIONS.includes(section as never)) || text.length < 10) return fail('bad_request', 400);
    const input = { section: section as (typeof ENTRY_SECTIONS)[number] | 'achievements', title: oneLine(body.title), organization: oneLine(body.organization), text, style: isImproveStyle(body.style) ? body.style : undefined };
    const source = `${input.title}\n${input.organization}\n${text}`;
    return {
      user: improveUserText(input),
      finish: (reply) => {
        const improved = parseImproved(reply, source);
        return improved ? Response.json({ improved }) : null;
      },
      temperature: 0.3,
      maxOutputTokens: 2000,
    };
  }

  if (mode === 'portfolio') {
    const input = cleanDraftInput(body);
    if (!input) return fail('bad_request', 400);
    return {
      user: portfolioUserText(input),
      finish: (reply) => {
        const draft = parseDraft(reply, input);
        return draft ? Response.json({ draft }) : null;
      },
      temperature: 0.4,
      maxOutputTokens: 4000,
    };
  }

  if (mode === 'template') {
    const input = cleanTemplateAiInput(body);
    if (!input) return fail('bad_request', 400);
    return {
      user: templateAiUserText(input),
      finish: (reply) => {
        const draft = parseTemplateAi(reply, input);
        return draft ? Response.json({ draft }) : null;
      },
      temperature: 0.5,
      maxOutputTokens: 2500,
    };
  }

  if (mode === 'portfolio-review') {
    const input = cleanReviewInput(body);
    if (!input) return fail('bad_request', 400);
    return {
      user: portfolioReviewUserText(input),
      finish: (reply) => {
        const review = parsePortfolioReview(reply, input);
        return review ? Response.json({ review }) : null;
      },
      temperature: 0.3,
      maxOutputTokens: 6000,
    };
  }

  const content = parseContent(body.content);
  if (!hasFacts(content)) return fail('bad_request', 400);
  const job = jobOf(body.job);
  if (job === undefined) return fail('bad_request', 400);

  if (mode === 'review') {
    return {
      user: reviewUserText(content, job),
      finish: (reply) => {
        const review = parseReview(reply, content);
        return review ? Response.json({ review }) : null;
      },
      temperature: 0.2,
      maxOutputTokens: 4000,
    };
  }

  return {
    user: generateUserText(content, { goal: oneLine(body.goal, 300), level: isResumeLevel(body.level) ? body.level : null, job }),
    finish: (reply) => {
      const generated = parseGenerated(reply);
      return generated ? Response.json({ generated }) : null;
    },
    temperature: 0.3,
    maxOutputTokens: 4000,
  };
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = geminiKey();
  if (!apiKey) return Response.json({ error: 'unavailable', reason: 'not_configured' }, { status: 503 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return fail('bad_request', 400);
  }
  const keys = keysOf(body);
  const mode = MODES.find((candidate) => candidate === body.mode);
  if (!keys || !mode || !validConversationId(body.requestId)) return fail('bad_request', 400);
  const requestId = body.requestId;

  const entitlements = await verifiedEntitlements(body.appUserId, body.entitlements);
  if (!entitlements.includes(ALL_ACCESS_ENTITLEMENT)) return fail('all_access_required', 403);

  const language = languageOf(body.language);
  // Bad input is refused before anything is counted or asked.
  const prepared = await prepare(mode, body, language);
  if (prepared instanceof Response) return prepared;

  const begun = await beginChat(keys, requestId, 'pro', { app: APP, limit: DAILY_LIMIT });
  const refused = refusal(begun);
  if (refused) return refused;
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, requestId, APP);
  };

  const slot = await reserveGlobal();
  if (slot === 'full') {
    await giveBack();
    return fail('busy', 503);
  }
  let result: GeminiResult;
  try {
    result = await callGemini(apiKey, {
      systemInstruction: { parts: [{ text: promptFor(mode, language, isTemplateTone(body.tone) ? body.tone : undefined) }] },
      contents: [{ role: 'user', parts: [...(prepared.parts ?? []), { text: prepared.user }] }],
      generationConfig: { temperature: prepared.temperature, maxOutputTokens: prepared.maxOutputTokens, responseMimeType: 'application/json', responseSchema: schemaFor(mode) },
    });
  } catch {
    await refundGlobal(slot);
    await giveBack();
    return fail('busy', 503);
  }
  const error = geminiError(result, 'resume');
  if (error) {
    await refundGlobal(slot);
    await giveBack();
    return error;
  }
  const text = replyText(result.data);
  const answer = text ? prepared.finish(text) : null;
  if (!answer) {
    await refundGlobal(slot);
    await giveBack();
    // A document with nothing readable in it is the learner's to fix; any other unusable answer is ours.
    if (mode === 'import' && text) return fail('unreadable_file', 422);
    // The model answered, but nothing in it could be kept (a name or figure the learner never gave, or no usable text): say that, so the app can ask for more detail instead of a vague failure.
    if ((mode === 'portfolio' || mode === 'portfolio-review') && text) return fail('draft_unusable', 422);
    return fail('unknown', 502);
  }
  await completeChat(keys, requestId, { input: result.data?.usageMetadata?.promptTokenCount, output: (result.data?.usageMetadata?.candidatesTokenCount ?? 0) + (result.data?.usageMetadata?.thoughtsTokenCount ?? 0) }, APP);
  return answer;
}

