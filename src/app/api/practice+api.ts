/**
 * The practice engine's server route (an Expo Router API route): role-plays with a simulated person, and the message coach for the
 * Soft Skills course. The Gemini key lives only here, and the partner's, the debriefer's and the coach's instructions are built here
 * from the practice catalog **by id**, so a modified app can't rewrite who the partner is or what is assessed. The conversation lives
 * on the phone; the server keeps only the allowance records (ids and counts, never text).
 *
 * Modes:
 *   turn    one partner reply to the learner's latest turn: `{ turn: { reply, end } }`. The first call of a session counts as a new
 *           practice session (Free 3 per rolling 24 h, fair use 30 with any purchase); every later turn and the debrief are free.
 *   report  the debrief of a finished role-play: `{ report }`. A conversation too short to judge gets an honest `tooShort` report
 *           without asking the model (and without using the allowance).
 *   review  the message coach on one written message: `{ review }`. Each review is a session of its own.
 *   lab-run     one live run of a prompt lab (Generative AI course): the learner's prompt (or, for a comparison of prompts, `prompts: [A, B]`)
 *               goes to a model together with the lab's material, which comes from the catalog and never from the phone: `{ run: { outputs } }`.
 *               The first run of a session counts as a new practice session; every further run up to the lab's `maxRuns` is free.
 *   lab-review  the prompt coach on the learner's latest run: `{ review }`, with the lab's key compared by code and revealed only here.
 *               Free inside the session that ran.
 *
 * Only the fields above ever leave this route: no private field of a scenario, task or lab (the partner's motives and reactions, the
 * rubric, the traps, what a complete answer contains, a lab's framing, key, facts and tool fixtures) is returned. A tool's fixtures are
 * used on the server only, and only what the model actually asked for comes back, in the trace. Needs the same server settings as `/api/interview`. Design:
 * docs/superpowers/specs/2026-11-17-soft-skills-course-design.md.
 */

import type { AiChatPlan } from '@/constants/ai-chat';
import { findLab, findMessageTask, findScenario } from '@/features/practice/catalog';
import { buildDebriefPrompt, buildPartnerPrompt, buildReviewPrompt, formatReviewData, formatTranscript } from '@/features/practice/lib/prompt';
import { PRACTICE_APP } from '@/features/practice/lib/limits';
import { parseReport, REPORT_SCHEMA, tooShortReport } from '@/features/practice/lib/report';
import { parseReview, REVIEW_SCHEMA } from '@/features/practice/lib/review';
import { checkReviewText } from '@/features/practice/lib/review-input';
import { cleanText, MAX_REVIEW_CHARS, MAX_SENT_MESSAGES, sanitizeMessages, whole, type PracticeMessage } from '@/features/practice/lib/sanitize';
import { judgeable, learnerLines, learnerTurns } from '@/features/practice/lib/session';
import { parseTurn, TURN_SCHEMA } from '@/features/practice/lib/turn';
import { practiceStrings } from '@/features/practice/strings';
import type { MessageTask, RoleplayScenario } from '@/features/practice/types';
import { ask, keysOf, tokensOf, type Body } from '@/lib/server/ai-ask';
import { completeChat, validConversationId } from '@/lib/server/ai-chat-quota';
import { verifiedEntitlements } from '@/lib/server/entitlements';
import { geminiKey } from '@/lib/server/gemini';
import { begin, type Common } from '@/lib/server/practice-allowance';
import { reviewLab, runLab } from '@/lib/server/practice-lab';

/** Lowercase words only, to tell whether a message is the opening line the route already knows. */
const squash = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * The conversation after the partner's opening. The phone sends only what came after it; if a message that is the opening line comes
 * first anyway it is dropped, because the opening is restated from the catalog and never taken from the phone.
 */
