import type { RoleplayScenario } from '../types';
import { wordCount, type PracticeMessage } from './sanitize';

/**
 * Where a role-play stands, worked out from its saved messages (never stored, so it can't disagree with the conversation).
 * Turns are the learner's: the partner's opening is not one.
 */

export const learnerTurns = (messages: readonly PracticeMessage[]): number => messages.filter((message) => message.role === 'user').length;

/** What the learner said, in order: the only text a debrief may quote. */
export const learnerLines = (messages: readonly PracticeMessage[]): string[] => messages.filter((message) => message.role === 'user').map((message) => message.text);

/** The learner may end the conversation and ask for feedback once they have had `minTurns` turns. */
export const canEnd = (scenario: Pick<RoleplayScenario, 'minTurns'>, messages: readonly PracticeMessage[]): boolean => learnerTurns(messages) >= scenario.minTurns;

export const turnsLeft = (scenario: Pick<RoleplayScenario, 'maxTurns'>, messages: readonly PracticeMessage[]): number => Math.max(0, scenario.maxTurns - learnerTurns(messages));

export type Phase = 'talking' | 'can-end' | 'must-end';

/** `must-end`: the conversation is over (the limit, or the partner ended it) and the next step is the debrief. */
export function phaseOf(scenario: Pick<RoleplayScenario, 'minTurns' | 'maxTurns'>, messages: readonly PracticeMessage[], partnerEnded: boolean): Phase {
  const turns = learnerTurns(messages);
  if (partnerEnded || turns >= scenario.maxTurns) return 'must-end';
  return turns >= scenario.minTurns ? 'can-end' : 'talking';
}

/**
 * A role-play is complete when the learner had at least `minTurns` turns and the debrief arrived and could judge them. How well they did
 * never matters here: the score is stored and shown, and a retry is always offered.
 */
export const roleplayComplete = (scenario: Pick<RoleplayScenario, 'minTurns'>, messages: readonly PracticeMessage[], report: { tooShort: boolean } | null): boolean =>
  report !== null && !report.tooShort && learnerTurns(messages) >= scenario.minTurns;

/** Fewer words than this across the whole conversation is too little for a fair judgement, however many turns there were. */
export const MIN_JUDGEABLE_WORDS = 20;

/** Whether there is enough to judge: at least `minTurns` turns and some substance in them. Decided before the model is asked, so it costs nothing and can't be talked around. */
export const judgeable = (scenario: Pick<RoleplayScenario, 'minTurns'>, messages: readonly PracticeMessage[]): boolean =>
  learnerTurns(messages) >= scenario.minTurns && learnerLines(messages).reduce((sum, line) => sum + wordCount(line), 0) >= MIN_JUDGEABLE_WORDS;
