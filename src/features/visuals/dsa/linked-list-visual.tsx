import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, PlayControls } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { deleteAtSteps, deleteValueSteps, idleStep, insertAtSteps, insertHeadSteps, insertTailSteps, searchSteps, type ListStep } from './linked-list';
import { dsaStrings } from './strings';

const START = [3, 5, 8];

export function LinkedListVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).linkedList;
  const theme = useTheme();
  const tones = useTones();
  const [trace, setTrace] = useState<ListStep[]>(() => [idleStep(START, dsaStrings.en.linkedList.intro)]);
  const [value, setValue] = useState(7);
  const [index, setIndex] = useState(1);
  const stepper = useStepper(trace, { intervalMs: 1000 });
  const step = stepper.step;
  const settled = trace[trace.length - 1]?.values ?? START;
  const run = (build: (values: readonly number[]) => ListStep[]) => setTrace(build(settled));

  const nodeStyle = (position: number) => {
    const here = step.pointer === position;
    const tone = step.found === position ? tones.mint : step.doomed === position ? tones.red : step.fresh === position ? tones.violet : here ? tones.amber : tones.neutral;
    return { tone, strong: here || step.found === position || step.doomed === position || step.fresh === position };
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <View style={styles.adjusts}>
            <NumberAdjust label={t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
            <NumberAdjust label={t.indexLabel} value={index} min={0} max={8} onChange={setIndex} />
          </View>
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.head} onPress={() => run((values) => insertHeadSteps(values, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.tail} onPress={() => run((values) => insertTailSteps(values, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.at} onPress={() => run((values) => insertAtSteps(values, index, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.deleteAt} onPress={() => run((values) => deleteAtSteps(values, index, t))} />
            <Button size="small" variant="secondary" title={t.buttons.deleteValue} onPress={() => run((values) => deleteValueSteps(values, value, t))} />
            <Button size="small" variant="outline" title={t.buttons.search} onPress={() => run((values) => searchSteps(values, value, t))} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={() => setTrace([idleStep(START, t.intro)])} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} accessible accessibilityLabel={t.listLabel(step.values)}>
        {step.floating ? (
          <View style={styles.floatingRow}>
            <View style={[styles.node, { backgroundColor: tones.violet.soft, borderColor: tones.violet.ink }]}>
              <ThemedText type="secondarySemiBold" tabular style={{ color: tones.violet.ink }}>{step.floating.value}</ThemedText>
            </View>
            <ThemedText type="caption" themeColor="textSecondary">{`${t.newLabel} → ${step.floating.next === null ? t.nullLabel : `[${step.floating.next}]`}`}</ThemedText>
          </View>
        ) : null}
        {step.values.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">{t.emptyHint}</ThemedText>
        ) : (
          <View style={styles.chain}>
            {step.values.map((nodeValue, position) => {
              const { tone, strong } = nodeStyle(position);
              return (
                <View key={`${position}-${nodeValue}`} style={styles.item}>
                  <View style={styles.labels}>
                    <ThemedText type="caption" themeColor="primary">{position === 0 ? t.headLabel : ' '}</ThemedText>
                  </View>
                  <View style={styles.nodeRow}>
                    <View style={[styles.node, { backgroundColor: tone.soft, borderColor: strong ? tone.ink : theme.border }, strong && styles.nodeStrong]}>
                      <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>{nodeValue}</ThemedText>
                    </View>
                    <ThemedText type="secondary" themeColor="textSecondary">{position === step.values.length - 1 ? `→ ${t.nullLabel}` : '→'}</ThemedText>
                  </View>
                  <ThemedText type="caption" themeColor="primary">{step.pointer === position ? t.curLabel : ' '}</ThemedText>
                </View>
              );
            })}
          </View>
        )}
        <ThemedText type="caption" themeColor="textSecondary">{t.legend}</ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  floatingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  chain: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.two },
  item: { alignItems: 'flex-start' },
  labels: { minHeight: 16 },
  nodeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  node: { minWidth: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 2.5 },
});
