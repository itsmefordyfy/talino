import type { DiagramSpec, Payload, StagedStep } from '../../diagrams';
import type { AiStrings } from '../strings';
import { buildPrompt, CHUNKS, QUESTIONS, rankChunks, retrieve, TOP_K, vectorText, type QuestionId } from './rag';

/* ------------------------------ LLM workflow ------------------------------ */

export const LLM_SCENARIOS = ['ok', 'bad'] as const;
export type LlmScenario = (typeof LLM_SCENARIOS)[number];

type LlmWords = AiStrings['llmWorkflow'];

export function llmSpec(s: LlmWords): DiagramSpec {
  return {
    kind: 'flow',
    title: s.title,
    summary: s.summary,
    direction: 'TD',
    nodes: [
      { id: 'prompt', label: s.nodes.prompt, note: s.notes.prompt },
      { id: 'context', label: s.nodes.context, note: s.notes.context },
      { id: 'model', label: s.nodes.model, note: s.notes.model },
      { id: 'answer', label: s.nodes.answer, note: s.notes.answer },
      { id: 'check', label: s.nodes.check, shape: 'diamond', note: s.notes.check },
      { id: 'use', label: s.nodes.use, shape: 'circle', note: s.notes.use },
    ],
    edges: [
      { from: 'prompt', to: 'context' },
      { from: 'context', to: 'model' },
      { from: 'model', to: 'answer' },
      { from: 'answer', to: 'check' },
      { from: 'check', to: 'use', label: s.edges.passes },
      { from: 'check', to: 'prompt', label: s.edges.problem, dashed: true },
    ],
  };
}

export function buildLlmSteps(scenario: LlmScenario, s: LlmWords): StagedStep[] {
  const ex = s.examples[scenario];
  const steps: StagedStep[] = [
    { caption: s.steps.prompt, nodes: ['prompt'], edges: [], payloads: [{ title: s.titles.prompt, lines: ex.prompt }] },
    { caption: s.steps.context, nodes: ['context'], edges: [0], payloads: [{ title: s.titles.context, lines: ex.context }] },
    { caption: s.steps.model, nodes: ['model'], edges: [1] },
  ];
  if (scenario === 'ok') {
    steps.push(
      { caption: s.steps.answer, nodes: ['answer'], edges: [2], payloads: [{ title: s.titles.answer, lines: ex.answer }] },
      { caption: s.steps.checkOk, nodes: ['check'], edges: [3], payloads: [{ title: s.titles.check, lines: s.examples.ok.check, tone: 'ok' }] },
    );
  } else {
    const bad = s.examples.bad;
    steps.push(
      { caption: s.steps.answer, nodes: ['answer'], edges: [2], payloads: [{ title: s.titles.answer, lines: bad.answer, tone: 'warn' }] },
      { caption: s.steps.checkBad, nodes: ['check'], edges: [3], payloads: [{ title: s.titles.check, lines: bad.check, tone: 'danger' }] },
      { caption: s.steps.refine, nodes: ['prompt'], edges: [5], payloads: [{ title: s.titles.prompt, lines: bad.prompt2 }] },
      { caption: s.steps.contextAgain, nodes: ['context'], edges: [0], payloads: [{ title: s.titles.context, lines: bad.context2 }] },
      { caption: s.steps.modelAgain, nodes: ['model'], edges: [1] },
      { caption: s.steps.answerGood, nodes: ['answer'], edges: [2], payloads: [{ title: s.titles.answer, lines: bad.answer2 }] },
      { caption: s.steps.checkGood, nodes: ['check'], edges: [3], payloads: [{ title: s.titles.check, lines: bad.check2, tone: 'ok' }] },
    );
  }
  steps.push({ caption: s.steps.use, nodes: ['use'], edges: [4] });
  return steps;
}

/* -------------------------------- AI app ---------------------------------- */

export const APP_SCENARIOS = ['server', 'app'] as const;
export type AppScenario = (typeof APP_SCENARIOS)[number];

type AppWords = AiStrings['appWorkflow'];
type AppKey = keyof AppWords['messages'];
type AppWho = 'app' | 'server' | 'model';

const APP_MESSAGES: Record<AppKey, { from: AppWho; to: AppWho; dashed?: boolean }> = {
  ask: { from: 'app', to: 'server' },
  guardIn: { from: 'server', to: 'server' },
  callModel: { from: 'server', to: 'model' },
  generated: { from: 'model', to: 'server', dashed: true },
  guardOut: { from: 'server', to: 'server' },
  log: { from: 'server', to: 'server' },
  answer: { from: 'server', to: 'app', dashed: true },
  appCall: { from: 'app', to: 'model' },
  appGenerated: { from: 'model', to: 'app', dashed: true },
  extract: { from: 'app', to: 'app' },
};

export const APP_SEQUENCES: Record<AppScenario, readonly AppKey[]> = {
  server: ['ask', 'guardIn', 'callModel', 'generated', 'guardOut', 'log', 'answer'],
  app: ['appCall', 'appGenerated', 'extract'],
};

