import type { Course } from '../../../types';

/** The skill meter of the Generative AI course: one skill per module, so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'genai-foundations', label: 'Foundations' },
  { id: 'genai-prompting', label: 'Prompting' },
  { id: 'genai-media', label: 'Images, audio and video' },
  { id: 'genai-multimodal', label: 'Multimodal' },
  { id: 'genai-rag', label: 'Knowledge and RAG' },
  { id: 'genai-agents', label: 'Agents' },
  { id: 'genai-business', label: 'Business use' },
  { id: 'genai-building', label: 'Building with AI' },
  { id: 'genai-responsible', label: 'Responsible AI' },
  { id: 'genai-future', label: 'Looking ahead' },
];
