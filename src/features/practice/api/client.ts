import { coachErrorCode, type CoachIdentity } from '@/features/coach';
import { ApiError, postJson } from '@/lib/api';
import { deviceId } from '@/lib/device-id';

import { readStoredLabReview, type LabReview } from '../lib/lab-review';
import { readLabRun, type LabRun } from '../lib/lab-run';
import type { ToolStep } from '../lib/lab-tools';
import { readStoredReport, type PracticeReport } from '../lib/report';
import { readStoredReview, type ReviewResult } from '../lib/review';
import { MAX_SENT_MESSAGES, type PracticeMessage } from '../lib/sanitize';
import { readPartnerTurn, type PartnerTurn } from '../lib/turn';

const who = (identity: CoachIdentity) => ({ deviceId: deviceId(), appUserId: identity.appUserId, entitlements: identity.entitlements });

/**
 * Why practice couldn't answer: `practice_limit` (today's sessions are used), `chat_in_progress`, `conversation_full`, `too_short`
 * and `not_original` (a message review needs a real message of the learner's own), `lab_too_short`, `lab_not_edited` and `lab_same_prompts`
 * (a lab prompt must be the learner's own edit), `busy`, `unavailable`, `quota_unavailable`,
 * `network`, `unknown`. None of them uses up a session, and the learner's words are saved on the phone first.
 */
export const practiceErrorCode = coachErrorCode;

export type TurnRequest = {
  /** The practice session's id, made on the phone: the first call under an id counts as a new session, the rest are free. */
  sessionId: string;
  /** The scenario's id in the catalog. The server builds the partner from it; the phone never sends instructions. */
  itemId: string;
  /** Which learner turn this is, counting from 1. */
  turn: number;
  /** The conversation after the partner's opening line (which the server knows), ending with the learner's message. */
  messages: readonly PracticeMessage[];
};

/** One partner reply. Only the latest messages go. */
export async function requestTurn(identity: CoachIdentity, input: TurnRequest): Promise<PartnerTurn> {
  const body = await postJson('/api/practice', { ...who(identity), mode: 'turn', sessionId: input.sessionId, itemId: input.itemId, turn: input.turn, messages: input.messages.slice(-MAX_SENT_MESSAGES) }, { timeoutMs: 60_000 });
  const turn = readPartnerTurn(body.turn);
  if (!turn) throw new ApiError('unknown');
  return turn;
}

export type ReportRequest = {
  sessionId: string;
  itemId: string;
  /** The whole conversation after the opening line. */
  messages: readonly PracticeMessage[];
};

/** The debrief of a finished role-play (a `tooShort` one when there was too little to judge). */
export async function requestReport(identity: CoachIdentity, input: ReportRequest): Promise<PracticeReport> {
  const body = await postJson('/api/practice', { ...who(identity), mode: 'report', sessionId: input.sessionId, itemId: input.itemId, messages: input.messages }, { timeoutMs: 90_000 });
  const report = readStoredReport(JSON.stringify(body.report ?? null));
  if (!report) throw new ApiError('unknown');
  return report;
}

export type ReviewRequest = {
  /** Each review is a session of its own, so a second review of a rewrite has a new id. */
  sessionId: string;
  /** The message task's id in the catalog. */
  itemId: string;
  /** The learner's own message. */
  text: string;
  /** Their earlier version, when this is a second review of a rewrite. */
  previous?: string;
};

/** The message coach's review of one message. */
export async function requestReview(identity: CoachIdentity, input: ReviewRequest): Promise<ReviewResult> {
  const body = await postJson('/api/practice', { ...who(identity), mode: 'review', sessionId: input.sessionId, itemId: input.itemId, text: input.text, ...(input.previous ? { previous: input.previous } : {}) }, { timeoutMs: 90_000 });
  const review = readStoredReview(JSON.stringify(body.review ?? null));
  if (!review) throw new ApiError('unknown');
  return review;
}

export type LabRunRequest = {
  /** The lab session's id, made on the phone: the first run under an id counts as a new session, the rest are free. */
  sessionId: string;
  /** The lab's id in the catalog. The server reads the framing and the material from it; the phone sends only the prompt. */
  itemId: string;
  /** Which run this is, counting from 1 (the server refuses one past the lab's `maxRuns`). */
  runNumber: number;
  /** The learner's prompt, or A and B for a comparison of prompts. */
  prompts: readonly string[];
};

/** One live run of a lab: a model call made now, with its measured time and token counts. A model comparison takes up to two minutes on a slow network. */
export async function requestLabRun(identity: CoachIdentity, input: LabRunRequest): Promise<LabRun> {
  const body = await postJson('/api/practice', { ...who(identity), mode: 'lab-run', sessionId: input.sessionId, itemId: input.itemId, runNumber: input.runNumber, prompt: input.prompts[0], ...(input.prompts.length > 1 ? { prompts: input.prompts } : {}) }, { timeoutMs: 90_000 });
  const run = readLabRun(body.run);
  if (!run) throw new ApiError('unknown');
  return run;
}

export type LabReviewRequest = {
  sessionId: string;
  itemId: string;
  prompts: readonly string[];
  /** What the model said on the latest run, one per output. */
  outputs: readonly string[];
  /** The tool trace of that run, for a tool-use lab. */
  toolSteps?: readonly ToolStep[];
};

/** The prompt coach's review of the latest run, with the lab's key compared by code. */
export async function requestLabReview(identity: CoachIdentity, input: LabReviewRequest): Promise<LabReview> {
  const body = await postJson('/api/practice', { ...who(identity), mode: 'lab-review', sessionId: input.sessionId, itemId: input.itemId, prompt: input.prompts[0], ...(input.prompts.length > 1 ? { prompts: input.prompts } : {}), outputs: input.outputs, ...(input.toolSteps && input.toolSteps.length > 0 ? { toolSteps: input.toolSteps } : {}) }, { timeoutMs: 90_000 });
  const review = readStoredLabReview(JSON.stringify(body.review ?? null));
  if (!review) throw new ApiError('unknown');
  return review;
}
