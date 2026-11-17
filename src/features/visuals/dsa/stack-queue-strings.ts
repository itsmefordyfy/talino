import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation).
// The stack and queue captions themselves stay in ./strings (with their Tagalog); this file holds what the Back / Reset upgrade and the deque added.
const en = {
  back: 'Back',
  backHint: 'Undo the last operation',
  operations: (count: number) => `Operations: ${count}`,
  noOperation: 'No operation yet. Add, remove or peek, then use Back to undo it.',
  lastOperation: (name: string) => `Last operation: ${name} · O(1)`,
  complexity: (name: string, kind: 'stack' | 'queue' | 'deque') =>
    `${name} is O(1): it touches only the ${kind === 'stack' ? 'top' : kind === 'queue' ? 'front or the rear' : 'front or the rear'}, so it takes one step however many items there are.`,
  refused: 'Refused: nothing changed, but the attempt counts as an operation.',
  names: {
    stack: { add: 'Push', remove: 'Pop', peek: 'Peek' },
    queue: { add: 'Enqueue', remove: 'Dequeue', peek: 'Peek front' },
    deque: { addFront: 'Add front', addBack: 'Add back', removeFront: 'Remove front', removeBack: 'Remove back', peekFront: 'Peek front', peekBack: 'Peek back' },
  },
  modeLabel: 'Structure',
  modes: { queue: 'Queue', deque: 'Deque (both ends)' },
  dequeDescription: 'Deque mode (double-ended queue): you can add, remove and peek at both the front and the rear.',
  deque: {
    valueLabel: 'Value to add',
    buttons: { addFront: 'Add front', addBack: 'Add back', removeFront: 'Remove front', removeBack: 'Remove back', peekFront: 'Peek front', peekBack: 'Peek back' },
    takenLabel: 'Removed so far, in order',
    emptyHint: 'The deque is empty.',
    listLabel: (items: readonly number[]) => (items.length === 0 ? 'Empty deque' : `Deque from the front: ${items.join(', ')}.`),
    intro: 'A deque is a double-ended queue: add or remove at the front or at the rear. Used on one end only it is a stack; used at opposite ends it is a queue.',
    bothLabel: 'Both ends open',
    overflow: (max: number) => `Deque full: this picture holds ${max}, so nothing was added.`,
    underflow: 'Deque underflow: the deque is empty, so there is nothing to remove.',
    peekEmpty: 'The deque is empty, so there is nothing to look at.',
    addFront: (value: number, size: number) => `Add ${value} at the front. The deque now has ${plural(size, 'item')}. O(1) with a doubly linked list or a ring buffer.`,
    addBack: (value: number, size: number) => `Add ${value} at the back. The deque now has ${plural(size, 'item')}. O(1).`,
    removeFront: (value: number, size: number) => `Remove ${value} from the front. ${size === 0 ? 'The deque is empty now.' : `${plural(size, 'item')} left.`} O(1).`,
    removeBack: (value: number, size: number) => `Remove ${value} from the back. ${size === 0 ? 'The deque is empty now.' : `${plural(size, 'item')} left.`} O(1).`,
    peekFront: (value: number) => `Peek: the front is ${value}. Nothing is removed.`,
    peekBack: (value: number) => `Peek: the back is ${value}. Nothing is removed.`,
  },
};

export const stackQueueStrings = defineStrings({ en, fil: en });
