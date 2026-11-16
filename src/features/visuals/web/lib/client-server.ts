import type { DiagramSpec, StagedStep } from '../../diagrams';
import type { WebStrings } from '../strings';

export const CLIENT_SERVER_IDS = ['page', 'data', 'many'] as const;
export type ClientServerId = (typeof CLIENT_SERVER_IDS)[number];

export function clientServerSpec(id: ClientServerId, s: WebStrings['clientServer']): DiagramSpec {
  const base = { title: s.scenarios[id], summary: s.summaries[id], direction: 'TD' as const };
  switch (id) {
    case 'page':
      return {
        kind: 'architecture',
        ...base,
        nodes: [
          { id: 'browser', label: s.nodes.browser, group: 'Client' },
          { id: 'server', label: s.nodes.server, group: 'Server' },
          { id: 'files', label: s.nodes.files, shape: 'database', group: 'Server' },
        ],
        edges: [
          { from: 'browser', to: 'server', label: s.edges.asks },
          { from: 'server', to: 'files' },
          { from: 'server', to: 'browser', label: s.edges.files, dashed: true },
        ],
      };
    case 'data':
      return {
        kind: 'architecture',
        ...base,
        nodes: [
          { id: 'app', label: s.nodes.app, group: 'Client' },
          { id: 'server', label: s.nodes.server, group: 'Server' },
          { id: 'database', label: s.nodes.database, shape: 'database', group: 'Server' },
        ],
        edges: [
          { from: 'app', to: 'server', label: s.edges.asks },
          { from: 'server', to: 'database', label: s.edges.query },
          { from: 'database', to: 'server', label: s.edges.rows, dashed: true },
          { from: 'server', to: 'app', label: s.edges.json, dashed: true },
        ],
      };
    case 'many':
      return {
        kind: 'architecture',
        ...base,
        nodes: [
          { id: 'phone', label: s.nodes.phone, group: 'Client' },
          { id: 'laptop', label: s.nodes.laptop, group: 'Client' },
          { id: 'server', label: s.nodes.server, group: 'Server' },
        ],
        edges: [
          { from: 'phone', to: 'server', label: s.edges.asks },
          { from: 'server', to: 'phone', label: s.edges.answers, dashed: true },
          { from: 'laptop', to: 'server', label: s.edges.asks },
          { from: 'server', to: 'laptop', label: s.edges.answers, dashed: true },
        ],
      };
  }
}

const ACTIVE: Record<ClientServerId, { nodes: string[]; edges: number[] }[]> = {
  page: [
    { nodes: ['browser'], edges: [0] },
    { nodes: ['server', 'files'], edges: [1] },
    { nodes: ['server'], edges: [2] },
    { nodes: ['browser'], edges: [] },
  ],
  data: [
    { nodes: ['app'], edges: [0] },
    { nodes: ['server', 'database'], edges: [1] },
    { nodes: ['database'], edges: [2] },
    { nodes: ['app'], edges: [3] },
  ],
  many: [
    { nodes: ['phone'], edges: [0] },
    { nodes: ['server'], edges: [1] },
    { nodes: ['laptop'], edges: [2] },
    { nodes: ['server'], edges: [3] },
  ],
};

export function buildClientServerSteps(id: ClientServerId, s: WebStrings['clientServer']): StagedStep[] {
  return s.steps[id].map((caption, i) => ({ caption, ...ACTIVE[id][i] }));
}
