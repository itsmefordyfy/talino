import { describe, expect, test } from '@jest/globals';

import { ancestors, applyGit, headCommitId, initialGit, layoutGitGraph, MAX_COMMITS, makeId, type GitCommand, type GitState } from './git';

function run(state: GitState, ...commands: GitCommand[]): GitState {
  return commands.reduce((current, command) => {
    const outcome = applyGit(current, command);
    if (!outcome.ok) throw new Error(`${command.type}: ${outcome.error}`);
    return outcome.state;
  }, state);
}

const commit: GitCommand = { type: 'commit' };
const tipOf = (state: GitState, name: string) => state.branches.find((branch) => branch.name === name)?.tip;

describe('start', () => {
  test('one commit on main with HEAD on main', () => {
    const state = initialGit();
    expect(state.commits).toHaveLength(1);
    expect(state.branches).toEqual([{ name: 'main', tip: state.commits[0].id }]);
    expect(state.head).toEqual({ kind: 'branch', name: 'main' });
  });

  test('ids look like short hashes and differ', () => {
    expect(makeId(['a'], 'x', 1)).toMatch(/^[0-9a-f]{7}$/);
    expect(makeId(['a'], 'x', 1)).not.toBe(makeId(['a'], 'x', 2));
    expect(makeId(['a'], 'x', 1)).toBe(makeId(['a'], 'x', 1));
  });
});

describe('commit', () => {
  test('moves the branch tip and HEAD follows the branch', () => {
    const start = initialGit();
    const outcome = applyGit(start, commit);
    expect(outcome.ok && outcome.kind).toBe('commit');
    if (!outcome.ok) return;
    expect(outcome.command).toMatch(/^git commit -m "Change \d+"$/);
    expect(outcome.state.commits).toHaveLength(2);
    const added = outcome.state.commits[1];
    expect(added.parents).toEqual([start.commits[0].id]);
    expect(tipOf(outcome.state, 'main')).toBe(added.id);
    expect(headCommitId(outcome.state)).toBe(added.id);
  });

  test('does not touch the old state and ids stay unique', () => {
    const start = initialGit();
    const snapshot = JSON.stringify(start);
    let state = start;
    for (let i = 0; i < 10; i += 1) state = run(state, commit);
    expect(JSON.stringify(start)).toBe(snapshot);
    expect(new Set(state.commits.map((c) => c.id)).size).toBe(state.commits.length);
  });

  test('stops at the limit with an error, state unchanged', () => {
    let state = initialGit();
    for (let i = 1; i < MAX_COMMITS; i += 1) state = run(state, commit);
    expect(applyGit(state, commit)).toMatchObject({ ok: false, error: 'too-many-commits' });
  });
});

describe('branch and switch', () => {
  test('git branch makes a branch at HEAD without switching', () => {
    const state = run(initialGit(), commit, { type: 'branch', name: 'feature' });
    expect(tipOf(state, 'feature')).toBe(tipOf(state, 'main'));
    expect(state.head).toEqual({ kind: 'branch', name: 'main' });
  });

  test('git switch -c makes it and moves HEAD', () => {
    const outcome = applyGit(initialGit(), { type: 'switchNew', name: 'feature' });
    expect(outcome.ok && outcome.command).toBe('git switch -c feature');
    expect(outcome.ok && outcome.state.head).toEqual({ kind: 'branch', name: 'feature' });
  });

  test('commits on a branch move only that branch', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, commit);
    expect(state.commits).toHaveLength(3);
    expect(tipOf(state, 'main')).toBe(state.commits[0].id);
    expect(tipOf(state, 'feature')).toBe(state.commits[2].id);
  });

  test('rejects bad and duplicate names', () => {
    const state = initialGit();
    for (const name of ['', 'Feature', '1abc', 'has space', 'a/b', 'x'.repeat(21), '--force', '__proto__']) {
      expect(applyGit(state, { type: 'branch', name })).toMatchObject({ ok: false, error: 'invalid-name' });
    }
    expect(applyGit(state, { type: 'branch', name: 'main' })).toMatchObject({ ok: false, error: 'branch-exists' });
  });

  test('checkout a branch, a commit id (detached), or fail', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, { type: 'checkout', target: 'main' });
    expect(state.head).toEqual({ kind: 'branch', name: 'main' });
    const first = state.commits[0].id;
    const detached = applyGit(state, { type: 'checkout', target: first });
    expect(detached.ok && detached.kind).toBe('detach');
    expect(detached.ok && detached.state.head).toEqual({ kind: 'detached', id: first });
    expect(applyGit(state, { type: 'checkout', target: 'nope' })).toMatchObject({ ok: false, error: 'no-such-target' });
    expect(applyGit(state, { type: 'checkout', target: '__proto__' })).toMatchObject({ ok: false, error: 'no-such-target' });
  });

  test('a commit made on a detached HEAD belongs to no branch', () => {
    const base = initialGit();
    const state = run(base, commit, { type: 'checkout', target: base.commits[0].id }, commit);
    expect(state.head.kind).toBe('detached');
    const lone = state.commits[state.commits.length - 1];
    expect(state.branches.every((branch) => branch.tip !== lone.id)).toBe(true);
    expect(headCommitId(state)).toBe(lone.id);
    // Switching away leaves it unreachable: it is pruned only by rebase, and still drawn until then.
    const back = run(state, { type: 'checkout', target: 'main' });
    expect(back.head).toEqual({ kind: 'branch', name: 'main' });
  });
});

