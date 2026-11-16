import { describe, expect, test } from '@jest/globals';

import { validateDiagram } from '../../diagrams/validate';
import { softwareStrings } from '../strings';
import { applyGit, initialGit } from './git';
import { outcomeText } from './git-text';
import { architectureSpec, COMPONENTS, LINKS, PATH_IDS, PATHS, pathSteps } from './architecture';
import { createNotifier, getInstance, NOTIFIER_KINDS, notifyObservers, patternSpec, PATTERN_IDS, SINGLETON_START, toggleSubscription } from './patterns';
import { buildPipelineRun, STAGES } from './pipeline';
import { buildSdlcSteps, PHASES, sdlcSequence, sdlcSpec } from './sdlc';

const s = softwareStrings.en;

function expectValid(spec: unknown) {
  const result = validateDiagram(spec);
  if (!result.ok) throw new Error(result.errors.join(', '));
}

describe('SDLC', () => {
  test('the spec is valid and has a loop and a bug edge', () => {
    const spec = sdlcSpec(s.sdlc);
    expectValid(spec);
    expect(spec.kind === 'flow' && spec.edges).toContainEqual(expect.objectContaining({ from: 'maintain', to: 'plan' }));
    expect(spec.kind === 'flow' && spec.edges[6]).toMatchObject({ from: 'test', to: 'build' });
  });

  test('a clean run visits every phase once, then loops back to plan', () => {
    const moves = sdlcSequence(false);
    expect(moves.map((move) => move.phase)).toEqual([...PHASES, 'plan']);
    expect(moves[moves.length - 1].kind).toBe('loop');
  });

  test('a bug sends the loop back from test to build and tests again', () => {
    const moves = sdlcSequence(true);
    expect(moves.map((move) => move.phase)).toEqual(['plan', 'design', 'build', 'test', 'build', 'test', 'release', 'maintain', 'plan']);
    expect(moves[4]).toMatchObject({ phase: 'build', edge: 6, kind: 'fix' });
  });

  test('every step points at a real edge and has a caption', () => {
    for (const bug of [false, true]) {
      for (const step of buildSdlcSteps(bug, s.sdlc)) {
        expect(step.caption.length).toBeGreaterThan(15);
        for (const edge of step.edges ?? []) expect(edge).toBeLessThan(7);
      }
    }
    expect(buildSdlcSteps(false, s.sdlc)[0].caption).toContain('Result: a list of requirements and a plan.');
  });
});

describe('pipeline', () => {
  test('all passing: every stage runs in order and deploy goes live', () => {
    const steps = buildPipelineRun({ build: 'pass', test: 'pass' });
    expect(steps[0].event).toBe('start');
    expect(steps.map((step) => step.stage).filter(Boolean).filter((stage, i, all) => all.indexOf(stage) === i)).toEqual([...STAGES]);
    const last = steps[steps.length - 1];
    expect(last.event).toBe('live');
    expect(Object.values(last.statuses)).toEqual(['passed', 'passed', 'passed', 'passed']);
  });

  test('a failing build stops everything after it', () => {
    const steps = buildPipelineRun({ build: 'fail', test: 'pass' });
    const last = steps[steps.length - 1];
    expect(last.event).toBe('stopped');
    expect(last.statuses).toEqual({ commit: 'passed', build: 'failed', test: 'skipped', deploy: 'skipped' });
    expect(steps.some((step) => step.statuses.test === 'running')).toBe(false);
  });

  test('a failing test: build passed, deploy skipped, never running', () => {
    const steps = buildPipelineRun({ build: 'pass', test: 'fail' });
    const last = steps[steps.length - 1];
    expect(last.statuses).toEqual({ commit: 'passed', build: 'passed', test: 'failed', deploy: 'skipped' });
    expect(steps.some((step) => step.statuses.deploy === 'running' || step.statuses.deploy === 'passed')).toBe(false);
  });

  test('a build failure hides the test setting', () => {
    expect(buildPipelineRun({ build: 'fail', test: 'fail' })).toEqual(buildPipelineRun({ build: 'fail', test: 'pass' }));
  });
});

