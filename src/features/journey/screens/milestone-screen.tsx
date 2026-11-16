import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { selectCompanion, selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useAppSelector } from '@/store/hooks';

import { useJourney } from '../hooks/use-journey';
import { useMilestoneActions } from '../hooks/use-milestone-actions';
import { currentLine, milestoneLine } from '../lib/tali-lines';
import type { JourneyState, MilestoneState, StepState } from '../lib/types';
import { journeyStrings, type JourneyText } from '../strings';

/** A milestone in detail: why it matters, what the learner will be able to do, the steps and how far along each is, and the one thing to do next. */
export function MilestoneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const text = useLocalized(journeyStrings);
  const journey = useJourney();
  if (journey.isPending) return <LoadingState />;
  if (journey.isError) return <ErrorState message={text.empty.body} onRetry={journey.refetch} />;
  const milestone = journey.state.milestones.find((entry) => entry.id === id);
  if (!milestone) return <Screen><EmptyState icon="route" title={text.sheet.notFound} /></Screen>;
  return <MilestoneDetails state={journey.state} milestone={milestone} stageTitle={journey.state.stages[milestone.stageIndex]?.def.title ?? ''} />;
}

type DetailsProps = { state: JourneyState; milestone: MilestoneState; stageTitle: string };

function MilestoneDetails({ state, milestone, stageTitle }: DetailsProps) {
  const text = useLocalized(journeyStrings);
  // The details are a sheet: a step opens full size, not inside it.
  const actions = useMilestoneActions({ fromSheet: true });
  const name = useAppSelector(selectLearnerName).split(' ')[0] ?? '';
  const coachName = COMPANIONS[useAppSelector(selectCompanion)].name;
  const { status, def } = milestone;
  const blockers = milestone.blockedBy.map((id) => state.milestones.find((entry) => entry.id === id)).filter((entry): entry is MilestoneState => !!entry);
  const line = status === 'current' ? currentLine(state, text.tali, name) : milestoneLine(state, milestone, text.tali);
  const needsPro = milestone.steps.some((step) => !step.done && !step.soon && !step.optional && !step.owned);

  const footer = footerFor(milestone, blockers, text, actions);

  return (
    <Screen footer={footer}>
      <View style={styles.hero}>
        <IconTile icon={def.icon} tone={status === 'done' ? 'mint' : 'violet'} size={64} />
        <View style={styles.heroText}>
          <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
            {stageTitle}
          </ThemedText>
          <ThemedText type="title" accessibilityRole="header">
            {def.title}
          </ThemedText>
        </View>
      </View>
      <View style={styles.tags}>
        <Pill label={text.map.status[status]} strong={status === 'current' || status === 'done'} />
        {def.kind === 'challenge' && <Pill label={text.map.challenge} />}
        {def.kind === 'capstone' && <Pill label={text.map.capstone} />}
        {milestone.optional && status !== 'done' && <Pill label={text.map.optional} />}
        {needsPro && <Pill label={text.map.pro} />}
      </View>

      <ThemedText type="body" themeColor="textSecondary">
        {def.summary}
      </ThemedText>

      {line && (
        <Card tone="primarySoft" style={styles.tali}>
          <Tali size={56} tight mood={line.mood} />
          <ThemedText type="bodySemiBold" style={styles.flex}>
            {line.text}
          </ThemedText>
        </Card>
      )}

      {statusNote(milestone, text.sheet) && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {statusNote(milestone, text.sheet)}
        </ThemedText>
      )}

      {status !== 'soon' && (
        <Card style={styles.progress}>
          <View style={styles.progressRow}>
            <ThemedText type="secondarySemiBold">{text.sheet.progress(milestone.stepsDone, milestone.stepsTotal)}</ThemedText>
            <ThemedText type="secondarySemiBold" themeColor="primaryText" tabular>
              {`${Math.round(milestone.fraction * 100)}%`}
            </ThemedText>
          </View>
          <ProgressBar fraction={milestone.fraction} done={status === 'done'} accessibilityLabel={text.sheet.progress(milestone.stepsDone, milestone.stepsTotal)} />
          {status !== 'done' && (
            <View style={styles.timeRow}>
              <Icon name="schedule" size={16} color="textSecondary" />
              <ThemedText type="caption" themeColor="textSecondary">
                {text.sheet.time(milestone.minutesLeft)}
              </ThemedText>
            </View>
          )}
        </Card>
      )}

      <Section title={text.sheet.why}>
        <ThemedText type="body">{def.why}</ThemedText>
      </Section>

      <Section title={text.sheet.objectives}>
        <Card>
          <View style={styles.list}>
            {def.objectives.map((objective) => (
              <View key={objective} style={styles.objective}>
                <Icon name="check_circle" size={20} color="primary" filled={status === 'done'} />
                <ThemedText type="body" style={styles.flex}>
                  {objective}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section title={text.sheet.steps}>
        <Card padded={false}>
          {milestone.steps.map((step) => (
            <StepRow key={step.key} step={step} locked={status === 'locked'} text={text.sheet} proLabel={text.map.pro} leave={actions.leave} />
          ))}
        </Card>
        <ThemedText type="caption" themeColor="textSecondary">
          {text.sheet.requirementsBody(milestone.stepsTotal)}
        </ThemedText>
      </Section>

      {blockers.length > 0 && (
        <Section title={text.sheet.prerequisites}>
          <Card padded={false}>
            {blockers.map((blocker) => (
              <ListRow key={blocker.id} title={blocker.def.title} subtitle={blocker.def.summary} icon={blocker.def.icon} tone="violet" onPress={() => router.replace({ pathname: '/journey/[id]', params: { id: blocker.id } })} />
            ))}
          </Card>
        </Section>
      )}

      {status !== 'soon' && (
        <Button title={text.sheet.askTali(coachName)} icon="forum" variant="ghost" onPress={() => actions.askTali(milestone)} />
      )}
    </Screen>
  );
}

function statusNote(milestone: MilestoneState, sheet: JourneyText['sheet']): string | null {
  switch (milestone.status) {
    case 'skipped':
      return sheet.skippedBecause;
    case 'soon':
      return sheet.soonBody;
    case 'done':
      return sheet.doneBody;
    default:
      return milestone.optional ? sheet.optionalBecause : null;
  }
}

function footerFor(milestone: MilestoneState, blockers: readonly MilestoneState[], text: JourneyText, actions: ReturnType<typeof useMilestoneActions>) {
  if (milestone.status === 'soon') return undefined;
  if (milestone.status === 'locked' && blockers[0]) {
    const first = blockers[0];
    return <Button title={text.sheet.goToFirst(first.def.title)} icon="arrow_forward" onPress={() => router.replace({ pathname: '/journey/[id]', params: { id: first.id } })} />;
  }
  if (milestone.status === 'done' || !milestone.next) {
    const course = milestone.steps.find((step) => step.courseId && !step.soon);
    return course?.courseId ? <Button title={text.sheet.review} variant="secondary" icon="menu_book" onPress={() => actions.leave(() => router.push({ pathname: '/course/[id]', params: { id: course.courseId! } }))} /> : undefined;
  }
  const next = milestone.next;
  const label = next.type === 'project' ? text.sheet.openProject : next.type === 'action' ? text.sheet.openPortfolio : milestone.started ? text.sheet.continue : text.sheet.start;
  return <Button title={label} icon="play_arrow" onPress={() => actions.go(milestone)} />;
}

type StepRowProps = { step: StepState; locked: boolean; text: JourneyText['sheet']; proLabel: string; leave: (navigate: () => void) => void };

function StepRow({ step, locked, text, proLabel, leave }: StepRowProps) {
  const subtitle =
    step.soon
      ? text.soonStep
      : step.kind === 'learn' && step.progressText
        ? text.lessons(step.progressText.done, step.progressText.total)
        : step.kind === 'build'
          ? `${text.challengeStep} · ${step.done ? text.passed : text.notPassed}`
          : step.done
            ? text.done
            : step.action === 'portfolio'
              ? text.portfolio
              : text.resume;
  const title = step.kind === 'action' ? (step.action === 'portfolio' ? text.portfolio : text.resume) : step.title;
  const icon = step.done ? 'check_circle' : step.soon ? 'schedule' : locked ? 'lock' : step.kind === 'build' ? 'flag' : step.kind === 'action' ? 'folder_special' : 'play_circle';
  const trailing = step.optional ? text.optionalStep : !step.owned && !step.done && !step.soon ? proLabel : null;
  // A locked milestone's courses and project don't open from here: the learner finishes the course before it first
  // (owner, 2026-11-16: "cannot proceed on next level if the current course is not done yet"); the footer leads there.
  const navigate = step.soon || locked
    ? undefined
    : step.kind === 'build' && step.projectId
      ? () => router.push({ pathname: '/project/[id]', params: { id: step.projectId! } })
      : step.kind === 'learn' && step.courseId
        ? () => router.push({ pathname: '/course/[id]', params: { id: step.courseId! } })
        : step.action === 'portfolio'
          ? () => router.push('/portfolio')
          : step.action === 'resume'
            ? () => router.push('/resume')
            : undefined;
  // Each opens full size, closing the sheet first.
  const onPress = navigate ? () => leave(navigate) : undefined;
  return (
    <ListRow
      title={title}
      titleLines={2}
      subtitle={subtitle}
      icon={icon}
      tone={step.done ? 'mint' : 'violet'}
      trailing={trailing ? <ThemedText type="caption" themeColor="textSecondary">{trailing}</ThemedText> : undefined}
      onPress={onPress}
    />
  );
}

function Pill({ label, strong = false }: { label: string; strong?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: strong ? theme.primary : theme.primarySoft }]}>
      <ThemedText type="caption" style={[styles.pillText, { color: strong ? theme.onPrimary : theme.primaryText }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  heroText: { flex: 1, gap: 2 },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  pill: { paddingHorizontal: Spacing.three, paddingVertical: 4, borderRadius: Radius.pill, borderCurve: 'continuous' },
  pillText: { fontWeight: '700' },
  tali: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  flex: { flex: 1 },
  progress: { gap: Spacing.two },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  list: { gap: Spacing.three },
  objective: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
});
