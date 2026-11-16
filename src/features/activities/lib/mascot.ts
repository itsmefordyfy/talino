import type { TaliMood } from '@/components/brand/tali';

export type MascotInput = {
  /** What happened last: the learner asked for a hint, checked an answer, or solved it. */
  last: 'hint' | 'wrong' | 'solved' | null;
  wrongTries: number;
  hintsUsed: number;
};

/** One still pose for Tali, matching the moment. No pose while nothing has happened yet. */
export function mascotMood({ last, wrongTries, hintsUsed }: MascotInput): TaliMood | null {
  if (last === 'solved') return wrongTries === 0 && hintsUsed === 0 ? 'celebrating' : 'excited';
  if (last === 'wrong') return wrongTries >= 2 ? 'determined' : 'confused';
  if (last === 'hint') return 'explaining';
  return null;
}
