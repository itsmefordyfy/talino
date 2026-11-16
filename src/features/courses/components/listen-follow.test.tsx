import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import type { RefObject } from 'react';
import { StyleSheet } from 'react-native';
import { createRoot, type TestInstance } from 'test-renderer';

import { Colors } from '@/constants/theme';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { COURSES, findLesson } from '../content';
import { FIL_COURSES } from '../content/fil';
import type { Lesson } from '../content/types';
import { getListenSnapshot, jumpToSegment, startListening, stopListening, type ListenSession, type ListenSnapshot } from '../audio/listen-controller';
import { emphasizeKeyTerms, lessonKeyTerms } from '../lib/key-terms';
import { lessonOutline, lessonScript, parseInline } from '../lib/plain-text';
import { blockUnit, lessonSegments, segmentIndexOf } from '../lib/speech-segments';
import { KeyTermsProvider } from './key-terms-context';
import { LessonBlocks } from './lesson-blocks';
import { LessonIntro } from './lesson-intro';
import type { ScreenHandle } from '@/components/ui/screen';
import { useFollowAlong } from '../hooks/use-follow-along';
import { ListenFollowProvider, saidOffsetOf, type ListenFollowValue } from './listen-follow';

// No native audio here: Listen uses the phone's voice, which speaks one sentence at a time and so exercises the same screen code.
jest.mock('expo', () => ({ ...(jest.requireActual('expo') as object), requireOptionalNativeModule: () => null }));
const mockSpoken: { text: string; onDone?: () => void; onBoundary?: (event: { charIndex: number; charLength: number }) => void }[] = [];
jest.mock('expo-speech', () => ({ speak: (text: string, options: { onDone?: () => void; onBoundary?: (event: { charIndex: number; charLength: number }) => void }) => mockSpoken.push({ text, onDone: options.onDone, onBoundary: options.onBoundary }), stop: () => {}, maxSpeechInputLength: 4000 }));
jest.mock('@/lib/monitoring', () => ({ reportError: jest.fn() }));
// The follow hook only asks Reanimated whether motion is reduced; the real module has no Jest implementation.
jest.mock('react-native-reanimated', () => ({ useReducedMotion: () => false }));
jest.mock('../audio/audio-cache', () => ({ AUDIO_ORIGIN: undefined, savedLessonAudio: () => null, downloadLessonAudio: jest.fn(), loadLessonPeaks: jest.fn(), loadLessonTiming: jest.fn(), forgetLessonAudio: jest.fn() }));
jest.mock('../audio/listen-position', () => ({ loadListenPosition: () => null, saveListenPosition: jest.fn(), clearListenPosition: jest.fn(), clearAllListenPositions: jest.fn() }));
// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
jest.mock('@/lib/clipboard', () => ({ copyText: async () => true }));

store.dispatch(languageChanged('en'));

const theme = Colors.light;
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
const styleOf = (instance: TestInstance) => StyleSheet.flatten(instance.props.style as never) as Record<string, unknown> | undefined;

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
/** What a tap on this element does: walks up to the component that owns onPress, as a touch would. */
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

function setup(lesson: Lesson) {
  const segments = lessonSegments(lesson);
  const index = segmentIndexOf(segments);
  const follow: ListenFollowValue = {
    lessonId: lesson.id,
    index,
    unitOfBlock: (block) => {
      const at = lesson.body.indexOf(block);
      return at < 0 || block.audience || block.type === 'activity' ? null : blockUnit(at);
    },
    jump: (segment) => jumpToSegment(segment),
    register: () => {},
  };
  const session: ListenSession = { lessonId: lesson.id, lessonTitle: lesson.title, courseTitle: 'Course', outline: lessonOutline(lesson), script: lessonScript(lesson), segments };
  const learn = lesson.body.filter((block) => block.type !== 'activity' && block.type !== 'takeaways' && !block.audience);
  const takeaways = lesson.body.filter((block) => block.type === 'takeaways');
  const tree = (
    <Provider store={store}>
      <ListenFollowProvider value={follow}>
        {/* As on the lesson screen: every follow test also runs with the lesson's key terms bolded. */}
        <KeyTermsProvider terms={lessonKeyTerms(lesson)}>
          <LessonIntro lesson={lesson} />
          <LessonBlocks blocks={[...learn, ...takeaways]} />
        </KeyTermsProvider>
      </ListenFollowProvider>
    </Provider>
  );
  return { segments, session, tree };
}

