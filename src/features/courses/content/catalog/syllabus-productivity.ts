import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Time Management and Productivity (owner's brief, 2026-11-17). A beginner course in planning, prioritising, focusing and working with AI without
 * burning out. It is practised with four interactive tools (Eisenhower matrix, day schedule builder, Pomodoro timer, prompt playground), a graded
 * planning challenge and the role-play and message-coach engine. Ten modules, 43 lessons (the brief asks for 4 to 6 per module, 8 to 12 hours).
 * Design: docs/superpowers/specs/2026-11-17-productivity-course-design.md; writer brief: docs/content/PRODUCTIVITY_BRIEF.md.
 */
export const PRODUCTIVITY_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'understanding-time-and-productivity',
    title: 'Understanding Time Management and Productivity',
    summary: 'Tell busy from productive, see where your time really goes, understand your own habits and set goals you can keep.',
    topics: [
      'What Time Management Really Means',
      'Busy Versus Productive: Finding Where Your Time Goes',
      'Your Personal Productivity Habits',
      'Setting Realistic Productivity Goals',
    ],
  },
  {
    slug: 'goal-setting-and-planning',
    title: 'Goal Setting and Planning',
    summary: 'Turn a wish into a SMART goal, break it into tasks and milestones, and track progress with a 30-day plan.',
    topics: [
      'SMART Goals: Making a Goal You Can Act On',
      'Short-Term and Long-Term Goals, Broken into Tasks',
      'Milestones and Tracking Progress',
      'Practice: Your 30-Day Development Plan',
    ],
  },
  {
    slug: 'prioritization-and-decision-making',
    title: 'Prioritization and Decision Making',
    summary: 'Separate urgent from important, rank by impact and decide what to do, delegate, postpone or decline.',
    topics: [
      'Urgent Versus Important: The Eisenhower Matrix',
      'ABC Prioritization and High-Impact Tasks',
      'Competing Responsibilities: Delegate, Postpone or Decline',
      'Practice: Organizing a Workload with Competing Deadlines',
    ],
  },
  {
    slug: 'planning-your-day-and-schedule',
    title: 'Planning Your Day and Managing Your Schedule',
    summary: 'Plan the day and the week, block your time, batch similar work, schedule breaks and cope when the plan breaks.',
    topics: [
      'Daily and Weekly Planning',
      'Calendar Management and Time Blocking',
      'Task Batching and Scheduling Breaks',
      'Managing Interruptions and Changing Priorities',
      'Practice: Building a Realistic Weekly Schedule',
    ],
  },
  {
    slug: 'beating-procrastination',
    title: 'Beating Procrastination and Staying Motivated',
    summary: 'Understand why you put things off, start small, work in focused rounds and build habits that keep you going.',
    topics: [
      'Why We Procrastinate',
      'Getting Started: The Two-Minute Rule and the Five-Minute Start',
      'The Pomodoro Technique',
      'Habit Stacking and Implementation Intentions',
      'Practice: A Seven-Day Anti-Procrastination Challenge',
    ],
  },
  {
    slug: 'focus-and-deep-work',
    title: 'Focus, Deep Work, and Managing Distractions',
    summary: 'Protect your attention: tell deep work from shallow work, tame notifications and design a session that is hard to interrupt.',
    topics: [
      'Focus, Attention and Deep Work',
      'Taming Digital Distractions and Notifications',
      'Your Workspace, Single-Tasking and Interruptions',
      'Practice: A Distraction-Free Deep-Work Session',
    ],
  },
  {
    slug: 'productivity-tools-and-digital-organization',
    title: 'Productivity Tools and Digital Organization',
    summary: 'Choose simple, free tools for tasks, calendar, notes, files and email, and build one workspace that you will actually use.',
    topics: [
      'Task Managers and Calendars',
      'Notes, Files and Project Basics',
      'Managing Email and Communication',
      'Practice: Building Your Personal Productivity Workspace',
    ],
  },
  {
    slug: 'productivity-with-ai-and-automation',
    title: 'Productivity with AI and Automation',
    summary: 'Use AI as a planning and writing partner you check, turn notes and requests into action, and automate only what is safe to automate.',
    topics: [
      'AI as Your Productivity Assistant',
      'AI for Research, Summaries, Email and Documents',
      'Turning Meeting Notes and Requests into Action',
      'Automating Repetitive Work: What to Automate and What Not To',
      'Practice: A Weekly Progress Report and an Automation Design',
    ],
  },
  {
    slug: 'work-study-and-remote-careers',
    title: 'Time Management for Work, Study, and Remote Careers',
    summary: 'Juggle several projects, estimate honestly, work across time zones, set client expectations and keep room for study and life.',
    topics: [
      'Managing Multiple Projects and Deadlines',
      'Remote Work, Time Zones and Client Expectations',
      'Study Schedules and Balancing Work with Life',
      'Practice: Managing a Simulated Week',
    ],
  },
  {
    slug: 'sustainable-productivity',
    title: 'Sustainable Productivity and Continuous Improvement',
    summary: 'Protect your energy, review your habits without obsessing, learn from missed goals and write a plan you can keep for the long run.',
    topics: [
      'Energy, Rest and Avoiding Burnout',
      'Reviewing and Measuring Progress Without Obsessing',
      'Learning from Missed Goals and Adjusting Your System',
      'Your 30-Day Productivity Plan',
    ],
  },
];

export const SYLLABUS_PRODUCTIVITY: readonly SyllabusEntry[] = [
  {
    id: 'time-management-productivity',
    title: 'Time Management and Productivity',
    level: 'beginner',
    category: 'careers',
    prerequisites: [],
    technologies: ['llm', 'chatgpt', 'claude'],
    // Not 'teach' or 'learn-ai-dev': a productivity course must never be the recommended starting course for those goals (the plan rules rank by goal).
    goals: ['get-job', 'freelance'],
    tags: ['time management', 'productivity', 'prioritization', 'eisenhower matrix', 'pomodoro', 'time blocking', 'procrastination', 'focus', 'deep work', 'goals', 'smart goals', 'planning', 'schedule', 'habits', 'burnout', 'remote work', 'automation', 'task management', 'ai assistant'],
    volatile: false,
    scope: 'The deep version of planning and focus: habits, goals, priorities, schedules, procrastination, deep work, simple tools, AI assistance and automation, remote and study time, and sustainable routines, practised with a matrix, a day planner, a timer and a graded planning challenge. It does not repeat the Soft Skills course’s five-lesson time module (a stress-tested weekly schedule and a manager-adds-work role-play) or the Freelance course’s pricing and proposals; it points to them.',
    modules: PRODUCTIVITY_MODULES,
    topics: PRODUCTIVITY_MODULES.flatMap((module) => module.topics),
  },
];
