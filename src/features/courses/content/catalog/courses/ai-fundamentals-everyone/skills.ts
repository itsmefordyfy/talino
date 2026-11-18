import type { Course } from '../../../types';

/** The skill meter of AI Fundamentals for Everyone: one skill per module, so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'ai-basics', label: 'AI basics' },
  { id: 'how-ai-works', label: 'How AI learns' },
  { id: 'generative-ai', label: 'Generative AI' },
  { id: 'everyday-ai-tools', label: 'Everyday AI tools' },
  { id: 'prompting-and-checking', label: 'Prompting and checking' },
  { id: 'responsible-ai', label: 'Responsible AI' },
  { id: 'ai-future', label: 'AI and your future' },
  { id: 'applying-ai', label: 'Applying AI' },
];
