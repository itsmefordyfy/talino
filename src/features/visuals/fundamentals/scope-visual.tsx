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
import type { VisualProps } from '../types';
import { CodeListing, NumberAdjust, Panel, PlayControls, Tag } from './parts';
import { buildScopeSteps, SCOPE_PROGRAMS, SCOPE_SOURCE, visibleScopes, type ScopeProgramId } from './scope';
import { fundamentalsStrings } from './strings';

export function ScopeVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).scope;
  const theme = useTheme();
  const tones = useTones();
  const [program, setProgram] = useState<ScopeProgramId>('function');
  const [arg, setArg] = useState(5);
  const steps = buildScopeSteps(program, arg, t);
  const stepper = useStepper(steps, { intervalMs: 1300 });
  const step = stepper.step;
  const source = SCOPE_SOURCE[program].map((line) => line.replace('ARG', String(arg)));
  const chain = visibleScopes(step.frames);

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.programLabel} wrap value={program} onChange={setProgram} options={SCOPE_PROGRAMS.map((id) => ({ value: id, label: t.programNames[id] }))} />
          {program === 'function' ? <NumberAdjust label={t.argLabel} value={arg} min={0} max={20} onChange={setArg} /> : null}
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <Panel label={t.codeLabel}>
          <CodeListing lines={source} active={[step.line]} />
        </Panel>
        <Panel label={t.stackLabel}>
          {[...step.frames].reverse().map((frame, index) => (
            <Tag key={`${frame.name}-${index}`} text={index === 0 ? `▶ ${frame.name === 'global' ? t.frameGlobal : t.frameCall(frame.name)}` : frame.name === 'global' ? t.frameGlobal : t.frameCall(frame.name)} mono tone={index === 0 ? 'violet' : 'neutral'} outlined={index === 0} />
          ))}
        </Panel>
        <Panel label={t.chainLabel}>
          {chain.map((scope) => (
            <View key={scope.label} style={[styles.scope, { borderColor: theme.border, backgroundColor: theme.background }]}>
              <ThemedText type="caption" themeColor="textSecondary">{scope.label}</ThemedText>
              <View style={styles.vars}>
                {scope.vars.length === 0 ? <ThemedText type="secondary" themeColor="textTertiary">–</ThemedText> : null}
                {scope.vars.map((variable) => {
                  const focused = step.focus?.name === variable.name && step.focus.scope === scope.label;
                  return (
                    <View key={variable.name} style={variable.shadowed ? styles.shadowed : undefined} accessible accessibilityLabel={`${variable.name} = ${variable.value}${variable.shadowed ? `, ${t.shadowedWord}` : ''}`}>
                      <Tag text={`${variable.name} = ${variable.value}${variable.shadowed ? ` (${t.shadowedWord})` : ''}`} mono tone={focused ? 'amber' : variable.shadowed ? 'neutral' : 'mint'} outlined={focused} dim={variable.shadowed} />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
          <ThemedText type="caption" themeColor="textSecondary">{t.hiddenNote}</ThemedText>
        </Panel>
        <View style={[styles.output, { backgroundColor: step.error ? tones.red.soft : theme.backgroundElement, borderColor: step.error ? tones.red.ink : theme.border }]}>
          <ThemedText type="caption" themeColor="textSecondary">{t.outputLabel}</ThemedText>
          {step.output.length === 0 && !step.error ? <ThemedText type="secondary" themeColor="textTertiary">{t.noOutput}</ThemedText> : null}
          {step.output.map((line, index) => <ThemedText key={`${index}-${line}`} type="code">{line}</ThemedText>)}
          {step.error ? <ThemedText type="code" style={{ color: tones.red.ink }}>{step.error}</ThemedText> : null}
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  stage: { gap: Spacing.two },
  scope: { gap: Spacing.one, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  vars: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  shadowed: { opacity: 0.75 },
  output: { gap: 2, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
});
