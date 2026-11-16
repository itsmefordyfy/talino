/**
 * A mini Git: a pure model of commits, branches and HEAD, for the Git visual. Simplified on purpose:
 * there are no files, so nothing ever conflicts; commit ids are made up; a rebase is only allowed over a
 * straight line of commits. Every function returns a new state and never throws.
 */

export type Commit = { id: string; parents: readonly string[]; message: string; seq: number };
export type Branch = { name: string; tip: string };
export type Head = { kind: 'branch'; name: string } | { kind: 'detached'; id: string };

export type GitState = {
  commits: readonly Commit[];
  branches: readonly Branch[];
  head: Head;
  /** Counts commits ever made, so messages and ids keep going up. */
  counter: number;
};

export type GitCommand =
  | { type: 'commit' }
  | { type: 'branch'; name: string }
  | { type: 'switchNew'; name: string }
  | { type: 'checkout'; target: string }
  | { type: 'merge'; branch: string }
  | { type: 'rebase'; onto: string };

export type GitErrorCode = 'invalid-name' | 'branch-exists' | 'no-such-branch' | 'no-such-target' | 'detached-head' | 'same-branch' | 'too-many-commits' | 'too-many-branches' | 'rebase-merge-commits';

export type GitKind = 'commit' | 'branch' | 'switch' | 'detach' | 'fast-forward' | 'merge-commit' | 'up-to-date' | 'rebase';

export type GitOutcome =
  | {
      ok: true;
      state: GitState;
      kind: GitKind;
      /** The real Git command this stands for. */
      command: string;
      /** Names to fill the sentence: the branch, the commit id, how many commits moved. */
      detail: { branch?: string; id?: string; count?: number; onto?: string };
    }
  | { ok: false; error: GitErrorCode; detail: { name?: string } };

export const MAX_COMMITS = 16;
export const MAX_BRANCHES = 5;
export const BRANCH_NAME = /^[a-z][a-z0-9-]{0,19}$/;

export function initialGit(): GitState {
  const first: Commit = { id: makeId(['root'], 'Initial commit', 0), parents: [], message: 'Initial commit', seq: 0 };
  return { commits: [first], branches: [{ name: 'main', tip: first.id }], head: { kind: 'branch', name: 'main' }, counter: 1 };
}

