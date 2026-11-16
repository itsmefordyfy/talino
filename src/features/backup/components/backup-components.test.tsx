import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act, type ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import type { ManualBackupEntry } from '../api/manual-backups';
import type { StatusKey } from '../lib/status';
import { backupStrings } from '../strings';
import { ManualBackupsSection, type ManualBackupsSectionProps } from './manual-backups-section';
import { StatusMessage, StatusRow, statusNeedsCard } from './status-card';

// The sheet's own animation needs the native runtime; its choices are what matter here.
jest.mock('@/components/ui/action-sheet', () => ({ ActionSheet: () => null }));
jest.mock('expo-router', () => ({ useIsFocused: () => true }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
store.dispatch(languageChanged('en'));

const text = backupStrings.en;

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(' '));
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
async function mount(element: ReactElement) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 402, height: 874 }, insets: { top: 62, bottom: 34, left: 0, right: 0 } }}>
        <Provider store={store}>{element}</Provider>
      </SafeAreaProvider>,
    );
  });
  return renderer;
}
const textNode = (renderer: ReturnType<typeof createRoot>, label: string) => renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === label)[0];

describe('the automatic backup status', () => {
  test('a calm status is one row that carries its own explanation, with no card under the group', async () => {
    const renderer = await mount(<StatusRow statusKey="synced" title="Backed up to iCloud" body="iCloud has confirmed." detail="Last confirmed by iCloud: today" />);
    const all = textOf(renderer.container);
    expect(all).toContain('Backed up to iCloud');
    expect(all).toContain('iCloud has confirmed.');
    expect(all).toContain('Last confirmed by iCloud: today');
    const message = await mount(<StatusMessage statusKey="synced" body="iCloud has confirmed." />);
    expect(textOf(message.container)).toBe('');
  });

  test('a status that needs attention keeps the row to a line and explains itself in a card', async () => {
    const row = await mount(<StatusRow statusKey="failed_full" title="iCloud storage is full" body="Free some space." />);
    expect(textOf(row.container)).not.toContain('Free some space.');
    const message = await mount(<StatusMessage statusKey="failed_full" body="Free some space." />);
    expect(textOf(message.container)).toContain('Free some space.');
  });

  test('every status says whether it needs a card, and the failures and the iCloud-off states do', () => {
    const keys = Object.keys(text.auto.statuses) as StatusKey[];
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) expect(typeof statusNeedsCard(key)).toBe('boolean');
    for (const key of keys.filter((name) => name.startsWith('failed_') || name.startsWith('unavailable_'))) expect(statusNeedsCard(key)).toBe(true);
    expect(statusNeedsCard('disabled_signed_out')).toBe(true);
    expect(statusNeedsCard('synced')).toBe(false);
    expect(statusNeedsCard('none_yet')).toBe(false);
  });
});

const entry = (overrides: Partial<ManualBackupEntry> = {}): ManualBackupEntry =>
  ({
    file: { uri: 'file:///backups/a.talino-backup', name: 'a.talino-backup', size: 2048, modified: 1_700_000_000_000 },
    header: { createdAt: '2026-11-14T09:30:00.000Z', appVersion: '1.0.0', label: null, counts: { lessons: 4, activities: 2 } },
    problem: null,
    ...overrides,
  }) as unknown as ManualBackupEntry;

function props(overrides: Partial<ManualBackupsSectionProps> = {}): ManualBackupsSectionProps {
  return {
    unlocked: true,
    entries: [],
    loading: false,
    failed: false,
    busy: null,
    canUndo: false,
    onUnlock: jest.fn(),
    onRetry: jest.fn(),
    onCreate: jest.fn(),
    onImport: jest.fn(),
    onExport: jest.fn(),
    onRestore: jest.fn(),
    onDelete: jest.fn(),
    onUndo: jest.fn(),
    ...overrides,
  };
}

describe('the backup files group', () => {
  test('Free sees the Export and Import rows, each with a Pro badge, and the footer; tapping either goes to the store', async () => {
    const onUnlock = jest.fn();
    const renderer = await mount(<ManualBackupsSection {...props({ unlocked: false, onUnlock })} />);
    const all = textOf(renderer.container);
    expect(all).toContain(text.manual.create);
    expect(all).toContain(text.manual.import);
    expect(all.match(/Pro/g)?.length).toBeGreaterThanOrEqual(2);
    expect(all).toContain(text.manual.lockedBody);
    await act(async () => tap(textNode(renderer, text.manual.create)));
    await act(async () => tap(textNode(renderer, text.manual.import)));
    expect(onUnlock).toHaveBeenCalledTimes(2);
  });

  test('Pro gets Create and Import rows that run their actions, and an empty history says so', async () => {
    const onCreate = jest.fn();
    const onImport = jest.fn();
    const renderer = await mount(<ManualBackupsSection {...props({ onCreate, onImport })} />);
    expect(textOf(renderer.container)).toContain(text.manual.emptyHistory);
    await act(async () => tap(textNode(renderer, text.manual.create)));
    await act(async () => tap(textNode(renderer, text.manual.import)));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledTimes(1);
  });

  test('while something runs, the rows can’t be pressed and the busy one says what it is doing', async () => {
    const onCreate = jest.fn();
    const renderer = await mount(<ManualBackupsSection {...props({ busy: 'create', onCreate })} />);
    expect(textOf(renderer.container)).toContain(text.manual.creating);
    expect(renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === text.manual.import)).toHaveLength(1);
    expect(onCreate).not.toHaveBeenCalled();
  });

  test('the history lists each file with its counts, and a failed read offers a retry', async () => {
    const withFile = await mount(<ManualBackupsSection {...props({ entries: [entry()] })} />);
    expect(textOf(withFile.container)).toContain(text.manual.counts(4, 2));
    const onRetry = jest.fn();
    const failed = await mount(<ManualBackupsSection {...props({ failed: true, entries: undefined, onRetry })} />);
    expect(textOf(failed.container)).toContain(text.loadFailed);
    await act(async () => tap(textNode(failed, text.retry)));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('an unreadable file shows as damaged with its reason', async () => {
    const renderer = await mount(<ManualBackupsSection {...props({ entries: [entry({ header: null, problem: 'needs_newer_app' } as Partial<ManualBackupEntry>)] })} />);
    expect(textOf(renderer.container)).toContain(text.manual.damaged);
    expect(textOf(renderer.container)).toContain(text.manual.newerBody);
  });
});
