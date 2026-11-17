import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { LabCheckResult } from '../lib/lab-check';
import type { LabOutput } from '../lib/lab-run';
import type { ToolStep } from '../lib/lab-tools';
import type { PracticeText } from '../strings';

export type LabOutputCardProps = {
  title: string;
  /** What the model said. */
  output: string;
  /** The run as it came back (measured numbers, field check, tool steps); absent for a reply read back from an earlier visit. */
  live?: LabOutput;
  text: PracticeText;
  /** A JSON answer is drawn in the code face. */
  json?: boolean;
};

/**
 * One model reply, always badged "Live model" (it was said by a real model, and the badge says so in words as well as colour), with the time and
 * token counts that were measured on the run, the field check of a JSON answer and the tool steps of a tool-use run. A reply from an earlier visit
 * says its numbers were not kept.
 */
export function LabOutputCard({ title, output, live, text, json = false }: LabOutputCardProps) {
  return (
    <Card style={styles.card} accessibilityLabel={`${title}. ${live ? text.lab.liveBadge : text.lab.liveSavedBadge}. ${output}`}>
      <View style={styles.head}>
        <ThemedText type="cardTitle" accessibilityRole="header" style={styles.fill}>
          {title}
        </ThemedText>
        <Badge label={live ? text.lab.liveBadge : text.lab.liveSavedBadge} color="statusOk" background="statusOkSoft" />
      </View>
      <ThemedText type={json ? 'code' : 'body'} selectable>
        {output}
      </ThemedText>
      {live ? (
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {text.lab.measured(live.latencyMs, live.tokens.input, live.tokens.output)}
        </ThemedText>
      ) : (
        <ThemedText type="caption" themeColor="textSecondary">
          {text.lab.savedNote}
        </ThemedText>
      )}
      <ThemedText type="caption" themeColor="textTertiary">
        {text.lab.liveBadgeNote}
      </ThemedText>
      {live?.check ? <FieldCheck check={live.check} text={text} /> : null}
      {live?.toolSteps !== undefined ? <ToolTrace steps={live.toolSteps} text={text} /> : null}
    </Card>
  );
}

/** Which fields of a JSON answer pass: by code, in words and by icon, never by colour alone. */
export function FieldCheck({ check, text }: { check: LabCheckResult; text: PracticeText }) {
  const theme = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: theme.backgroundSelected }]}>
      <ThemedText type="secondarySemiBold" accessibilityRole="header">
        {`${text.lab.checkTitle} · ${text.lab.checkSummary(check.passed, check.total)}`}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {text.lab.checkNote}
      </ThemedText>
      {!check.parsed ? <Notice tone="warning" message={text.lab.checkNotJson} /> : null}
      {check.fields.map((field) => (
        <View key={field.name} style={styles.row} accessible accessibilityLabel={`${field.name}: ${field.ok ? text.lab.fieldOk : text.lab.fieldFail}. ${field.note}`}>
          <Icon name={field.ok ? 'check_circle' : 'cancel'} size={18} color={field.ok ? 'statusOk' : 'danger'} filled />
          <View style={styles.fill}>
            <ThemedText type="bodySemiBold">{`${field.name} · ${field.ok ? text.lab.fieldOk : text.lab.fieldFail}`}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {field.note}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const show = (value: unknown): string => (typeof value === 'string' ? `"${value}"` : String(value));

/** What a tool-use model asked and what the tools answered, in order: the trace is data from the server, drawn as it came. */
export function ToolTrace({ steps, text }: { steps: readonly ToolStep[]; text: PracticeText }) {
  const theme = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: theme.backgroundSelected }]}>
      <ThemedText type="secondarySemiBold" accessibilityRole="header">
        {text.lab.stepsTitle}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {text.lab.stepsNote}
      </ThemedText>
      {steps.length === 0 ? <ThemedText type="secondary">{text.lab.noSteps}</ThemedText> : null}
      {steps.map((step, index) => (
        <View key={index} style={styles.step}>
          <ThemedText type="code">{text.lab.stepLine(index + 1, step.tool, Object.entries(step.arguments).map(([name, value]) => `${name}: ${show(value)}`).join(', '))}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {text.lab.stepResult(Object.entries(step.result).map(([name, value]) => `${name}: ${show(value)}`).join(', '))}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  fill: { flex: 1 },
  panel: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  step: { gap: Spacing.half },
});
