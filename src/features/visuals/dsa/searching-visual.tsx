import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildSearchPairs, makeSearchArray } from './searching';
import { dsaStrings } from './strings';

type Preset = 'first' | 'middle' | 'last' | 'missing';

export function SearchingVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).searching;
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [size, setSize] = useState(11);
  const [target, setTarget] = useState(26);
  const values = makeSearchArray(size);
  const pairs = buildSearchPairs(values, target, t);
  const stepper = useStepper(pairs, { intervalMs: 1000 });
  const { linear, binary } = stepper.step;
  const cell = Math.max(22, Math.min(40, Math.floor((width - 3 * (size - 1)) / size)));

  const preset = (kind: Preset) => setTarget(kind === 'first' ? (values[0] ?? 0) : kind === 'middle' ? (values[Math.floor(size / 2)] ?? 0) : kind === 'last' ? (values[size - 1] ?? 0) : (values[Math.floor(size / 2)] ?? 0) + 1);
  const changeSize = (next: number) => {
    setSize(next);
    setTarget(makeSearchArray(next)[Math.floor(next / 2)] ?? 0);
  };

  const result = (done: boolean, found: number | null) => (!done ? t.resultRunning : found === null ? t.resultMissing : t.resultFound(found));

  const row = (kind: 'linear' | 'binary') => {
    const step = kind === 'linear' ? linear : binary;
    return (
      <View style={[styles.side, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessible accessibilityLabel={`${kind === 'linear' ? t.linearLabel : t.binaryLabel}: ${t.checks(step.checked)}, ${result(step.done, step.found)}`}>
        <View style={styles.sideHead}>
          <ThemedText type="cardTitle">{kind === 'linear' ? t.linearLabel : t.binaryLabel}</ThemedText>
          <Tag text={`${t.checks(step.checked)}: ${result(step.done, step.found)}`} tone={step.found !== null ? 'mint' : step.done ? 'red' : 'neutral'} outlined />
        </View>
        <View style={styles.cells}>
          {values.map((value, index) => {
            const isFound = step.found === index;
            let tone = tones.neutral;
            let note = '';
            let dim = false;
            if (kind === 'linear') {
              const here = (linear.index === index && !isFound);
              const past = linear.index !== null && index < linear.index;
              tone = isFound ? tones.mint : here ? tones.amber : tones.neutral;
              note = isFound ? '✓' : here ? '●' : past ? '✗' : '';
              dim = past;
            } else {
              const out = index < binary.low || index > binary.high;
              const mid = binary.mid === index;
              tone = isFound ? tones.mint : mid ? tones.amber : tones.neutral;
              note = isFound ? '✓' : mid ? t.lowHighLabel.mid : index === binary.low ? t.lowHighLabel.low : index === binary.high ? t.lowHighLabel.high : out ? '✗' : '';
              dim = out && !isFound;
            }
            return (
              <View key={index} style={[styles.cellWrap, { width: cell }]} accessible accessibilityLabel={`${t.indexWord} ${index}: ${value}${dim ? `, ${t.discarded}` : ''}`}>
                <View style={[styles.cell, { height: cell, backgroundColor: tone.soft, borderColor: isFound || (kind === 'linear' ? linear.index === index : binary.mid === index) ? tone.ink : theme.border }, dim && styles.dim]}>
                  <ThemedText type="caption" tabular style={{ color: tone.ink }}>
                    {value}
                  </ThemedText>
                </View>
                <ThemedText type="caption" themeColor="textSecondary" style={styles.note} numberOfLines={1}>
                  {note || ' '}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={`${t.linearLabel}: ${linear.caption} ${t.binaryLabel}: ${binary.caption}`}
      controls={
        <View style={styles.controls}>
          <View style={styles.adjusts}>
            <NumberAdjust label={t.sizeLabel} value={size} min={5} max={15} onChange={changeSize} />
            <NumberAdjust label={t.targetLabel} value={target} min={0} max={size * 3 + 3} onChange={setTarget} />
          </View>
          <ChipSelect label={t.presetsLabel} value={null} onChange={preset} options={(['first', 'middle', 'last', 'missing'] as const).map((value) => ({ value, label: t.presets[value] }))} />
          <PlayControls stepper={stepper} />
          <ThemedText type="caption" themeColor="textSecondary">
            {t.legend}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.sortedNote}
          </ThemedText>
        </View>
      }>
      <View onLayout={onLayout} style={styles.stage} accessibilityLabel={t.listLabel(values)}>
        {row('linear')}
        {row('binary')}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  stage: { gap: Spacing.two },
  side: { gap: Spacing.two, padding: Spacing.two, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  sideHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  cells: { flexDirection: 'row', gap: 3 },
  cellWrap: { alignItems: 'center' },
  cell: { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderCurve: 'continuous', borderWidth: 1.5 },
  dim: { opacity: 0.4 },
  note: { textAlign: 'center' },
});
