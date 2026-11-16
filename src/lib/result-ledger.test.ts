import { describe, expect, it } from '@jest/globals';

import { createResultLedger } from './result-ledger';

function memory() {
  let stored: string | null = null;
  return { read: () => stored, write: (value: string) => void (stored = value) };
}

describe('result ledger', () => {
  it('answers a repeated id with the first result', () => {
    const ledger = createResultLedger<string>(memory());
    ledger.remember('a', 'first');
    ledger.remember('a', 'second');
    expect(ledger.find('a')).toBe('first');
    expect(ledger.find('b')).toBeUndefined();
  });

  it('lists the ids it remembers, oldest first', () => {
    const ledger = createResultLedger<number>(memory());
    ledger.remember('a', 1);
    ledger.remember('b', 2);
    expect(ledger.ids()).toEqual(['a', 'b']);
  });

  it('forgets the oldest once it is full', () => {
    const ledger = createResultLedger<number>(memory(), 2);
    ledger.remember('a', 1);
    ledger.remember('b', 2);
    ledger.remember('c', 3);
    expect(ledger.find('a')).toBeUndefined();
    expect(ledger.find('c')).toBe(3);
  });

  it('starts empty when what was stored is unreadable', () => {
    const ledger = createResultLedger<number>({ read: () => '{not json', write: () => {} });
    expect(ledger.find('a')).toBeUndefined();
  });
});
