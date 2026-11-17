import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { productivityStrings, readMatrixState } from '@/features/productivity';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { EisenhowerVisual } from './eisenhower-visual';

// The component reads the app's database through expo-sqlite's context; a test hands it the real schema on Node's SQLite.
const mockDb: { current: unknown } = { current: null };
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb.current }));
let counter = 0;
jest.mock('@/lib/id', () => ({ newId: () => `task-${(counter += 1)}`, nowTimestamp: () => '2026-11-17T00:00:00.000Z' }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: 'SkeletonBlock' }));
store.dispatch(languageChanged('en'));

const t = productivityStrings.en;
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;
type Db = Awaited<ReturnType<typeof createTestDatabase>>;

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);

async function press(renderer: Renderer, label: string) {
  const [node] = findAll(renderer, label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  const onPress = fiber!.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
}

const settle = () => act(async () => new Promise((resolve) => setTimeout(resolve, 20)));

let db: Db;
beforeEach(async () => {
  counter = 0;
  db = await createTestDatabase();
  mockDb.current = db;
});
afterEach(() => db.close());

async function mount() {
  const renderer = createRoot();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always' }, mutations: { networkMode: 'always' } } });
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <EisenhowerVisual />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await settle();
  return { renderer, text: () => textOf(renderer.container) };
}

describe('the free Eisenhower matrix', () => {
  test('a first visit shows an empty board with a way to add a task', async () => {
    const view = await mount();
    expect(view.text()).toContain(t.matrixEmpty);
    expect(findAll(view.renderer, t.matrixAddLabel).length).toBeGreaterThan(0);
    await act(async () => view.renderer.unmount());
  });

  test('an added and moved task is saved, and comes back when the tool is opened again', async () => {
    const first = await mount();
    const [field] = findAll(first.renderer, t.matrixAddLabel);
    await act(async () => (field.props.onChangeText as (text: string) => void)('Plan the course'));
    await press(first.renderer, t.matrixAdd);
    await settle();
    expect(first.text()).toContain('Plan the course');
    await press(first.renderer, 'Plan the course');
    await press(first.renderer, t.quadrants.plan.title);
    await settle();
    expect(await readMatrixState(db)).toEqual({ tasks: [{ id: 'task-1', title: 'Plan the course' }], placements: { 'task-1': 'plan' } });
    await act(async () => first.renderer.unmount());

    const second = await mount();
    expect(second.text()).toContain('Plan the course');
    expect(findAll(second.renderer, t.matrixInBox('Plan the course', t.quadrants.plan.title)).length).toBeGreaterThan(0);
    await act(async () => second.renderer.unmount());
  });

  test('removing a task and clearing the board (after asking) are saved', async () => {
    const view = await mount();
    for (const name of ['One', 'Two']) {
      const [field] = findAll(view.renderer, t.matrixAddLabel);
      await act(async () => (field.props.onChangeText as (text: string) => void)(name));
      await press(view.renderer, t.matrixAdd);
      await settle();
    }
    await press(view.renderer, 'One');
    await press(view.renderer, t.matrixRemove('One'));
    await settle();
    expect((await readMatrixState(db)).tasks).toEqual([{ id: 'task-2', title: 'Two' }]);

    await press(view.renderer, t.matrixReset);
    expect(view.text()).toContain(t.matrixResetAsk);
    await press(view.renderer, t.matrixResetKeep);
    expect((await readMatrixState(db)).tasks).toHaveLength(1);
    await press(view.renderer, t.matrixReset);
    await press(view.renderer, t.matrixResetYes);
    await settle();
    expect((await readMatrixState(db)).tasks).toEqual([]);
    expect(view.text()).toContain(t.matrixEmpty);
    await act(async () => view.renderer.unmount());
  });

  test('a board that cannot be read shows an error with a retry', async () => {
    mockDb.current = { getFirstAsync: async () => { throw new Error('disk'); } };
    const view = await mount();
    expect(view.text()).toContain(t.matrixLoadError);
    expect(findAll(view.renderer, t.matrixRetry).length).toBeGreaterThan(0);
    await act(async () => view.renderer.unmount());
  });
});
