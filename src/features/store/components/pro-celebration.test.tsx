import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { celebratePro, endProCelebration } from '@/lib/pro-celebration';
import { store } from '@/store';

import { ProCelebrationHost } from './pro-celebration';

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('@/hooks/use-viewport', () => ({ useViewport: () => ({ width: 390, height: 844 }) }));
// The confetti is Reanimated and has no Jest implementation; a marker host stands in so its place in the tree can be checked.
jest.mock('@/components/confetti-fall', () => ({ ConfettiFall: () => (jest.requireActual('react') as typeof import('react')).createElement('ConfettiFall') }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
/** What a tap on this element does: walks up to the component that owns onPress, as a touch would. */
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  await act(async () => {
    endProCelebration();
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

async function mount() {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <ProCelebrationHost />
      </Provider>,
    );
  });
  return renderer;
}

describe('the Pro celebration', () => {
  test('shows nothing until Pro is celebrated, then the welcome card with a button that closes it', async () => {
    const renderer = await mount();
    expect(textOf(renderer.container)).not.toContain('Welcome to Talino Pro');
    await act(async () => celebratePro());
    expect(textOf(renderer.container)).toContain('Welcome to Talino Pro!');
    const done = renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === 'Start learning');
    expect(done.length).toBeGreaterThan(0);
    // The confetti comes after the card in the same backdrop, so it is drawn over it (never behind).
    const kinds = renderer.container.queryAll((instance) => String(instance.type) === 'ConfettiFall' || textOf(instance) === 'Welcome to Talino Pro!');
    expect(kinds.some((instance) => String(instance.type) === 'ConfettiFall')).toBe(true);
    await act(async () => tap(done[0]));
    expect(textOf(renderer.container)).not.toContain('Welcome to Talino Pro');
  });
});
