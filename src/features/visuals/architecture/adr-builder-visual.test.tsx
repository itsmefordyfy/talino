import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { MAX_ARTIFACTS_PER_KIND, getArtifact, listArtifacts, saveArtifact } from '@/features/architecture';
import { adrStrings } from '@/features/architecture/adr/strings';
import { adrToContent, parseAdrContent, type AdrDraft } from '@/features/architecture/lib/adr';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { AdrBuilderVisual } from './adr-builder-visual';

// The component reads the app's database through expo-sqlite's context; a test hands it the real schema on Node's SQLite.
const mockDb: { current: unknown } = { current: null };
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb.current }));
let counter = 0;
jest.mock('@/lib/id', () => ({ newId: () => `adr-${(counter += 1)}`, nowTimestamp: () => '2026-11-18T00:00:00.000Z' }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: 'SkeletonBlock' }));
const mockCopy = jest.fn<(text: string) => Promise<boolean>>();
jest.mock('@/lib/clipboard', () => ({ copyText: (text: string) => mockCopy(text) }));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
store.dispatch(languageChanged('en'));

const t = adrStrings.en;
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
  counter = 0;
  mockCopy.mockReset();
  mockCopy.mockResolvedValue(true);
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
          <AdrBuilderVisual />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await settle();
  return { renderer, text: () => textOf(renderer.container) };
}

const COMPLETE: AdrDraft = {
  title: 'Use PostgreSQL for tenant data',
  status: 'accepted',
  date: '2026-11-18',
  context: 'TindaTrack stores orders for many small shops. Each shop must never see another shop’s data. Two developers will run it.',
  drivers: ['Tenant data must be isolated'],
  options: [
    { name: 'One shared database', pros: ['Simple to run'], cons: ['Policies are easy to get wrong'] },
    { name: 'One database per shop', pros: ['Strong isolation'], cons: ['Hundreds to migrate'] },
  ],
  decision: { chosen: 'One shared database', reason: 'Two people can run one database, and row-level security enforces the isolation requirement.' },
  consequences: { good: ['One schema'], bad: ['Every policy needs a test'] },
  notes: '',
};

