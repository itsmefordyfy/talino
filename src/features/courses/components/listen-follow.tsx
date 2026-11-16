import { createContext, use, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { StyleSheet, Text, View, type HostInstance, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { nameText } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useAppSelector } from '@/store/hooks';

import { getListenSnapshot, subscribeListen, type ListenSnapshot } from '../audio/listen-controller';
import type { LessonBlock } from '../content/types';
import { emphasizeKeyTerms } from '../lib/key-terms';
import { parseInline } from '../lib/plain-text';
import { sentenceRanges, sliceParts, type SegmentIndex } from '../lib/speech-segments';
import { activeFraction, saidOffset, saidOffsetAtTime } from '../lib/word-progress';
import { courseStrings } from '../strings';
import { InlineParts } from './inline-text';
import { useKeyTerms } from './key-terms-context';

/**
 * Follow-along reading: while a lesson is being listened to, the words already said in the part being read are highlighted word by word in the lesson's own text, what
 * was read in earlier parts is softer, and a tap on any sentence jumps the audio to it. The lesson screen provides this context; outside it (or for
 * a block that isn't spoken) every component here draws exactly what it drew before, with no handlers.
 *
 * Nothing here holds the audio's position. Each sentence subscribes to the one listener and re-renders only when ITS state changes
 * (upcoming → active → read), so following along costs a couple of small renders a sentence, not a render of the lesson.
 */
export type ListenFollowValue = {
  lessonId: string;
  index: SegmentIndex;
  /** The unit id of a block of the lesson body, or null when it isn't spoken (a block written for another level). */
  unitOfBlock: (block: LessonBlock) => string | null;
  /** The learner tapped a sentence: speak it now. */
  jump: (segment: number) => void;
  /** Lets the screen find where a part of the lesson is, to keep it in view. */
  register: (unit: string, node: HostInstance | null) => void;
};

const FollowContext = createContext<ListenFollowValue | null>(null);

export function ListenFollowProvider({ value, children }: { value: ListenFollowValue; children: ReactNode }) {
  return <FollowContext value={value}>{children}</FollowContext>;
}

export function useListenFollow(): ListenFollowValue | null {
  return use(FollowContext);
}

/**
 * `off`: nothing to show (not listening to this lesson, or the voice can't say where it is).
 * `said`: already spoken AND in the same part (paragraph, list item) as the sentence being spoken: it stays marked while its part is read,
 * so the words said so far in that part are all lit. `read`: spoken in an earlier part, so softer.
 */
export type SentenceState = 'off' | 'read' | 'said' | 'active' | 'upcoming';
/** A whole part of the lesson: `whole` when the active segment speaks all of it (a label, code, a table), `part` when it speaks a sentence of it. */
export type UnitState = 'off' | 'read' | 'upcoming' | 'part' | 'whole';

/** The active segment of the lesson being followed, or null when there is none to show. */
function activeOf(snapshot: ListenSnapshot, lessonId: string): number | null {
  const { session, state, activeSegment } = snapshot;
  if (!session || session.lessonId !== lessonId || session.kind === 'reply' || state === 'idle' || state === 'loading') return null;
  return activeSegment;
}

export function sentenceStateOf(snapshot: ListenSnapshot, lessonId: string, segment: number | null): SentenceState {
  const active = activeOf(snapshot, lessonId);
  if (active === null || segment === null) return 'off';
  if (segment > active) return 'upcoming';
  if (segment === active) return 'active';
  const segments = snapshot.session?.segments;
  const unit = segments?.[segment]?.unit;
  return unit && unit === segments?.[active]?.unit ? 'said' : 'read';
}

/** The word lights a hair before it is heard, as the sentence does (the controller's LEAD_SECONDS). */
const WORD_LEAD_SECONDS = 0.05;

/**
 * How much of the sentence being spoken has been said, as an offset into its own text: the words up to it are lit. -1 when this sentence
 * isn't the one being spoken; the whole length when the voice can't say where it is inside the sentence (then all of it is lit, as before).
 */
export function saidOffsetOf(snapshot: ListenSnapshot, lessonId: string, segment: number | null, plain: string): number {
  if (sentenceStateOf(snapshot, lessonId, segment) !== 'active') return -1;
  // A recording that knows when each word starts: the word being spoken, exactly.
  if (snapshot.mode === 'recording' && snapshot.timing?.words && segment !== null) {
    const exact = saidOffsetAtTime(plain, snapshot.timing.words[segment], snapshot.position + WORD_LEAD_SECONDS);
    if (exact !== null) return exact;
  }
  const fraction = activeFraction(snapshot);
  return fraction === null ? plain.length : saidOffset(plain, fraction);
}

export function unitStateOf(snapshot: ListenSnapshot, follow: Pick<ListenFollowValue, 'lessonId' | 'index'>, unit: string): UnitState {
  const active = activeOf(snapshot, follow.lessonId);
  const range = follow.index.range(unit);
  if (active === null || !range) return 'off';
  if (active < range[0]) return 'upcoming';
  if (active > range[1]) return 'read';
  return follow.index.whole(unit) === active ? 'whole' : 'part';
}

/** The unit holding the active segment (for keeping it in view), or null. */
export function activeUnitOf(snapshot: ListenSnapshot, lessonId: string): string | null {
  const active = activeOf(snapshot, lessonId);
  return active === null ? null : (snapshot.session?.segments[active]?.unit ?? null);
}

function useSentenceState(segment: number | null): SentenceState {
  const follow = useListenFollow();
  return useSyncExternalStore(subscribeListen, () => (follow ? sentenceStateOf(getListenSnapshot(), follow.lessonId, segment) : 'off'));
}

function useSaidOffset(segment: number | null, plain: string): number {
  const follow = useListenFollow();
  // A number, so the sentence re-renders only when another word has been said.
  return useSyncExternalStore(subscribeListen, () => (follow ? saidOffsetOf(getListenSnapshot(), follow.lessonId, segment, plain) : -1));
}

function useUnitState(unit: string | null): UnitState {
  const follow = useListenFollow();
  return useSyncExternalStore(subscribeListen, () => (follow && unit ? unitStateOf(getListenSnapshot(), follow, unit) : 'off'));
}

/** True while the voice is describing this part of the lesson (a visual that should be shown and played while it is explained). */
export function useUnitSpeaking(unit: string | null): boolean {
  const state = useUnitState(unit);
  return state === 'whole' || state === 'part';
}

/** True while the voice is somewhere inside the parts of a lesson block whose units start with `prefix` (a "show more" opens as it is read). */
export function useSpeakingInside(prefix: string | null): boolean {
  const follow = useListenFollow();
  return useSyncExternalStore(subscribeListen, () => {
    if (!follow || !prefix) return false;
    const unit = activeUnitOf(getListenSnapshot(), follow.lessonId);
    return !!unit && unit.startsWith(`${prefix}-`);
  });
}

export type SpokenTextProps = Omit<ThemedTextProps, 'children'> & {
  /** The lesson text, with its **bold** and `code` marks. */
  text: string;
  /** Which part of the lesson this is (`lessonSegments`' unit ids); without one (or when it isn't spoken) it is plain lesson text. */
  unit?: string | null;
  /** Reading text (a paragraph, a list item): the lesson's key terms in it are drawn bold. Never set on titles, headings or labels. */
  keyTerms?: boolean;
};

/** Lesson text whose sentences light up as they are spoken and jump the audio when tapped. */
export function SpokenText({ text, unit, keyTerms = false, ...rest }: SpokenTextProps) {
  const follow = useListenFollow();
  const companion = useAppSelector(selectCompanion);
  const strings = useLocalized(courseStrings);
  const state = useUnitState(unit ?? null);
  const terms = useKeyTerms();
  // Bolding only re-cuts the parts; their characters are the same, so the sentence ranges and word offsets below are unchanged.
  const emphasize = (parsed: ReturnType<typeof parseInline>) => (keyTerms ? emphasizeKeyTerms(parsed, terms) : parsed);
  const parts = emphasize(parseInline(text));
  const spoken = !!follow && !!unit && follow.index.range(unit) !== null;
  if (!spoken) {
    return (
      <ThemedText {...rest}>
        <InlineParts parts={emphasize(parseInline(nameText(text, companion)))} />
      </ThemedText>
    );
  }
  const plain = parts.map((part) => part.text).join('');
  const live = state !== 'off';
  const first = follow.index.first(unit);
  // A title, a heading or a label is spoken as one whole line, not as sentences: the text just lights up as a whole while it is read, and a tap jumps to it.
  const whole = follow.index.ofSentence(unit, 0) === null ? follow.index.whole(unit) : null;
  if (whole !== null) {
    return (
      <ThemedText {...rest} onPress={live ? () => follow.jump(whole) : undefined} accessibilityHint={live ? strings.listenTapHint : undefined}>
        <Sentence segment={whole} parts={parts.map((part) => ({ ...part, text: nameText(part.text, companion) }))} wholeLine />
      </ThemedText>
    );
  }
  const ranges = sentenceRanges(plain);
  const pieces: ReactNode[] = [];
  let at = 0;
  ranges.forEach((range, sentence) => {
    const segment = follow.index.ofSentence(unit, sentence);
    if (range.start > at) pieces.push(nameText(plain.slice(at, range.start), companion));
    const sliced = sliceParts(parts, range.start, range.end).map((part) => ({ ...part, text: nameText(part.text, companion) }));
    pieces.push(<Sentence key={sentence} segment={segment} parts={sliced} />);
    at = range.end;
  });
  if (at < plain.length) pieces.push(nameText(plain.slice(at), companion));
  return (
    // The whole paragraph is also a target (and what a screen reader activates): it starts the unit from its first sentence.
    <ThemedText {...rest} onPress={live && first !== null ? () => follow.jump(first) : undefined} accessibilityHint={live ? strings.listenTapHint : undefined}>
      {pieces}
    </ThemedText>
  );
}

function Sentence({ segment, parts, wholeLine = false }: { segment: number | null; parts: Parameters<typeof InlineParts>[0]['parts']; wholeLine?: boolean }) {
  const follow = useListenFollow();
  const theme = useTheme();
  const state = useSentenceState(segment);
  const plain = parts.map((part) => part.text).join('');
  const said = useSaidOffset(segment, plain);
  const onPress = state !== 'off' && segment !== null && follow ? () => follow.jump(segment) : undefined;
  // Color is never the only cue: the words already said have their own background (no bar or box beside the text).
  // In the sentence being spoken only the words said so far are lit, and the rest of it is plain until the voice gets there.
  // A whole line (a title, a label) is lit all at once: what is spoken can differ a little from what is written, so no word-by-word guess.
  if (state === 'active' && !wholeLine && said >= 0 && said < plain.length) {
    return (
      <Text suppressHighlighting onPress={onPress}>
        {said > 0 && (
          <Text suppressHighlighting style={{ backgroundColor: theme.listenHighlight }}>
            <InlineParts parts={sliceParts(parts, 0, said)} />
          </Text>
        )}
        <InlineParts parts={sliceParts(parts, said, plain.length)} />
      </Text>
    );
  }
  return (
    <Text suppressHighlighting onPress={onPress} style={state === 'active' || state === 'said' ? { backgroundColor: theme.listenHighlight } : state === 'read' ? { color: theme.listenRead } : undefined}>
      <InlineParts parts={parts} />
    </Text>
  );
}

export type SpeakFrameProps = {
  /** The part of the lesson this wraps; without one (or when it isn't spoken) it is just a view with `style` (or nothing, with no style). */
  unit?: string | null;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** `none` for text that only lights up as it is read (a title, a heading, a label): the part is still found and scrolled to, but no ring is drawn round it. */
  marker?: 'frame' | 'none';
};

/**
 * Marks a part of the lesson while it is being spoken: a ring round it when the whole part is what is being said (a code example, a
 * table, a diagram). Text never gets a bar or a box: it only lights up (`marker="none"`, and paragraphs draw no frame at all). It also tells the screen where the part is, so the lesson can scroll to keep it in view.
 */
export function SpeakFrame({ unit, children, style, marker = 'frame' }: SpeakFrameProps) {
  const follow = useListenFollow();
  const theme = useTheme();
  const state = useUnitState(unit ?? null);
  const node = useRef<HostInstance>(null);
  const register = follow?.register;
  useEffect(() => {
    if (!register || !unit) return;
    register(unit, node.current);
    return () => register(unit, null);
  }, [register, unit]);
  // Not followed (not listening, or this part isn't spoken): exactly the view it replaced, so layout never depends on listening.
  if (!follow || !unit || follow.index.range(unit) === null) return style ? <View style={style}>{children}</View> : <>{children}</>;
  return (
    <View ref={node} collapsable={false} style={style}>
      {children}
      {marker === 'frame' && state === 'whole' && <View pointerEvents="none" style={[styles.ring, { borderColor: theme.listenAccent }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
});
