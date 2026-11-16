import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Arrow, CodeListing, NumberAdjust, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildCheckoutSteps, CLASS_NAMES, IMPLS, type ImplId } from './abstraction';
import { ClassBox } from './class-box';
import { oopStrings } from './strings';

export function AbstractionVisual({ compact }: VisualProps) {
  const t = useLocalized(oopStrings).abstraction;
  const theme = useTheme();
  const [impl, setImpl] = useState<ImplId>('card');
  const [amount, setAmount] = useState(100);
  const steps = buildCheckoutSteps(impl, amount, t);
  const stepper = useStepper(steps, { intervalMs: 1300 });
  const step = stepper.step;
  const concrete = IMPLS.filter((id) => id !== 'abstract');

  const codeActive = step.stage === 'start' ? [1] : step.stage === 'call' ? [2] : [];

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.implLabel} wrap value={impl} onChange={setImpl} options={IMPLS.map((id) => ({ value: id, label: t.impls[id] }))} />
          <NumberAdjust label={t.amountLabel} value={amount} min={1} max={500} step={5} onChange={setAmount} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <View style={[styles.code, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText type="caption" themeColor="textSecondary">{t.checkoutLabel}</ThemedText>
          <CodeListing lines={t.checkoutCode} active={codeActive} />
        </View>
        <View accessible accessibilityLabel={t.diagramLabel} style={styles.diagram}>
          <ClassBox name="PaymentMethod" stereotype={t.interfaceStereotype} methods={[{ text: 'pay(amount)', tag: t.abstractTag }]} dashed tone="violet" active={step.active === 'abstract'} />
          {concrete.map((id) => (
            <View key={id} style={styles.impl}>
              <Arrow direction="up" label={t.implements} />
              <ClassBox name={CLASS_NAMES[id]} tone="indigo" methods={id === 'broken' ? [{ text: t.noPayMethod, tag: t.notImplemented }] : [{ text: 'pay(amount)', highlight: step.active === id && step.stage === 'run' }]} active={step.active === id && step.stage !== 'run' && step.stage !== 'result'} provider={step.active === id && (step.stage === 'run' || step.stage === 'result')} />
            </View>
          ))}
        </View>
        <View style={styles.result}>
          <ThemedText type="caption" themeColor="textSecondary">{t.chargedLabel}</ThemedText>
          {step.failed ? <Tag text={t.failedLabel} tone="red" outlined marker="✗" /> : <Tag text={step.charged === null ? t.nothing : String(step.charged)} mono tone={step.charged === null ? 'neutral' : 'mint'} outlined={step.charged !== null} />}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.legend}</ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two },
  code: { gap: Spacing.one, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  diagram: { gap: 0, alignItems: 'stretch' },
  impl: { alignItems: 'stretch' },
  result: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
});