function afterOpening(scenario: RoleplayScenario, value: unknown): PracticeMessage[] {
  const messages = sanitizeMessages(value);
  return messages[0]?.role === 'assistant' && squash(messages[0].text) === squash(scenario.opening) ? messages.slice(1) : messages;
}

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
  if (!keys || !validConversationId(body.sessionId) || typeof body.itemId !== 'string') return Response.json({ error: 'bad_request' }, { status: 400 });
  const mode = body.mode;
  if (mode !== 'turn' && mode !== 'report' && mode !== 'review' && mode !== 'lab-run' && mode !== 'lab-review') return Response.json({ error: 'bad_request' }, { status: 400 });

  // The item is read from the catalog by id, and must be of the kind the mode works on, before anything is spent on the request.
  const isLab = mode === 'lab-run' || mode === 'lab-review';
  const scenario = mode === 'turn' || mode === 'report' ? findScenario(body.itemId) : undefined;
  const task = mode === 'review' ? findMessageTask(body.itemId) : undefined;
  const lab = isLab ? findLab(body.itemId) : undefined;
  if (!scenario && !task && !lab) return Response.json({ error: 'bad_request' }, { status: 400 });

  const entitlements = await verifiedEntitlements(body.appUserId, body.entitlements);
  const plan: AiChatPlan = entitlements.length > 0 ? 'pro' : 'free';
  const common: Common = { keys, sessionId: body.sessionId, plan, apiKey };

  if (mode === 'turn' && scenario) return turn(body, common, scenario);
  if (mode === 'report' && scenario) return report(body, common, scenario);
  if (mode === 'review' && task) return review(body, common, task);
  if (mode === 'lab-run' && lab) return runLab(body, common, lab);
  if (mode === 'lab-review' && lab) return reviewLab(body, common, lab);
  return Response.json({ error: 'bad_request' }, { status: 400 });
}

async function turn(body: Body, common: Common, scenario: RoleplayScenario): Promise<Response> {
  const messages = afterOpening(scenario, body.messages);
  // A turn answers the learner: nothing to reply to means nothing to ask.
  if (messages[messages.length - 1]?.role !== 'user') return Response.json({ error: 'bad_request' }, { status: 400 });
  // The phone counts the turns (older ones may no longer be in the window); it can only raise the count the messages already show.
  const turnNumber = Math.max(whole(body.turn, 1, scenario.maxTurns + 1), learnerTurns(messages));
  if (turnNumber > scenario.maxTurns) return Response.json({ error: 'conversation_full' }, { status: 409 });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  // Gemini wants the conversation to start with the learner, and a trimmed window may begin with the partner.
  const window = messages.slice(-MAX_SENT_MESSAGES);
  const lead = window[0].role === 'assistant' ? [{ role: 'user', parts: [{ text: '(The conversation is already under way; the earlier part is left out. Continue from the messages below.)' }] }] : [];
  const contents = [...lead, ...window.map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.text }] }))];

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: { parts: [{ text: buildPartnerPrompt({ scenario, turn: turnNumber }) }] },
      contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 2000, responseMimeType: 'application/json', responseSchema: TURN_SCHEMA },
    },
    giveBack,
    'practice',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseTurn(answer.text, { scenario, turn: turnNumber });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.sessionId, tokensOf(answer.result), PRACTICE_APP);
  return Response.json({ turn: parsed });
}

async function report(body: Body, common: Common, scenario: RoleplayScenario): Promise<Response> {
  const messages = afterOpening(scenario, body.messages);
  // Too little to judge is answered honestly and for free, without asking the model: a score made of nothing is never shown.
  if (!judgeable(scenario, messages)) return Response.json({ report: tooShortReport(practiceStrings.en.tooShortRoleplay) });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: { parts: [{ text: buildDebriefPrompt({ scenario, learnerTurns: learnerTurns(messages) }) }] },
      contents: [{ role: 'user', parts: [{ text: `Transcript (data):\n"""\n${scenario.partner.name} opened: ${scenario.opening}\n${formatTranscript(scenario, messages)}\n"""` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 6000, responseMimeType: 'application/json', responseSchema: REPORT_SCHEMA },
    },
    giveBack,
    'practice',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseReport(answer.text, { scenario, learnerLines: learnerLines(messages) });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.sessionId, tokensOf(answer.result), PRACTICE_APP);
  return Response.json({ report: parsed });
}

async function review(body: Body, common: Common, task: MessageTask): Promise<Response> {
  const text = cleanText(body.text, MAX_REVIEW_CHARS);
  const previous = cleanText(body.previous, MAX_REVIEW_CHARS);
  // A message worth reviewing is long enough and the learner's own; a modified app can't spend a review on nothing.
  const checked = checkReviewText(task, text);
  if (!checked.ok) return Response.json({ error: checked.reason }, { status: 400 });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: { parts: [{ text: buildReviewPrompt({ task, revision: previous !== '' }) }] },
      contents: [{ role: 'user', parts: [{ text: formatReviewData({ text, previous: previous || undefined }) }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 6000, responseMimeType: 'application/json', responseSchema: REVIEW_SCHEMA },
    },
    giveBack,
    'practice',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseReview(answer.text, { task, learnerText: text });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.sessionId, tokensOf(answer.result), PRACTICE_APP);
  return Response.json({ review: parsed });
}
