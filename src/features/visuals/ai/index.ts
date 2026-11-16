import type { VisualDefinition } from '../types';
import { AiAppVisual } from './components/ai-app';
import { EmbeddingsVisual } from './components/embeddings';
import { LlmWorkflowVisual } from './components/llm-workflow';
import { ModelIoVisual } from './components/model-io';
import { NeuralNetVisual } from './components/neural-net';
import { RagVisual } from './components/rag';
import { TokensVisual } from './components/tokens';
import { aiStrings } from './strings';


/** Interactive visuals for AI. Everything with example data says it is an illustration, never a real model. */
const build = (s: typeof aiStrings.en): VisualDefinition[] => [
  {
    id: 'ai-model-input-output',
    title: s.modelIo.title,
    category: 'ai',
    summary: s.modelIo.summary,
    description: s.modelIo.description,
    topics: ['llm', 'language model', 'next token', 'prediction', 'temperature', 'probability', 'how ai works', 'generation'],
    Component: ModelIoVisual,
  },
  {
    id: 'ai-tokens',
    title: s.tokens.title,
    category: 'ai',
    summary: s.tokens.summary,
    description: s.tokens.description,
    topics: ['tokens', 'tokenizer', 'tokenization', 'bpe', 'context window', 'subword'],
    Component: TokensVisual,
  },
  {
    id: 'ai-embeddings',
    title: s.embeddings.title,
    category: 'ai',
    summary: s.embeddings.summary,
    description: s.embeddings.description,
    topics: ['embeddings', 'vectors', 'cosine similarity', 'semantic search', 'nearest neighbors', 'vector database'],
    Component: EmbeddingsVisual,
  },
  {
    id: 'ai-neural-network',
    title: s.network.title,
    category: 'ai',
    summary: s.network.summary,
    description: s.network.description,
    topics: ['neural network', 'weights', 'bias', 'activation', 'relu', 'sigmoid', 'forward pass', 'neuron', 'deep learning'],
    Component: NeuralNetVisual,
  },
  {
    id: 'ai-llm-workflow',
    title: s.llmWorkflow.title,
    category: 'ai',
    summary: s.llmWorkflow.summary,
    description: s.llmWorkflow.description,
    topics: ['llm', 'prompt', 'context', 'hallucination', 'evaluation', 'check', 'prompt engineering', 'workflow'],
    Component: LlmWorkflowVisual,
  },
  {
    id: 'ai-rag',
    title: s.rag.title,
    category: 'ai',
    summary: s.rag.summary,
    description: s.rag.description,
    topics: ['rag', 'retrieval augmented generation', 'knowledge base', 'citations', 'grounding', 'embeddings', 'chunks', 'vector search'],
    Component: RagVisual,
  },
  {
    id: 'ai-app-workflow',
    title: s.appWorkflow.title,
    category: 'ai',
    summary: s.appWorkflow.summary,
    description: s.appWorkflow.description,
    topics: ['ai app', 'api key', 'security', 'server', 'guardrails', 'evaluation', 'model api', 'secrets'],
    Component: AiAppVisual,
  },
];

export const aiVisuals = build(aiStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const aiVisualsFil = build(aiStrings.fil);
