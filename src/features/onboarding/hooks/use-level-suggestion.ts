import { catalogFacts, suggestNextLevel, useLearning, type CompletedCourse, type LevelSuggestion } from '@/features/courses/data';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { clearAppState, readAppState, writeAppState } from '@/db/app-state';

import { useProfile, useSetLearnerLevel } from './use-profile';

const DISMISSED_KEY = 'level-suggestion-dismissed';
const dismissedKey = ['level-suggestion-dismissed'] as const;

/** A suggestion is remembered as dismissed by the step it offered ("beginner→intermediate"), so a different step later is a new question. */
export const suggestionId = (from: string, to: string) => `${from}→${to}`;

export type LevelSuggestionState = {
  /** The one step up on offer, or null (no evidence, already dismissed, no level chosen, still loading). */
  suggestion: LevelSuggestion | null;
  isPending: boolean;
  /** Moves the learner up; progress is untouched. */
  accept: () => void;
  /** Hides this suggestion for good (until a different step is on offer). */
  dismiss: () => void;
};

/**
 * "Ready for the next level?": the pure `suggestNextLevel` fed with the learner's own level, the courses they completed (with the difficulty
 * tier they sit in and their quiz average) and a saved skill check. It never changes anything by itself: accepting or dismissing is the learner's.
 */
export function useLevelSuggestion(): LevelSuggestionState {
  const profile = useProfile();
  const learning = useLearning();
  const dismissed = useDbQuery(dismissedKey, (db) => readAppState<string>(db, DISMISSED_KEY));
  const { setLevel } = useSetLearnerLevel();
  const remember = useDbMutation((db, id: string | null) => (id === null ? clearAppState(db, DISMISSED_KEY) : writeAppState(db, DISMISSED_KEY, id)), { notify: false });

  const isPending = profile.isPending || learning.isPending || dismissed.isPending;
  const level = profile.data?.experience ?? null;
  let suggestion: LevelSuggestion | null = null;
  if (!isPending && level) {
    const tiers = new Map(catalogFacts().map((facts) => [facts.id, facts.level]));
    const completed: CompletedCourse[] = learning.progress
      .filter((progress) => progress.complete)
      .map((progress) => ({ difficulty: tiers.get(progress.courseId) ?? 'beginner', quizAverage: progress.quizAverage }));
    const found = suggestNextLevel({ level, completed, skillCheck: profile.data?.assessment?.level ?? null });
    if (found && dismissed.data !== suggestionId(level, found.to)) suggestion = found;
  }
  return {
    suggestion,
    isPending,
    accept: () => {
      if (!suggestion) return;
      setLevel(suggestion.to);
      remember.mutate(null);
    },
    dismiss: () => {
      if (level && suggestion) remember.mutate(suggestionId(level, suggestion.to));
    },
  };
}
