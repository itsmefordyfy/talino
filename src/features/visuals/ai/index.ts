import type { VisualDefinition } from '../types';
import { agentLoopStrings } from './agent-loop-strings';
import { AgentLoopVisual } from './components/agent-loop';
import { AiAppVisual } from './components/ai-app';
import { ContextWindowVisual } from './components/context-window';
import { contextWindowStrings } from './context-window-strings';
import { ImagePromptBuilderVisual } from './components/image-prompt-builder';
import { imagePromptStrings } from './image-prompt-strings';
import { PromptAnatomyVisual } from './components/prompt-anatomy';
import { promptAnatomyStrings } from './prompt-anatomy-strings';
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

/** The Generative AI course's four visuals: context window, prompt anatomy, image prompt builder and the agent loop; each keeps its strings in its own file (English only for now). */
const buildCourse = (language: 'en' | 'fil'): VisualDefinition[] => {
  const context = contextWindowStrings[language];
  const anatomy = promptAnatomyStrings[language];
  const image = imagePromptStrings[language];
  const agent = agentLoopStrings[language];
  return [
    { id: 'ai-context-window', title: context.title, category: 'ai', summary: context.summary, description: context.description, topics: context.topics, Component: ContextWindowVisual },
    { id: 'ai-prompt-anatomy', title: anatomy.title, category: 'ai', summary: anatomy.summary, description: anatomy.description, topics: anatomy.topics, Component: PromptAnatomyVisual },
    { id: 'ai-image-prompt-builder', title: image.title, category: 'ai', summary: image.summary, description: image.description, topics: image.topics, Component: ImagePromptBuilderVisual },
    { id: 'ai-agent-loop', title: agent.title, category: 'ai', summary: agent.summary, description: agent.description, topics: agent.topics, Component: AgentLoopVisual },
  ];
};

export const aiVisuals = [...build(aiStrings.en), ...buildCourse('en')];
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const aiVisualsFil = [...build(aiStrings.fil), ...buildCourse('fil')];
