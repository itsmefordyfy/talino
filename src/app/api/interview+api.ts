/**
 * The mock interview's server route (an Expo Router API route). The Gemini key lives only here, and the interviewer's and the
 * evaluator's instructions are built here from the checked setup, so a modified app can't rewrite them. The conversation lives on
 * the phone; the server keeps only the allowance records (ids and counts, never text).
 *
 * Modes:
 *   turn    one interviewer turn: the reply, what kind of turn it was and the interviewer's running notes. The first call of an
 *           interview (no answers yet) is the opening and counts as a new interview (Free 1 per rolling 24 h, fair use 10 with any
 *           purchase); every later turn and the evaluation of that interview are free.
 *   report  the evaluation of a finished interview from its transcript, as JSON (scores, answer feedback, courses to take).
 *
 * Needs the same server settings as `/api/coach` (GEMINI_API_KEY, SUPABASE_URL + SUPABASE_SECRET_KEY for the allowance,
 * REVENUECAT_SECRET_KEY + REVENUECAT_PROJECT_ID to check purchases). Design: docs/superpowers/specs/2026-11-15-mock-interview-design.md.
 */

import type { AiChatPlan } from '@/constants/ai-chat';
import { COURSE_INDEX } from '@/features/courses/content/course-index';
import { sanitizeCandidate } from '@/features/interview/lib/candidate';
import { INTERVIEW_APP, interviewLimit } from '@/features/interview/lib/limits';
import { canStart, sanitizeSetup } from '@/features/interview/lib/options';
import { buildInterviewPrompt, buildReportPrompt, formatTranscript } from '@/features/interview/lib/prompt';
import { MIN_ANSWERS_FOR_REPORT, parseReport, REPORT_SCHEMA } from '@/features/interview/lib/report';
import { MAX_ANSWERS, MAX_NOTES_CHARS, MAX_SENT_MESSAGES, parseTurn, TURN_SCHEMA } from '@/features/interview/lib/turn';
import { ask, keysOf, refusal, tokensOf, type Body } from '@/lib/server/ai-ask';
import { beginChat, completeChat, releaseChat, validConversationId } from '@/lib/server/ai-chat-quota';
import { verifiedEntitlements } from '@/lib/server/entitlements';
import { geminiKey } from '@/lib/server/gemini';

/** An answer is typed in a box that holds 4,000 characters; an interviewer's message is far shorter. */
const MAX_MESSAGE_CHARS = 4000;
/** Bound on how many raw entries are even looked at. */
const MAX_RAW_MESSAGES = MAX_ANSWERS * 2 + 4;

type Message = { role: 'user' | 'assistant'; text: string };

function toMessage(value: unknown): Message | null {
  if (typeof value !== 'object' || value === null) return null;
  const { role, text } = value as Record<string, unknown>;
  if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string' || text.trim() === '') return null;
  return { role, text: text.slice(0, MAX_MESSAGE_CHARS) };
}

const messagesOf = (value: unknown): Message[] => (Array.isArray(value) ? value.slice(-MAX_RAW_MESSAGES) : []).map(toMessage).filter((message): message is Message => message !== null);

const whole = (value: unknown, min: number, max: number): number => (typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value))) : min);

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
  if (!keys || !validConversationId(body.interviewId)) return Response.json({ error: 'bad_request' }, { status: 400 });
  const setup = sanitizeSetup(body.setup);
  if (!canStart(setup)) return Response.json({ error: 'bad_request' }, { status: 400 });

  const entitlements = await verifiedEntitlements(body.appUserId, body.entitlements);
  const plan: AiChatPlan = entitlements.length > 0 ? 'pro' : 'free';
  const common = { keys, interviewId: body.interviewId, setup, plan, apiKey, language: setup.language, companion: setup.companion, candidate: sanitizeCandidate(body.candidate), notes: typeof body.notes === 'string' ? body.notes.slice(0, MAX_NOTES_CHARS) : '' };

  if (body.mode === 'turn') return turn(body, common);
  if (body.mode === 'report') return report(body, common);
  return Response.json({ error: 'bad_request' }, { status: 400 });
}

type Common = {
  keys: string[];
  interviewId: string;
  setup: ReturnType<typeof sanitizeSetup>;
  plan: AiChatPlan;
  apiKey: string;
  language: ReturnType<typeof sanitizeSetup>['language'];
  companion: ReturnType<typeof sanitizeSetup>['companion'];
  candidate: string;
  notes: string;
};

/** Counts the interview (the first call only), or lets a follow-up through; null means go ahead. */
async function begin({ keys, interviewId, plan }: Common) {
  const begun = await beginChat(keys, interviewId, plan, { app: INTERVIEW_APP, limit: interviewLimit(plan) });
  const refused = refusal(begun, plan, 'interview_limit');
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, interviewId, INTERVIEW_APP);
  };
  return { refused, giveBack };
}

async function turn(body: Body, common: Common): Promise<Response> {
  const answered = whole(body.answered, 0, MAX_ANSWERS + 1);
  if (answered > MAX_ANSWERS) return Response.json({ error: 'conversation_full' }, { status: 409 });
  const sent = messagesOf(body.messages).slice(-MAX_SENT_MESSAGES);
  const opening = answered === 0;
  if (!opening && sent[sent.length - 1]?.role !== 'user') return Response.json({ error: 'bad_request' }, { status: 400 });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  // Gemini wants the conversation to start with the candidate: the opening has no history at all, and a trimmed history may begin with the interviewer.
  const lead: Message[] = opening || sent[0]?.role === 'assistant' ? [{ role: 'user', text: opening ? "I'm ready. Please begin the interview." : '(The interview is already under way; continue from the notes and the messages below.)' }] : [];
  const contents = [...lead, ...(opening ? [] : sent)].map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.text }] }));

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: {
        parts: [
          {
            text: buildInterviewPrompt({
              setup: common.setup,
              companion: common.companion,
              language: common.language,
              notes: common.notes,
              candidate: common.candidate,
              asked: whole(body.asked, 0, 30),
              answered,
              followUps: whole(body.followUps, 0, 5),
            }),
          },
        ],
      },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000, responseMimeType: 'application/json', responseSchema: TURN_SCHEMA },
    },
    giveBack,
    'interview',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseTurn(answer.text, { opening, previousNotes: common.notes });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.interviewId, tokensOf(answer.result), INTERVIEW_APP);
  return Response.json({ turn: parsed });
}

async function report(body: Body, common: Common): Promise<Response> {
  const messages = messagesOf(body.messages);
  const answerCount = messages.filter((message) => message.role === 'user').length;
  // Nothing to evaluate yet: an honest "not enough", never a score made of nothing.
  if (answerCount < MIN_ANSWERS_FOR_REPORT) return Response.json({ error: 'too_short' }, { status: 400 });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: { parts: [{ text: buildReportPrompt({ setup: common.setup, companion: common.companion, language: common.language, notes: common.notes, candidate: common.candidate, courses: COURSE_INDEX.map((course) => `${course.id}: ${course.title}`), answerCount }) }] },
      contents: [{ role: 'user', parts: [{ text: `Transcript (data):\n"""\n${formatTranscript(messages)}\n"""` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 6000, responseMimeType: 'application/json', responseSchema: REPORT_SCHEMA },
    },
    giveBack,
    'interview',
  );
  if (answer instanceof Response) return answer;
  const parsed = parseReport(answer.text, { answerCount, courseIds: new Set(COURSE_INDEX.map((course) => course.id)) });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.interviewId, tokensOf(answer.result), INTERVIEW_APP);
  return Response.json({ report: parsed });
}
