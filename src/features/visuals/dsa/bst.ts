import { dsaStrings } from './strings';

type Text = typeof dsaStrings.en.bst;
export const MAX_TREE_NODES = 12;

export type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };
export type Tree = TreeNode | null;

export const insertValue = (root: Tree, value: number): TreeNode => {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) return { ...root, left: insertValue(root.left, value) };
  if (value > root.value) return { ...root, right: insertValue(root.right, value) };
  return root;
};

export const minNode = (root: TreeNode): TreeNode => (root.left ? minNode(root.left) : root);

/** Removes a value; a node with two children is replaced by its in-order successor (the smallest value to its right). */
export const removeValue = (root: Tree, value: number): Tree => {
  if (!root) return null;
  if (value < root.value) return { ...root, left: removeValue(root.left, value) };
  if (value > root.value) return { ...root, right: removeValue(root.right, value) };
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  const successor = minNode(root.right);
  return { value: successor.value, left: root.left, right: removeValue(root.right, successor.value) };
};

export const hasValue = (root: Tree, value: number): boolean => (root ? (value === root.value ? true : hasValue(value < root.value ? root.left : root.right, value)) : false);
export const findNode = (root: Tree, value: number): TreeNode | null => (root ? (value === root.value ? root : findNode(value < root.value ? root.left : root.right, value)) : null);
export const sizeOf = (root: Tree): number => (root ? 1 + sizeOf(root.left) + sizeOf(root.right) : 0);
export const heightOf = (root: Tree): number => (root ? 1 + Math.max(heightOf(root.left), heightOf(root.right)) : 0);

export type Traversal = 'inorder' | 'preorder' | 'postorder' | 'levelorder';
export const TRAVERSALS: readonly Traversal[] = ['inorder', 'preorder', 'postorder', 'levelorder'];

