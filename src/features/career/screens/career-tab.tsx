import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { ListRow } from '@/components/ui/list-row';
import { TwoColumns } from '@/components/two-columns';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ShortcutTile } from '@/components/ui/shortcut-tile';
import { TabSkeleton } from '@/components/tab-skeleton';
import { ErrorState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { interviewStrings } from '@/features/interview';
import { useLocalized } from '@/hooks/use-strings';
import { useViewportSettling } from '@/hooks/use-viewport-settling';
import { todayISO } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { formatMoney } from '@/lib/money';

import { ComingUpList } from '../components/coming-up-list';
import { GoalCard } from '../components/goal-card';
import { PipelineGrid } from '../components/pipeline-grid';
import { useCareer } from '../hooks/use-career';
import { goalProgress } from '../lib/goal-progress';
import { comingUp, incomeSummary, monthRange, stageCounts } from '../lib/overview';
import { careerStrings, type CareerStrings } from '../strings';

/** Goals shown before "Show all": the tab stays short for someone with many. */
const GOALS_SHOWN = 2;
/** Follow-ups and interviews shown on the tab; the rest are on the applications list. */
const COMING_UP_SHOWN = 3;

/** The Career tab: the tools in one row, then the job hunt (pipeline and what's coming up), goals and freelance income. */
export function CareerTab() {
  const strings = useLocalized(careerStrings);
  const career = useCareer();
  const settling = useViewportSettling();
  const [showAllGoals, setShowAllGoals] = useState(false);
  const header = <TabHeader title={strings.tabTitle} subtitle={strings.tabSubtitle} accessory={<SettingsButton />} />;

  if (career.isError) {
    return (
      <Screen variant="tab">
        {header}
        <ErrorState onRetry={() => void career.refetch()} />
      </Screen>
    );
  }

  if (!career.data || settling) return <TabSkeleton variant="career" />;

  const { applications, income, goals } = career.data;
  const today = todayISO();
  const nothingYet = applications.length === 0 && income.length === 0 && goals.length === 0;
  const upcoming = comingUp(applications, new Date(), today).slice(0, COMING_UP_SHOWN);
  const month = monthRange(today);
  const summary = incomeSummary(income, month.from, month.to);
  const addApplication = () => router.push('/career/application/new');
  const addGoal = () => router.push('/career/goal/new');
  const addIncome = () => router.push('/career/income/new');
  const shownGoals = showAllGoals ? goals : goals.slice(0, GOALS_SHOWN);

  return (
    <Screen variant="tab" wide>
      {header}
      <ToolsRow strings={strings} />
      {nothingYet ? (
        <EmptyState
          icon="work"
          title={strings.emptyTitle}
          message={strings.emptyBody}
          action={
            <View style={styles.emptyActions}>
              <Button title={strings.emptyAction} icon="add" onPress={addApplication} />
              <Button title={strings.emptyGoal} icon="flag" variant="secondary" onPress={addGoal} />
            </View>
          }
        />
      ) : (
        <TwoColumns
          primary={
            <>
              <Section
                title={strings.pipelineTitle}
                actionLabel={strings.seeAll}
                onAction={() => router.push('/career/applications')}
                trailing={
                  <IconButton
                    icon="add"
                    accessibilityLabel={strings.newApplication}
                    onPress={() => {
                      tapFeedback();
                      addApplication();
                    }}
                  />
                }>
                <PipelineGrid counts={stageCounts(applications)} strings={strings} onSelect={(stage) => router.push({ pathname: '/career/applications', params: { stage } })} />
                {/* Only when there is something: an empty "nothing coming up" block is clutter. */}
                {upcoming.length > 0 && (
                  <View style={styles.upcoming}>
                    <ThemedText type="secondarySemiBold" themeColor="textSecondary">
                      {strings.comingUpTitle}
                    </ThemedText>
                    <ComingUpList items={upcoming} strings={strings} />
                  </View>
                )}
              </Section>
            </>
          }
          secondary={
            <>
              <Section title={strings.goalsTitle} actionLabel={strings.addGoal} onAction={addGoal}>
                {goals.length === 0 ? (
                  <SettingsGroup>
                    <ListRow icon="flag" tone="amber" title={strings.emptyGoal} subtitle={strings.goalTitlePlaceholder} onPress={addGoal} />
                  </SettingsGroup>
                ) : (
                  <View style={styles.stack}>
                    {shownGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} progress={goalProgress(goal, { applications, income })} strings={strings} onPress={() => router.push({ pathname: '/career/goal/[id]', params: { id: goal.id } })} />
                    ))}
                    {goals.length > GOALS_SHOWN && (
                      <Pressable accessibilityRole="button" onPress={() => setShowAllGoals((current) => !current)} hitSlop={12} style={styles.more}>
                        <ThemedText type="secondarySemiBold" themeColor="primary">
                          {showAllGoals ? strings.showFewerGoals : strings.showAllGoals(goals.length)}
                        </ThemedText>
                      </Pressable>
                    )}
                  </View>
                )}
              </Section>

              <Section
                title={strings.incomeTitle}
                actionLabel={income.length > 0 ? strings.seeAll : undefined}
                onAction={() => router.push('/career/income')}
                trailing={
                  <IconButton
                    icon="add"
                    accessibilityLabel={strings.addIncome}
                    onPress={() => {
                      tapFeedback();
                      addIncome();
                    }}
                  />
                }>
                <IncomeCard summary={summary} strings={strings} />
              </Section>
            </>
          }
        />
      )}
    </Screen>
  );
}