describe('merge', () => {
  test('fast-forward when HEAD is behind: no new commit, the branch just moves', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, commit, { type: 'checkout', target: 'main' });
    const outcome = applyGit(state, { type: 'merge', branch: 'feature' });
    expect(outcome.ok && outcome.kind).toBe('fast-forward');
    if (!outcome.ok) return;
    expect(outcome.state.commits).toHaveLength(state.commits.length);
    expect(tipOf(outcome.state, 'main')).toBe(tipOf(state, 'feature'));
    expect(outcome.state.head).toEqual({ kind: 'branch', name: 'main' });
  });

  test('merge commit with two parents when both sides moved', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, { type: 'checkout', target: 'main' }, commit);
    const featureTip = tipOf(state, 'feature');
    const mainTip = tipOf(state, 'main');
    const outcome = applyGit(state, { type: 'merge', branch: 'feature' });
    expect(outcome.ok && outcome.kind).toBe('merge-commit');
    if (!outcome.ok) return;
    const merged = outcome.state.commits[outcome.state.commits.length - 1];
    expect(merged.parents).toEqual([mainTip, featureTip]);
    expect(merged.message).toBe('Merge feature into main');
    expect(tipOf(outcome.state, 'main')).toBe(merged.id);
    expect(tipOf(outcome.state, 'feature')).toBe(featureTip);
    expect(ancestors(outcome.state, merged.id).has(featureTip as string)).toBe(true);
  });

  test('already up to date changes nothing', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit);
    const outcome = applyGit(state, { type: 'merge', branch: 'main' });
    expect(outcome.ok && outcome.kind).toBe('up-to-date');
    expect(outcome.ok && outcome.state).toBe(state);
  });

  test('invalid merges are errors', () => {
    const state = run(initialGit(), { type: 'branch', name: 'feature' });
    expect(applyGit(state, { type: 'merge', branch: 'main' })).toMatchObject({ ok: false, error: 'same-branch' });
    expect(applyGit(state, { type: 'merge', branch: 'ghost' })).toMatchObject({ ok: false, error: 'no-such-branch' });
    const detached = run(state, { type: 'checkout', target: state.commits[0].id });
    expect(applyGit(detached, { type: 'merge', branch: 'feature' })).toMatchObject({ ok: false, error: 'detached-head' });
  });

  test('merging the same branch twice the second time is up to date', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, { type: 'checkout', target: 'main' }, commit, { type: 'merge', branch: 'feature' });
    expect(applyGit(state, { type: 'merge', branch: 'feature' })).toMatchObject({ ok: true, kind: 'up-to-date' });
  });
});

describe('rebase', () => {
  test('replays the branch commits on top of the other branch with new ids', () => {
    const state = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, commit, { type: 'checkout', target: 'main' }, commit, { type: 'checkout', target: 'feature' });
    const oldTip = tipOf(state, 'feature') as string;
    const mainTip = tipOf(state, 'main') as string;
    const outcome = applyGit(state, { type: 'rebase', onto: 'main' });
    expect(outcome.ok && outcome.kind).toBe('rebase');
    if (!outcome.ok) return;
    expect(outcome.detail.count).toBe(2);
    const next = outcome.state;
    const newTip = tipOf(next, 'feature') as string;
    expect(newTip).not.toBe(oldTip);
    expect(ancestors(next, newTip).has(mainTip)).toBe(true);
    // A straight line now: every commit but the root has exactly one parent.
    expect(next.commits.every((c) => c.parents.length <= 1)).toBe(true);
    // The old copies are no longer on any branch, so they are gone from the picture.
    expect(next.commits.some((c) => c.id === oldTip)).toBe(false);
    expect(next.commits.map((c) => c.message).filter((m) => m.startsWith('Change'))).toHaveLength(3);
    expect(tipOf(next, 'main')).toBe(mainTip);
    expect(next.head).toEqual({ kind: 'branch', name: 'feature' });
  });

  test('is a fast-forward when the branch is just behind, and a no-op when already on top', () => {
    const behind = run(initialGit(), { type: 'branch', name: 'feature' }, commit);
    const outcome = applyGit({ ...behind, head: { kind: 'branch', name: 'feature' } }, { type: 'rebase', onto: 'main' });
    expect(outcome.ok && outcome.kind).toBe('fast-forward');
    const ahead = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit);
    expect(applyGit(ahead, { type: 'rebase', onto: 'main' })).toMatchObject({ ok: true, kind: 'up-to-date' });
  });

  test('refuses merge commits, detached HEAD and unknown branches', () => {
    const merged = run(initialGit(), { type: 'switchNew', name: 'feature' }, commit, { type: 'checkout', target: 'main' }, commit, { type: 'merge', branch: 'feature' }, { type: 'switchNew', name: 'other' }, { type: 'checkout', target: 'feature' }, commit, { type: 'checkout', target: 'other' }, commit);
    expect(applyGit(merged, { type: 'rebase', onto: 'feature' })).toMatchObject({ ok: false, error: 'rebase-merge-commits' });
    expect(applyGit(initialGit(), { type: 'rebase', onto: 'ghost' })).toMatchObject({ ok: false, error: 'no-such-branch' });
    const state = initialGit();
    const detached = run(state, { type: 'checkout', target: state.commits[0].id });
    expect(applyGit(detached, { type: 'rebase', onto: 'main' })).toMatchObject({ ok: false, error: 'detached-head' });
  });
});

