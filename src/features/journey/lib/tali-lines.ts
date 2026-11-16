import type { TaliMood } from '@/components/brand/tali';

import type { JourneyText } from '../strings';
import type { JourneyState, MilestoneState } from './types';

export type TaliLine = { text: string; mood: TaliMood };

const names = (state: JourneyState, ids: readonly string[]) =>
  ids
    .map((id) => state.milestones.find((milestone) => milestone.id === id)?.def.title)
    .filter((title): title is string => !!title)
    .map((title) => `"${title}"`)
    .join(' and ');

/** The overall line for the header, from how far through the journey the learner really is. */
export function headerLine(state: JourneyState, text: JourneyText['header']): string {
  if (state.complete) return text.done;
  if (state.fraction <= 0) return text.start;
  if (state.fraction < 1 / 3) return text.early;
  if (state.fraction < 2 / 3) return text.middle;
  return text.late;
}

/**
 * What Tali says beside the learner's current milestone. Every line comes from the learner's real position: nothing is said about a
 * step they haven't reached, and "great job" only follows a milestone they really finished.
 */
export function currentLine(state: JourneyState, text: JourneyText['tali'], name: string): TaliLine {
  if (state.complete) return { text: text.allDone, mood: 'celebrating' };
  const current = state.current;
  if (!current) return { text: text.closer, mood: 'encouraging' };
  const before = state.milestones[current.index - 1];
  const nothingYet = state.done === 0 && !current.started;
  if (nothingYet) return { text: text.hello(name, current.def.title), mood: 'happy' };
  if (current.started && current.stepsDone > 0 && current.stepsTotal > 0) return { text: text.keepGoing(current.stepsDone, current.stepsTotal, current.def.title), mood: 'encouraging' };
  if (current.started) return { text: text.justStarted(current.def.title), mood: 'encouraging' };
  if (before && before.status === 'done') return { text: text.completed(before.def.title, current.def.title), mood: 'celebrating' };
  if (current.def.kind === 'challenge') return { text: text.challenge, mood: 'determined' };
  return { text: text.nextStep(current.def.summary), mood: 'explaining' };
}

/** A line for a milestone that isn't the current one (shown in its details). */
export function milestoneLine(state: JourneyState, milestone: MilestoneState, text: JourneyText['tali']): TaliLine | null {
  if (milestone.status === 'done') return { text: text.closer, mood: 'proud' };
  if (milestone.status === 'locked') return { text: text.locked(names(state, milestone.blockedBy)), mood: 'curious' };
  if (milestone.status === 'available' || milestone.status === 'skipped') return { text: text.preview(milestone.def.title), mood: 'inspired' };
  return null;
}
