import type { SQLiteDatabase } from 'expo-sqlite';

import type { CoachIdentity } from '@/features/coach';

import type { LabReview } from '../lib/lab-review';
import type { LabRun } from '../lib/lab-run';
import type { ToolStep } from '../lib/lab-tools';
import type { PracticeReport } from '../lib/report';
import type { ReviewResult } from '../lib/review';
import type { PracticeMessage } from '../lib/sanitize';
import type { PartnerTurn } from '../lib/turn';
import type { LabTask, MessageTask, RoleplayScenario } from '../types';
import { requestLabReview, requestLabRun, requestReport, requestReview, requestTurn, type LabReviewRequest, type LabRunRequest, type ReportRequest, type ReviewRequest, type TurnRequest } from './client';
import { appendLabRun, appendMessage, finishSession, readSession, startSession } from './practice-repo';

/**
 * The steps of a practice session, each one saving to the phone before and after it asks the server, so the learner's words are never lost to a
 * failed request and a retry changes nothing. The request functions are parameters only so the tests can stand in for the server.
 */

/** What the server is sent: the saved conversation after the partner's opening (which the server already knows). */
async function conversationAfterOpening(db: SQLiteDatabase, sessionId: string): Promise<PracticeMessage[]> {
  const detail = await readSession(db, sessionId);
  return (detail?.messages ?? []).filter((message) => message.id !== `${sessionId}-opening`).map((message) => ({ role: message.role, text: message.text }));
}

export type SendTurnInput = {
  sessionId: string;
  scenario: RoleplayScenario;
  /** Made when the learner pressed Send; sending the same id again (a retry) saves the words once. */
  messageId: string;
  text: string;
};

/**
 * The learner says something: it is saved first, the partner is asked with the conversation so far, and the reply is saved under an id
 * made from the message's, so a retry never saves it twice. If the request fails the learner's words stay saved and the error is thrown.
 */
export async function sendLearnerTurn(db: SQLiteDatabase, identity: CoachIdentity, input: SendTurnInput, request: (identity: CoachIdentity, input: TurnRequest) => Promise<PartnerTurn> = requestTurn): Promise<PartnerTurn> {
  await appendMessage(db, { id: input.messageId, sessionId: input.sessionId, role: 'user', text: input.text });
  const messages = await conversationAfterOpening(db, input.sessionId);
  // End on the learner's message: a retry after the reply was already saved must not send the reply back as if it were new.
  const lastUser = messages.map((message) => message.role).lastIndexOf('user');
  const sent = messages.slice(0, lastUser + 1);
  const turn = sent.filter((message) => message.role === 'user').length;
  const answer = await request(identity, { sessionId: input.sessionId, itemId: input.scenario.id, turn, messages: sent });
  await appendMessage(db, { id: `${input.messageId}-reply`, sessionId: input.sessionId, role: 'assistant', text: answer.reply });
  return answer;
}

export type FinishRoleplayInput = { sessionId: string; scenario: RoleplayScenario };

/** Asks for the debrief of the whole conversation and keeps it with the session. A failure leaves the session open so it can be asked again. */
export async function finishRoleplay(db: SQLiteDatabase, identity: CoachIdentity, input: FinishRoleplayInput, request: (identity: CoachIdentity, input: ReportRequest) => Promise<PracticeReport> = requestReport): Promise<PracticeReport> {
  const messages = await conversationAfterOpening(db, input.sessionId);
  const report = await request(identity, { sessionId: input.sessionId, itemId: input.scenario.id, messages });
  await finishSession(db, { id: input.sessionId, result: report });
  return report;
}

export type ReviewMessageInput = {
  sessionId: string;
  task: MessageTask;
  /** The learner's own message. */
  text: string;
  /** Their earlier version, for a second review of a rewrite. */
  previous?: string;
  courseId?: string;
  lessonId?: string;
  projectId?: string;
};

/**
 * One message review, as a session of its own (so a second review of a rewrite is the next attempt). The session is saved before the coach is
 * asked and finished with the review, which stores the learner's own text as their work.
 */
export async function reviewMessage(db: SQLiteDatabase, identity: CoachIdentity, input: ReviewMessageInput, request: (identity: CoachIdentity, input: ReviewRequest) => Promise<ReviewResult> = requestReview): Promise<ReviewResult> {
  await startSession(db, { id: input.sessionId, itemId: input.task.id, kind: 'message-review', courseId: input.courseId, lessonId: input.lessonId, projectId: input.projectId });
  const review = await request(identity, { sessionId: input.sessionId, itemId: input.task.id, text: input.text, ...(input.previous ? { previous: input.previous } : {}) });
  await finishSession(db, { id: input.sessionId, result: review, finalText: input.text });
  return review;
}

export type RunLabInput = {
  sessionId: string;
  lab: LabTask;
  /** Which run this is, counting from 1: one more than the runs already saved. */
  runNumber: number;
  /** The learner's prompt, or A and B for a comparison of prompts. */
  prompts: readonly string[];
  courseId?: string;
  lessonId?: string;
  projectId?: string;
};

/**
 * One live run of a lab. The session is saved before the model is asked; the prompt(s) and the output(s) are saved together only once the run came
 * back (the learner's text stays in the editor until then, so a failed request loses nothing and a retry saves the prompt once). Each message has an
 * id made from the run number, so repeating a run that was already saved changes nothing.
 */
export async function runLabPrompt(db: SQLiteDatabase, identity: CoachIdentity, input: RunLabInput, request: (identity: CoachIdentity, input: LabRunRequest) => Promise<LabRun> = requestLabRun): Promise<LabRun> {
  await startSession(db, { id: input.sessionId, itemId: input.lab.id, kind: 'prompt-lab', courseId: input.courseId, lessonId: input.lessonId, projectId: input.projectId });
  const run = await request(identity, { sessionId: input.sessionId, itemId: input.lab.id, runNumber: input.runNumber, prompts: input.prompts });
  await appendLabRun(db, { sessionId: input.sessionId, runNumber: input.runNumber, prompts: input.prompts, outputs: run.outputs.map((output) => output.output) });
  return run;
}

export type ReviewLabInput = {
  sessionId: string;
  lab: LabTask;
  /** The prompt(s) of the latest run. */
  prompts: readonly string[];
  /** What the model said on it. */
  outputs: readonly string[];
  /** The latest run's tool trace, when it has one in memory. */
  toolSteps?: readonly ToolStep[];
};

/** The prompt coach's review of the latest run; saved as the session's result, with the learner's last prompt as their work. */
export async function reviewLabPrompt(db: SQLiteDatabase, identity: CoachIdentity, input: ReviewLabInput, request: (identity: CoachIdentity, input: LabReviewRequest) => Promise<LabReview> = requestLabReview): Promise<LabReview> {
  const review = await request(identity, { sessionId: input.sessionId, itemId: input.lab.id, prompts: input.prompts, outputs: input.outputs, toolSteps: input.toolSteps });
  await finishSession(db, { id: input.sessionId, result: review, finalText: input.prompts[input.prompts.length - 1] });
  return review;
}
