import type { Course } from '../../../types';

/** The skill meter of the Software Architecture with AI course (ten skills; modules 1-2 share one, modules 10-11 share one). */
export const SKILLS: Course['skills'] = [
  { id: 'arch-foundations', label: 'Foundations and requirements' },
  { id: 'arch-styles', label: 'Architecture styles' },
  { id: 'arch-components', label: 'Components and boundaries' },
  { id: 'arch-data', label: 'Data architecture' },
  { id: 'arch-integration', label: 'APIs and integration' },
  { id: 'arch-cloud', label: 'Cloud and infrastructure' },
  { id: 'arch-reliability', label: 'Scalability and reliability' },
  { id: 'arch-security', label: 'Security architecture' },
  { id: 'arch-ai-design', label: 'AI-assisted design and delivery' },
  { id: 'arch-production', label: 'Production and review' },
];
