import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { buildFunctionSteps, callText, FUNCTION_PRESETS, functionSource, type FunctionStep } from './functions';
import { Arrow, CodeListing, Panel, PlayControls, Tag } from './parts';
import { fundamentalsStrings } from './strings';

const EMPTY: readonly FunctionStep[] = [];

export function FunctionsVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).functions;
  const theme = useTheme();
  const tones = useTones();
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = FUNCTION_PRESETS[presetIndex] ?? FUNCTION_PRESETS[0]!;
  const [args, setArgs] = useState<string[]>(() => preset.params.map((param) => param.initial));
  const build = buildFunctionSteps(preset, args, t);
  const stepper = useStepper(build.ok ? build.steps : EMPTY, { intervalMs: 1200 });
  const step = build.ok ? stepper.step : null;

  const choose = (id: string) => {
    const index = FUNCTION_PRESETS.findIndex((entry) => entry.id === id);
    const next = FUNCTION_PRESETS[index];
    if (!next) return;
    setPresetIndex(index);
    setArgs(next.params.map((param) => param.initial));
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={build.ok ? (step?.caption ?? '') : build.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.functionLabel} value={preset.id} onChange={choose} options={FUNCTION_PRESETS.map((entry) => ({ value: entry.id, label: t.presetNames[entry.id] }))} />
          {preset.params.map((param, index) => (
            <TextField key={`${preset.id}-${param.name}`} label={t.argumentLabel(param.name)} value={args[index] ?? ''} autoCapitalize="none" autoCorrect={false} keyboardType={param.kind === 'number' ? 'numbers-and-punctuation' : 'default'} onChangeText={(text) => setArgs(args.map((arg, position) => (position === index ? text : arg)))} error={!build.ok && build.param === param.name ? t.badNumber(param.name) : null} />
          ))}
          {build.ok ? <PlayControls stepper={stepper} /> : null}
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.row}>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.callLabel}
          </ThemedText>
          <ThemedText type="codeInline">{callText(preset, args)}</ThemedText>
        </View>
        <Panel label={t.inputLabel}>
          <View style={styles.tags}>
            {step && step.inputs.length > 0 ? step.inputs.map((input, index) => <Tag key={`${index}-${input}`} text={input} mono tone="indigo" outlined />) : <ThemedText type="secondary" themeColor="textSecondary">{t.noneYet}</ThemedText>}
          </View>
        </Panel>
        <Arrow />
        <View style={[styles.machine, { borderColor: tones.violet.ink, backgroundColor: tones.violet.soft }]}>
          <ThemedText type="cardTitle" style={{ color: tones.violet.ink }}>{`${t.machineLabel}: ${preset.name}`}</ThemedText>
          <View style={styles.tags}>
            <ThemedText type="caption" themeColor="textSecondary">{t.parametersLabel}</ThemedText>
            {step && step.bound.length > 0 ? step.bound.map((item) => <Tag key={item.name} text={`${item.name} = ${item.value}`} mono tone="violet" outlined />) : <ThemedText type="secondary" themeColor="textSecondary">{t.noneYet}</ThemedText>}
          </View>
          <View style={styles.tags}>
            <ThemedText type="caption" themeColor="textSecondary">{t.localsLabel}</ThemedText>
            {step && step.locals.length > 0 ? step.locals.map((item) => <Tag key={item.name} text={`${item.name} = ${item.value}`} mono tone="mint" />) : <ThemedText type="secondary" themeColor="textSecondary">{t.noneYet}</ThemedText>}
          </View>
          <View style={[styles.code, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <CodeListing lines={functionSource(preset)} active={step?.line ? [step.line] : []} />
          </View>
        </View>
        <Arrow />
        <Panel label={t.outputLabel}>
          {step?.output ? <Tag text={step.output} mono tone="mint" outlined marker="↩" /> : <ThemedText type="secondary" themeColor="textSecondary">{t.noOutput}</ThemedText>}
        </Panel>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two, alignItems: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  machine: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.large, borderCurve: 'continuous', borderWidth: 2 },
  code: { padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
});