describe('graph layout', () => {
  test('newest first, main in lane 0, diverging work in its own lane', () => {
    const state = run(initialGit(), commit, { type: 'switchNew', name: 'feature' }, commit, { type: 'checkout', target: 'main' }, commit);
    const graph = layoutGitGraph(state);
    expect(graph.nodes.map((node) => node.row)).toEqual([0, 1, 2, 3]);
    const seqOf = (id: string) => state.commits.find((c) => c.id === id)?.seq ?? 0;
    const seqs = graph.nodes.map((node) => seqOf(node.id));
    expect([...seqs].sort((a, b) => b - a)).toEqual(seqs);
    const mainTip = graph.nodes.find((node) => node.labels.includes('main'));
    const featureTip = graph.nodes.find((node) => node.labels.includes('feature'));
    expect(mainTip?.lane).toBe(0);
    expect(featureTip?.lane).toBe(1);
    expect(graph.lanes).toBe(2);
    expect(graph.edges).toHaveLength(3);
  });

  test('no two commits share a lane and a row; HEAD is marked once', () => {
    let state = initialGit();
    const moves: GitCommand[] = [commit, { type: 'switchNew', name: 'a' }, commit, { type: 'checkout', target: 'main' }, { type: 'switchNew', name: 'b' }, commit, commit, { type: 'checkout', target: 'main' }, commit, { type: 'merge', branch: 'a' }, { type: 'merge', branch: 'b' }];
    for (const move of moves) state = run(state, move);
    const graph = layoutGitGraph(state);
    const spots = graph.nodes.map((node) => `${node.lane}:${node.row}`);
    expect(new Set(spots).size).toBe(spots.length);
    expect(graph.nodes.filter((node) => node.isHead)).toHaveLength(1);
    // A merge commit has two edges leaving it.
    const merge = graph.nodes.find((node) => node.parents.length === 2);
    expect(merge && graph.edges.filter((edge) => edge.from === merge.id)).toHaveLength(2);
  });

  test('fuzz: random command sequences keep the model consistent', () => {
    let seed = 99;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const names = ['a', 'b', 'c'];
    for (let round = 0; round < 60; round += 1) {
      let state = initialGit();
      for (let step = 0; step < 25; step += 1) {
        const r = random();
        const branches = state.branches.map((b) => b.name);
        const pick = <T,>(list: readonly T[]): T => list[Math.floor(random() * list.length)];
        const command: GitCommand =
          r < 0.35 ? commit : r < 0.5 ? { type: 'branch', name: pick(names) } : r < 0.6 ? { type: 'switchNew', name: pick(names) } : r < 0.75 ? { type: 'checkout', target: random() < 0.2 ? pick(state.commits).id : pick(branches) } : r < 0.9 ? { type: 'merge', branch: pick(branches) } : { type: 'rebase', onto: pick(branches) };
        const outcome = applyGit(state, command);
        if (outcome.ok) state = outcome.state;
        const ids = new Set(state.commits.map((c) => c.id));
        expect(ids.size).toBe(state.commits.length);
        for (const c of state.commits) for (const p of c.parents) expect(ids.has(p)).toBe(true);
        for (const b of state.branches) expect(ids.has(b.tip)).toBe(true);
        expect(ids.has(headCommitId(state))).toBe(true);
        const graph = layoutGitGraph(state);
        expect(new Set(graph.nodes.map((n) => `${n.lane}:${n.row}`)).size).toBe(graph.nodes.length);
      }
    }
  });
});