type ToolsRowProps = { strings: CareerStrings };

/** The résumé, portfolio, mock interview (next to the portfolio, owner 2026-11-16), kit, templates and job boards as round tiles, like Home's shortcuts, instead of tall rows. */
function ToolsRow({ strings }: ToolsRowProps) {
  const interview = useLocalized(interviewStrings);
  const go = (path: string) => () => router.push(path as Href);
  return (
    <Section title={strings.proofTitle}>
      {/* Six tiles don't fit one line of a phone (a label broke mid-word), so the row scrolls sideways, edge to edge. */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll} contentContainerStyle={styles.tools}>
        <ShortcutTile label={strings.resume} icon="description" tone="sky" onPress={go('/resume')} style={styles.tool} />
        <ShortcutTile label={strings.portfolio} icon="folder_open" tone="rose" onPress={go('/portfolio')} style={styles.tool} />
        <ShortcutTile label={interview.toolLabel} icon="record_voice_over" tone="indigo" onPress={go('/interview')} style={styles.tool} />
        <ShortcutTile label={strings.careerKit} icon="palette" tone="violet" onPress={go('/career-kit')} style={styles.tool} />
        <ShortcutTile label={strings.templates} icon="article" tone="teal" onPress={go('/templates')} style={styles.tool} />
        <ShortcutTile label={strings.jobBoards} icon="travel_explore" tone="amber" onPress={go('/job-boards')} style={styles.tool} />
      </ScrollView>
    </Section>
  );
}

type IncomeCardProps = {
  summary: ReturnType<typeof incomeSummary>;
  strings: CareerStrings;
};

/** "₱4,000.00" → "₱4,000" when there are no cents to show; "₱4,000.50" stays as it is. */
function wholeWhenPossible(text: string): string {
  return text.replace(/[.,]0+(?=\D*$)/, '');
}

/**
 * This month's income: each currency as one figure with its code under it, side by side (two amounts stacked in the page's biggest type
 * read as a wall of numbers, owner 2026-11-16). Adding income is the + in the section's header, as for the pipeline.
 */
function IncomeCard({ summary, strings }: IncomeCardProps) {
  return (
    <Card style={styles.income}>
      <ThemedText type="caption" themeColor="textSecondary">
        {strings.incomeThisMonth}
      </ThemedText>
      {summary.totals.length === 0 ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.noIncomeYet}
        </ThemedText>
      ) : (
        <View style={styles.amounts}>
          {summary.totals.map((total) => (
            <View key={total.currency} style={styles.amount}>
              <ThemedText type="stat" tabular selectable>
                {wholeWhenPossible(formatMoney(total.minor, total.currency))}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {total.currency}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  emptyActions: {
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  // The row bleeds to the screen edges (the page's side padding is given back as the scroller's own), so tiles scroll under the margins.
  toolsScroll: {
    marginHorizontal: -Spacing.three,
  },
  tools: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  // A fixed width (the tile fills its row otherwise): wide enough for "Templates" on one line, two lines for the longer names.
  tool: {
    flex: 0,
    width: 84,
  },
  upcoming: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  more: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  income: {
    gap: Spacing.two,
  },
  amounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.five,
    rowGap: Spacing.two,
  },
  amount: {
    gap: Spacing.half,
  },
});