/** The sentences drawn with the highlight background: what the learner sees lit. */
const lit = (renderer: ReturnType<typeof createRoot>) => renderer.container.queryAll((instance) => styleOf(instance)?.backgroundColor === theme.listenHighlight).map((instance) => textOf(instance));
const soft = (renderer: ReturnType<typeof createRoot>) => renderer.container.queryAll((instance) => styleOf(instance)?.color === theme.listenRead).map((instance) => textOf(instance));
/** The text element that draws exactly this sentence. */
const sentence = (renderer: ReturnType<typeof createRoot>, text: string) => {
  const found = renderer.container.queryAll((instance) => typeof instance.props.onPress === 'function' && textOf(instance) === text);
  if (found.length === 0) throw new Error(`no tappable sentence "${text}"`);
  return found[found.length - 1];
};

const mounted: ReturnType<typeof createRoot>[] = [];
async function render(tree: React.ReactElement) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(tree);
  });
  return renderer;
}

beforeEach(() => {
  mockSpoken.length = 0;
});
// Listening is app-wide state: stop it and take the screens down inside act, so no test hears the one before.
afterEach(async () => {
  await act(async () => stopListening());
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

describe('a lesson drawn while nobody is listening', () => {
  test('shows its text plainly: nothing lit, nothing softened, no sentence to tap', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { tree } = setup(found.lesson);
    const renderer = await render(tree);
    expect(lit(renderer)).toEqual([]);
    expect(soft(renderer)).toEqual([]);
    expect(renderer.container.queryAll((instance) => typeof instance.props.onPress === 'function' && textOf(instance).length > 20)).toEqual([]);
    expect(textOf(renderer.container)).toContain(found.lesson.intro?.why.replace(/\*\*|`/g, '').slice(0, 30));
  });
});

describe('titles, headings and visuals while the lesson is read', () => {
  const frameViews = (renderer: ReturnType<typeof createRoot>) => renderer.container.queryAll((instance) => styleOf(instance)?.backgroundColor === theme.listenAccent || styleOf(instance)?.borderColor === theme.listenAccent);
  const titled = (renderer: ReturnType<typeof createRoot>, title: string) => renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === title);

  test('a heading and a label just light up as they are read: no bar and no ring round them', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const at = found.lesson.body.findIndex((block) => block.type === 'heading');
    const heading = found.lesson.body[at] as { text: string };
    const segment = segments.find((candidate) => candidate.unit === blockUnit(at));
    if (!segment) throw new Error('the heading is not spoken');
    await act(async () => jumpToSegment(segment.index));
    expect(lit(renderer)).toEqual([heading.text]);
    expect(frameViews(renderer)).toHaveLength(0);

    const label = segments.find((candidate) => candidate.unit === 'objectives-label');
    if (!label) throw new Error('no objectives label');
    await act(async () => jumpToSegment(label.index));
    // What is written differs a little from what is said ("By the end you will be able to" / "By the end of this lesson…"): the written line lights as a whole.
    expect(lit(renderer)).toEqual(['By the end you will be able to']);
    expect(frameViews(renderer)).toHaveLength(0);
  });

  test('a paragraph draws no bar, and a visual keeps its ring: it is not just words', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const visualAt = found.lesson.body.findIndex((block) => block.type === 'visual');
    const visual = segments.find((candidate) => candidate.unit === blockUnit(visualAt));
    if (!visual) throw new Error('the visual is not spoken');
    await act(async () => jumpToSegment(visual.index));
    // A ring round the visual, and nothing standing at its left edge.
    const ring = renderer.container.queryAll((instance) => styleOf(instance)?.borderColor === theme.listenAccent);
    expect(ring).toHaveLength(1);
    expect(renderer.container.queryAll((instance) => styleOf(instance)?.backgroundColor === theme.listenAccent)).toHaveLength(0);
    // Reading a paragraph: lit text, no bar and no ring anywhere.
    const paragraphAt = found.lesson.body.findIndex((block) => block.type === 'paragraph' && !block.audience);
    const paragraph = segments.find((candidate) => candidate.unit === blockUnit(paragraphAt));
    if (!paragraph) throw new Error('the paragraph is not spoken');
    await act(async () => jumpToSegment(paragraph.index));
    expect(lit(renderer)).not.toEqual([]);
    expect(frameViews(renderer)).toHaveLength(0);
  });

  test('a visual is shown and played while the voice describes it, and stops when the voice moves on', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    expect(titled(renderer, 'Play').length).toBeGreaterThan(0);
    expect(titled(renderer, 'Pause')).toHaveLength(0);
    await act(async () => startListening(session, { rate: 1, online: true }));
    // Reading elsewhere: the visual waits for the learner, as always.
    expect(titled(renderer, 'Pause')).toHaveLength(0);
    const visualAt = found.lesson.body.findIndex((block) => block.type === 'visual');
    const visual = segments.find((candidate) => candidate.unit === blockUnit(visualAt));
    if (!visual) throw new Error('the visual is not spoken');
    await act(async () => jumpToSegment(visual.index));
    expect(titled(renderer, 'Pause').length).toBeGreaterThan(0);
    expect(titled(renderer, 'Play')).toHaveLength(0);
    // The voice moves on to the next part: the visual stops where it is.
    await act(async () => jumpToSegment(visual.index + 1));
    expect(titled(renderer, 'Pause')).toHaveLength(0);
    expect(titled(renderer, 'Play').length + titled(renderer, 'Replay').length).toBeGreaterThan(0);
  });
});

describe('a lesson drawn while it is being listened to', () => {
  test('lights exactly the sentence being spoken and softens the ones already spoken', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));

    // Segment 0 is the title (not on this screen); the summary's first sentence is the first one drawn here.
    const firstSentence = segments.find((segment) => segment.unit === 'summary' && segment.sentence === 0);
    if (!firstSentence) throw new Error('no summary sentence');
    await act(async () => jumpToSegment(firstSentence.index));
    expect(lit(renderer)).toEqual([firstSentence.text]);

    const next = segments[firstSentence.index + 1];
    await act(async () => mockSpoken.at(-1)?.onDone?.());
    expect(getListenSnapshot().activeSegment).toBe(next.index);
    if (next.unit === 'summary') {
      expect(lit(renderer)).toEqual([next.text]);
      expect(soft(renderer)).toContain(firstSentence.text);
    }
  });

  test('lights a sentence in the middle of a paragraph that has bold and inline code, and the whole sentence', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const marked = segments.find((segment) => segment.sentence !== null && /^b\d+$/.test(segment.unit) && found.lesson.body.some((block) => block.type === 'paragraph' && /\*\*|`/.test(block.text) && block.text.replace(/\*\*|`/g, '').includes(segment.text)));
    const target = marked ?? segments.find((segment) => /^b\d+$/.test(segment.unit) && segment.sentence === 1);
    if (!target) throw new Error('no paragraph sentence to light');
    await act(async () => jumpToSegment(target.index));
    expect(lit(renderer)).toEqual([target.text]);
  });

  test('a key term bolded by the app is drawn bold, and its sentence still lights whole, word for word as spoken', async () => {
    // The first lesson with a paragraph where the app bolds a term the author didn't bold there.
    let pick: { lesson: Lesson; at: number; term: string } | null = null;
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const terms = lessonKeyTerms(lesson);
        const at = lesson.body.findIndex((block) => block.type === 'paragraph' && !block.audience && emphasizeKeyTerms(parseInline(block.text), terms).length > parseInline(block.text).length);
        if (at < 0) continue;
        const block = lesson.body[at];
        if (block.type !== 'paragraph') continue;
        const original = parseInline(block.text);
        const term = emphasizeKeyTerms(original, terms).find((part) => part.bold && !original.some((before) => before.bold && before.text === part.text))?.text;
        if (term) {
          pick = { lesson, at, term };
          break;
        }
      }
      if (pick) break;
    }
    if (!pick) throw new Error('no lesson bolds a key term');
    const { lesson, at, term } = pick;
    const { segments, session, tree } = setup(lesson);
    const renderer = await render(tree);
    expect(renderer.container.queryAll((instance) => styleOf(instance)?.fontWeight === 700 && textOf(instance) === term).length).toBeGreaterThan(0);

    await act(async () => startListening(session, { rate: 1, online: true }));
    const target = segments.find((segment) => segment.unit === blockUnit(at) && segment.text.includes(term));
    if (!target) throw new Error('no sentence holding the term');
    await act(async () => jumpToSegment(target.index));
    // The sentence being spoken, and the ones before it in the same paragraph (said), are lit: exactly their words, the bold changing none.
    expect(lit(renderer)).toEqual(segments.filter((segment) => segment.unit === target.unit && segment.index <= target.index).map((segment) => segment.text));
  });

  test('a tap on a sentence jumps the voice to it, even backwards, and the light moves there', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const paragraphs = segments.filter((segment) => /^b\d+$/.test(segment.unit) && segment.sentence !== null);
    const later = paragraphs[Math.min(3, paragraphs.length - 1)];
    const earlier = segments.find((segment) => segment.unit === 'summary' && segment.sentence === 0);
    if (!earlier) throw new Error('no summary sentence');

    await act(async () => tap(sentence(renderer, later.text)));
    expect(getListenSnapshot().activeSegment).toBe(later.index);
    expect(mockSpoken.at(-1)?.text).toBe(later.text);
    expect(lit(renderer)).toEqual([later.text]);
    expect(soft(renderer)).toContain(earlier.text);

    await act(async () => tap(sentence(renderer, earlier.text)));
    expect(getListenSnapshot().activeSegment).toBe(earlier.index);
    expect(lit(renderer)).toEqual([earlier.text]);
    expect(soft(renderer)).not.toContain(earlier.text);
    expect(soft(renderer)).not.toContain(later.text);
  });

  test('stopping puts the lesson back to plain text', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    await act(async () => jumpToSegment(3));
    expect(lit(renderer).length + soft(renderer).length).toBeGreaterThan(0);
    await act(async () => stopListening());
    expect(lit(renderer)).toEqual([]);
    expect(soft(renderer)).toEqual([]);
  });

  test('the same works for the Tagalog (Taglish) lesson: the sentences are cut and lit from the Tagalog text', async () => {
    const lesson = FIL_COURSES.starter.lessons[0];
    const { segments, session, tree } = setup(lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const target = segments.find((segment) => /^b\d+$/.test(segment.unit) && segment.sentence === 1) ?? segments.find((segment) => segment.unit === 'summary');
    if (!target) throw new Error('no Tagalog sentence');
    await act(async () => jumpToSegment(target.index));
    // The earlier sentences of the same paragraph stay lit (already said), then the one being spoken.
    const before = segments.filter((segment) => segment.unit === target.unit && segment.index < target.index).map((segment) => segment.text);
    expect(lit(renderer)).toEqual([...before, target.text]);
    await act(async () => tap(sentence(renderer, target.text)));
    expect(getListenSnapshot().activeSegment).toBe(target.index);
  });

  test('inside the sentence being spoken only the words already said are lit, and more light up as the voice reports each word', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session, tree } = setup(found.lesson);
    const renderer = await render(tree);
    await act(async () => startListening(session, { rate: 1, online: true }));
    const target = segments.find((segment) => /^b\d+$/.test(segment.unit) && segment.sentence === 1 && segment.text.split(' ').length > 8);
    if (!target) throw new Error('no long second sentence');
    await act(async () => jumpToSegment(target.index));
    const speaking = mockSpoken[mockSpoken.length - 1];
    if (!speaking?.onBoundary) throw new Error('the voice was not asked for word markers');
    const firstWord = target.text.split(' ')[0];
    await act(async () => speaking.onBoundary?.({ charIndex: 0, charLength: firstWord.length }));
    const early = lit(renderer).at(-1) ?? '';
    expect(early.length).toBeGreaterThan(0);
    expect(early.length).toBeLessThan(target.text.length);
    expect(target.text.startsWith(early)).toBe(true);
    const middle = Math.floor(target.text.length / 2);
    await act(async () => speaking.onBoundary?.({ charIndex: middle, charLength: 4 }));
    const later = lit(renderer).at(-1) ?? '';
    expect(later.length).toBeGreaterThan(early.length);
    expect(later.length).toBeLessThan(target.text.length);
    expect(target.text.startsWith(later)).toBe(true);
  });

  test("another lesson's listening does not light this one", async () => {
    const found = findLesson('starter-01');
    const other = findLesson('starter-02');
    if (!found || !other) throw new Error('starter lessons are missing');
    const { tree } = setup(found.lesson);
    const renderer = await render(tree);
    const { session } = setup(other.lesson);
    await act(async () => startListening(session, { rate: 1, online: true }));
    await act(async () => jumpToSegment(4));
    expect(lit(renderer)).toEqual([]);
    expect(soft(renderer)).toEqual([]);
  });
});

describe('the word lit in a recording that has word times', () => {
  const plain = 'Kokoro says each word at its own time.';
  const session = { lessonId: 'l1', lessonTitle: '', courseTitle: '', outline: [], script: '', segments: [{ text: plain, unit: 'b1', pause: 'sentence' }] } as unknown as ListenSession;
  const snapshot = (position: number, words?: number[][]): ListenSnapshot =>
    ({
      session,
      state: 'playing',
      mode: 'recording',
      position,
      duration: 20,
      peaks: null,
      timing: { hash: 'abcdef12', duration: 20, segments: [[10, 14]], ...(words ? { words } : {}) },
      activeSegment: 0,
      spokenFraction: null,
      buffering: false,
      fallback: null,
    }) as ListenSnapshot;
  const words = [[10, 10.6, 11, 11.3, 11.7, 11.9, 12.1, 12.4]];

  test('follows the real time of each word, not an estimate from the sentence', () => {
    // 3 s into a 4 s sentence the estimate would have lit nearly everything; the real word times say the voice is on "word".
    expect(plain.slice(0, saidOffsetOf(snapshot(11.4, words), 'l1', 0, plain))).toBe('Kokoro says each word');
    expect(plain.slice(0, saidOffsetOf(snapshot(12.5, words), 'l1', 0, plain))).toBe(plain);
  });

  test('a recording with sentence times only keeps the estimate; another sentence is not lit at all', () => {
    const estimated = saidOffsetOf(snapshot(12, undefined), 'l1', 0, plain);
    expect(estimated).toBeGreaterThan(0);
    expect(estimated).toBeLessThan(plain.length);
    expect(saidOffsetOf(snapshot(11.4, words), 'l1', 1, plain)).toBe(-1);
  });

  test('word times for different text (not one per word) fall back to the estimate instead of lighting the wrong word', () => {
    const wrong = [[10, 11, 12]];
    expect(saidOffsetOf(snapshot(12, wrong), 'l1', 0, plain)).toBe(saidOffsetOf(snapshot(12, undefined), 'l1', 0, plain));
  });
});

describe('"Back to reading" follows what the learner sees', () => {
  type Place = 'comfortable' | 'visible' | 'hidden';
  let place: Place = 'hidden';
  let latest: ReturnType<typeof useFollowAlong> | null = null;
  const screen = { current: { follow: (_view: unknown, _options: unknown, done?: (place: Place) => void) => done?.(place) } } as unknown as RefObject<ScreenHandle | null>;
  function Probe({ lessonId }: { lessonId: string }) {
    latest = useFollowAlong(screen, lessonId);
    return null;
  }

  test('it shows only while the part being read is off screen, and goes as soon as the learner scrolls to it', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session } = setup(found.lesson);
    jest.useFakeTimers();
    let now = 1_000_000;
    const dateNow = jest.spyOn(Date, 'now').mockImplementation(() => now);
    try {
      await render(<Probe lessonId={found.lesson.id} />);
      await act(async () => startListening(session, { rate: 1, online: true }));
      await act(async () => jumpToSegment(segments[3].index));
      expect(latest?.away).toBe(false);

      // The learner scrolls by hand to somewhere else: what is being read leaves the screen.
      latest?.suspend();
      place = 'hidden';
      now += 1000;
      await act(async () => latest?.recheck());
      expect(latest?.away).toBe(true);

      // They scroll back until the sentence is in view (even partly): the button goes at once, not at the next sentence.
      place = 'visible';
      now += 1000;
      await act(async () => latest?.recheck());
      expect(latest?.away).toBe(false);

      // Scrolling away again, a scroll event too soon after the last look is still judged when the scrolling pauses.
      place = 'hidden';
      now += 10;
      await act(async () => {
        latest?.recheck();
        jest.advanceTimersByTime(200);
      });
      expect(latest?.away).toBe(true);
    } finally {
      dateNow.mockRestore();
      jest.useRealTimers();
    }
  });

  test('when the learner has not scrolled by hand nothing is measured (the screen follows the voice itself)', async () => {
    const found = findLesson('starter-01');
    if (!found) throw new Error('starter-01 is missing');
    const { segments, session } = setup(found.lesson);
    await render(<Probe lessonId={found.lesson.id} />);
    await act(async () => startListening(session, { rate: 1, online: true }));
    await act(async () => jumpToSegment(segments[3].index));
    place = 'hidden';
    await act(async () => latest?.recheck());
    expect(latest?.away).toBe(false);
  });
});
