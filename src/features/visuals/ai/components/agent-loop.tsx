import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Toggle } from '@/components/ui/toggle';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import { Panel, PlayControls, Tag, useMeasuredWidth } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { agentLoopStrings } from '../agent-loop-strings';
import { buildAgentSteps, outcomeOf, stageIndex, stagesFor } from '../lib/agent-loop';
import { StageStrip } from './stage-strip';

const WIDE = 560;

/**
 * The agent loop on a fixed task. Back, Play, Next and Reset step through goal, plan, tool calls, observations, a decision and (with the switch on) a
 * person's approval before the refund; switching the approval off shows what the same slip costs. A hand-written script, labelled as an illustration.
 */
export function AgentLoopVisual({ compact }: VisualProps) {
  const t = useLocalized(agentLoopStrings);
  const theme = useTheme();
  const { width, onLayout } = useMeasuredWidth();
  const [gate, setGate] = useState(true);
  const steps = buildAgentSteps(gate, t);
  const stepper = useStepper(steps, { intervalMs: 1700 });
  const step = stepper.step;
  const wide = width >= WIDE;
  const stages = stagesFor(gate);
  const outcome = outcomeOf(steps, stepper.index);
  const log = steps.slice(0, stepper.index + 1);
  const pending = step.tool !== null && step.tool.result === null;
  const approvalTone = step.approval === 'approved' ? 'mint' : step.approval === 'rejected' ? 'red' : 'amber';

  const toolPanel = (
    <Panel label={t.toolTitle}>
      {step.tool === null ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.toolNone}
        </ThemedText>
      ) : (
        <View style={styles.tool} accessible accessibilityLabel={`${t.toolTitle}: ${step.tool.name}. ${t.toolInput}: ${step.tool.input}. ${t.toolResult}: ${pending ? t.pending : step.tool.result}`}>
          <View style={styles.toolRow}>
            <ThemedText type="caption" themeColor="textSecondary">
              {t.toolName}
            </ThemedText>
            <Tag text={step.tool.name} mono tone={step.tool.name === 'issue_refund' ? 'amber' : 'indigo'} outlined />
          </View>
          <View style={styles.toolRow}>
            <ThemedText type="caption" themeColor="textSecondary">
              {t.toolInput}
            </ThemedText>
            <ThemedText type="codeInline">{step.tool.input}</ThemedText>
          </View>
          <View style={styles.toolRow}>
            <ThemedText type="caption" themeColor="textSecondary">
              {t.toolResult}
            </ThemedText>
            <ThemedText type="codeInline" themeColor={pending ? 'textSecondary' : 'text'}>
              {pending ? t.pending : step.tool.result}
            </ThemedText>
          </View>
        </View>
      )}
      {step.approval !== null && (
        <View style={styles.approval}>
          <Tag text={t.approval[step.approval]} tone={approvalTone} outlined marker={step.approval === 'approved' ? '✓' : step.approval === 'rejected' ? '✕' : '…'} />
        </View>
      )}
    </Panel>
  );

  const logPanel = (
    <Panel label={t.logTitle}>
      <View style={styles.log} accessibilityLiveRegion="polite">
        {log.map((entry, index) => {
          const last = index === log.length - 1;
          const stage = t.stages[entry.kind];
          return (
            <View key={index} accessible accessibilityLabel={t.logItem(index + 1, stage, entry.log)} style={[styles.logRow, last && { backgroundColor: theme.primarySoft }]}>
              <ThemedText type="caption" themeColor={last ? 'primary' : 'textSecondary'} tabular style={styles.logNumber}>
                {index + 1}
              </ThemedText>
              <ThemedText type="secondary" themeColor={last ? 'text' : 'textSecondary'} style={styles.logText}>
                <ThemedText type="secondarySemiBold" themeColor={last ? 'text' : 'textSecondary'}>{stage}: </ThemedText>
                {entry.log}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </Panel>
  );

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <View style={[styles.gate, { backgroundColor: gate ? theme.statusOkSoft : theme.statusWarnSoft, borderColor: gate ? theme.statusOk : theme.statusWarn }]}>
            <Icon name={gate ? 'verified_user' : 'warning'} size={20} color={gate ? 'statusOk' : 'statusWarn'} />
            <View style={styles.gateText}>
              <ThemedText type="secondarySemiBold">{t.gateLabel}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {gate ? t.gateOn : t.gateOff}
                {compact ? '' : `. ${t.gateHint}`}
              </ThemedText>
            </View>
            <Toggle value={gate} onValueChange={setGate} accessibilityLabel={t.gateLabel} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={styles.task}>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.taskTitle}
          </ThemedText>
          <ThemedText type="secondary">{t.task}</ThemedText>
        </View>
        <StageStrip stages={stages.map((kind) => t.stages[kind])} active={stageIndex(step.kind, gate)} describe={t.stageLabel} />
        <View style={styles.counters}>
          <Tag text={t.counters.steps(stepper.index + 1, steps.length)} tone="neutral" outlined />
          <Tag text={t.counters.tools(step.toolCalls)} tone="indigo" outlined />
          {gate && <Tag text={t.counters.approvals(step.approvals)} tone="mint" outlined />}
          <Tag text={t.counters.refunded(step.refunded)} tone={step.mistake && step.refunded > 0 ? 'red' : 'violet'} outlined marker={step.mistake && step.refunded > 0 ? '!' : undefined} />
        </View>
        <View style={wide ? styles.wideRow : styles.column}>
          <View style={wide ? styles.half : undefined}>{toolPanel}</View>
          <View style={wide ? styles.half : undefined}>{logPanel}</View>
        </View>
        {outcome === 'risk' && (
          <Notice tone="danger">
            <ThemedText type="secondarySemiBold">{t.riskTitle}</ThemedText>
            <ThemedText type="secondary">{t.risk}</ThemedText>
          </Notice>
        )}
        {outcome === 'safe' && (
          <Notice tone="success">
            <ThemedText type="secondarySemiBold">{t.safeTitle}</ThemedText>
            <ThemedText type="secondary">{t.safe}</ThemedText>
          </Notice>
        )}
        <View style={styles.badgeRow}>
          <Badge label={t.illustration} color="statusWarn" background="statusWarnSoft" />
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  gate: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5, minHeight: 56 },
  gateText: { flex: 1, gap: Spacing.half },
  stage: { gap: Spacing.three },
  task: { gap: Spacing.half },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  column: { gap: Spacing.three },
  wideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  half: { flex: 1 },
  tool: { gap: Spacing.two },
  toolRow: { gap: Spacing.half },
  approval: { flexDirection: 'row' },
  log: { gap: Spacing.one },
  logRow: { flexDirection: 'row', gap: Spacing.two, paddingVertical: Spacing.half + 1, paddingHorizontal: Spacing.one, borderRadius: Radius.small },
  logNumber: { width: 20, textAlign: 'right' },
  logText: { flex: 1 },
  badgeRow: { flexDirection: 'row' },
});
