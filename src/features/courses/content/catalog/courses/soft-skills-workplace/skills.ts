import type { Course } from '../../../types';

/** The skill meter of Soft Skills for the Modern Workplace: one skill per module, so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'communication', label: 'Communication' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'critical-thinking', label: 'Critical thinking' },
  { id: 'time-management', label: 'Time management' },
  { id: 'emotional-intelligence', label: 'Emotional intelligence' },
  { id: 'presenting', label: 'Presenting' },
  { id: 'adaptability', label: 'Adaptability' },
  { id: 'professionalism', label: 'Professionalism' },
  { id: 'client-management', label: 'Client management' },
  { id: 'career-readiness', label: 'Career readiness' },
];