describe('the decision record builder', () => {
  test('a first visit shows an empty records list, a checklist of what is missing, and no way to save a blank record', async () => {
    const view = await mount();
    expect(view.text()).toContain(t.savedEmpty);
    expect(view.text()).toContain(t.checkTitle);
    expect(view.text()).toContain('Give the record a short title');
    expect(view.text()).toContain('Every decision costs something');
    expect(disabled(view.renderer, t.saveBlank)).toBe(true);
    expect(disabled(view.renderer, t.askTali)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('typing fills the Markdown preview and clears the findings it answers', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Use PostgreSQL for tenant data');
    expect(view.text()).toContain('# Use PostgreSQL for tenant data');
    expect(view.text()).not.toContain('Give the record a short title');
    await act(async () => view.renderer.unmount());
  });

  test('a record can be saved with warnings, says what is missing, and is kept as an adr row; saving twice updates the same row', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Use PostgreSQL');
    await press(view.renderer, t.save);
    await settle();
    expect(view.text()).toContain('still missing');
    const rows = await listArtifacts(db, 'adr');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: 'adr-1', kind: 'adr', title: 'Use PostgreSQL', projectId: null });
    expect(parseAdrContent(rows[0]!.content)?.title).toBe('Use PostgreSQL');
    expect(view.text()).toContain(t.saved);

    await typeInto(view.renderer, t.titleLabel, 'Use PostgreSQL for tenants');
    expect(view.text()).toContain(t.unsaved);
    await press(view.renderer, t.save);
    await press(view.renderer, t.save);
    await settle();
    const after = await listArtifacts(db, 'adr');
    expect(after).toHaveLength(1);
    expect(after[0]!.title).toBe('Use PostgreSQL for tenants');
    await act(async () => view.renderer.unmount());
  });

  test('a complete record saves with a plain "Saved" message and can be attached to a project', async () => {
    await saveArtifact(db, { id: 'seed', kind: 'adr', title: COMPLETE.title, content: adrToContent(COMPLETE) });
    const view = await mount();
    await press(view.renderer, t.savedOpen(COMPLETE.title));
    expect(valueOf(view.renderer, t.titleLabel)).toBe(COMPLETE.title);
    expect(view.text()).toContain(t.checkClear);
    await press(view.renderer, t.project['software-architecture-ai-p2']!);
    await press(view.renderer, t.save);
    await settle();
    expect(view.text()).toContain(t.saveDone);
    expect((await getArtifact(db, 'seed'))?.projectId).toBe('software-architecture-ai-p2');
    await act(async () => view.renderer.unmount());
  });

  test('a saved record comes back when the tool is opened again, with its fields', async () => {
    const first = await mount();
    await typeInto(first.renderer, t.titleLabel, 'Keep the monolith');
    await typeInto(first.renderer, t.contextLabel, 'A small team with one product.');
    await press(first.renderer, t.save);
    await settle();
    await act(async () => first.renderer.unmount());

    const second = await mount();
    expect(second.text()).toContain('Keep the monolith');
    await press(second.renderer, t.savedOpen('Keep the monolith'));
    expect(valueOf(second.renderer, t.contextLabel)).toBe('A small team with one product.');
    await act(async () => second.renderer.unmount());
  });

  test('options, the decision, and list items are edited with the shared controls', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.optionNameLabel(1), 'Monolith');
    await typeInto(view.renderer, t.optionNameLabel(2), 'Microservices');
    expect(has(view.renderer, 'Monolith')).toBe(true);
    await press(view.renderer, 'Monolith');
    await press(view.renderer, t.proAdd);
    await typeInto(view.renderer, `${t.optionNumber(1)}: ${t.itemLabel(t.proItem, 1)}`, 'One thing to deploy');
    expect(view.text()).toContain('Chosen option: "Monolith"');
    expect(view.text()).toContain('* Good, because One thing to deploy');
    // Renaming the chosen option keeps the decision on it.
    await typeInto(view.renderer, t.optionNameLabel(1), 'Modular monolith');
    expect(view.text()).toContain('Chosen option: "Modular monolith"');
    await press(view.renderer, t.optionAdd);
    expect(has(view.renderer, t.optionNameLabel(3))).toBe(true);
    await press(view.renderer, t.optionRemove(3));
    expect(has(view.renderer, t.optionNameLabel(3))).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('Copy sends the Markdown to the clipboard, and says when it could not', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Use queues');
    await press(view.renderer, t.copy);
    expect(mockCopy).toHaveBeenCalledTimes(1);
    expect(mockCopy.mock.calls[0]![0]).toContain('# Use queues');
    expect(view.text()).toContain(t.copied);
    mockCopy.mockResolvedValue(false);
    await press(view.renderer, t.copied);
    expect(view.text()).toContain(t.copyFailed);
    await act(async () => view.renderer.unmount());
  });

  test('Ask Tali opens the chat with the record and the challenge, focused on architecture', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Use queues');
    await press(view.renderer, t.askTali);
    expect(mockPush).toHaveBeenCalledTimes(1);
    const arg = mockPush.mock.calls[0]![0] as { pathname: string; params: { prompt: string; focus: string } };
    expect(arg.pathname).toBe('/tali');
    expect(arg.params.focus).toBe('architecture');
    expect(arg.params.prompt).toContain('# Use queues');
    expect(arg.params.prompt).toContain('Challenge this decision');
    expect(arg.params.prompt.length).toBeLessThanOrEqual(4000);
    await act(async () => view.renderer.unmount());
  });

  test('deleting asks first; keeping leaves it, confirming removes it, and deleting the open record makes the form a new one', async () => {
    await saveArtifact(db, { id: 'seed', kind: 'adr', title: 'Old decision', content: adrToContent({ ...COMPLETE, title: 'Old decision' }) });
    const view = await mount();
    await press(view.renderer, t.savedOpen('Old decision'));
    await press(view.renderer, t.savedDelete('Old decision'));
    expect(view.text()).toContain(t.deleteAsk('Old decision'));
    await press(view.renderer, t.deleteKeep);
    expect(await listArtifacts(db, 'adr')).toHaveLength(1);
    await press(view.renderer, t.savedDelete('Old decision'));
    await press(view.renderer, t.deleteYes);
    await settle();
    expect(await listArtifacts(db, 'adr')).toHaveLength(0);
    expect(view.text()).toContain(t.savedEmpty);
    // The form still shows what was open, now as an unsaved record: saving it makes a new row, never the deleted id.
    expect(valueOf(view.renderer, t.titleLabel)).toBe('Old decision');
    await press(view.renderer, t.save);
    await settle();
    const rows = await listArtifacts(db, 'adr');
    expect(rows).toHaveLength(1);
    expect(rows[0]!.id).not.toBe('seed');
    await act(async () => view.renderer.unmount());
  });

  test('opening another record, or starting a new one, asks first when there are unsaved changes', async () => {
    await saveArtifact(db, { id: 'seed', kind: 'adr', title: 'Other decision', content: adrToContent({ ...COMPLETE, title: 'Other decision' }) });
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Half written');
    await press(view.renderer, t.savedOpen('Other decision'));
    expect(view.text()).toContain(t.discardAsk);
    expect(valueOf(view.renderer, t.titleLabel)).toBe('Half written');
    await press(view.renderer, t.discardKeep);
    expect(view.text()).not.toContain(t.discardAsk);
    await press(view.renderer, t.newRecord);
    expect(view.text()).toContain(t.discardAsk);
    await press(view.renderer, t.discardYes);
    expect(valueOf(view.renderer, t.titleLabel)).toBe('');
    await act(async () => view.renderer.unmount());
  });

  test('a store that refuses (too many records) is explained, and nothing is lost from the form', async () => {
    for (let i = 0; i < MAX_ARTIFACTS_PER_KIND; i += 1) await saveArtifact(db, { id: `r${i}`, kind: 'adr', title: `R${i}`, content: '{}' });
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'One too many');
    await press(view.renderer, t.save);
    await settle();
    expect(view.text()).toContain(t.saveRefused.limit);
    expect(valueOf(view.renderer, t.titleLabel)).toBe('One too many');
    expect(await listArtifacts(db, 'adr')).toHaveLength(MAX_ARTIFACTS_PER_KIND);
    await act(async () => view.renderer.unmount());
  });

  test('a write that throws shows a plain failure message', async () => {
    const view = await mount();
    await typeInto(view.renderer, t.titleLabel, 'Will fail');
    const original = db.getFirstAsync.bind(db);
    db.getFirstAsync = (async () => {
      throw new Error('disk');
    }) as typeof db.getFirstAsync;
    await press(view.renderer, t.save);
    await settle();
    db.getFirstAsync = original;
    expect(view.text()).toContain(t.saveFailed);
    await act(async () => view.renderer.unmount());
  });

  test('records that cannot be listed show an error with a retry, and the form still works', async () => {
    mockDb.current = {
      getAllAsync: async () => {
        throw new Error('disk');
      },
    };
    const view = await mount();
    expect(view.text()).toContain(t.savedLoadError);
    expect(has(view.renderer, t.savedRetry)).toBe(true);
    await typeInto(view.renderer, t.titleLabel, 'Still typing');
    expect(view.text()).toContain('# Still typing');
    await act(async () => view.renderer.unmount());
  });

  test('a saved record that is not a readable draft is not opened and says so', async () => {
    await saveArtifact(db, { id: 'bad', kind: 'adr', title: 'Broken', content: 'not json at all' });
    const view = await mount();
    await press(view.renderer, t.savedOpen('Broken'));
    expect(view.text()).toContain(t.openFailed);
    await act(async () => view.renderer.unmount());
  });
});
