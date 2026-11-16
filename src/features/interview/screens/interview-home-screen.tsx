import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, toISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { useAppSelector } from '@/store/hooks';

import type { InterviewSummary } from '../api/interview-repo';
import { useInterviews, useInterviewScores } from '../hooks/use-interview';
import { ratingFor, trendOf } from '../lib/report';
import { interviewStrings } from '../strings';

const openInterview = (interview: Pick<InterviewSummary, 'id' | 'status'>) => {
  tapFeedback();
  if (interview.status === 'finished') router.push({ pathname: '/interview/report/[id]', params: { id: interview.id } });
  else router.push({ pathname: '/interview/[id]', params: { id: interview.id } });
};

/** Mock interview home: start one, pick up an unfinished one, see how your scores are moving, and open any past interview. */
export function InterviewHomeScreen() {
  const strings = useLocalized(interviewStrings);
  const companion = useAppSelector(selectCompanion);
  const interviews = useInterviews();
  const scores = useInterviewScores();

  if (interviews.isError || scores.isError) {
    return (
      <Screen>
        <ErrorState onRetry={() => void Promise.all([interviews.refetch(), scores.refetch()])} />
      </Screen>
    );
  }
  if (!interviews.data || !scores.data) {
    return (
      <Screen>
        <View style={styles.stack}>
          <SkeletonBlock height={190} />
          <SkeletonBlock height={120} />
        </View>
      </Screen>
    );
  }

  const list = interviews.data;
  const unfinished = list.find((interview) => interview.status !== 'finished');
  const start = () => {
    tapFeedback();
    router.push('/interview/setup');
  };

  return (
    <Screen>
      <Card style={styles.hero}>
        <Tali size={150} mood="explaining" tight />
        <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
          {strings.homeBody(COMPANIONS[companion].name)}
        </ThemedText>
        <Button title={strings.start} icon="play_arrow" onPress={start} style={styles.stretch} />
      </Card>

      {unfinished && (
        <Section title={strings.continueTitle}>
          <Card onPress={() => openInterview(unfinished)} accessibilityLabel={`${strings.continueAction}: ${unfinished.title}`}>
            <View style={styles.continueRow}>
              <View style={styles.flex}>
                <ThemedText type="cardTitle" numberOfLines={1}>
                  {unfinished.title}
                </ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {strings.types[unfinished.setup.type].label} · {strings.answersCount(unfinished.answers)}
                </ThemedText>
              </View>
              <Badge label={unfinished.status === 'paused' ? strings.paused : strings.inProgress} color="statusWarn" background="statusWarnSoft" />
            </View>
          </Card>
        </Section>
      )}

      <ProgressCard scores={scores.data.map((entry) => entry.score)} strings={strings} />

      <Section title={strings.historyTitle}>
        {list.length === 0 ? (
          <EmptyState icon="record_voice_over" title={strings.emptyTitle} message={strings.emptyBody} />
        ) : (
          <SettingsGroup>
            {list.map((interview) => (
              <ListRow
                key={interview.id}
                icon={interview.status === 'finished' ? 'task_alt' : 'forum'}
                tone={interview.status === 'finished' ? 'teal' : 'amber'}
                title={interview.title}
                subtitle={`${strings.types[interview.setup.type].label} · ${formatDate(toISODate(new Date(interview.updated_at)))}`}
                trailing={
                  interview.score !== null ? (
                    <ThemedText type="statSmall" tabular>
                      {interview.score}
                    </ThemedText>
                  ) : (
                    <ThemedText type="caption" themeColor="textSecondary">
                      {interview.status === 'finished' ? strings.notEvaluated : interview.status === 'paused' ? strings.paused : strings.inProgress}
                    </ThemedText>
                  )
                }
                onPress={() => openInterview(interview)}
              />
            ))}
          </SettingsGroup>
        )}
      </Section>

      <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
        {strings.privacy}
      </ThemedText>
    </Screen>
  );
}

type Strings = (typeof interviewStrings)['en'];
type ProgressCardProps = { scores: readonly number[]; strings: Strings };

/** Your scores over time: the latest, how it moved, and the last few as bars. Nothing is drawn until there is a score. */
function ProgressCard({ scores, strings }: ProgressCardProps) {
  const theme = useTheme();
  if (scores.length === 0) return null;
  const latest = scores[scores.length - 1];
  const trend = trendOf(scores);
  const recent = scores.slice(-8);
  const best = Math.max(...scores);
  return (
    <Section title={strings.progressTitle}>
      <Card style={styles.progress}>
        <View style={styles.progressTop}>
          <View style={styles.flex}>
            <ThemedText type="caption" themeColor="textSecondary">
              {strings.progressLatest}
            </ThemedText>
            <ThemedText type="stat" tabular>
              {latest}
            </ThemedText>
            <ThemedText type="secondarySemiBold" themeColor={trend === null || trend === 0 ? 'textSecondary' : trend > 0 ? 'statusOk' : 'statusDanger'}>
              {trend === null ? strings.progressAttempts(scores.length) : trend === 0 ? strings.trendSame : trend > 0 ? strings.trendUp(trend) : strings.trendDown(Math.abs(trend))}
            </ThemedText>
          </View>
          <Badge label={strings.ratings[ratingFor(latest)].label} color="primaryText" background="primarySoft" />
        </View>
        <View style={styles.bars} accessible accessibilityLabel={`${strings.progressTitle}: ${recent.join(', ')}`}>
          {recent.map((score, index) => (
            <View key={index} style={styles.barSlot}>
              <View style={[styles.bar, { height: Math.max(6, (score / 100) * 64), backgroundColor: index === recent.length - 1 ? theme.primary : theme.backgroundSelected }]} />
            </View>
          ))}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.progressAttempts(scores.length)} · {strings.progressBest} {best}
        </ThemedText>
      </Card>
    </Section>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progress: {
    gap: Spacing.three,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    height: 64,
  },
  barSlot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: Radius.small,
    borderCurve: 'continuous',
  },
});
