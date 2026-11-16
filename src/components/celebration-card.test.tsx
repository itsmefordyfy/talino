import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

import { CelebrationCard } from './celebration-card';

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});
async function render(onAction: () => void, withPrize: boolean) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <CelebrationCard mood="celebrating" eyebrow="New badge" title="First lesson" message="Finish your first lesson." actionLabel="Nice!" onAction={onAction} announcement="A new badge, Ford: First lesson!" prize={withPrize ? <Prize /> : undefined} />
      </Provider>,
    );
  });
  return renderer;
}
function Prize() {
  return null;
}

describe('the celebration card', () => {
  test('says what was earned once each: a label, the title, one line of explanation and one button', async () => {
    const renderer = await render(jest.fn(), true);
    const text = textOf(renderer.container);
    expect(text.match(/First lesson/g)).toHaveLength(1); // the title, drawn once
    expect(text).toContain('New badge');
    expect(text).toContain('Finish your first lesson.');
    // No speech bubble repeating it: Tali's own words are only read aloud.
    expect(text).not.toContain('A new badge, Ford');
    const card = renderer.container.queryAll((instance) => instance.props.accessibilityLabel === 'A new badge, Ford: First lesson!');
    expect(card.length).toBeGreaterThan(0);
  });

  test('the button closes it', async () => {
    const onAction = jest.fn();
    const renderer = await render(onAction, false);
    const label = renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === 'Nice!')[0];
    await act(async () => tap(label));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
