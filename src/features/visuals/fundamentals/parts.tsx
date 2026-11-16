import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { breakLigatures } from '@/lib/highlight';
import { useTones } from '@/hooks/use-tones';
import { useLocalized } from '@/hooks/use-strings';

import { StepControls } from '../components/step-controls';
import type { Stepper } from '../components/use-stepper';
import { fundamentalsStrings } from './strings';

/** The width the picture can use, measured from its own layout (visuals never assume a screen size). */
export function useMeasuredWidth(initial = 280) {
  const [width, setWidth] = useState(initial);
  return {
    width,
    onLayout: (event: LayoutChangeEvent) => {
      const next = Math.floor(event.nativeEvent.layout.width);
      if (next > 0 && next !== width) setWidth(next);
    },
  };
}

export type PanelProps = { label?: string; children: ReactNode; style?: StyleProp<ViewStyle> };

/** A quiet card inside the stage, with a small label. */
export function Panel({ label, children, style }: PanelProps) {
  const theme = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, style]}>
      {label ? (
        <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">
          {label}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

export type TagProps = {
  text: string;
  tone?: Tone;
  /** Draw the border in the tone's ink (a chosen or active thing), so state never rests on color alone with the marker. */
  outlined?: boolean;
  mono?: boolean;
  dim?: boolean;
  /** A small prefix glyph such as a check or an arrow, so the state has a shape as well as a color. */
  marker?: string;
  style?: StyleProp<ViewStyle>;
};

/** A small labelled box: a value, a variable, a node. */
export function Tag({ text, tone = 'neutral', outlined = false, mono = false, dim = false, marker, style }: TagProps) {
  const tones = useTones();
  const theme = useTheme();
  const colors = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: colors.soft, borderColor: outlined ? colors.ink : theme.border }, outlined && styles.tagOutlined, dim && styles.dim, style]}>
      <ThemedText type={mono ? 'codeInline' : 'secondarySemiBold'} style={{ color: colors.ink }}>
        {marker ? `${marker} ${text}` : text}
      </ThemedText>
    </View>
  );
}

export type NumberAdjustProps = { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void };

/** A number the learner nudges with minus and plus (no keyboard, so it works anywhere). */
export function NumberAdjust({ label, value, min, max, step = 1, onChange }: NumberAdjustProps) {
  const t = useLocalized(fundamentalsStrings).common;
  return (
    <View style={styles.adjust} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ min, max, now: value }} accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]} onAccessibilityAction={(event) => onChange(Math.min(max, Math.max(min, value + (event.nativeEvent.actionName === 'increment' ? step : -step))))}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.adjustRow}>
        <IconButton icon="remove" accessibilityLabel={t.decrease(label)} disabled={value <= min} onPress={() => onChange(Math.max(min, value - step))} />
        <ThemedText type="statSmall" tabular style={styles.adjustValue}>
          {value}
        </ThemedText>
        <IconButton icon="add" accessibilityLabel={t.increase(label)} disabled={value >= max} onPress={() => onChange(Math.min(max, value + step))} />
      </View>
    </View>
  );
}

export type CodeListingProps = {
  lines: readonly string[];
  /** 1-based lines being run now. */
  active?: readonly number[];
  /** 1-based lines already run. */
  done?: readonly number[];
};

/** A small numbered listing with the running line marked by a bar and an arrow (shape, not just color). */
export function CodeListing({ lines, active = [], done = [] }: CodeListingProps) {
  const theme = useTheme();
  return (
    <View accessibilityRole="text" accessibilityLabel={lines.join('. ')} style={styles.listing}>
      {lines.map((line, index) => {
        const number = index + 1;
        const on = active.includes(number);
        return (
          <View key={number} style={[styles.codeLine, on && { backgroundColor: theme.primarySoft, borderLeftColor: theme.primary }]}>
            <ThemedText type="caption" themeColor={on ? 'primary' : 'textTertiary'} tabular style={styles.lineNumber}>
              {on ? '▶' : number}
            </ThemedText>
            <ThemedText type="code" themeColor={on ? 'text' : done.includes(number) ? 'textSecondary' : 'codeText'} style={styles.codeText}>
              {line === '' ? ' ' : breakLigatures(line)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

export type LegendItem = { label: string; tone: Tone; marker: string };

/** What each color and symbol means, in words. */
export function Legend({ items }: { items: readonly LegendItem[] }) {
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <Tag key={item.label} text={item.label} marker={item.marker} tone={item.tone} outlined />
      ))}
    </View>
  );
}

/** Back, Play, Next and Reset plus a jump to the last step. */
export function PlayControls({ stepper, hidePlay = false, endLabel }: { stepper: Stepper<unknown>; hidePlay?: boolean; endLabel?: string }) {
  const t = useLocalized(fundamentalsStrings).common;
  return (
    <View style={styles.controls}>
      <StepControls stepper={stepper} hidePlay={hidePlay} />
      <Button title={endLabel ?? t.skipToEnd} icon="skip_next" size="small" variant="ghost" disabled={stepper.atEnd} onPress={() => stepper.goTo(stepper.count - 1)} />
    </View>
  );
}

/** A thin arrow between two boxes, with an optional word on it ("extends", "has", "yes"). */
export function Arrow({ label, direction = 'down' }: { label?: string; direction?: 'down' | 'up' | 'right' }) {
  const glyph = direction === 'down' ? 'arrow_downward' : direction === 'up' ? 'arrow_upward' : 'arrow_forward';
  return (
    <View style={direction === 'right' ? styles.arrowRow : styles.arrowCol} accessible={false}>
      <Icon name={glyph} size={16} color="textSecondary" />
      {label ? (
        <ThemedText type="caption" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

/** A tappable option that is not a chip (a node, a bar, a cell): one place for roles and the 44 pt target. */
export function CellButton({ label, onPress, children, selected, style }: { label: string; onPress: () => void; children: ReactNode; selected?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.cellButton, pressed && styles.dim, style]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: { gap: Spacing.two, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  tag: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth, alignSelf: 'flex-start' },
  tagOutlined: { borderWidth: 1.5 },
  dim: { opacity: 0.5 },
  adjust: { gap: Spacing.one },
  adjustRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  adjustValue: { minWidth: 36, textAlign: 'center' },
  listing: { gap: 1 },
  codeLine: { flexDirection: 'row', gap: Spacing.two, paddingVertical: 1, paddingRight: Spacing.two, borderLeftWidth: 3, borderLeftColor: 'transparent', borderRadius: 4 },
  lineNumber: { width: 22, textAlign: 'right' },
  codeText: { flex: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  controls: { gap: Spacing.one },
  arrowCol: { alignItems: 'center', paddingVertical: 2 },
  arrowRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cellButton: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
});
