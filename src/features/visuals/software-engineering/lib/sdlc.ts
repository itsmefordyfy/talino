import type { DiagramSpec, StagedStep } from '../../diagrams';

export const PHASES = ['plan', 'design', 'build', 'test', 'release', 'maintain'] as const;
export type SdlcPhase = (typeof PHASES)[number];

export type SdlcStrings = {
  title: string;
  summary: string;
  phases: Record<SdlcPhase, { label: string; what: string; output: string; note: string }>;
  output: (text: string) => string;
  bug: string;
  fix: string;
  retest: string;
  loop: string;
  edges: { bug: string; next: string };
};

type Kind = 'phase' | 'bug' | 'fix' | 'retest' | 'loop';
export type SdlcMove = { phase: SdlcPhase; edge: number | null; kind: Kind };

/** The order the loop is walked in: the six phases once, then back to planning. If testing finds a bug the loop goes back to build first. */
export function sdlcSequence(bugFound: boolean): SdlcMove[] {
  const moves: SdlcMove[] = [
    { phase: 'plan', edge: null, kind: 'phase' },
    { phase: 'design', edge: 0, kind: 'phase' },
    { phase: 'build', edge: 1, kind: 'phase' },
  ];
  if (bugFound) moves.push({ phase: 'test', edge: 2, kind: 'bug' }, { phase: 'build', edge: 6, kind: 'fix' }, { phase: 'test', edge: 2, kind: 'retest' });
  else moves.push({ phase: 'test', edge: 2, kind: 'phase' });
  moves.push({ phase: 'release', edge: 3, kind: 'phase' }, { phase: 'maintain', edge: 4, kind: 'phase' }, { phase: 'plan', edge: 5, kind: 'loop' });
  return moves;
}

export function sdlcSpec(s: SdlcStrings): DiagramSpec {
  return {
    kind: 'flow',
    title: s.title,
    summary: s.summary,
    direction: 'TD',
    nodes: PHASES.map((phase) => ({ id: phase, label: s.phases[phase].label, note: s.phases[phase].note })),
    edges: [
      { from: 'plan', to: 'design' },
      { from: 'design', to: 'build' },
      { from: 'build', to: 'test' },
      { from: 'test', to: 'release' },
      { from: 'release', to: 'maintain' },
      { from: 'maintain', to: 'plan', label: s.edges.next, dashed: true },
      { from: 'test', to: 'build', label: s.edges.bug, dashed: true },
    ],
  };
}

export function buildSdlcSteps(bugFound: boolean, s: SdlcStrings): StagedStep[] {
  return sdlcSequence(bugFound).map((move) => {
    const phase = s.phases[move.phase];
    const caption = move.kind === 'bug' ? `${phase.what} ${s.bug}` : move.kind === 'fix' ? s.fix : move.kind === 'retest' ? s.retest : move.kind === 'loop' ? `${phase.what} ${s.loop}` : `${phase.what} ${s.output(phase.output)}`;
    return { caption, nodes: [move.phase], edges: move.edge === null ? [] : [move.edge] };
  });
}
