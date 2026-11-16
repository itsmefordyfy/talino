import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

import { TaliSays } from './tali-says';

jest.mock('expo-image', () => ({ Image: 'Image' }));

const mounted: ReturnType<typeof createRoot>[] = [];
async function render(layout: 'side' | 'stacked') {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <TaliSays mood="happy" text="A new badge: First lesson!" layout={layout} />
      </Provider>,
    );
  });
  return renderer;
}
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

const styleOf = (instance: TestInstance) => StyleSheet.flatten(instance.props.style as never) as Record<string, unknown> | undefined;
/** Views that would stretch to fill whatever height they are given. */
const growing = (renderer: ReturnType<typeof createRoot>) =>
  renderer.container.queryAll((instance) => {
    const style = styleOf(instance);
    return !!style && (Number(style.flex ?? 0) > 0 || Number(style.flexGrow ?? 0) > 0);
  });

describe('TaliSays', () => {
  // A stacked Tali sits in a column of unknown height (a result page, a badge card). A bubble that grows there fills the whole
  // screen: the bubble floats in a huge empty block, or is squeezed to nothing (owner's screenshots, quiz result and new badge).
  test('stacked: nothing grows, so the bubble is only as tall as its words', async () => {
    expect(growing(await render('stacked'))).toEqual([]);
  });

  test('side: the bubble takes the width left beside Tali', async () => {
    expect(growing(await render('side')).length).toBeGreaterThan(0);
  });
});