export function traverse(root: Tree, kind: Traversal): number[] {
  const out: number[] = [];
  const walk = (node: Tree) => {
    if (!node) return;
    if (kind === 'preorder') out.push(node.value);
    walk(node.left);
    if (kind === 'inorder') out.push(node.value);
    walk(node.right);
    if (kind === 'postorder') out.push(node.value);
  };
  if (kind === 'levelorder') {
    const queue: TreeNode[] = root ? [root] : [];
    while (queue.length > 0) {
      const node = queue.shift()!;
      out.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  } else walk(root);
  return out;
}

export function buildTree(values: readonly number[]): Tree {
  return values.reduce<Tree>((root, value) => insertValue(root, value), null);
}

export type Placed = { value: number; column: number; depth: number; parent: number | null };

/** Each node's column (its in-order position) and depth, and its parent's value, for drawing. */
export function layoutTree(root: Tree): Placed[] {
  const placed: Placed[] = [];
  let column = 0;
  const walk = (node: Tree, depth: number, parent: number | null) => {
    if (!node) return;
    walk(node.left, depth + 1, node.value);
    placed.push({ value: node.value, column, depth, parent });
    column += 1;
    walk(node.right, depth + 1, node.value);
  };
  walk(root, 0, null);
  return placed;
}

export type TreeStep = {
  root: Tree;
  /** Nodes visited on the way (the path or the traversal so far). */
  visited: number[];
  current: number | null;
  /** The node a search or delete found. */
  found: number | null;
  fresh: number | null;
  doomed: number | null;
  /** The traversal's output so far (null when not traversing). */
  output: number[] | null;
  /** Level-order only: the queue of nodes waiting to be visited. */
  queue: number[] | null;
  caption: string;
};

const mk = (root: Tree, extra: Partial<TreeStep>, caption: string): TreeStep => ({ root, visited: [], current: null, found: null, fresh: null, doomed: null, output: null, queue: null, ...extra, caption });

/** The path from the root toward a value, with the left/right decision at each node. */
function descend(root: Tree, value: number, t: Text): { steps: TreeStep[]; hit: boolean; path: number[] } {
  const steps: TreeStep[] = [];
  const path: number[] = [];
  let node = root;
  while (node) {
    path.push(node.value);
    if (value === node.value) {
      steps.push(mk(root, { visited: [...path], current: node.value, found: node.value }, t.equal(value, node.value)));
      return { steps, hit: true, path };
    }
    const left = value < node.value;
    steps.push(mk(root, { visited: [...path], current: node.value }, t.goes(value, node.value, left, (left ? node.left : node.right) === null)));
    node = left ? node.left : node.right;
  }
  return { steps, hit: false, path };
}

export function insertSteps(root: Tree, value: number, t: Text = dsaStrings.en.bst): TreeStep[] {
  if (hasValue(root, value)) return [...descend(root, value, t).steps, mk(root, { current: value }, t.duplicate(value))];
  if (sizeOf(root) >= MAX_TREE_NODES) return [mk(root, {}, t.full(MAX_TREE_NODES))];
  if (!root) return [mk(null, {}, t.insertStart(value)), mk(insertValue(null, value), { fresh: value }, t.insertRoot(value))];
  const { steps, path } = descend(root, value, t);
  const next = insertValue(root, value);
  return [mk(root, {}, t.insertStart(value)), ...steps, mk(next, { visited: path, fresh: value }, t.insertPlaced(value, path[path.length - 1] ?? 0))];
}

export function searchSteps(root: Tree, value: number, t: Text = dsaStrings.en.bst): TreeStep[] {
  if (!root) return [mk(null, {}, t.searchEmpty)];
  const { steps, hit, path } = descend(root, value, t);
  return [mk(root, {}, t.searchStart(value)), ...steps, ...(hit ? [] : [mk(root, { visited: path }, t.searchMissing(value, path.length))])];
}

export function deleteSteps(root: Tree, value: number, t: Text = dsaStrings.en.bst): TreeStep[] {
  if (!root) return [mk(null, {}, t.searchEmpty)];
  const { steps, hit, path } = descend(root, value, t);
  const start = mk(root, {}, t.deleteStart(value));
  if (!hit) return [start, ...steps, mk(root, { visited: path }, t.deleteMissing(value))];
  const target = findNode(root, value)!;
  const doomed = mk(root, { visited: path, doomed: value }, target.left && target.right ? t.deleteTwo(value, minNode(target.right).value) : target.left || target.right ? t.deleteOne(value, (target.left ?? target.right)!.value) : t.deleteLeaf(value));
  return [start, ...steps, doomed, mk(removeValue(root, value), {}, t.deleteDone(value))];
}

/** One step per visited node, with the output so far (and the queue for level order). */
export function traversalSteps(root: Tree, kind: Traversal, t: Text = dsaStrings.en.bst): TreeStep[] {
  const order = traverse(root, kind);
  const steps: TreeStep[] = [mk(root, { output: [], queue: kind === 'levelorder' && root ? [root.value] : null }, root ? t.traversalStart(t.traversalNames[kind], t.traversalRules[kind]) : t.searchEmpty)];
  const parentOf = new Map(layoutTree(root).map((placed) => [placed.value, placed]));
  order.forEach((value, index) => {
    let queue: number[] | null = null;
    if (kind === 'levelorder') {
      // Nodes already discovered but not yet visited: children of visited nodes (and of the current one, once it is visited).
      const seen = new Set(order.slice(0, index + 1));
      queue = order.slice(index + 1).filter((candidate) => {
        const parent = parentOf.get(candidate)?.parent;
        return parent === null || parent === undefined ? false : seen.has(parent);
      });
    }
    steps.push(mk(root, { visited: order.slice(0, index + 1), current: value, output: order.slice(0, index + 1), queue }, t.visit(value, index + 1, order.length)));
  });
  if (root) steps.push(mk(root, { visited: order, output: order, queue: kind === 'levelorder' ? [] : null }, t.traversalDone(t.traversalNames[kind], order.join(', '), kind === 'inorder')));
  return steps;
}
