import { oopStrings } from './strings';

type Text = typeof oopStrings.en.encapsulation;

export type AccessMode = 'open' | 'encapsulated';
export type Action = { kind: 'setDirect'; value: number } | { kind: 'readDirect' } | { kind: 'deposit'; amount: number } | { kind: 'withdraw'; amount: number } | { kind: 'getBalance' };
export type Outcome = 'ok' | 'blocked' | 'rejected' | 'invalid';
export type Attempt = { balance: number; outcome: Outcome; route: 'direct' | 'method'; message: string };

export const START_BALANCE = 100;

/**
 * One try at the account. The balance should never be negative. With open fields, code outside can set it to
 * anything and break that rule; with encapsulation the field is private and only the validating methods change it.
 */
export function act(balance: number, action: Action, mode: AccessMode, t: Text = oopStrings.en.encapsulation): Attempt {
  const done = (outcome: Outcome, route: Attempt['route'], message: string, next = balance): Attempt => ({ balance: next, outcome, route, message });
  switch (action.kind) {
    case 'setDirect':
      if (mode === 'encapsulated') return done('blocked', 'direct', t.directBlocked);
      return action.value < 0 ? done('invalid', 'direct', t.directInvalid(action.value), action.value) : done('ok', 'direct', t.directOk(action.value), action.value);
    case 'readDirect':
      return mode === 'encapsulated' ? done('blocked', 'direct', t.readBlocked) : done('ok', 'direct', t.readOk(balance));
    case 'getBalance':
      return done('ok', 'method', t.getBalance(balance));
    case 'deposit':
      if (!(action.amount > 0)) return done('rejected', 'method', t.badAmount('deposit', action.amount));
      return done('ok', 'method', t.deposited(action.amount, balance + action.amount), balance + action.amount);
    case 'withdraw':
      if (!(action.amount > 0)) return done('rejected', 'method', t.badAmount('withdraw', action.amount));
      if (action.amount > balance) return done('rejected', 'method', t.insufficient(action.amount, balance));
      return done('ok', 'method', t.withdrew(action.amount, balance - action.amount), balance - action.amount);
  }
}
