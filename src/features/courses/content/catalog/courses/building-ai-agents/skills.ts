import type { Course } from '../../../types';

/** The skill meter of the Building AI Agents course (nine skills; modules 1-2 share one, modules 5-6 share one, modules 11-12 share one). */
export const SKILLS: Course['skills'] = [
  { id: 'agent-foundations', label: 'Agent concepts and architecture' },
  { id: 'agent-llm-apis', label: 'Connecting to LLM APIs' },
  { id: 'agent-tools', label: 'Tool and function calling' },
  { id: 'agent-memory-rag', label: 'Memory, retrieval and RAG' },
  { id: 'agent-planning', label: 'Planning and multi-step execution' },
  { id: 'agent-multi', label: 'Multi-agent systems' },
  { id: 'agent-frameworks', label: 'Frameworks and testing' },
  { id: 'agent-applications', label: 'Real-world agent applications' },
  { id: 'agent-production', label: 'Security, evaluation and production' },
];
