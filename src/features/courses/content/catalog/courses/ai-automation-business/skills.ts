import type { Course } from '../../../types';

/** The skill meter of AI Automation for Business and Everyday Work: one skill per teaching module (Module 11's lessons review them), so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'automation-thinking', label: 'Automation thinking' },
  { id: 'automation-tools', label: 'Choosing automation tools' },
  { id: 'personal-workflows', label: 'Personal AI workflows' },
  { id: 'documents-reports', label: 'Documents and reports' },
  { id: 'marketing-sales', label: 'Marketing and sales workflows' },
  { id: 'customer-support', label: 'Customer support automation' },
  { id: 'ai-agents', label: 'AI agents and tool use' },
  { id: 'workflow-building', label: 'Building workflows' },
  { id: 'business-automation', label: 'Small-business automation' },
  { id: 'responsible-automation', label: 'Safe and responsible automation' },
];
