import type { Course } from '../../../types';

/** The ten skills of How Large Language Models Work: one per teaching area (module 10 and 11 share the last, applying what was learned). */
export const SKILLS: Course['skills'] = [
  { id: 'llm-foundations', label: 'What an LLM is' },
  { id: 'llm-training-data', label: 'Training data and learning' },
  { id: 'llm-tokens-embeddings', label: 'Tokens and embeddings' },
  { id: 'llm-transformers', label: 'Transformers and attention' },
  { id: 'llm-generation', label: 'Generating responses' },
  { id: 'llm-alignment', label: 'Fine-tuning and alignment' },
  { id: 'llm-limits', label: 'Context, memory and limits' },
  { id: 'llm-rag', label: 'Retrieval and external knowledge' },
  { id: 'llm-multimodal', label: 'Multimodal models' },
  { id: 'llm-applications', label: 'Applying LLMs responsibly' },
];
