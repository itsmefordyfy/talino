import { describe, expect, test } from '@jest/globals';

import { act, START_BALANCE, type Action } from './encapsulation';
import { seededRandom } from '../dsa/sorting';

describe('encapsulation', () => {
  test('open fields let outside code break the rule', () => {
    const attempt = act(START_BALANCE, { kind: 'setDirect', value: -500 }, 'open');
    expect(attempt.outcome).toBe('invalid');
    expect(attempt.balance).toBe(-500);
    expect(act(START_BALANCE, { kind: 'setDirect', value: 20 }, 'open')).toMatchObject({ outcome: 'ok', balance: 20 });
  });

  test('private fields block direct writes and reads and change nothing', () => {
    expect(act(START_BALANCE, { kind: 'setDirect', value: 1_000_000 }, 'encapsulated')).toMatchObject({ outcome: 'blocked', balance: START_BALANCE });
    expect(act(START_BALANCE, { kind: 'readDirect' }, 'encapsulated')).toMatchObject({ outcome: 'blocked', balance: START_BALANCE });
    expect(act(START_BALANCE, { kind: 'readDirect' }, 'open').outcome).toBe('ok');
  });

  test('public methods validate: no negative or zero amounts, no overdrawing', () => {
    expect(act(100, { kind: 'deposit', amount: 50 }, 'encapsulated')).toMatchObject({ outcome: 'ok', balance: 150 });
    expect(act(100, { kind: 'deposit', amount: -5 }, 'encapsulated')).toMatchObject({ outcome: 'rejected', balance: 100 });
    expect(act(100, { kind: 'deposit', amount: 0 }, 'encapsulated').outcome).toBe('rejected');
    expect(act(100, { kind: 'withdraw', amount: 40 }, 'encapsulated')).toMatchObject({ outcome: 'ok', balance: 60 });
    expect(act(100, { kind: 'withdraw', amount: 100 }, 'encapsulated')).toMatchObject({ outcome: 'ok', balance: 0 });
    expect(act(100, { kind: 'withdraw', amount: 101 }, 'encapsulated')).toMatchObject({ outcome: 'rejected', balance: 100 });
    expect(act(100, { kind: 'withdraw', amount: Number.NaN }, 'encapsulated').outcome).toBe('rejected');
    expect(act(100, { kind: 'getBalance' }, 'encapsulated')).toMatchObject({ outcome: 'ok', balance: 100 });
  });

  test('the balance can never go negative through an encapsulated object, whatever is tried', () => {
    const random = seededRandom(21);
    for (let run = 0; run < 200; run += 1) {
      let balance = START_BALANCE;
      for (let step = 0; step < 40; step += 1) {
        const amount = Math.floor(random() * 400) - 100;
        const kinds: Action[] = [{ kind: 'setDirect', value: amount }, { kind: 'readDirect' }, { kind: 'deposit', amount }, { kind: 'withdraw', amount }, { kind: 'getBalance' }];
        balance = act(balance, kinds[Math.floor(random() * kinds.length)]!, 'encapsulated').balance;
        expect(balance).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
