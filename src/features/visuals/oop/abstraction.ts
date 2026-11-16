import { oopStrings } from './strings';

type Text = typeof oopStrings.en.abstraction;

export type ImplId = 'abstract' | 'card' | 'wallet' | 'cash' | 'broken';
export const IMPLS: readonly ImplId[] = ['card', 'wallet', 'cash', 'abstract', 'broken'];
export const CLASS_NAMES: Record<ImplId, string> = { abstract: 'PaymentMethod', card: 'CardPayment', wallet: 'WalletPayment', cash: 'CashPayment', broken: 'BrokenPayment' };

const round = (value: number) => Number(value.toFixed(2));

/** What each concrete class charges for an amount: the card adds nothing, the wallet a 2% fee, cash is rounded to whole units. */
export function computeCharge(impl: 'card' | 'wallet' | 'cash', amount: number): number {
  if (impl === 'wallet') return round(amount * 1.02);
  if (impl === 'cash') return Math.round(amount);
  return amount;
}

export type CheckoutStep = { stage: 'start' | 'create' | 'call' | 'run' | 'result' | 'error'; active: ImplId | null; charged: number | null; failed: boolean; caption: string };

/**
 * `checkout(method, amount)` knows only the abstract type, `PaymentMethod`, which promises a `pay(amount)`. Each
 * concrete class keeps that promise its own way. An abstract type cannot be created itself, and a class that
 * does not keep the promise is refused.
 */
export function buildCheckoutSteps(impl: ImplId, amount: number, t: Text = oopStrings.en.abstraction): CheckoutStep[] {
  const steps: CheckoutStep[] = [{ stage: 'start', active: null, charged: null, failed: false, caption: t.start }];
  const name = CLASS_NAMES[impl];
  if (impl === 'abstract') {
    steps.push({ stage: 'error', active: 'abstract', charged: null, failed: true, caption: t.cannotCreate(name) });
    return steps;
  }
  if (impl === 'broken') {
    steps.push({ stage: 'error', active: 'broken', charged: null, failed: true, caption: t.missingMethod(name) });
    return steps;
  }
  const charged = computeCharge(impl, amount);
  steps.push({ stage: 'create', active: impl, charged: null, failed: false, caption: t.create(name) });
  steps.push({ stage: 'call', active: impl, charged: null, failed: false, caption: t.call(amount) });
  steps.push({ stage: 'run', active: impl, charged: null, failed: false, caption: t.run(name, impl, amount, charged) });
  steps.push({ stage: 'result', active: impl, charged, failed: false, caption: t.result(charged) });
  return steps;
}
