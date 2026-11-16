import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { companionChanged, selectCompanion } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { CompanionPicker } from './companion-picker';

const mockPlay = jest.fn<(id: string, onDone: () => void) => Promise<void>>();
const mockStop = jest.fn();

jest.mock('react-native-safe-area-context', () => (jest.requireActual('react-native-safe-area-context/jest/mock') as { default: object }).default);
jest.mock('../audio/coach-sample', () => ({ playCoachSample: (id: string, onDone: () => void) => mockPlay(id, onDone), stopCoachSample: () => mockStop() }));
jest.mock('@/lib/haptics', () => ({ tapFeedback: jest.fn(), successFeedback: jest.fn() }));

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
async function render() {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <CompanionPicker />
      </Provider>,
    );
  });
  return renderer;
}
const named = (renderer: ReturnType<typeof createRoot>, name: string) => renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === name)[0];

beforeEach(() => {
  mockPlay.mockReset();
  mockPlay.mockResolvedValue(undefined);
  mockStop.mockReset();
  store.dispatch(companionChanged('tali'));
});
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

describe('choosing a coach', () => {
  test('picking the other coach switches to them and plays their greeting at once', async () => {
    const renderer = await render();
    await act(async () => tap(named(renderer, 'Tala')));
    expect(selectCompanion(store.getState())).toBe('tala');
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPlay.mock.calls[0][0]).toBe('tala');
  });

  test('picking back switches again and plays the new coach, not the old one', async () => {
    const renderer = await render();
    await act(async () => tap(named(renderer, 'Tala')));
    await act(async () => tap(named(renderer, 'Tali')));
    expect(selectCompanion(store.getState())).toBe('tali');
    expect(mockPlay.mock.calls.map((call) => call[0])).toEqual(['tala', 'tali']);
  });

  test('tapping the coach already chosen plays their greeting, and again stops it', async () => {
    const renderer = await render();
    await act(async () => tap(named(renderer, 'Tali')));
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPlay.mock.calls[0][0]).toBe('tali');
    await act(async () => tap(named(renderer, 'Tali')));
    expect(mockStop).toHaveBeenCalled();
  });

  test('nothing plays just from opening the picker', async () => {
    await render();
    expect(mockPlay).not.toHaveBeenCalled();
  });
});
