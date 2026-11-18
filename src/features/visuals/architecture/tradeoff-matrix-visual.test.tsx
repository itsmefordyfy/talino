import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { getArtifact, saveArtifact } from '@/features/architecture';
import { parseMatrixState, serializeMatrix } from '@/features/architecture/lib/tradeoff';
import { findPreset } from '@/features/architecture/lib/tradeoff-presets';
import { architectureToolStrings } from '@/features/architecture/workbench/strings';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { clients, findAll, has, mount, press, typeInto } from './render-test-utils';
import { TradeoffMatrixVisual } from './tradeoff-matrix-visual';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...args: unknown[]) => mockPush(...args) } }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
let mockIds = 0;
jest.mock('@/lib/id', () => ({ newId: () => `matrix-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
let mockDb: unknown;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));
store.dispatch(languageChanged('en'));

const t = architectureToolStrings.en;
type Db = Awaited<ReturnType<typeof createTestDatabase>>;
let db: Db;

beforeEach(async () => {
  mockIds = 0;
  mockPush.mockClear();
  db = await createTestDatabase();
  mockDb = db;
});
afterEach(() => {
  for (const client of clients.splice(0)) client.clear();
  db.close();
});

const open = () => mount(<TradeoffMatrixVisual />);
const preset = findPreset('style')!.build();
const [mono, modular] = preset.options.map((option) => option.name) as [string, string, string];
const criteria = preset.criteria.map((criterion) => criterion.name);
const question = (view: Awaited<ReturnType<typeof open>>) => findAll(view.renderer, t.matrix.questionLabel)[0]!.props.value as string;
const word = (value: number) => t.matrix.scoreWords[value - 1] ?? '';
const score = (view: Awaited<ReturnType<typeof open>>, option: string, criterion: string, value: number) => press(view.renderer, t.matrix.scoreButton(option, criterion, value, word(value)));

describe('the trade-off matrix', () => {
  test('opens on a TindaTrack comparison with nothing scored: no result, a prompt to score, and the plain-words reminder', async () => {
    const view = await open();
    expect(question(view)).toBe(preset.question);
    for (const name of [...preset.options.map((option) => option.name), ...criteria]) expect(view.text()).toContain(name);
    expect(view.text()).toContain(t.matrix.notReady);
    expect(view.text()).toContain(t.matrix.disclaimer);
    expect(view.text()).toContain(t.matrix.warnings.same_weights);
    expect(view.text()).toContain(t.matrix.warnings.unscored_option(mono));
    expect(view.text()).not.toContain('comes out ahead');
    await view.unmount();
  });

  test('scoring two options live names a leader with the gap, and tapping a chosen score again clears it', async () => {
    const view = await open();
    for (const criterion of criteria.slice(0, 3)) {
      await score(view, mono, criterion, 5);
      await score(view, modular, criterion, 2);
    }
    expect(view.text()).toContain(t.matrix.leader(mono, 3));
    expect(has(view.renderer, t.matrix.optionResult(1, mono, 5))).toBe(true);
    expect(has(view.renderer, t.matrix.optionResult(2, modular, 2))).toBe(true);
    expect(has(view.renderer, t.matrix.optionResult(null, preset.options[2]!.name, null))).toBe(true);
    // Clearing the monolith's scores takes the result away again.
    for (const criterion of criteria.slice(0, 3)) await score(view, mono, criterion, 5);
    expect(view.text()).toContain(t.matrix.notReady);
    expect(view.text()).not.toContain('comes out ahead');
    await view.unmount();
  });

  test('a margin under half a point says too close to call, names no winner and shows where the top two differ most', async () => {
    const view = await open();
    await score(view, mono, criteria[0]!, 4);
    await score(view, modular, criteria[0]!, 3);
    await score(view, mono, criteria[1]!, 3);
    await score(view, modular, criteria[1]!, 3);
    await score(view, mono, criteria[2]!, 3);
    await score(view, modular, criteria[2]!, 3);
    expect(view.text()).toContain(t.matrix.tooClose(0.33));
    expect(view.text()).toContain(t.matrix.closeHeading);
    expect(view.text()).toContain(t.matrix.closeRow(criteria[0]!, 3, mono, 4, modular, 3));
    expect(view.text()).not.toContain('comes out ahead');
    await view.unmount();
  });

  test('weights can be raised and lowered, and they change the result', async () => {
    const view = await open();
    await score(view, mono, criteria[0]!, 5);
    await score(view, modular, criteria[0]!, 1);
    await score(view, mono, criteria[1]!, 1);
    await score(view, modular, criteria[1]!, 5);
    await score(view, mono, criteria[2]!, 3);
    await score(view, modular, criteria[2]!, 3);
    expect(view.text()).toContain(t.matrix.tooClose(0)); // equal weights: a tie
    await press(view.renderer, t.matrix.weightUp(criteria[0]!));
    await press(view.renderer, t.matrix.weightUp(criteria[0]!));
    expect(view.text()).toContain(t.matrix.leader(mono, 0.73));
    expect(view.text()).not.toContain(t.matrix.warnings.same_weights);
    await view.unmount();
  });

  test('options stay between two and four and qualities between three and eight, with the limit said', async () => {
    const view = await open();
    await press(view.renderer, t.matrix.addOption);
    expect(has(view.renderer, t.matrix.addOption)).toBe(false);
    expect(view.text()).toContain(t.matrix.optionsLimit);
    await press(view.renderer, t.matrix.removeOption('Option 4'));
    expect(has(view.renderer, t.matrix.addOption)).toBe(true);
    await press(view.renderer, t.matrix.addCriterion);
    await press(view.renderer, t.matrix.addCriterion);
    expect(has(view.renderer, t.matrix.addCriterion)).toBe(false);
    expect(view.text()).toContain(t.matrix.criteriaLimit);
    await view.unmount();

    const small = await open();
    await press(small.renderer, 'Blank');
    expect(has(small.renderer, t.matrix.removeOption('Option 1'))).toBe(false); // two options: none can go
    expect(has(small.renderer, t.matrix.removeCriterion('Quality 1'))).toBe(false); // three qualities: none can go
    await small.unmount();
  });

  test('changing the starting point asks first once the matrix has been changed', async () => {
    const view = await open();
    await press(view.renderer, 'REST or GraphQL'); // untouched: no question
    expect(view.text()).not.toContain(t.matrix.leaveAsk);
    expect(question(view)).toBe(findPreset('api')!.build().question);
    await score(view, 'REST', findPreset('api')!.build().criteria[0]!.name, 4);
    await press(view.renderer, 'Blank');
    expect(view.text()).toContain(t.matrix.leaveAsk);
    await press(view.renderer, t.matrix.leaveKeep);
    expect(question(view)).toBe(findPreset('api')!.build().question);
    await press(view.renderer, 'Blank');
    await press(view.renderer, t.matrix.leaveYes);
    expect(question(view)).toBe('');
    await view.unmount();
  });

  test('Save keeps the matrix as JSON with its title and project, and saving again updates the same row', async () => {
    const view = await open();
    await score(view, mono, criteria[0]!, 4);
    await typeInto(view.renderer, t.common.saveTitleLabel, 'Shop structure');
    await press(view.renderer, t.common.projects[2]!.label);
    await press(view.renderer, t.common.save);
    expect(view.text()).toContain(t.common.saved);
    const row = (await getArtifact(db, 'matrix-1'))!;
    expect(row).toMatchObject({ kind: 'matrix', title: 'Shop structure', projectId: 'software-architecture-ai-p3' });
    expect(parseMatrixState(row.content)!.criteria[0]!.scores).toEqual({ o1: 4 });
    await score(view, modular, criteria[0]!, 2);
    await press(view.renderer, t.common.saveChanges);
    expect(parseMatrixState((await getArtifact(db, 'matrix-1'))!.content)!.criteria[0]!.scores).toEqual({ o1: 4, o2: 2 });
    await view.unmount();
  });

  test('a saved matrix can be opened and deleted (after asking), and one that cannot be read is not opened', async () => {
    const mine = { ...findPreset('database')!.build(), question: 'My own question' };
    await saveArtifact(db, { id: 'm1', kind: 'matrix', title: 'Database choice', content: serializeMatrix(mine) });
    await saveArtifact(db, { id: 'm2', kind: 'matrix', title: 'Damaged', content: '{"options": 3}' });
    const view = await open();
    await press(view.renderer, t.common.openLabel('Database choice'));
    expect(question(view)).toBe('My own question');
    expect(view.text()).not.toContain(t.matrix.unreadable);
    await press(view.renderer, t.common.openLabel('Damaged'));
    expect(view.text()).toContain(t.matrix.unreadable);
    expect(question(view)).toBe('My own question');
    await press(view.renderer, t.common.deleteLabel('Database choice'));
    expect(view.text()).toContain(t.common.deleteAsk('Database choice'));
    await press(view.renderer, t.common.deleteYes);
    expect(await getArtifact(db, 'm1')).toBeNull();
    // The open one went, so the editor starts a fresh matrix.
    expect(question(view)).toBe(preset.question);
    await view.unmount();
  });

  test('Ask Tali opens the chat with the matrix and the review question on the architecture focus', async () => {
    const view = await open();
    await score(view, mono, criteria[0]!, 4);
    await press(view.renderer, t.common.askTali);
    const arg = mockPush.mock.calls[0]![0] as { pathname: string; params: { prompt: string; focus: string } };
    expect(arg.pathname).toBe('/tali');
    expect(arg.params.focus).toBe('architecture');
    expect(arg.params.prompt).toContain(`${criteria[0]} (weight 3): ${mono} 4, ${modular} not scored`);
    expect(arg.params.prompt).toContain('Review this trade-off matrix');
    await view.unmount();
  });

  test('a list that cannot be read shows an error with a retry', async () => {
    mockDb = {
      getAllAsync: async () => {
        throw new Error('disk');
      },
      getFirstAsync: async () => null,
      runAsync: async () => ({}),
    };
    const view = await open();
    expect(view.text()).toContain(t.common.savedLoadError);
    expect(has(view.renderer, t.common.retry)).toBe(true);
    await view.unmount();
  });
});
