import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Toggle } from '@/components/ui/toggle';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { CodeListing, Legend, NumberAdjust, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildTrace, callCount, codeFor, INPUT_RANGE, RECURSION_FNS, type Frame, type RecursionFn } from './recursion-stack';
import { recursionStrings } from './recursion-stack-strings';

export function RecursionStackVisual({ compact }: VisualProps) {
  const t = useLocalized(recursionStrings);
  const theme = useTheme();
  const tones = useTones();
  const [fn, setFn] = useState<RecursionFn>('factorial');
  const [inputs, setInputs] = useState<Record<RecursionFn, number>>({ factorial: INPUT_RANGE.factorial.start, fibonacci: INPUT_RANGE.fibonacci.start, sum: INPUT_RANGE.sum.start, countdown: INPUT_RANGE.countdown.start });
  const [memo, setMemo] = useState(false);
  const n = inputs[fn];
  const memoOn = fn === 'fibonacci' && memo;
  // The trace is worked out from the inputs, so changing any of them rebuilds it and the stepper starts over.
  const trace = buildTrace({ fn, n, memo: memoOn }, t);
  const stepper = useStepper(trace, { intervalMs: 900 });
  const step = stepper.step;
  const range = INPUT_RANGE[fn];
  const code = codeFor(fn, memoOn);

  const frameTone = (frame: Frame, isTop: boolean): { tone: Tone; word: string } => {
    if (!isTop) return { tone: 'neutral', word: t.waiting };
    if (frame.returning) return { tone: 'mint', word: t.returning };
    if (frame.hit) return { tone: 'violet', word: t.memoHit };
    return { tone: 'amber', word: t.running };
  };

  const frames = [...step.stack].reverse();
  const complexity = fn === 'fibonacci' ? (memoOn ? t.complexity.fibonacciMemo : t.complexity.fibonacciPlain) : t.complexity[fn];

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect<RecursionFn> label={t.functionLabel} wrap value={fn} onChange={setFn} options={RECURSION_FNS.map((name) => ({ value: name, label: t.functionNames[name] }))} />
          <View style={styles.adjusts}>
            <NumberAdjust label={t.inputLabels[fn]} value={n} min={range.min} max={range.max} onChange={(next) => setInputs((current) => ({ ...current, [fn]: next }))} />
            {fn === 'fibonacci' ? (
              <View style={styles.toggleRow}>
                <ThemedText type="secondarySemiBold" style={styles.toggleLabel}>{t.memoLabel}</ThemedText>
                <Toggle value={memo} onValueChange={setMemo} accessibilityLabel={t.memoLabel} />
              </View>
            ) : null}
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.counters}>
          <Tag text={t.calls(step.calls)} tone="indigo" mono outlined />
          <Tag text={t.depth(step.stack.length, step.deepest)} tone="violet" mono />
        </View>
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">{t.codeLabel}</ThemedText>
          <CodeListing lines={code} active={step.line === null ? [] : [step.line]} />
        </View>
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">{t.stackLabel}</ThemedText>
          <View style={styles.stack} accessible accessibilityLabel={t.stackSummary(step.stack.map((frame) => frame.label))}>
            {frames.length === 0 ? (
              <ThemedText type="secondary" themeColor="textSecondary">{t.stackEmpty}</ThemedText>
            ) : (
              frames.map((frame, position) => {
                const { tone, word } = frameTone(frame, position === 0);
                const colors = tones[tone];
                return (
                  <View key={frame.id} style={[styles.frame, { backgroundColor: colors.soft, borderColor: position === 0 ? colors.ink : theme.border }, position === 0 && styles.frameTop]}>
                    <View style={styles.frameHead}>
                      <ThemedText type="codeInline" style={{ color: colors.ink }}>{frame.label}</ThemedText>
                      <ThemedText type="caption" style={{ color: colors.ink }}>{position === 0 ? `${t.top} · ${word}` : word}</ThemedText>
                    </View>
                    {frame.returning ? (
                      <ThemedText type="secondarySemiBold" tabular style={{ color: colors.ink }}>{frame.value === null ? t.returnsNothing : t.returnsValue(frame.value)}</ThemedText>
                    ) : frame.wait ? (
                      <ThemedText type="codeInline" themeColor="textSecondary">{frame.wait}</ThemedText>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        </View>
        {memoOn ? (
          <View style={styles.block}>
            <ThemedText type="caption" themeColor="textSecondary">{t.memoTitle}</ThemedText>
            {step.memo.length === 0 ? (
              <ThemedText type="caption" themeColor="textTertiary">{t.memoEmpty}</ThemedText>
            ) : (
              <View style={styles.tags}>
                {step.memo.map(([key, value]) => <Tag key={key} text={`fib(${key}) = ${value}`} mono tone="violet" />)}
              </View>
            )}
          </View>
        ) : null}
        {fn === 'countdown' ? (
          <View style={styles.block}>
            <ThemedText type="caption" themeColor="textSecondary">{t.outputLabel}</ThemedText>
            <ThemedText type="codeInline" tabular>{step.output.length === 0 ? t.outputEmpty : step.output.join(', ')}</ThemedText>
          </View>
        ) : null}
        {fn === 'fibonacci' ? <ThemedText type="secondary" themeColor="textSecondary">{t.fibCompare(n, callCount({ fn, n, memo: false }), callCount({ fn, n, memo: true }))}</ThemedText> : null}
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary">{t.complexityLabel}</ThemedText>
          <ThemedText type="secondarySemiBold">{complexity}</ThemedText>
        </View>
        {!compact ? (
          <Legend
            items={[
              { label: t.legend.running, tone: 'amber', marker: '●' },
              { label: t.legend.waiting, tone: 'neutral', marker: '…' },
              { label: t.legend.returning, tone: 'mint', marker: '↩' },
              ...(memoOn ? [{ label: t.legend.memoHit, tone: 'violet' as const, marker: '★' }] : []),
            ]}
          />
        ) : null}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: Spacing.three },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: 44 },
  toggleLabel: { flexShrink: 1 },
  stage: { gap: Spacing.three },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  block: { gap: Spacing.one },
  stack: { gap: Spacing.one },
  frame: { gap: Spacing.half, paddingHorizontal: Spacing.two + 2, paddingVertical: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  frameTop: { borderWidth: 2.5 },
  frameHead: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
});