export function appSpec(scenario: AppScenario, s: AppWords): DiagramSpec {
  const keys = APP_SEQUENCES[scenario];
  const used = new Set(keys.flatMap((key) => [APP_MESSAGES[key].from, APP_MESSAGES[key].to]));
  const participants = (['app', 'server', 'model'] as const).filter((who) => used.has(who));
  return {
    kind: 'sequence',
    title: s.scenarios[scenario],
    summary: s.summary,
    participants: participants.map((who) => ({ id: who, label: s.participants[who], note: s.participantNotes[who], ...(who === 'model' ? { shape: 'database' as const } : {}) })),
    messages: keys.map((key) => ({ from: APP_MESSAGES[key].from, to: APP_MESSAGES[key].to, label: s.messages[key], ...(APP_MESSAGES[key].dashed ? { dashed: true } : {}) })),
  };
}

export function buildAppSteps(scenario: AppScenario, s: AppWords): StagedStep[] {
  return APP_SEQUENCES[scenario].map((key, index) => ({ caption: s.captions[key], nodes: [...new Set([APP_MESSAGES[key].from, APP_MESSAGES[key].to])], edges: [index] }));
}

/* ----------------------------------- RAG ---------------------------------- */

type RagWords = AiStrings['rag'];

export function ragSpec(s: RagWords): DiagramSpec {
  return {
    kind: 'flow',
    title: s.title,
    summary: s.summary,
    direction: 'TD',
    nodes: [
      { id: 'question', label: s.nodes.question, note: s.notes.question },
      { id: 'embed', label: s.nodes.embed, note: s.notes.embed },
      { id: 'kb', label: s.nodes.kb, shape: 'database', note: s.notes.kb },
      { id: 'search', label: s.nodes.search, note: s.notes.search },
      { id: 'chunks', label: s.nodes.chunks, note: s.notes.chunks },
      { id: 'prompt', label: s.nodes.prompt, note: s.notes.prompt },
      { id: 'model', label: s.nodes.model, note: s.notes.model },
      { id: 'answer', label: s.nodes.answer, shape: 'box', note: s.notes.answer },
    ],
    edges: [
      { from: 'question', to: 'embed' },
      { from: 'embed', to: 'search' },
      { from: 'kb', to: 'search' },
      { from: 'search', to: 'chunks' },
      { from: 'chunks', to: 'prompt' },
      { from: 'prompt', to: 'model' },
      { from: 'model', to: 'answer' },
      { from: 'question', to: 'prompt', label: s.edges.noRetrieval, dashed: true },
    ],
  };
}

/** Retrieval on: seven stages from question to a cited answer. Off: four stages, ending in an answer with no sources. */
export function buildRagSteps(question: QuestionId, retrievalOn: boolean, s: RagWords): StagedStep[] {
  const q = QUESTIONS[question];
  const questionPayload: Payload = { title: s.payloads.question, lines: [q.text] };
  if (!retrievalOn) {
    return [
      { caption: s.steps.question, nodes: ['question'], edges: [], payloads: [questionPayload] },
      { caption: s.steps.promptOff, nodes: ['question', 'prompt'], edges: [7], payloads: [{ title: s.payloads.prompt, lines: buildPrompt(q.text, [], s.instruction) }] },
      { caption: s.steps.modelOff, nodes: ['prompt', 'model'], edges: [5] },
      { caption: s.steps.answerOff, nodes: ['model', 'answer'], edges: [6], payloads: [{ title: s.payloads.ungrounded, lines: s.answers[question].ungrounded, tone: 'warn' }] },
    ];
  }
  const ranked = rankChunks(q);
  const top = retrieve(q, TOP_K);
  const picked = new Set(top.map((item) => item.chunk.id));
  const sources = top.map((item) => item.chunk);
  return [
    { caption: s.steps.question, nodes: ['question'], edges: [], payloads: [questionPayload] },
    { caption: s.steps.embed, nodes: ['question', 'embed'], edges: [0], payloads: [{ title: s.payloads.vector, lines: [vectorText(q), s.vectorNote], tone: 'info' }] },
    { caption: s.steps.search, nodes: ['embed', 'search', 'kb'], edges: [1, 2], payloads: [{ title: s.payloads.ranking, lines: ranked.map((item) => s.rankLine(item.chunk.id, item.chunk.title, item.similarity, picked.has(item.chunk.id))), tone: 'info' }] },
    { caption: s.steps.retrieve, nodes: ['search', 'chunks'], edges: [3], payloads: [{ title: s.payloads.retrieved, lines: sources.map((chunk, i) => `[${i + 1}] ${chunk.title}: ${chunk.text}`) }] },
    { caption: s.steps.prompt, nodes: ['chunks', 'prompt'], edges: [4], payloads: [{ title: s.payloads.prompt, lines: buildPrompt(q.text, sources, s.instruction) }] },
    { caption: s.steps.model, nodes: ['prompt', 'model'], edges: [5] },
    {
      caption: s.steps.answer,
      nodes: ['model', 'answer'],
      edges: [6],
      payloads: [
        { title: s.payloads.grounded, lines: s.answers[question].grounded, tone: 'ok' },
        { title: s.payloads.sources, lines: sources.map((chunk, i) => `[${i + 1}] ${chunk.title}`) },
      ],
    },
  ];
}

export const KB_LINES = CHUNKS.map((chunk) => `[${chunk.id}] ${chunk.title}: ${chunk.text}`);
