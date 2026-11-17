/**
 * The AI Prompt Playground's templates (course: Time Management and Productivity). Plain data: a learner edits the text, fills the
 * [brackets] with their own details, copies it into their own assistant (ChatGPT, Gemini, Claude, Tali...) and checks what comes back.
 * Nothing here is an AI's output. `explain` says what each part of the prompt is for; `improve` are ideas for making it better;
 * `verify` is what to check in ANY answer before using it.
 */

export type PromptTemplateId = 'daily-planning' | 'weekly-planning' | 'task-prioritization' | 'task-breakdown' | 'meeting-summary' | 'project-schedule' | 'productivity-review';

export type PromptTemplate = {
  id: PromptTemplateId;
  title: string;
  /** One line: when to reach for it. */
  when: string;
  /** The prompt. Every [bracket] is something only the learner knows. */
  text: string;
  explain: { part: string; why: string }[];
  improve: string[];
  verify: string[];
};

export const PROMPT_TEMPLATES: readonly PromptTemplate[] = [
  {
    id: 'daily-planning',
    title: 'Plan my day',
    when: 'The evening before, or the first ten minutes of the day, when you have more to do than hours.',
    text: `Act as a practical planning coach. Help me plan tomorrow.

Context: I [work or study as ...] from [start time] to [end time]. My fixed commitments are [meetings, classes, school run, meals, with times].

My tasks, with a rough estimate each: [task 1, 45 min; task 2, 90 min; task 3, 30 min].
The one thing that must be done tomorrow: [your most important task].

Limits: no more than [4] hours of focused work, a break at least every [90] minutes, and [30] minutes left free for surprises.

Give me a time-blocked schedule as a table with the time, the task and why it sits in that slot. Then list anything that does not fit and what you suggest (move, delegate, drop). Ask me any questions you need before you answer, and list the assumptions you made.`,
    explain: [
      { part: 'Role', why: 'A role sets the style of help you want: a coach who plans, not a writer who invents.' },
      { part: 'Context and fixed commitments', why: 'The AI cannot see your calendar. Without your fixed times it will happily schedule work on top of your lunch.' },
      { part: 'Tasks with estimates', why: 'Estimates let it check whether the day adds up. You are better placed to estimate than it is.' },
      { part: 'The one must-do', why: 'It tells the AI what to protect when something has to give.' },
      { part: 'Limits', why: 'Breaks, a cap on focused work and slack are what make a plan survivable. Say them, or they get dropped.' },
      { part: 'Format and questions', why: 'A table is easy to check. Asking for questions and assumptions makes gaps visible before you rely on the plan.' },
    ],
    improve: [
      'Add the time your energy is best ("I think best before noon") so hard tasks land there.',
      'Say how much of your day is usually lost to interruptions, based on your own last week.',
      'Ask for a "plan B" for the afternoon in case a meeting runs long.',
    ],
    verify: ['Do the blocks add up to the hours you really have?', 'Is lunch, rest and travel time still there?', 'Is the must-do early enough to survive a bad afternoon?', 'Did it invent a task or a meeting you never mentioned?'],
  },
  {
    id: 'weekly-planning',
    title: 'Plan my week',
    when: 'Sunday evening or Monday morning, to decide the shape of the week before the days fill themselves.',
    text: `Act as a planning coach. Help me plan next week.

Context: I [work or study as ...]. My working hours are [days and times]. Fixed commitments this week: [meetings, classes, deadlines, family commitments, with days and times].

My goals for the week, in order of importance: [goal 1; goal 2; goal 3].
Tasks I know about, with estimates: [task, 2 h; task, 45 min; ...].

Limits: at most [5] hours of focused work a day, [one] evening and [one] half day with no work, and a [30]-minute buffer each day.

Give me a week view as a table (days across, time blocks down). Put the most important goal's work in my best hours: [mornings]. Show which tasks you did not fit and suggest what to do with them. Ask me questions first if anything is unclear, and state your assumptions.`,
    explain: [
      { part: 'Goals in order', why: 'Ranking the goals tells the AI what to protect when the week is too full.' },
      { part: 'Fixed commitments', why: 'Deadlines and appointments are the frame; everything else goes around them.' },
      { part: 'Rest built in', why: 'A free evening and half day in the prompt stop a plan that only works if you never get tired.' },
      { part: 'Best hours', why: 'Your own energy pattern is the one thing the AI cannot know. Tell it.' },
    ],
    improve: ['Add last week\'s unfinished tasks so the plan is honest about carry-over.', 'Ask it to mark which blocks are flexible and which are fixed.', 'Ask for a Wednesday check-in slot to adjust the plan.'],
    verify: ['Is every deadline before its due date?', 'Is there really a free evening and half day?', 'Is your top goal getting your best hours?', 'Do the daily totals match the limits you set?'],
  },
  {
    id: 'task-prioritization',
    title: 'Sort my tasks',
    when: 'When everything feels urgent and you need a second look at what is urgent, what is important and what is neither.',
    text: `Act as a thinking partner who helps me prioritise. I will list my tasks. Sort each into one of four boxes: urgent and important, important but not urgent, urgent but not important, and neither.

My main goals right now: [goal 1; goal 2].
Tasks, each with its deadline and who is waiting for it: [task, due Friday, my manager; task, no deadline, nobody; ...].

For each task, give the box and one sentence of reasoning I can argue with. Then name the two tasks you think have the highest impact on my goals, anything I could delegate or automate (and to whom or how), and anything I could drop. Tell me which of your calls you are least sure of and what information would change it.`,
    explain: [
      { part: 'Your goals', why: 'Important means important to something. Without your goals, "important" is just the AI\'s guess.' },
      { part: 'Deadline and who is waiting', why: 'Urgency comes from time and people. Both are facts only you have.' },
      { part: 'Reasoning you can argue with', why: 'You decide. A box with a reason is easy to disagree with; a bare list is not.' },
      { part: 'Where it is unsure', why: 'Asking for doubt keeps the AI from sounding more certain than it is.' },
    ],
    improve: ['Add the cost of doing nothing for the three biggest tasks.', 'Tell it which tasks you are tempted to avoid, so you can check your own bias.', 'Ask for a second opinion with the opposite assumption (what if the deadline moves?).'],
    verify: ['Does each box match what you know about the deadline?', 'Did it treat someone else\'s urgency as your importance?', 'Did it add tasks you did not list?'],
  },
  {
    id: 'task-breakdown',
    title: 'Break a big task into steps',
    when: 'When a task feels too big to start, and you need steps small enough to begin in five minutes.',
    text: `Act as a project coach. Help me break a big task into small steps I can start today.

The task: [describe the task and what "done" looks like].
My deadline: [date]. Time I can give it: [hours per day, which days].
What I already have or know: [materials, drafts, skills]. What worries me: [the part I keep avoiding].

Give me a numbered list of steps, each 15 to 45 minutes, in the order I should do them. Mark the first step I can finish in five minutes. For each step say what the finished result looks like. Tell me where I am most likely to get stuck and one way to get unstuck. Ask me questions before you answer if the task is unclear.`,
    explain: [
      { part: 'What "done" looks like', why: 'A task with no finish line cannot be broken down. Describe the result, not the activity.' },
      { part: 'Time you really have', why: 'Steps are only useful if they fit into the hours you have, not the hours you wish for.' },
      { part: 'What worries you', why: 'The avoided part is usually the real work. Naming it lets the plan include it early.' },
      { part: 'A five-minute first step', why: 'The easiest start beats the best plan you never begin.' },
    ],
    improve: ['Ask for the steps as a checklist you can paste into your task app.', 'Ask which step you could ask someone else to review.', 'Add a "done" test for each step so you know when to stop.'],
    verify: ['Is every step small enough to start without more planning?', 'Are the steps in an order that works (nothing needs a later step first)?', 'Does the total time fit before the deadline?'],
  },
  {
    id: 'meeting-summary',
    title: 'Turn meeting notes into actions',
    when: 'Right after a meeting, while you still remember what was meant.',
    text: `Act as a careful note-taker. Below are my rough notes from a meeting. Do not add anything that is not in the notes.

Meeting: [name or topic], on [date]. People: [first names or roles only].
Notes: [paste your notes here, with names, numbers and anything confidential removed or replaced].

Give me: (1) a three-sentence summary; (2) the decisions made; (3) action items as a table with the task, the owner, and the due date, writing "not stated" where the notes do not say; (4) open questions. Quote the line in my notes that each action item comes from. If something is unclear, list it as a question instead of guessing.`,
    explain: [
      { part: 'Do not add anything', why: 'Summaries are where an AI is most tempted to fill gaps with plausible nonsense. Forbid it.' },
      { part: 'Notes without confidential details', why: 'What you paste may be stored or used by the tool. Remove names, figures and anything private first.' },
      { part: '"Not stated" for gaps', why: 'A blank is honest. A guessed owner or date can quietly become a wrong commitment.' },
      { part: 'Quote the source', why: 'Quotes let you verify each action in ten seconds.' },
    ],
    improve: ['Ask it to flag any action item with no owner.', 'Ask for a two-line follow-up message to the group, which you edit before sending.', 'Add the last meeting\'s open items so it can mark what was closed.'],
    verify: ['Does every action item have a quote you can find in your notes?', 'Is any owner or date invented?', 'Is anything confidential left in what you pasted?'],
  },
  {
    id: 'project-schedule',
    title: 'Schedule a project',
    when: 'When a project has a deadline and several parts, and you need to see if the dates are believable.',
    text: `Act as a project planner. Help me build a schedule I can check.

Project: [what it is and what the finished result is]. Deadline: [date]. Start date: [date].
Parts of the work, with my own estimates in hours: [part 1, 6 h; part 2, 10 h; ...].
Dependencies (what must finish before what): [part 2 needs part 1].
Time I can give it: [hours per day, which days], with these days off: [dates].
Other commitments that compete: [other projects, meetings, study, family].

Give me a week-by-week table with the work, hours, and the date each part finishes. Add 20% extra time to my estimates and show where that leaves the deadline. If the deadline is not realistic, say so plainly and give me options (reduce scope, move the date, get help) instead of squeezing the plan. State your assumptions.`,
    explain: [
      { part: 'Your own estimates', why: 'You know the work. The AI knows how plans usually go wrong, so ask it to add a margin rather than invent hours.' },
      { part: 'Dependencies', why: 'Order matters. A schedule that ignores what must come first is only a list.' },
      { part: 'Competing commitments', why: 'Projects rarely get a whole week to themselves. Say what else takes your time.' },
      { part: 'Permission to say no', why: 'Asking it to tell you if the deadline is unrealistic stops it from forcing the plan to fit.' },
    ],
    improve: ['Add a first milestone date within a week so you can check the pace early.', 'Ask for the riskiest part to be scheduled first.', 'Ask what to tell the client or manager if the plan is tight.'],
    verify: ['Do the hours add up to the days you listed, including days off?', 'Is the dependency order respected?', 'Did the 20% margin change the finish date?', 'Is the schedule honest about a tight deadline?'],
  },
  {
    id: 'productivity-review',
    title: 'Review my week',
    when: 'Friday afternoon or Sunday evening, to learn from the week without judging yourself.',
    text: `Act as a kind but honest reflection partner. I will describe my week and you will help me learn from it. Use only what I tell you; do not guess at my feelings or habits.

What I planned: [list]. What I finished: [list]. What I did not finish: [list].
What got in the way, in my own words: [interruptions, low energy, unclear tasks, avoiding something].
What felt good: [one or two things]. How rested I felt: [honestly, 1 to 5].

Please: (1) compare what I planned with what I finished, and note any pattern you can see in these lists only; (2) ask me three questions that would help me understand why; (3) suggest one small change to try next week, and one thing I should keep doing; (4) remind me that one week is a small sample, and say what you cannot tell from this. Keep it short.`,
    explain: [
      { part: 'Use only what I tell you', why: 'The AI has no view of your week. This line keeps it from announcing "you always..." about things it cannot know.' },
      { part: 'Planned versus finished', why: 'The gap between the two lists is the most honest information in the review.' },
      { part: 'Rest and what felt good', why: 'A review that only counts output teaches you to overwork. Energy and good moments are data too.' },
      { part: 'One small change', why: 'One change you will actually try beats a list of ten you will not.' },
    ],
    improve: ['Paste two weeks side by side to see if a pattern repeats.', 'Ask it to turn the one change into a single sentence you can write on a sticky note.', 'Ask what you could stop doing.'],
    verify: ['Does it claim anything about you that you did not say?', 'Is the suggested change small enough to try this week?', 'Does it respect the rest you reported?'],
  },
];

export function findPromptTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((template) => template.id === id);
}
