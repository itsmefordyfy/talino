import { defineStrings } from '@/lib/i18n';

/**
 * The course outline beside a lesson on a wide window (iPad, 2026-11-16). English only: the owner asked on 2026-11-15 that no
 * Filipino text be written, so `fil` is the same English (listed in `strings-parity.test.ts`'s ENGLISH_ONLY).
 */
const en = {
  title: 'Lessons',
  lessonRow: (day: number, title: string, state: 'done' | 'current' | 'next' | 'locked', minutes: number) =>
    `Day ${day}, ${title}, ${minutes} minutes, ${state === 'done' ? 'done' : state === 'current' ? 'open now' : state === 'next' ? 'up next' : 'locked'}`,
  progress: (done: number, total: number) => `${done} of ${total} done`,
  backToCourse: 'Course overview',
  minutes: (n: number) => `${n} min`,
  projects: 'Projects',
};

export const outlineStrings = defineStrings({ en, fil: en });
