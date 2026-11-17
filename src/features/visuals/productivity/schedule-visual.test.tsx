import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { productivityStrings, readDayState } from '@/features/productivity';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { ScheduleVisual } from './schedule-visual';

jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
let mockIds = 0;
// expo-crypto is native; ids that are unique for the run stand in.
jest.mock('@/lib/id', () => ({ newId: () => `test-id-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
// The shimmer uses a Reanimated value Jest's mock doesn't implement; a plain block stands in.
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
let mockDb: Awaited<ReturnType<typeof createTestDatabase>>;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));
store.dispatch(languageChanged('en'));

const t = productivityStrings.en;

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: Renderer, label: string) => findAll(renderer, label).length > 0;

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
}

async function press(renderer: Renderer, label: string, index = 0) {
  const node = findAll(renderer, label)[index];
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
  await settle();
}

const clients: QueryClient[] = [];

async function mount(compact = false) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always', gcTime: 0 }, mutations: { retry: false, networkMode: 'always', gcTime: 0 } } });
  clients.push(client);
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ScheduleVisual compact={compact} />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await settle();
  return { renderer, text: () => textOf(renderer.container) };
}

beforeEach(async () => {
  mockIds = 0;
  mockDb = await createTestDatabase();
});
afterEach(() => {
  for (const client of clients.splice(0)) client.clear();
  mockDb.close();
});

describe('the free daily schedule builder', () => {
  test('starts empty with a next step, adds a task and places it, and finds both again on the next visit', async () => {
    const first = await mount();
    expect(first.text()).toContain(t.dayToolEmptyTitle);
    expect(first.text()).toContain(t.dayIntro);
    const [name] = findAll(first.renderer, t.dayTaskName);
    await act(async () => (name!.props.onChangeText as (text: string) => void)('Write the proposal'));
    await press(first.renderer, t.dayAddTask);
    expect(first.text()).toContain('Write the proposal');
    await press(first.renderer, `${t.dayPlace}: Write the proposal`);
    expect(first.text()).toContain(t.dayPlacedLine('30 min', '8:00 AM'));
    // Written to this phone as it happened.
    const saved = await readDayState(mockDb);
    expect(saved.tasks).toEqual([{ id: 'test-id-1', title: 'Write the proposal', minutes: 30, priority: 'medium' }]);
    expect(saved.blocks).toEqual([expect.objectContaining({ kind: 'task', taskId: 'test-id-1', start: 8 * 60, minutes: 30 })]);
    await act(async () => first.renderer.unmount());

    const second = await mount();
    expect(second.text()).toContain('Write the proposal');
    expect(second.text()).toContain(t.dayPlacedLine('30 min', '8:00 AM'));
    expect(second.text()).not.toContain(t.dayToolEmptyTitle);
    await act(async () => second.renderer.unmount());
  });

  test('removing a task takes its blocks out of the day too, and the day hours can be changed', async () => {
    const view = await mount();
    const [name] = findAll(view.renderer, t.dayTaskName);
    await act(async () => (name!.props.onChangeText as (text: string) => void)('Plan the week'));
    await press(view.renderer, t.dayAddTask);
    await press(view.renderer, `${t.dayPlace}: Plan the week`);
    await press(view.renderer, t.dayHoursLater(t.dayHoursEnd));
    await press(view.renderer, t.dayHoursEarlier(t.dayHoursStart));
    await press(view.renderer, t.dayRemove('Plan the week'));
    const saved = await readDayState(mockDb);
    expect(saved).toMatchObject({ tasks: [], blocks: [], windowStart: 7 * 60 + 30, windowEnd: 18 * 60 + 30 });
    expect(view.text()).toContain(t.dayToolEmptyTitle);
    await act(async () => view.renderer.unmount());
  });

  test('shows the planner\'s live advice for a crowded day, with no scoring', async () => {
    const view = await mount();
    for (const title of ['One', 'Two']) {
      const [name] = findAll(view.renderer, t.dayTaskName);
      await act(async () => (name!.props.onChangeText as (text: string) => void)(title));
      await press(view.renderer, t.dayAddTask);
      await press(view.renderer, `${t.dayPlace}: ${title}`);
    }
    expect(view.text()).toContain(t.dayWatchTitle);
    expect(view.text()).toContain(t.dayAdvice({ code: 'noRest', level: 'note', params: { needed: 30 } }));
    expect(view.text()).not.toContain(t.dayResultTitle);
    expect(has(view.renderer, t.planCheck)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('a day that cannot be read says so and offers to try again', async () => {
    const original = mockDb.getFirstAsync.bind(mockDb);
    let failing = true;
    mockDb.getFirstAsync = (async (...args: Parameters<typeof original>) => {
      if (failing) throw new Error('locked');
      return original(...args);
    }) as typeof mockDb.getFirstAsync;
    const view = await mount();
    expect(view.text()).toContain(t.dayToolLoadFailed);
    failing = false;
    await press(view.renderer, t.dayToolRetry);
    expect(view.text()).not.toContain(t.dayToolLoadFailed);
    expect(view.text()).toContain(t.dayToolEmptyTitle);
    await act(async () => view.renderer.unmount());
  });

  test('compact (inside a lesson) drops the intro and keeps the tool', async () => {
    const view = await mount(true);
    expect(view.text()).not.toContain(t.dayIntro);
    expect(view.text()).toContain(t.dayAddTask);
    await act(async () => view.renderer.unmount());
  });
});
