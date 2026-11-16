import { describe, expect, test } from '@jest/globals';

import { buildTree, deleteSteps, heightOf, insertSteps, insertValue, layoutTree, removeValue, searchSteps, sizeOf, traversalSteps, traverse, TRAVERSALS, type Tree, type TreeNode } from './bst';
import { seededRandom } from './sorting';

const classic = buildTree([50, 30, 70, 20, 40, 60, 80]);
const last = <T>(items: readonly T[]) => items[items.length - 1]!;

function isBst(node: Tree, low = -Infinity, high = Infinity): boolean {
  if (!node) return true;
  return node.value > low && node.value < high && isBst(node.left, low, node.value) && isBst(node.right, node.value, high);
}

describe('binary search tree', () => {
  test('traversal orders of the classic tree', () => {
    expect(traverse(classic, 'inorder')).toEqual([20, 30, 40, 50, 60, 70, 80]);
    expect(traverse(classic, 'preorder')).toEqual([50, 30, 20, 40, 70, 60, 80]);
    expect(traverse(classic, 'postorder')).toEqual([20, 40, 30, 60, 80, 70, 50]);
    expect(traverse(classic, 'levelorder')).toEqual([50, 30, 70, 20, 40, 60, 80]);
    for (const kind of TRAVERSALS) expect(traverse(null, kind)).toEqual([]);
  });

  test('in-order is always sorted, and the BST property holds after random inserts and deletes', () => {
    const random = seededRandom(3);
    for (let run = 0; run < 100; run += 1) {
      let root: Tree = null;
      const present = new Set<number>();
      for (let op = 0; op < 40; op += 1) {
        const value = 1 + Math.floor(random() * 30);
        if (random() < 0.6) {
          root = insertValue(root, value);
          present.add(value);
        } else {
          root = removeValue(root, value);
          present.delete(value);
        }
        expect(isBst(root)).toBe(true);
        expect(traverse(root, 'inorder')).toEqual([...present].sort((a, b) => a - b));
        expect(sizeOf(root)).toBe(present.size);
      }
    }
  });

  test('the same values in different orders give different shapes', () => {
    expect(heightOf(buildTree([1, 2, 3, 4, 5]))).toBe(5);
    expect(heightOf(buildTree([3, 1, 5, 2, 4]))).toBe(3);
    expect(heightOf(null)).toBe(0);
  });

  test('delete handles a leaf, one child and two children', () => {
    expect(traverse(removeValue(classic, 20), 'preorder')).toEqual([50, 30, 40, 70, 60, 80]);
    const oneChild = buildTree([50, 30, 20]);
    expect(traverse(removeValue(oneChild, 30), 'preorder')).toEqual([50, 20]);
    const two = removeValue(classic, 50) as TreeNode;
    expect(two.value).toBe(60); // the in-order successor
    expect(traverse(two, 'inorder')).toEqual([20, 30, 40, 60, 70, 80]);
    expect(removeValue(classic, 99)).toEqual(classic);
  });

  test('insert steps follow the path and end with the new node', () => {
    const steps = insertSteps(classic, 65);
    expect(last(steps).fresh).toBe(65);
    expect(traverse(last(steps).root, 'inorder')).toEqual([20, 30, 40, 50, 60, 65, 70, 80]);
    expect(last(steps).visited).toEqual([50, 70, 60]);
    expect(classic).toEqual(buildTree([50, 30, 70, 20, 40, 60, 80]));
    expect(last(insertSteps(null, 5)).root?.value).toBe(5);
  });

  test('inserting a duplicate changes nothing; a full tree refuses', () => {
    expect(last(insertSteps(classic, 40)).root).toBe(classic);
    const big = buildTree(Array.from({ length: 12 }, (_, index) => index + 1));
    expect(last(insertSteps(big, 99)).root).toBe(big);
  });

  test('search steps end on the node or report a miss', () => {
    const hit = searchSteps(classic, 60);
    expect(last(hit).current).toBe(60);
    expect(last(hit).visited).toEqual([50, 70, 60]);
    const miss = searchSteps(classic, 65);
    expect(last(miss).current).toBeNull();
    expect(last(miss).visited).toEqual([50, 70, 60]);
    expect(searchSteps(null, 1)).toHaveLength(1);
  });

  test('delete steps mark the node and end with the tree without it', () => {
    for (const value of [20, 30, 50, 80]) {
      const steps = deleteSteps(classic, value);
      expect(steps.some((step) => step.doomed === value)).toBe(true);
      expect(traverse(last(steps).root, 'inorder')).toEqual([20, 30, 40, 50, 60, 70, 80].filter((v) => v !== value));
    }
    expect(traverse(last(deleteSteps(classic, 99)).root, 'inorder')).toHaveLength(7);
  });

  test('traversal steps visit every node once, in the traversal order', () => {
    for (const kind of TRAVERSALS) {
      const steps = traversalSteps(classic, kind);
      expect(last(steps).output).toEqual(traverse(classic, kind));
      expect(steps.filter((step) => step.current !== null).map((step) => step.current)).toEqual(traverse(classic, kind));
    }
  });

  test('level order shows the queue of waiting nodes', () => {
    const steps = traversalSteps(classic, 'levelorder');
    expect(steps[0]?.queue).toEqual([50]);
    expect(steps[1]?.queue).toEqual([30, 70]); // after visiting the root, its children wait
    expect(steps[2]?.queue).toEqual([70, 20, 40]);
    expect(last(steps).queue).toEqual([]);
  });

  test('layout puts nodes in sorted columns and children one level deeper', () => {
    const placed = layoutTree(classic);
    expect(placed.map((node) => node.value)).toEqual([20, 30, 40, 50, 60, 70, 80]);
    expect(placed.map((node) => node.column)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(placed.find((node) => node.value === 50)?.depth).toBe(0);
    expect(placed.find((node) => node.value === 60)).toMatchObject({ depth: 2, parent: 70 });
  });
});