describe('system architecture', () => {
  test('the diagram is valid and every component is on it', () => {
    const spec = architectureSpec(s.architecture);
    expectValid(spec);
    expect(spec.kind === 'architecture' && spec.nodes.map((node) => node.id)).toEqual([...COMPONENTS]);
    expect(spec.kind === 'architecture' && spec.edges).toHaveLength(LINKS.length);
  });

  test.each(PATH_IDS)('%s: every hop leaves a component the path has already reached', (id) => {
    const steps = pathSteps(id);
    expect(steps).toHaveLength(PATHS[id].length);
    expect(s.architecture.hops[id]).toHaveLength(steps.length);
    const reached = new Set<string>([steps[0].from]);
    for (const step of steps) {
      expect(reached.has(step.from)).toBe(true);
      reached.add(step.to);
      expect(step.nodes).toContain(step.to);
    }
    expect(steps[steps.length - 1].edges).toEqual(PATHS[id]);
  });

  test('requests start at a client and never skip the gateway', () => {
    for (const id of PATH_IDS) {
      const [first, second] = pathSteps(id);
      expect(['web', 'mobile']).toContain(first.from);
      expect(first.to).toBe('gateway');
      expect(second.from).toBe('gateway');
    }
    for (const [from] of LINKS) if (from === 'web' || from === 'mobile') expect(LINKS.find(([a]) => a === from)?.[1]).toBe('gateway');
  });

  test('only services touch the database; clients never do', () => {
    for (const [from, to] of LINKS) if (to === 'db') expect(['auth', 'catalog', 'orders']).toContain(from);
  });
});

describe('design patterns', () => {
  test.each(PATTERN_IDS)('%s class diagram is valid and every class has a note', (id) => {
    const strings = {
      observer: { title: s.patterns.diagramTitles.observer, summary: s.patterns.diagramSummaries.observer, notes: s.patterns.notes.observer },
      factory: { title: s.patterns.diagramTitles.factory, summary: s.patterns.diagramSummaries.factory, notes: s.patterns.notes.factory },
      singleton: { title: s.patterns.diagramTitles.singleton, summary: s.patterns.diagramSummaries.singleton, notes: s.patterns.notes.singleton },
    };
    const spec = patternSpec(id, strings);
    expectValid(spec);
    if (spec.kind !== 'class') throw new Error('kind');
    for (const box of spec.classes) expect(box.note).toBeTruthy();
  });

  test('each pattern says when to use it and when not to', () => {
    for (const id of PATTERN_IDS) {
      expect(s.patterns.use[id].length).toBeGreaterThan(20);
      expect(s.patterns.avoid[id].length).toBeGreaterThan(20);
    }
  });

  test('observer: exactly the subscribed observers are notified, in order', () => {
    let subs = toggleSubscription([], 'sms');
    subs = toggleSubscription(subs, 'email');
    expect(notifyObservers(subs)).toEqual(['sms', 'email']);
    subs = toggleSubscription(subs, 'sms');
    expect(notifyObservers(subs)).toEqual(['email']);
    expect(notifyObservers(toggleSubscription(subs, 'email'))).toEqual([]);
  });

  test('factory: builds the class asked for and refuses unknown kinds', () => {
    expect(createNotifier('email')?.type).toBe('EmailNotifier');
    expect(createNotifier('sms')?.send('Hi')).toBe('SMS sent: Hi');
    for (const kind of NOTIFIER_KINDS) expect(createNotifier(kind)).not.toBeNull();
    expect(createNotifier('carrier-pigeon')).toBeNull();
    expect(createNotifier('__proto__')).toBeNull();
  });

  test('singleton: the first call builds, every later call returns the same instance', () => {
    const first = getInstance(SINGLETON_START);
    expect(first).toMatchObject({ instance: 1, wasCreated: true });
    const second = getInstance(first.state);
    const third = getInstance(second.state);
    expect(second).toMatchObject({ instance: 1, wasCreated: false });
    expect(third.state.created).toBe(1);
    expect(third.state.calls).toBe(3);
  });
});

describe('git captions', () => {
  test('every outcome kind and every error has a sentence', () => {
    const state = initialGit();
    const ok = applyGit(state, { type: 'commit' });
    expect(outcomeText(ok, s.git)).toMatch(/new commit/);
    const merged = [
      applyGit(state, { type: 'branch', name: 'feature' }),
      applyGit(state, { type: 'switchNew', name: 'feature' }),
      applyGit(state, { type: 'checkout', target: state.commits[0].id }),
      applyGit(state, { type: 'merge', branch: 'main' }),
    ];
    for (const outcome of merged) expect(outcomeText(outcome, s.git).length).toBeGreaterThan(10);
    for (const code of Object.keys(s.git.errors)) expect(s.git.errors[code as keyof typeof s.git.errors].length).toBeGreaterThan(10);
    expect(outcomeText(applyGit(state, { type: 'branch', name: 'BAD' }), s.git)).toBe(s.git.errors['invalid-name']);
  });
});
