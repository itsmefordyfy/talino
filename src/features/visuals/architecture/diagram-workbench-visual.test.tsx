import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { getArtifact, listArtifacts, MAX_ARTIFACTS_PER_KIND, saveArtifact } from '@/features/architecture';
import { defaultTemplate, DIAGRAM_TEMPLATES } from '@/features/architecture/lib/diagram-templates';
import { architectureToolStrings } from '@/features/architecture/workbench/strings';
import { DRAW_PAUSE_MS } from '@/features/architecture/workbench/diagram-workbench';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { DiagramWorkbenchVisual } from './diagram-workbench-visual';
import { clients, findAll, has, mount, press, settle, typeInto, type Renderer } from './render-test-utils';

// The real drawing waits for the screen to measure it, which a test never does; a stand-in records which text each drawing was made from.
jest.mock('@/features/visuals/diagrams', () => {
  const actual = jest.requireActual<Record<string, unknown>>('@/features/visuals/diagrams');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  return { ...actual, DiagramFromMermaid: ({ source }: { source: string }) => React.createElement(View, { accessibilityLabel: 'drawn-diagram', accessibilityHint: source }) };
});
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...args: unknown[]) => mockPush(...args) } }));
const mockCopy = jest.fn(async (_text: string) => true);
jest.mock('@/lib/clipboard', () => ({ copyText: (text: string) => mockCopy(text) }));
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
let mockIds = 0;
jest.mock('@/lib/id', () => ({ newId: () => `diagram-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
let mockDb: unknown;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));
store.dispatch(languageChanged('en'));

const t = architectureToolStrings.en;
type Db = Awaited<ReturnType<typeof createTestDatabase>>;
let db: Db;
const SOURCE = t.workbench.sourceLabel;
const pause = () => settle(DRAW_PAUSE_MS + 60);

beforeEach(async () => {
  mockIds = 0;
  mockPush.mockClear();
  mockCopy.mockClear();
  db = await createTestDatabase();
  mockDb = db;
});
afterEach(() => {
  for (const client of clients.splice(0)) client.clear();
  db.close();
});

const drawn = (renderer: Renderer) => findAll(renderer, 'drawn-diagram').map((node) => node.props.accessibilityHint as string);
const open = () => mount(<DiagramWorkbenchVisual />);

describe('the diagram workbench', () => {
  test('opens on the C4 context template, drawn, with the source and the template chips', async () => {
    const view = await open();
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe(defaultTemplate().source);
    for (const template of DIAGRAM_TEMPLATES) expect(has(view.renderer, template.label)).toBe(true);
    expect(view.text()).not.toContain(t.workbench.errorsHeading(1));
    expect(view.text()).not.toContain(t.workbench.emptyDrawing);
    expect(drawn(view.renderer)).toEqual([defaultTemplate().source]);
    await view.unmount();
  });

  test('a mistake shows the parser\'s line-numbered message after a pause and keeps the last good drawing', async () => {
    const view = await open();
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A --> B\n  B -- C');
    expect(view.text()).not.toContain('Line 3'); // not before the pause
    await pause();
    expect(view.text()).toContain(t.workbench.errorsHeading(1));
    expect(view.text()).toContain('Line 3:');
    // The earlier good text was the template, so it is still the drawing and the notice says so.
    expect(view.text()).toContain(t.workbench.lastGood);
    expect(drawn(view.renderer)).toEqual([defaultTemplate().source]);
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A --> B\n  B --> C');
    await pause();
    expect(view.text()).not.toContain('Line 3');
    expect(view.text()).not.toContain(t.workbench.lastGood);
    expect(drawn(view.renderer)).toEqual(['flowchart TD\n  A --> B\n  B --> C']);
    await view.unmount();
  });

  test('smart quotes from a phone keyboard are put back to plain ones', async () => {
    const view = await open();
    await typeInto(view.renderer, SOURCE, 'C4Context\n  Person(a, “Owner”)');
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe('C4Context\n  Person(a, "Owner")');
    await view.unmount();
  });

  test('blank text says there is nothing to draw, and picking a template while the text is changed asks first', async () => {
    const view = await open();
    await typeInto(view.renderer, SOURCE, '');
    await pause();
    expect(view.text()).toContain(t.workbench.emptyDrawing);
    expect(drawn(view.renderer)).toEqual([]);
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  X --> Y');
    await press(view.renderer, 'Sequence: checkout');
    expect(view.text()).toContain(t.workbench.switchAsk('Sequence: checkout'));
    await press(view.renderer, t.workbench.switchKeep);
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe('flowchart TD\n  X --> Y');
    await press(view.renderer, 'Sequence: checkout');
    await press(view.renderer, t.workbench.switchYes);
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe(DIAGRAM_TEMPLATES.find((template) => template.id === 'sequence')!.source);
    await view.unmount();
  });

  test('Reset to template puts the template back after asking, and an unchanged text needs no question', async () => {
    const view = await open();
    await press(view.renderer, t.workbench.reset); // unchanged: no question
    expect(view.text()).not.toContain(t.workbench.resetAsk);
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  X --> Y');
    await press(view.renderer, t.workbench.reset);
    expect(view.text()).toContain(t.workbench.resetAsk);
    await press(view.renderer, t.workbench.resetYes);
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe(defaultTemplate().source);
    await view.unmount();
  });

  test('Copy source copies the text and says so', async () => {
    const view = await open();
    await press(view.renderer, t.workbench.copy);
    expect(mockCopy).toHaveBeenCalledWith(defaultTemplate().source);
    expect(has(view.renderer, t.workbench.copied)).toBe(true);
    await view.unmount();
  });

  test('Ask Tali opens the chat with the diagram and the review question, on the architecture focus', async () => {
    const view = await open();
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A --> B');
    await press(view.renderer, t.common.askTali);
    expect(mockPush).toHaveBeenCalledTimes(1);
    const arg = mockPush.mock.calls[0]![0] as { pathname: string; params: { prompt: string; focus: string } };
    expect(arg.pathname).toBe('/tali');
    expect(arg.params.focus).toBe('architecture');
    expect(arg.params.prompt).toContain('flowchart TD\n  A --> B');
    expect(arg.params.prompt).toContain('Review this diagram: what assumptions does it make, what is missing, and what would you ask me?');
    await view.unmount();
  });

  test('Save keeps the diagram with its title and project, and saving again updates the same row', async () => {
    const view = await open();
    await typeInto(view.renderer, t.common.saveTitleLabel, 'Checkout context');
    await press(view.renderer, t.common.projects[0]!.label);
    await press(view.renderer, t.common.save);
    expect(view.text()).toContain(t.common.saved);
    expect(await getArtifact(db, 'diagram-1')).toMatchObject({ kind: 'diagram', title: 'Checkout context', content: defaultTemplate().source.trim(), projectId: 'software-architecture-ai-p1' });
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A --> B');
    await press(view.renderer, t.common.saveChanges);
    expect(await listArtifacts(db, 'diagram')).toHaveLength(1);
    expect((await getArtifact(db, 'diagram-1'))!.content).toBe('flowchart TD\n  A --> B');
    expect(view.text()).toContain('Checkout context');
    await view.unmount();
  });

  test('saving nothing, or past the limit, says why in plain words', async () => {
    const view = await open();
    await typeInto(view.renderer, SOURCE, '   ');
    await press(view.renderer, t.common.save);
    expect(view.text()).toContain(t.common.saveRefused.empty);
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A --> B');
    for (let i = 0; i < MAX_ARTIFACTS_PER_KIND; i += 1) await saveArtifact(db, { id: `old-${i}`, kind: 'diagram', title: `Old ${i}`, content: 'flowchart TD\n A --> B' });
    await press(view.renderer, t.common.save);
    expect(view.text()).toContain(t.common.saveRefused.limit(t.workbench.kindNames.diagram));
    await view.unmount();
  });

  test('a save that fails is reported, not lost silently', async () => {
    const view = await open();
    const original = db.runAsync.bind(db);
    db.runAsync = (async () => {
      throw new Error('disk full');
    }) as typeof db.runAsync;
    await press(view.renderer, t.common.save);
    expect(view.text()).toContain(t.common.saveFailed);
    db.runAsync = original;
    await view.unmount();
  });

  test('saved diagrams are listed to open, and deleting asks first', async () => {
    await saveArtifact(db, { id: 's1', kind: 'diagram', title: 'Earlier idea', content: 'flowchart TD\n  P --> Q', projectId: 'software-architecture-ai-p2' });
    const view = await open();
    expect(view.text()).toContain('Earlier idea');
    expect(view.text()).toContain(t.common.attachedTo('P2'));
    await press(view.renderer, t.common.openLabel('Earlier idea'));
    // The template text was unchanged, so opening needed no question.
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe('flowchart TD\n  P --> Q');
    expect(findAll(view.renderer, t.common.saveTitleLabel)[0]!.props.value).toBe('Earlier idea');

    await press(view.renderer, t.common.deleteLabel('Earlier idea'));
    expect(view.text()).toContain(t.common.deleteAsk('Earlier idea'));
    await press(view.renderer, t.common.deleteKeep);
    expect(await getArtifact(db, 's1')).not.toBeNull();
    await press(view.renderer, t.common.deleteLabel('Earlier idea'));
    await press(view.renderer, t.common.deleteYes);
    expect(await getArtifact(db, 's1')).toBeNull();
    expect(view.text()).toContain(t.workbench.savedEmpty);
    // The open one went, so the editor starts a fresh diagram on the template.
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe(defaultTemplate().source);
    await view.unmount();
  });

  test('opening a saved diagram while the text has unsaved changes asks first', async () => {
    await saveArtifact(db, { id: 's1', kind: 'diagram', title: 'Earlier idea', content: 'flowchart TD\n  P --> Q' });
    const view = await open();
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  X --> Y');
    await press(view.renderer, t.common.openLabel('Earlier idea'));
    expect(view.text()).toContain(t.workbench.leaveAsk);
    await press(view.renderer, t.workbench.leaveYes);
    expect(findAll(view.renderer, SOURCE)[0]!.props.value).toBe('flowchart TD\n  P --> Q');
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

  test('Compare shows two versions one after the other with what changed between them', async () => {
    await saveArtifact(db, { id: 's1', kind: 'diagram', title: 'Before', content: 'flowchart TD\n  A[Web] --> B[API]' });
    const view = await open();
    await typeInto(view.renderer, SOURCE, 'flowchart TD\n  A[Web app] --> B[API]\n  B --> C[(Database)]');
    await press(view.renderer, t.workbench.modes.compare);
    expect(view.text()).toContain(t.workbench.compare.needTwo);
    await press(view.renderer, 'Before', 0); // A
    await press(view.renderer, t.workbench.compare.current, 1); // B
    expect(view.text()).toContain(t.workbench.compare.drawingOf('A', 'Before'));
    expect(view.text()).toContain(t.workbench.compare.drawingOf('B', t.workbench.compare.current));
    expect(drawn(view.renderer)).toEqual(['flowchart TD\n  A[Web] --> B[API]', 'flowchart TD\n  A[Web app] --> B[API]\n  B --> C[(Database)]']);
    expect(view.text()).toContain(t.workbench.compare.changedHeading);
    expect(view.text()).toContain(t.workbench.compare.summary(2, 1));
    expect(view.text()).toContain('C');
    expect(view.text()).toContain(t.workbench.compare.renamed('Web', 'Web app'));
    await view.unmount();
  });

  test('Compare says so when the two versions are the same, when none is saved, and when one cannot be drawn', async () => {
    const view = await open();
    await press(view.renderer, t.workbench.modes.compare);
    expect(view.text()).toContain(t.workbench.compare.noSaved);
    await press(view.renderer, t.workbench.compare.current, 0);
    await press(view.renderer, t.workbench.compare.current, 1);
    expect(view.text()).toContain(t.workbench.compare.same);
    await view.unmount();

    await saveArtifact(db, { id: 'bad', kind: 'diagram', title: 'Broken', content: 'flowchart TD\n  A -- B' });
    const second = await open();
    await press(second.renderer, t.workbench.modes.compare);
    await press(second.renderer, 'Broken', 0);
    await press(second.renderer, t.workbench.compare.current, 1);
    expect(second.text()).toContain(t.workbench.compare.cantDraw('A'));
    expect(second.text()).toContain('Line 2:');
    await second.unmount();
  });
});
