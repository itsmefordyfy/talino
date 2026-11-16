import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Motion, MinTouchSize, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { stripInlineMarkup } from '../lib/text';
import { RichText } from './rich-text';

/**
 * One look per state, never one look for everything:
 * `idle` a quiet outlined card, `selected` the violet pick (soft fill, violet border, filled mark),
 * `correct` mint, `incorrect` red, `partial` amber (a reasonable but not best answer).
 */
export type ChoiceState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'partial';

export type ChoiceCardProps = {
  /** The option's words; `**bold**` and `` `code` `` are drawn as such. */
  title: string;
  /** More under the title (what happened if you chose this). */
  detail?: string;
  /** A letter or number in a round badge at the left (the moments of a matching activity). */
  badge?: string;
  /**
   * `single`: a round radio mark, `multiple`: a square checkbox mark, `action`: no mark (tapping the card is the answer).
   */
  mode: 'single' | 'multiple' | 'action';
  state?: ChoiceState;
  /** Can't be pressed. Looks unchanged unless `muted`, so a finished card stays readable. */
  disabled?: boolean;
  /** Faded out: not available right now (a limit that is already matched, an option already tried). */
  muted?: boolean;
  onPress: () => void;
  /** Overrides the spoken label (default: the title, then the detail). */
  accessibilityLabel?: string;
  /** Said after the label: "selected", "matched with A". */
  accessibilityHint?: string;
  /** The title is program text (an output, a line of code): drawn as is in the code font, never read for `**bold**` or backticks. */
  literal?: boolean;
  /** Room for more inside the card, under the text (a chooser, a tag, an explanation). */
  children?: ReactNode;
};

const STATE_ICON: Record<Exclude<ChoiceState, 'idle'>, IconName> = {
  selected: 'check',
  correct: 'check',
  incorrect: 'close',
  partial: 'remove',
};

/** The soft fill, border and ink of a state, from the theme (light and dark). Exported for the pieces that sit inside a card. */
export function choiceColors(state: ChoiceState, theme: ThemeColors) {
  switch (state) {
    case 'selected':
      return { fill: theme.primarySoft, line: theme.primary, ink: theme.onPrimary, mark: theme.primary };
    case 'correct':
      return { fill: theme.statusOkSoft, line: theme.statusOk, ink: theme.onPrimary, mark: theme.statusOk };
    case 'incorrect':
      return { fill: theme.statusDangerSoft, line: theme.danger, ink: theme.onPrimary, mark: theme.danger };
    case 'partial':
      return { fill: theme.statusWarnSoft, line: theme.statusWarn, ink: theme.onPrimary, mark: theme.statusWarn };
    default:
      return { fill: theme.backgroundElement, line: theme.border, ink: theme.textSecondary, mark: 'transparent' };
  }
}

/**
 * The state tint of a card: a layer over a card whose border never changes width, so taking a state never moves the cards
 * around it. It fades in (instantly with Reduce Motion). Put it first inside a card that has `choiceSurface` and `overflow: hidden`.
 */
export function ChoiceTint({ state }: { state: ChoiceState }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const active = state !== 'idle';
  const colors = choiceColors(state, theme);
  const tint = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    tint.value = reduceMotion ? (active ? 1 : 0) : withTiming(active ? 1 : 0, { duration: Motion.quick, easing: Easing.out(Easing.cubic) });
  }, [active, reduceMotion, tint]);
  const tintStyle = useAnimatedStyle(() => ({ opacity: tint.value }));
  return <Animated.View pointerEvents="none" style={[styles.tint, { backgroundColor: colors.fill, borderColor: colors.line }, tintStyle]} />;
}

/** The base look of every choice card (size, radius, quiet border); the tint goes on top. */
export const choiceSurface = (theme: ThemeColors) => [styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }] as const;

/** The round or square mark at the right of a card, popping once when it takes a state. */
export function ChoiceMark({ mode, state }: { mode: 'single' | 'multiple'; state: ChoiceState }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const active = state !== 'idle';
  const colors = choiceColors(state, theme);
  const pop = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    pop.value = reduceMotion || !active ? (active ? 1 : 0) : withSpring(1, { damping: 12, stiffness: 260, mass: 0.6 });
  }, [active, state, reduceMotion, pop]);
  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.6 + 0.4 * pop.value }], opacity: 0.4 + 0.6 * pop.value }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.mark, mode === 'single' ? styles.round : styles.square, { borderColor: active ? colors.mark : theme.textTertiary, backgroundColor: active ? colors.mark : 'transparent' }, active && markStyle]}>
      {active && <Icon name={STATE_ICON[state as Exclude<ChoiceState, 'idle'>]} size={16} tint={colors.ink} />}
    </Animated.View>
  );
}

/** The round letter at the left of a card: grey while idle, in the state's color once it has one. */
export function ChoiceBadge({ label, state }: { label: string; state: ChoiceState }) {
  const theme = useTheme();
  const active = state !== 'idle';
  const colors = choiceColors(state, theme);
  return (
    <View style={[styles.badge, { backgroundColor: active ? colors.mark : theme.backgroundSelected }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <ThemedText type="caption" style={{ color: active ? colors.ink : theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

/**
 * A choice that is clearly a choice: the whole card is the target (at least 56 pt), its state is the fill, the border and
 * a mark (never the color alone), and it eases between states (instantly with Reduce Motion).
 */
export function ChoiceCard({ title, detail, badge, mode, state = 'idle', disabled = false, muted = false, onPress, accessibilityLabel, accessibilityHint, literal = false, children }: ChoiceCardProps) {
  const theme = useTheme();
  const stateWord = state === 'selected' ? 'selected' : state === 'correct' ? 'correct' : state === 'incorrect' ? 'not right' : state === 'partial' ? 'partly right' : '';
  const label = accessibilityLabel ?? `${literal ? title : stripInlineMarkup(title)}${detail ? `. ${stripInlineMarkup(detail)}` : ''}`;
  const role = mode === 'multiple' ? 'checkbox' : mode === 'single' ? 'radio' : 'button';

  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: state === 'selected', checked: mode === 'action' ? undefined : state === 'selected' || state === 'correct', disabled }}
      accessibilityValue={stateWord ? { text: stateWord } : undefined}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [...choiceSurface(theme), muted && styles.muted, pressed && styles.pressed]}>
      <ChoiceTint state={state} />
      <View style={styles.row}>
        {badge !== undefined && <ChoiceBadge label={badge} state={state} />}
        <View style={styles.text}>
          {literal ? <ThemedText type="code">{title}</ThemedText> : <RichText type="bodySemiBold" text={title} />}
          {detail ? <RichText type="secondary" themeColor="textSecondary" text={detail} /> : null}
        </View>
        {mode !== 'action' && <ChoiceMark mode={mode} state={state} />}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    minHeight: MinTouchSize + Spacing.three,
    paddingVertical: Spacing.three - 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  tint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: Radius.large, borderCurve: 'continuous', borderWidth: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  text: { flex: 1, gap: 2 },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  round: { borderRadius: 12 },
  square: { borderRadius: 7 },
  muted: { opacity: 0.5 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