/** A short hexadecimal id (FNV-1a over the commit's parents, message and number). Illustrative: real Git ids are SHA hashes of the content. */
export function makeId(parents: readonly string[], message: string, counter: number): string {
  let hash = 0x811c9dc5;
  for (const char of `${parents.join(',')}|${message}|${counter}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0').slice(0, 7);
}

export function headCommitId(state: GitState): string {
  if (state.head.kind === 'detached') return state.head.id;
  const name = state.head.name;
  return state.branches.find((branch) => branch.name === name)?.tip ?? '';
}

export function currentBranch(state: GitState): string | null {
  return state.head.kind === 'branch' ? state.head.name : null;
}

export function commitById(state: GitState, id: string): Commit | undefined {
  return state.commits.find((commit) => commit.id === id);
}

/** The commit and everything behind it. */
export function ancestors(state: GitState, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length > 0) {
    const next = stack.pop() as string;
    if (seen.has(next)) continue;
    seen.add(next);
    const commit = commitById(state, next);
    if (commit) stack.push(...commit.parents);
  }
  return seen;
}

function uniqueId(state: GitState, parents: readonly string[], message: string): string {
  let salt = state.counter;
  let id = makeId(parents, message, salt);
  while (state.commits.some((commit) => commit.id === id)) {
    salt += 1000;
    id = makeId(parents, message, salt);
  }
  return id;
}

/** Drops commits no branch (and not HEAD) can reach any more, as after a rebase: the old copies are left behind. */
function prune(state: GitState): GitState {
  const keep = new Set<string>();
  for (const branch of state.branches) for (const id of ancestors(state, branch.tip)) keep.add(id);
  for (const id of ancestors(state, headCommitId(state))) keep.add(id);
  return { ...state, commits: state.commits.filter((commit) => keep.has(commit.id)) };
}

function withTip(state: GitState, name: string, tip: string): GitState {
  return { ...state, branches: state.branches.map((branch) => (branch.name === name ? { ...branch, tip } : branch)) };
}

function addCommit(state: GitState, parents: readonly string[], message: string): { state: GitState; id: string } {
  const id = uniqueId(state, parents, message);
  const commit: Commit = { id, parents, message, seq: state.counter };
  return { state: { ...state, commits: [...state.commits, commit], counter: state.counter + 1 }, id };
}

const fail = (error: GitErrorCode, name?: string): GitOutcome => ({ ok: false, error, detail: name === undefined ? {} : { name } });

/** Applies one command. Invalid commands are returned as `{ ok: false, error }` and leave the state alone. */
export function applyGit(state: GitState, command: GitCommand): GitOutcome {
  switch (command.type) {
    case 'commit': {
      if (state.commits.length >= MAX_COMMITS) return fail('too-many-commits');
      const parent = headCommitId(state);
      const message = `Change ${state.counter}`;
      const made = addCommit(state, [parent], message);
      const next = state.head.kind === 'branch' ? withTip(made.state, state.head.name, made.id) : { ...made.state, head: { kind: 'detached', id: made.id } as Head };
      return { ok: true, state: next, kind: 'commit', command: `git commit -m "${message}"`, detail: { id: made.id, ...(state.head.kind === 'branch' ? { branch: state.head.name } : {}) } };
    }
    case 'branch':
    case 'switchNew': {
      if (!BRANCH_NAME.test(command.name)) return fail('invalid-name', command.name);
      if (state.branches.some((branch) => branch.name === command.name)) return fail('branch-exists', command.name);
      if (state.branches.length >= MAX_BRANCHES) return fail('too-many-branches');
      const tip = headCommitId(state);
      const next: GitState = { ...state, branches: [...state.branches, { name: command.name, tip }] };
      if (command.type === 'switchNew') return { ok: true, state: { ...next, head: { kind: 'branch', name: command.name } }, kind: 'switch', command: `git switch -c ${command.name}`, detail: { branch: command.name, id: tip } };
      return { ok: true, state: next, kind: 'branch', command: `git branch ${command.name}`, detail: { branch: command.name, id: tip } };
    }
    case 'checkout': {
      const branch = state.branches.find((candidate) => candidate.name === command.target);
      if (branch) return { ok: true, state: { ...state, head: { kind: 'branch', name: branch.name } }, kind: 'switch', command: `git switch ${branch.name}`, detail: { branch: branch.name, id: branch.tip } };
      const commit = state.commits.find((candidate) => candidate.id === command.target);
      if (commit) return { ok: true, state: { ...state, head: { kind: 'detached', id: commit.id } }, kind: 'detach', command: `git switch --detach ${commit.id}`, detail: { id: commit.id } };
      return fail('no-such-target', command.target);
    }
    case 'merge': {
      if (state.head.kind !== 'branch') return fail('detached-head');
      const current = state.head.name;
      const other = state.branches.find((branch) => branch.name === command.branch);
      if (!other) return fail('no-such-branch', command.branch);
      if (other.name === current) return fail('same-branch', current);
      const here = headCommitId(state);
      if (ancestors(state, here).has(other.tip)) return { ok: true, state, kind: 'up-to-date', command: `git merge ${other.name}`, detail: { branch: other.name } };
      if (ancestors(state, other.tip).has(here)) return { ok: true, state: withTip(state, current, other.tip), kind: 'fast-forward', command: `git merge ${other.name}`, detail: { branch: other.name, id: other.tip } };
      if (state.commits.length >= MAX_COMMITS) return fail('too-many-commits');
      const made = addCommit(state, [here, other.tip], `Merge ${other.name} into ${current}`);
      return { ok: true, state: withTip(made.state, current, made.id), kind: 'merge-commit', command: `git merge ${other.name}`, detail: { branch: other.name, id: made.id } };
    }
    case 'rebase': {
      if (state.head.kind !== 'branch') return fail('detached-head');
      const current = state.head.name;
      const onto = state.branches.find((branch) => branch.name === command.onto);
      if (!onto) return fail('no-such-branch', command.onto);
      if (onto.name === current) return fail('same-branch', current);
      const here = headCommitId(state);
      const behind = ancestors(state, here);
      if (behind.has(onto.tip)) return { ok: true, state, kind: 'up-to-date', command: `git rebase ${onto.name}`, detail: { branch: current, onto: onto.name } };
      if (ancestors(state, onto.tip).has(here)) return { ok: true, state: withTip(state, current, onto.tip), kind: 'fast-forward', command: `git rebase ${onto.name}`, detail: { branch: current, onto: onto.name, id: onto.tip } };
      // The commits only this branch has, oldest first. A merge commit among them cannot be replayed here.
      const base = ancestors(state, onto.tip);
      const replay = state.commits.filter((commit) => behind.has(commit.id) && !base.has(commit.id)).sort((a, b) => a.seq - b.seq);
      if (replay.some((commit) => commit.parents.length > 1)) return fail('rebase-merge-commits');
      if (state.commits.length + replay.length > MAX_COMMITS + 4) return fail('too-many-commits');
      let working = state;
      let parent = onto.tip;
      for (const commit of replay) {
        const made = addCommit(working, [parent], commit.message);
        working = made.state;
        parent = made.id;
      }
      return { ok: true, state: prune(withTip(working, current, parent)), kind: 'rebase', command: `git rebase ${onto.name}`, detail: { branch: current, onto: onto.name, count: replay.length, id: parent } };
    }
  }
}

/* ------------------------------ graph drawing ------------------------------ */

export type GraphNode = { id: string; lane: number; row: number; message: string; parents: readonly string[]; labels: readonly string[]; isHead: boolean };
export type GraphEdge = { from: string; to: string };
export type GitGraph = { nodes: GraphNode[]; edges: GraphEdge[]; lanes: number };

/**
 * Places commits for drawing: newest first (row 0 is the newest), one lane (column) per line of
 * development, `main` in lane 0. A commit continues its first parent's lane; a second parent gets a lane
 * of its own. Branch names and HEAD are attached to the commit they point at.
 */
export function layoutGitGraph(state: GitState): GitGraph {
  const ordered = [...state.commits].sort((a, b) => b.seq - a.seq);
  const lane = new Map<string, number>();
  let next = 1;
  // main's first-parent line is lane 0.
  const main = state.branches.find((branch) => branch.name === 'main') ?? state.branches[0];
  let walk = main ? commitById(state, main.tip) : undefined;
  while (walk) {
    lane.set(walk.id, 0);
    walk = walk.parents[0] ? commitById(state, walk.parents[0]) : undefined;
  }
  for (const commit of ordered) {
    if (!lane.has(commit.id)) lane.set(commit.id, next++);
    const own = lane.get(commit.id) as number;
    commit.parents.forEach((parent, index) => {
      if (lane.has(parent)) return;
      lane.set(parent, index === 0 ? own : next++);
    });
  }
  const headId = headCommitId(state);
  const nodes: GraphNode[] = ordered.map((commit, row) => ({
    id: commit.id,
    lane: lane.get(commit.id) ?? 0,
    row,
    message: commit.message,
    parents: commit.parents,
    labels: state.branches.filter((branch) => branch.tip === commit.id).map((branch) => branch.name),
    isHead: commit.id === headId,
  }));
  const edges = ordered.flatMap((commit) => commit.parents.filter((parent) => commitById(state, parent)).map((parent) => ({ from: commit.id, to: parent })));
  return { nodes, edges, lanes: Math.max(1, ...nodes.map((node) => node.lane + 1)) };
}
