import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

import { COMPARISON_ROWS, PAYWALL_FEATURES } from '../lib/paywall-content';
import type { StoreItem } from '../types';
import { PaywallHero } from './paywall-hero';
import { PlanComparison } from './plan-comparison';
import { PlanPicker } from './plan-picker';
import { ProFeatureList } from './pro-feature-list';

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
// Icons are one glyph character of text; the words are longer.
const texts = (renderer: ReturnType<typeof createRoot>) => renderer.container.queryAll((instance) => String(instance.type) === 'Text').map((instance) => textOf(instance)).filter((text) => text.length > 1);

const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

async function mount(element: React.ReactElement) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(<Provider store={store}>{element}</Provider>);
  });
  return renderer;
}

const plan = (productId: string, kind: StoreItem['kind'], price: number): StoreItem => ({ productId, kind, title: productId, priceString: `₱${price}`, price, currencyCode: 'PHP', offeringId: 'default', packageId: productId });
const plans = [plan('weekly', 'weekly', 199), plan('yearly', 'yearly', 1999)];

describe('the paywall hero', () => {
  test('shows the eyebrow, the title and the subtitle on the brand gradient', async () => {
    const renderer = await mount(<PaywallHero eyebrow="Talino Pro" title="Unlock every course" subtitle="All of it." />);
    expect(texts(renderer)).toEqual(['Talino Pro', 'Unlock every course', 'All of it.']);
    expect(renderer.container.queryAll((instance) => String(instance.type) === 'LinearGradient')).toHaveLength(1);
  });
});

describe('the plan comparison', () => {
  test('has a row for each difference, with Free and PRO headings', async () => {
    const renderer = await mount(<PlanComparison />);
    const all = texts(renderer);
    expect(all).toEqual(expect.arrayContaining(['Free and Pro', 'Free', 'PRO', 'Courses and mini-courses', 'Chats with Tali or Tala', 'Backup file', '3 a day', 'Unlimited']));
    expect(all.filter((text) => text === 'Courses and mini-courses')).toHaveLength(1);
    // The Pro number is told once, as fair use.
    expect(all.some((text) => text.includes('fair use'))).toBe(true);
  });

  test('announces each row with both plans, in words', async () => {
    const renderer = await mount(<PlanComparison />);
    const rows = renderer.container.queryAll((instance) => String((instance.props as { accessibilityLabel?: string }).accessibilityLabel ?? '').startsWith('Backup file:'));
    expect(rows.length).toBeGreaterThan(0);
    expect((rows[0].props as { accessibilityLabel: string }).accessibilityLabel).toBe('Backup file: Free Not included, PRO Included');
  });

  test('draws every row of the table', async () => {
    const renderer = await mount(<PlanComparison />);
    const labelled = renderer.container.queryAll((instance) => /: Free .*, PRO /.test(String((instance.props as { accessibilityLabel?: string }).accessibilityLabel ?? '')));
    expect(labelled.length).toBeGreaterThanOrEqual(COMPARISON_ROWS.length);
  });
});

describe('the Pro feature list', () => {
  test('lists every feature once, with its hint', async () => {
    const renderer = await mount(<ProFeatureList />);
    const all = texts(renderer);
    expect(all).toHaveLength(PAYWALL_FEATURES.length * 2);
    expect(all[0]).toBe('Every course');
  });

  test('leads with what the learner reached for', async () => {
    const renderer = await mount(<ProFeatureList lead="backup" />);
    expect(texts(renderer)[0]).toBe('A backup file you keep');
  });
});

describe('the plan picker on the paywall', () => {
  test('says what a week costs on the yearly plan, only when asked', async () => {
    const plain = await mount(<PlanPicker items={plans} selectedId="yearly" onSelect={() => {}} />);
    expect(texts(plain).some((text) => text.startsWith('Just '))).toBe(false);
    const withDetail = await mount(<PlanPicker items={plans} selectedId="yearly" onSelect={() => {}} showEquivalent />);
    expect(texts(withDetail).filter((text) => text.startsWith('Just '))).toHaveLength(1);
    expect(texts(withDetail).filter((text) => /a week$/.test(text) && text.startsWith('Just '))[0]).toMatch(/38[.,]44/);
  });
});
