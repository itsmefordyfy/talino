import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { allFixedBlocks, DayPlanner, formatClock, formatDuration, productivityStrings, resolveRules, type Block, type Decision, type ScheduleChallenge, type ScheduleResult } from '@/features/productivity';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { PlanningActivity } from '../types';
import { CheckBar } from './activity-frame';

export type PlanningSchedulePanelProps = { activity: PlanningActivity; challenge: ScheduleChallenge; session: ActivitySession };

/** How much the learner may write about their choices. Kept with the plan on this phone's memory while the app is open; never scored or sent. */
const MAX_EXPLANATION = 600;

/**
 * The graded day: the scenario's commitments, tasks and rules are shown first, so the learner knows what a good day means before planning. They
 * build the plan with the shared day planner, start the day to meet the surprise (when there is one) and rebuild around it, then check. A check
 * that does not pass never clears the plan. The reference solution is never read or shown here.
 */
export function PlanningSchedulePanel({ activity, challenge, session }: PlanningSchedulePanelProps) {
  const t = useLocalized(productivityStrings);
  const { scenario } = challenge;
  const rules = resolveRules(scenario);
  // Kept while the app is open, so leaving the lesson and coming back finds the plan, the decisions and the day as they were.
  const [blocks, setBlocks] = useActivityDraft<Block[]>(activity.id, 'plan.blocks', []);
  const [decisions, setDecisions] = useActivityDraft<Decision[]>(activity.id, 'plan.decisions', []);
  const [started, setStarted] = useActivityDraft<boolean>(activity.id, 'plan.started', false);
  const [explanation, setExplanation] = useActivityDraft<string>(activity.id, 'plan.explain', '');
  const [checkedKey, setCheckedKey] = useActivityDraft<string | null>(activity.id, 'plan.checked', null);

  const { interruption } = scenario;
  const afterInterruption = interruption ? started : true;
  const fixed = allFixedBlocks(scenario, !!interruption && started);
  const key = JSON.stringify({ blocks, decisions, afterInterruption });
  const checked: ScheduleResult | null = session.result?.detail?.kind === 'planning' && session.result.detail.mode === 'schedule' ? session.result.detail.schedule : null;
  const changedSinceCheck = checked !== null && checkedKey !== null && checkedKey !== key;
  const canCheck = blocks.length > 0 && afterInterruption;

  const ruleLines: { icon: IconName; text: string }[] = [
    { icon: 'timer', text: t.planRuleFocus(formatDuration(rules.maxFocusRun)) },
    { icon: 'coffee', text: t.planRuleBreak(formatDuration(rules.minBreakTotal), formatDuration(rules.minBreakMinutes)) },
    { icon: 'hourglass_empty', text: t.planRuleSlack(formatDuration(rules.minSlack)) },
    { icon: 'flag', text: t.planRuleCap(formatDuration(rules.maxPlannedMinutes)) },
    ...(scenario.tasks.some((task) => task.mustDo) ? [{ icon: 'priority_high' as IconName, text: t.planRuleMust }] : []),
    { icon: 'add_task', text: t.planRuleDecide },
  ];

  return (
    <View style={styles.root}>
      <Card style={styles.card}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {scenario.dayLabel}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary" tabular>
          {t.dayWindow(formatClock(scenario.windowStart), formatClock(scenario.windowEnd))}
        </ThemedText>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary" accessibilityRole="header" style={styles.rulesTitle}>
          {t.planDayRules}
        </ThemedText>
        <View style={styles.rules}>
          {ruleLines.map((line) => (
            <View key={line.text} style={styles.rule}>
              <Icon name={line.icon} size={18} color="primary" />
              <ThemedText type="secondary" style={styles.ruleText}>
                {line.text}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      {interruption && started && (
        <Notice tone="warning" accessibilityLiveRegion="assertive">
          <ThemedText type="secondarySemiBold">{`${t.planInterruptionTitle}: ${interruption.title}, ${formatClock(interruption.start)}`}</ThemedText>
          <ThemedText type="secondary">{interruption.note}</ThemedText>
          <ThemedText type="secondary">{t.planAfter}</ThemedText>
        </Notice>
      )}

      <DayPlanner
        windowStart={scenario.windowStart}
        windowEnd={scenario.windowEnd}
        tasks={scenario.tasks}
        fixed={fixed}
        blocks={blocks}
        decisions={decisions}
        rules={rules}
        readOnly={session.done}
        result={checked}
        onChange={(next) => {
          setBlocks(next.blocks);
          setDecisions(next.decisions);
        }}
      />

      {changedSinceCheck && <Notice tone="info" message={t.planChanged} />}

      <View style={styles.explain}>
        <TextField
          label={t.planExplain}
          hint={t.planExplainHint}
          placeholder={t.planExplainPlaceholder}
          value={explanation}
          onChangeText={(text) => setExplanation(text.slice(0, MAX_EXPLANATION))}
          maxLength={MAX_EXPLANATION}
          multiline
          editable={!session.done}
        />
      </View>

      {interruption && !started ? (
        <View style={styles.start}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {t.planStartHint}
          </ThemedText>
          <Button
            title={t.planStart}
            icon="play_arrow"
            disabled={blocks.length === 0}
            onPress={() => {
              tapFeedback();
              setStarted(true);
            }}
          />
        </View>
      ) : (
        <CheckBar
          session={session}
          label={t.planCheck}
          canCheck={canCheck}
          onCheck={() => {
            if (!canCheck) return;
            setCheckedKey(key);
            void session.check({ kind: 'planning', mode: 'schedule', blocks, decisions, afterInterruption });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  card: { gap: Spacing.two },
  rulesTitle: { marginTop: Spacing.two },
  rules: { gap: Spacing.two },
  rule: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  ruleText: { flex: 1 },
  explain: { gap: Spacing.one },
  start: { gap: Spacing.two },
});
