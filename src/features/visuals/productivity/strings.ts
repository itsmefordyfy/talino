import { defineStrings } from '@/lib/i18n';

// Owner rule (2026-11-15): no Filipino is written, so `fil` is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of
// strings-parity.test.ts and in PENDING_TRANSLATION of registry-fil.test.ts. The tools' own words live in `features/productivity/strings.ts`.
const en = {
  eisenhower: {
    title: 'Eisenhower matrix',
    summary: 'Sort your own tasks by what is urgent and what is important, and see what to do now, schedule, hand off or let go.',
    description: 'Add a task, then tap it and choose a box: do now, schedule it, hand it off or let it go. Two questions help you decide: does it need attention soon, and does it matter to a goal. Your board is kept on this phone.',
    topics: ['eisenhower', 'matrix', 'urgent', 'important', 'priority', 'prioritization', 'prioritisation', 'sort tasks', 'delegate', 'time management', 'productivity'],
  },
  schedule: {
    title: 'Daily schedule builder',
    summary: 'Build a day from your tasks: estimate each one, give it a time, add breaks, and see conflicts and what is left over.',
    description: 'Add tasks with a length and a priority, give each a start time on the day line, add breaks, and watch for overlaps and for time you have not planned. The summary shows work, rest and free time. Your day is kept on this phone.',
    topics: ['schedule', 'daily plan', 'time blocking', 'time block', 'calendar', 'breaks', 'conflicts', 'planning', 'time management', 'productivity'],
  },
  pomodoro: {
    title: 'Pomodoro focus timer',
    summary: 'Work in focused rounds with short and long breaks. Set your own lengths, pause when life interrupts, and see the rounds you finished.',
    description: 'Start a focus round, pause or resume it, and take the break when it ends. After a set number of rounds you get a long break. You can change every length. Finished rounds are counted on this phone.',
    topics: ['pomodoro', 'timer', 'focus', 'deep work', 'break', 'procrastination', 'concentration', 'time management', 'productivity'],
  },
  promptPlayground: {
    title: 'AI prompt playground',
    summary: 'Edit planning prompts, see what each part is for, check the structure and copy the prompt into your own AI assistant.',
    description: 'Pick a prompt for planning, prioritising, breaking down a task, meeting notes, a project schedule or a weekly review. Replace the brackets with your details, read what each part is for and check the structure, then copy it. It is a checklist, not an AI.',
    topics: ['prompt', 'prompts', 'ai', 'chatgpt', 'gemini', 'claude', 'planning', 'prioritization', 'meeting notes', 'summary', 'weekly review', 'productivity', 'time management'],
  },
};

export const productivityVisualStrings = defineStrings({ en, fil: en });
