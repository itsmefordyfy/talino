import { describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { demoStrings } from '../demo-strings';
import type { LessonBlock } from '../content/types';
import { LessonBlocks } from './lesson-blocks';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
const mockCopied: string[] = [];
jest.mock('@/lib/clipboard', () => ({
  copyText: async (text: string) => {
    mockCopied.push(text);
    return true;
  },
}));
store.dispatch(languageChanged('en'));

const text = demoStrings.en;
const demo: Extract<LessonBlock, { type: 'demo' }> = {
  type: 'demo',
  title: 'A clear request for a refund email',
  prompt: 'Write a short, polite email to a customer. Say sorry for the late order.',
  output: 'Hi Maria, I am sorry your order was late. Thank you for your patience.',
  notice: 'The answer follows the tone you asked for. Check the name before you send it.',
};

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

describe('the "AI in Action" demo block', () => {
  test('is always drawn as an illustration: the badge, the disclaimer, the labelled boxes, and the example texts', async () => {
    const renderer = createRoot();
    await act(async () => {
      renderer.render(
        <Provider store={store}>
          <LessonBlocks blocks={[demo]} />
        </Provider>,
      );
    });
    const shown = textOf(renderer.container);
    expect(shown).toContain(text.badge);
    expect(shown).toContain(text.disclaimer);
    expect(shown).toContain(demo.title);
    for (const label of [text.youAsk, text.answer, text.notice]) expect(shown).toContain(label);
    for (const body of [demo.prompt, demo.output, demo.notice]) expect(shown).toContain(body);
    // The card is announced as an illustration to a screen reader.
    expect(renderer.container.queryAll((node) => node.props.accessibilityLabel === text.label(demo.title))).toHaveLength(1);
    await act(async () => renderer.unmount());
  });

  test('Copy puts the example prompt (and only the prompt) on the clipboard', async () => {
    const renderer = createRoot();
    await act(async () => {
      renderer.render(
        <Provider store={store}>
          <LessonBlocks blocks={[demo]} />
        </Provider>,
      );
    });
    const [button] = renderer.container.queryAll((node) => node.props.accessibilityLabel === text.copyPrompt(demo.title));
    let fiber = button.unstable_fiber as Fiber | null;
    while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
    await act(async () => {
      (fiber?.memoizedProps?.onPress as () => void)();
    });
    expect(mockCopied).toEqual([demo.prompt]);
    await act(async () => renderer.unmount());
  });
});
