import type { DiagramSpec, StagedStep } from '../../diagrams';
import type { WebStrings } from '../strings';
import { createStore, handleRequest, requestLines, responseLines, statusClass, USERS_SPEC, type ApiRecord, type ApiRequest, type ApiResult } from './http';

export const API_SCENARIO_IDS = ['get-user', 'create-user', 'not-found', 'invalid'] as const;
export type ApiScenarioId = (typeof API_SCENARIO_IDS)[number];

const SEED: readonly ApiRecord[] = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Leo' },
  { id: 3, name: 'Zed' },
  { id: 4, name: 'Kim' },
  { id: 5, name: 'Maya' },
];

type Facts = { request: ApiRequest; sql: string | null; dbResult: string; touchesDatabase: boolean };

const FACTS: Record<ApiScenarioId, Facts> = {
  'get-user': { request: { method: 'GET', path: '/users/5' }, sql: 'SELECT * FROM users WHERE id = 5;', dbResult: '1 row: id 5, name Maya', touchesDatabase: true },
  'create-user': { request: { method: 'POST', path: '/users', body: { name: 'Ben' } }, sql: "INSERT INTO users (name) VALUES ('Ben');", dbResult: '1 row added: id 6', touchesDatabase: true },
  'not-found': { request: { method: 'GET', path: '/users/999' }, sql: 'SELECT * FROM users WHERE id = 999;', dbResult: '0 rows', touchesDatabase: true },
  invalid: { request: { method: 'POST', path: '/users', body: {} }, sql: null, dbResult: '', touchesDatabase: false },
};

/** The request really run against a tiny users API, so the status and body shown are computed, not typed in. */
export function runApiScenario(id: ApiScenarioId): { request: ApiRequest; result: ApiResult; sql: string | null; dbResult: string; touchesDatabase: boolean } {
  const facts = FACTS[id];
  return { ...facts, result: handleRequest(createStore(USERS_SPEC, SEED), facts.request) };
}

export function apiTraceSpec(s: WebStrings['apiTrace']): DiagramSpec {
  return {
    kind: 'flow',
    title: s.title,
    summary: s.summary,
    direction: 'TD',
    nodes: [
      { id: 'user', label: s.nodes.user, shape: 'actor', note: s.nodeNotes.user },
      { id: 'frontend', label: s.nodes.frontend, note: s.nodeNotes.frontend },
      { id: 'request', label: s.nodes.request, shape: 'box', note: s.nodeNotes.request },
      { id: 'backend', label: s.nodes.backend, note: s.nodeNotes.backend },
      { id: 'database', label: s.nodes.database, shape: 'database', note: s.nodeNotes.database },
      { id: 'response', label: s.nodes.response, shape: 'box', note: s.nodeNotes.response },
    ],
    edges: [
      { from: 'user', to: 'frontend', label: s.edges.tap },
      { from: 'frontend', to: 'request', label: s.edges.sends },
      { from: 'request', to: 'backend', label: s.edges.network },
      { from: 'backend', to: 'database', label: s.edges.query },
      { from: 'database', to: 'backend', label: s.edges.rows, dashed: true },
      { from: 'backend', to: 'response', label: s.edges.builds },
      { from: 'response', to: 'frontend', label: s.edges.arrives, dashed: true },
    ],
  };
}

/** The seven stages of one request: user, frontend, request, backend, database, response, frontend again. */
export function buildApiTrace(id: ApiScenarioId, s: WebStrings['apiTrace']): StagedStep[] {
  const { request, result, sql, dbResult, touchesDatabase } = runApiScenario(id);
  const response = result.response;
  const tone = statusClass(response.status) === '2xx' ? 'ok' : 'danger';
  const responsePayload = { title: s.responseTitle, lines: responseLines(response), tone } as const;
  const steps: StagedStep[] = [
    { caption: s.steps.user(s.scenarios[id].action), nodes: ['user'], edges: [] },
    { caption: s.steps.frontend(request.method, request.path), nodes: ['frontend'], edges: [0] },
    { caption: s.steps.request, nodes: ['request'], edges: [1], payloads: [{ title: s.requestTitle, lines: requestLines(request) }] },
    { caption: s.steps.backend(s.backendWhat[id]), nodes: ['backend'], edges: [2], payloads: [{ title: s.requestTitle, lines: requestLines(request) }] },
  ];
  if (touchesDatabase && sql !== null) {
    steps.push({ caption: s.steps.database(s.databaseWhat[id]), nodes: ['backend', 'database'], edges: [3, 4], payloads: [{ title: s.queryTitle, lines: [sql, `→ ${dbResult}`, s.sqlNote], tone: 'info' }] });
  } else {
    steps.push({ caption: s.steps.databaseSkipped, nodes: ['backend'], edges: [] });
  }
  steps.push({ caption: s.steps.response(`${response.status} ${response.statusText}`, s.responseWhat[id]), nodes: ['response'], edges: [5], payloads: [responsePayload] });
  steps.push({ caption: s.steps.frontendDone(s.doneWhat[id]), nodes: ['frontend'], edges: [6], payloads: [responsePayload] });
  return steps;
}
