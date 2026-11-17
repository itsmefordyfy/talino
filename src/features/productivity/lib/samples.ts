import type { PlanningActivity } from '@/features/activities/types';

/** Two small planning activities (one of each mode) for the activity samples: real, correct, and checked by the same rules as the course. */
const H = (hours: number, minutes = 0) => hours * 60 + minutes;

export const PLANNING_SAMPLES: readonly PlanningActivity[] = [
  {
    id: 'sample-planning-sort',
    kind: 'planning',
    title: 'Sort a busy Monday',
    prompt: 'Place each task in the box that fits: urgent and important, important but not urgent, urgent but not important, or neither.',
    concept: 'prioritization',
    hints: ['Ask two questions for each task: does it need attention soon, and does it matter to a goal?', 'A deadline today makes a task urgent, but only a goal makes it important.', 'Something that only feels urgent because someone else is waiting may belong in "hand it off".'],
    explanation: 'Urgent means it needs attention soon. Important means it matters to a goal. Doing the important-but-not-urgent work on purpose is what keeps it from becoming an emergency later.',
    challenge: {
      mode: 'prioritize',
      tasks: [
        { id: 'invoice', title: 'Send the invoice that is due at 5 PM', expected: 'do', why: 'It has a deadline today and money depends on it.' },
        { id: 'course', title: 'Start the certificate course you promised yourself', expected: 'plan', why: 'It matters to your goals, but nothing forces it today, so give it a time.' },
        { id: 'favour', title: 'A coworker asks for a quick favour right now', expected: 'delegate', alsoAcceptable: ['drop'], why: 'It is urgent for them, not for your goals; hand it off or say no politely.' },
        { id: 'feed', title: 'Scroll the news feed', expected: 'drop', why: 'It is neither urgent nor important.' },
        { id: 'bill', title: 'Pay the electricity bill that is due today', expected: 'do', why: 'A real deadline with a penalty, and it matters.' },
      ],
    },
  },
  {
    id: 'sample-planning-day',
    kind: 'planning',
    title: 'Plan a short Friday',
    prompt: 'Place the tasks in the day around the fixed commitments. Add a break, keep some time free, and decide about anything that does not fit.',
    concept: 'time-blocking',
    hints: ['Put the must-do task where you have the most energy, and give it the time you estimated.', 'A long stretch of work with no break fails. Add a short break between blocks.', 'If something does not fit, decide: do it another day, hand it off, say no or automate it.'],
    explanation: 'A good plan has the must-do work early, a break before the long stretch ends, some free time for surprises, and an honest decision about what did not fit.',
    challenge: {
      mode: 'schedule',
      scenario: {
        dayLabel: 'A short Friday',
        windowStart: H(8),
        windowEnd: H(16),
        fixed: [
          { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
          { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
        ],
        tasks: [
          { id: 'report', title: 'Finish the client report', minutes: 120, priority: 'high', mustDo: true, deadline: H(15) },
          { id: 'invoices', title: 'Send two invoices', minutes: 30, priority: 'medium' },
          { id: 'tidy', title: 'Tidy the desktop files', minutes: 60, priority: 'low', okActions: ['defer', 'decline'] },
        ],
      },
      solution: {
        blocks: [
          { id: 's1', kind: 'task', taskId: 'report', title: 'Client report', start: H(8), minutes: 60 },
          { id: 's2', kind: 'break', title: 'Break', start: H(9, 15), minutes: 15 },
          { id: 's3', kind: 'task', taskId: 'report', title: 'Client report', start: H(9, 30), minutes: 60 },
          { id: 's4', kind: 'task', taskId: 'invoices', title: 'Invoices', start: H(13), minutes: 30 },
        ],
        decisions: [{ taskId: 'tidy', action: 'defer' }],
      },
    },
  },
];
