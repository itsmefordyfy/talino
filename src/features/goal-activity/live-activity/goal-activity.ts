import type { CompanionId } from '@/features/companion/lib/companions';

export type GoalActivityInput = {
  /** The learner's daily goal in minutes (`dailyMinutes`), or null when none is set (then any card is ended). */
  goalMinutes: number | null;
  /** Milliseconds learned today. */
  studiedMs: number;
  /** Which coach's picture the card shows. */
  companion: CompanionId;
  /** Today's local date, so a goal met yesterday never hides today's card. */
  day: string;
};

/** Android and web have no Live Activities: there is nothing to show beside the app. */
export async function syncGoalActivity(_input: GoalActivityInput): Promise<void> {}
