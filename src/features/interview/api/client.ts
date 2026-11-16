import { coachErrorCode, type CoachIdentity } from '@/features/coach';
import { ApiError, postJson } from '@/lib/api';
import { deviceId } from '@/lib/device-id';

import type { InterviewSetup } from '../lib/options';
import { readStoredReport, type InterviewReport } from '../lib/report';
import { MAX_SENT_MESSAGES, parseTurn, type InterviewTurn } from '../lib/turn';

const who = (identity: CoachIdentity) => ({ deviceId: deviceId(), appUserId: identity.appUserId, entitlements: identity.entitlements });

/**
 * Why the interviewer couldn't answer: `interview_limit` (today's interviews are used), `chat_in_progress`, `conversation_full`,
 * `too_short` (an evaluation needs at least two answers), `busy`, `unavailable`, `quota_unavailable`, `network`, `unknown`. None of
 * them uses up an interview.
 */
export const interviewErrorCode = coachErrorCode;

export type TurnMessage = { role: 'user' | 'assistant'; text: string };

export type TurnRequest = {
  interviewId: string;
  setup: InterviewSetup;
  /** The interviewer's own notes from the earlier turns. */
  notes: string;
  /** The résumé and portfolio as text (empty when the learner switched them off). */
  candidate: string;
  /** Main questions asked so far, answers given, and follow-ups in a row since the last main question. */
  asked: number;
  answered: number;
  followUps: number;
  /** The conversation so far, ending with the learner's answer (empty for the opening). */
  messages: readonly TurnMessage[];
};

/** One interviewer turn. Only the latest messages go; the notes carry what came before. */
export async function requestTurn(identity: CoachIdentity, input: TurnRequest): Promise<InterviewTurn> {
  const body = await postJson('/api/interview', { ...who(identity), mode: 'turn', ...input, messages: input.messages.slice(-MAX_SENT_MESSAGES) }, { timeoutMs: 60_000 });
  const turn = parseTurn(JSON.stringify(body.turn ?? null), { opening: input.answered === 0, previousNotes: input.notes });
  if (!turn) throw new ApiError('unknown');
  return turn;
}

export type ReportRequest = {
  interviewId: string;
  setup: InterviewSetup;
  notes: string;
  candidate: string;
  /** The whole conversation. */
  messages: readonly TurnMessage[];
};

/** The evaluation of a finished interview. */
export async function requestReport(identity: CoachIdentity, input: ReportRequest): Promise<InterviewReport> {
  const body = await postJson('/api/interview', { ...who(identity), mode: 'report', ...input }, { timeoutMs: 90_000 });
  const report = readStoredReport(JSON.stringify(body.report ?? null));
  if (!report) throw new ApiError('unknown');
  return report;
}
