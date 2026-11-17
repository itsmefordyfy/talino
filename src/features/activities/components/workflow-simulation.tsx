import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { SimulatedRun } from '../lib/workflow';
import type { WorkflowText } from '../workflow-strings';
import { LaneTag } from './workflow-lane';

export type WorkflowSimulationProps = { run: SimulatedRun; text: WorkflowText };

/**
 * A hand-written sample request walked through the learner's steps, one press at a time. It always carries the badge "Simulated run, not a real model":
 * nothing here came from a model, and the line for a step the example did not write is generic and marked so.
 */
export function WorkflowSimulation({ run, text }: WorkflowSimulationProps) {
  const theme = useTheme();
  const [shown, setShown] = useState(0);
  const finished = shown >= run.steps.length;
  return (
    <View style={[styles.panel, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessibilityLabel={`${text.simulationTitle}. ${text.simulationBadge}`}>
      <View style={styles.headerRow}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.simulationTitle}
        </ThemedText>
        <Badge label={text.simulationBadge} color="statusWarn" background="statusWarnSoft" />
      </View>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.simulationNote}
      </ThemedText>

      <View style={[styles.block, { backgroundColor: theme.backgroundSelected }]} accessible accessibilityLabel={`${text.simulationInput}: ${run.input}`}>
        <ThemedText type="caption" themeColor="textSecondary">
          {text.simulationInput}
        </ThemedText>
        <ThemedText type="body">{run.input}</ThemedText>
      </View>

      <View style={styles.steps} accessibilityLiveRegion="polite">
        {run.steps.slice(0, shown).map((step, index) => (
          <View key={step.partId} style={[styles.step, { borderColor: theme.border }]} accessible accessibilityLabel={`${text.simulationStep(index + 1, step.label, step.line)}${step.written ? '' : `. ${text.genericMark}`}`}>
            <View style={styles.stepHead}>
              <View style={[styles.number, { backgroundColor: theme.primarySoft }]}>
                <ThemedText type="caption" themeColor="primary" tabular>
                  {index + 1}
                </ThemedText>
              </View>
              <LaneTag lane={step.lane} label={text.lanes[step.lane]} />
            </View>
            <ThemedText type="secondary">{step.line}</ThemedText>
            {!step.written && (
              <ThemedText type="caption" themeColor="textTertiary">
                {text.genericMark}
              </ThemedText>
            )}
          </View>
        ))}
      </View>

      {finished && (
        <View style={[styles.block, { backgroundColor: theme.statusOkSoft }]} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${text.simulationOutput}: ${run.output}`}>
          <View style={styles.outputHead}>
            <Icon name="check_circle" size={18} color="statusOk" filled />
            <ThemedText type="secondarySemiBold" themeColor="statusOk">
              {text.simulationOutput}
            </ThemedText>
          </View>
          <ThemedText type="body">{run.output}</ThemedText>
        </View>
      )}

      <View style={styles.buttons}>
        {!finished && <Button title={text.runShowNext} icon="play_arrow" size="small" onPress={() => setShown((current) => current + 1)} />}
        {shown > 0 && <Button title={text.runAgain} icon="replay" size="small" variant="secondary" onPress={() => setShown(0)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.large, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  headerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  block: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  steps: { gap: Spacing.two },
  step: { gap: Spacing.two, padding: Spacing.three - 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  number: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  outputHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
