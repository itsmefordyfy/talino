import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Arrow, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { ClassBox } from './class-box';
import { buildInheritanceSteps, CLASS_IDS, CLASSES, METHOD_NAMES, type ClassId, type MethodName } from './inheritance';
import { oopStrings } from './strings';

export function InheritanceVisual({ compact }: VisualProps) {
  const t = useLocalized(oopStrings).inheritance;
  const [cls, setCls] = useState<ClassId>('Puppy');
  const [method, setMethod] = useState<MethodName>('speak');
  const steps = buildInheritanceSteps(cls, method, t);
  const stepper = useStepper(steps, { intervalMs: 1200 });
  const step = stepper.step;

  const box = (id: ClassId) => {
    const def = CLASSES.find((entry) => entry.id === id)!;
    const parentDef = def.parent ? CLASSES.find((entry) => entry.id === def.parent) : null;
    return (
      <ClassBox
        name={id}
        tone={id === cls ? 'violet' : 'indigo'}
        active={step.checking === id}
        provider={step.running.includes(id)}
        methods={(Object.keys(def.methods) as MethodName[]).map((name) => ({ text: `${name}()`, tag: parentDef?.methods[name] ? t.overrides : undefined, highlight: name === method && (step.checking === id || step.running.includes(id)) }))}
      />
    );
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.classLabel} wrap value={cls} onChange={setCls} options={CLASS_IDS.map((id) => ({ value: id, label: id }))} />
          <ChipSelect label={t.methodLabel} wrap value={method} onChange={setMethod} options={METHOD_NAMES.map((name) => ({ value: name, label: `${name}()` }))} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} accessible accessibilityLabel={t.diagramLabel}>
        <View style={styles.center}>{box('Animal')}</View>
        <View style={styles.columns}>
          <View style={styles.column}>
            <Arrow direction="up" label={t.extends} />
            {box('Dog')}
            <Arrow direction="up" label={t.extends} />
            {box('Puppy')}
          </View>
          <View style={styles.column}>
            <Arrow direction="up" label={t.extends} />
            {box('Cat')}
          </View>
        </View>
        <View style={styles.result}>
          <ThemedText type="caption" themeColor="textSecondary">{t.outputLabel}</ThemedText>
          {step.failed ? <Tag text={t.failedLabel} tone="red" outlined /> : <Tag text={step.output === null ? t.nothing : `"${step.output}"`} mono tone={step.output === null ? 'neutral' : 'mint'} outlined={step.output !== null} />}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.legend}</ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two },
  center: { alignItems: 'center' },
  columns: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  column: { flex: 1, gap: 0, alignItems: 'stretch' },
  result: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
});
