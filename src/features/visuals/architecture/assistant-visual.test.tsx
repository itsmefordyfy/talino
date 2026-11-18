import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { assistantStrings } from '@/features/architecture/assistant/strings';
import { ASSISTANT_DRAFT_KEY, readAssistantDraft, writeAssistantDraft } from '@/features/architecture/assistant/assistant-draft';
import { ASSISTANT_REQUESTS, assistantRequest } from '@/features/architecture/lib/assistant-prompt';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { ArchitectureAssistantVisual } from './assistant-visual';

// The component reads the app's database through expo-sqlite's context; a test hands it the real schema on Node's SQLite.
const mockDb: { current: unknown } = { current: null };
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb.current }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: 'SkeletonBlock' }));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
store.dispatch(languageChanged('en'));

const t = assistantStrings.en;
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;
type Db = Awaited<ReturnType<typeof createTestDatabase>>;

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: Renderer, label: string) => findAll(renderer, label).length > 0;
const disabled = (renderer: Renderer, label: string) => Boolean((findAll(renderer, label)[0]?.props.accessibilityState as { disabled?: boolean } | undefined)?.disabled);

async function press(renderer: Renderer, label: string) {
  const [node] = findAll(renderer, label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
}

async function typeInto(renderer: Renderer, label: string, value: string) {
  const [node] = renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label && typeof instance.props.onChangeText === 'function');
  if (!node) throw new Error(`no input labelled "${label}"`);
  await act(async () => (node.props.onChangeText as (text: string) => void)(value));
}

const valueOf = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label && typeof instance.props.onChangeText === 'function')[0]?.props.value;
const settle = () => act(async () => new Promise((resolve) => setTimeout(resolve, 20)));

let db: Db;
beforeEach(async () => {
  mockPush.mockReset();
  db = await createTestDatabase();
  mockDb.current = db;
});
afterEach(() => db.close());

async function mount() {
  const renderer = createRoot();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always', gcTime: Infinity }, mutations: { networkMode: 'always', gcTime: Infinity } } });
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ArchitectureAssistantVisual />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await settle();
  return { renderer, text: () => textOf(renderer.container) };
}

const DESCRIPTION = 'TindaTrack lets small shop owners record sales and stock from a phone. About 2,000 shops use it and each must only see its own data.';

describe('the architecture assistant launcher', () => {
  test('a first visit shows the empty form, all nine requests, the expectations panel, and a closed door until there is a description', async () => {
    const view = await mount();
    expect(has(view.renderer, t.descriptionLabel)).toBe(true);
    for (const request of ASSISTANT_REQUESTS) expect(has(view.renderer, request.label)).toBe(true);
    expect(ASSISTANT_REQUESTS).toHaveLength(9);
    expect(view.text()).toContain(t.expectTitle);
    expect(view.text()).toContain(t.will[0]);
    expect(view.text()).toContain(t.wont[0]);
    expect(view.text()).toContain(t.noLiveCall);
    expect(disabled(view.renderer, t.openButton)).toBe(true);
    expect(valueOf(view.renderer, t.descriptionLabel)).toBe('');
    await act(async () => view.renderer.unmount());
  });

  test('a description that is too short is explained and still does not open the assistant', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.descriptionLabel, 'A shop app.');
    expect(view.text()).toContain('too short');
    expect(disabled(view.renderer, t.openButton)).toBe(true);
    await press(view.renderer, t.openButton);
    expect(mockPush).not.toHaveBeenCalled();
    await act(async () => view.renderer.unmount());
  });

  test('Open the assistant goes to Tali with the prompt prefilled and the architecture focus', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.descriptionLabel, DESCRIPTION);
    await typeInto(view.renderer, t.constraintsLabel, 'Two developers.');
    await press(view.renderer, assistantRequest('security').label);
    expect(disabled(view.renderer, t.openButton)).toBe(false);
    await press(view.renderer, t.openButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    const arg = mockPush.mock.calls[0]![0] as { pathname: string; params: { prompt: string; focus: string } };
    expect(arg.pathname).toBe('/tali');
    expect(arg.params.focus).toBe('architecture');
    expect(arg.params.prompt).toContain(DESCRIPTION);
    expect(arg.params.prompt).toContain('Two developers.');
    expect(arg.params.prompt).toContain(assistantRequest('security').instruction);
    expect(arg.params.prompt).toContain('List the assumptions you are making.');
    expect(arg.params.prompt.length).toBeLessThanOrEqual(4000);
    // Opening saves what was typed straight away.
    expect((await readAssistantDraft(db)).description).toBe(DESCRIPTION);
    await act(async () => view.renderer.unmount());
  });

  test('the last description survives a relaunch, with the request chosen', async () => {
    const first = await mount();
    await typeInto(first.renderer, t.descriptionLabel, DESCRIPTION);
    await press(first.renderer, assistantRequest('cost').label);
    await act(async () => first.renderer.unmount());
    await settle();
    const row = await db.getFirstAsync<{ key: string }>('SELECT key FROM app_state WHERE key = ?', ASSISTANT_DRAFT_KEY);
    expect(row?.key).toBe('architecture:assistant-draft');

    const second = await mount();
    expect(valueOf(second.renderer, t.descriptionLabel)).toBe(DESCRIPTION);
    expect(second.text()).toContain(assistantRequest('cost').description);
    await act(async () => second.renderer.unmount());
  });

  test('an email, a phone number or a key-like string is a reminder, and does not stop the learner', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.descriptionLabel, `${DESCRIPTION} Reach me at maria@example.com or 0917 123 4567, password: hunter2hunter2.`);
    expect(view.text()).toContain(t.reminderLead);
    expect(view.text()).toContain('email address');
    expect(view.text()).toContain('phone number');
    expect(view.text()).toContain('key, token or password');
    expect(disabled(view.renderer, t.openButton)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('the prompt preview shows what will be prefilled', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.descriptionLabel, DESCRIPTION);
    await press(view.renderer, `Show: ${t.previewTitle}`);
    expect(view.text()).toContain('Treat your answer as a draft');
    expect(view.text()).toContain(DESCRIPTION);
    await act(async () => view.renderer.unmount());
  });

  test('a saved description that cannot be read shows an error with a retry, and retry loads it', async () => {
    await writeAssistantDraft(db, { request: 'api', description: DESCRIPTION, constraints: '', knowns: '' });
    let fail = true;
    const real = db.getFirstAsync.bind(db);
    mockDb.current = {
      getFirstAsync: async (...args: Parameters<typeof real>) => {
        if (fail) throw new Error('disk');
        return real(...args);
      },
      runAsync: db.runAsync.bind(db),
    };
    const view = await mount();
    expect(view.text()).toContain(t.loadError);
    fail = false;
    await press(view.renderer, t.retry);
    await settle();
    expect(valueOf(view.renderer, t.descriptionLabel)).toBe(DESCRIPTION);
    await act(async () => view.renderer.unmount());
  });

  test('a description that could not be saved says so, and the text stays on screen', async () => {
    mockDb.current = {
      getFirstAsync: async () => null,
      runAsync: async () => {
        throw new Error('disk full');
      },
    };
    const view = await mount();
    await typeInto(view.renderer, t.descriptionLabel, DESCRIPTION);
    await press(view.renderer, t.openButton);
    await settle();
    expect(view.text()).toContain(t.saveError);
    expect(valueOf(view.renderer, t.descriptionLabel)).toBe(DESCRIPTION);
    await act(async () => view.renderer.unmount());
  });
});
