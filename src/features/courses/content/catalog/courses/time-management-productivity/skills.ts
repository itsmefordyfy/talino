import type { Course } from '../../../types';

/** The skill meter of Time Management and Productivity: one skill per module, so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'understanding-time', label: 'Understanding your time' },
  { id: 'goal-setting', label: 'Goal setting' },
  { id: 'prioritizing', label: 'Prioritizing' },
  { id: 'daily-planning', label: 'Planning your day' },
  { id: 'starting-and-motivation', label: 'Starting and staying motivated' },
  { id: 'focus', label: 'Focus and deep work' },
  { id: 'digital-organization', label: 'Digital organization' },
  { id: 'ai-productivity', label: 'Working with AI and automation' },
  { id: 'work-study-remote', label: 'Work, study and remote time' },
  { id: 'sustainable-habits', label: 'Sustainable habits' },
];
