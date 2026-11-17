import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { moveItem } from '../lib/arrange';
import { useActivityDraft } from '../lib/draft';
import { addWorkflowStep, brokenRulesOf, removeWorkflowStep, simulateWorkflow, stepsInBrokenRules, workflowCountState } from '../lib/workflow';
import type { WorkflowBuilderActivity } from '../types';
import { workflowStrings } from '../workflow-strings';
import { ActivityFeedback, ActivityFrame, CheckBar } from './activity-frame';
import { RichText } from './rich-text';
import { WorkflowPalette } from './workflow-palette';
import { WorkflowSimulation } from './workflow-simulation';
import { WorkflowSteps } from './workflow-steps';

export type WorkflowBuilderViewProps = { activity: WorkflowBuilderActivity; session: ActivitySession };

/** Wide enough for the palette's parts to sit two to a row and the step buttons to sit beside the text. */
const WIDE_WIDTH = 560;

/**
 * The AI Workflow Builder: pick steps from a lane-labelled palette, order them with the move buttons, then check them against the rules. Nothing calls a
 * model. A wrong check lists the rules that are not met in their own words (never the solution); once every rule is met a hand-written, labelled
 * simulated run walks a sample request through the learner's steps.
 */
export function WorkflowBuilderView({ activity, session }: WorkflowBuilderViewProps) {
  const theme = useTheme();
  const text = useLocalized(workflowStrings);
  const { done, result } = session;
  // Kept while the app is open, like the other kinds: leaving the lesson and coming back finds the workflow as it was.
  const [order, setOrder] = useActivityDraft<string[]>(activity.id, 'order', []);
  const [checkedOrder, setCheckedOrder] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const wide = width >= WIDE_WIDTH;

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) setWidth(next);
  };

  // What the last check found only applies to the workflow it checked; any change to the steps hides it.
  const current = checkedOrder === order.join('\n') && result?.detail?.kind === 'workflow-builder' ? result.detail : null;
  const brokenRules = current ? brokenRulesOf(activity, current.broken) : [];
  const flagged = current ? stepsInBrokenRules(activity, current.broken, order) : [];
  const countState = workflowCountState(order.length, activity);

  const feedbackMessage = current && !done ? (brokenRules.length > 0 ? text.brokenSummary(brokenRules.length) : result?.feedback) : undefined;

  return (
    <ActivityFrame session={session} feedback="inline">
      <View style={styles.root} onLayout={onLayout}>
        <Card tone="backgroundSelected" accessibilityLabel={`${text.situation}. ${activity.situation}`}>
          <ThemedText type="caption" themeColor="textSecondary">
            {text.situation}
          </ThemedText>
          <RichText type="body" text={activity.situation} />
        </Card>

        <WorkflowSteps
          order={order}
          parts={activity.parts}
          minSteps={activity.minSteps}
          maxSteps={activity.maxSteps}
          countState={countState}
          flagged={flagged}
          locked={done}
          wide={wide}
          text={text}
          onMove={(from, to) => setOrder((list) => moveItem(list, from, to))}
          onRemove={(partId) => setOrder((list) => removeWorkflowStep(list, partId))}
        />

        {!done && <WorkflowPalette parts={activity.parts} order={order} full={countState === 'full'} locked={done} wide={wide} text={text} onAdd={(partId) => setOrder((list) => addWorkflowStep(list, partId, activity))} />}

        <CheckBar
          session={session}
          label={text.checkWorkflow}
          canCheck={order.length > 0}
          onCheck={() => {
            setCheckedOrder(order.join('\n'));
            void session.check({ kind: 'workflow-builder', order });
          }}
        />

        {current && !done && <ActivityFeedback session={session} message={feedbackMessage} />}

        {current && !done && brokenRules.length > 0 && (
          <View style={styles.broken} accessibilityLabel={text.brokenTitle}>
            <ThemedText type="secondarySemiBold" accessibilityRole="header">
              {text.brokenTitle}
            </ThemedText>
            {brokenRules.map((rule, index) => (
              <View key={rule.id} style={[styles.rule, { backgroundColor: theme.statusWarnSoft, borderColor: theme.statusWarn }]} accessible accessibilityLabel={text.brokenRule(index + 1, rule.message)}>
                <Icon name="warning" size={20} color="statusWarn" />
                <ThemedText type="secondary" style={styles.ruleText}>
                  {rule.message}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {done && <WorkflowSimulation run={simulateWorkflow(activity, order, text)} text={text} />}
      </View>
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  broken: { gap: Spacing.two },
  rule: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.three - 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5 },
  ruleText: { flex: 1 },
});
