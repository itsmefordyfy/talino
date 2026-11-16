import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { ErrorState, NotFoundState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { getCourse } from '@/features/courses';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { AnswerCard } from '../components/answer-card';
import { CategoryBars } from '../components/category-bars';
import { AnswerBubble, InterviewerBubble } from '../components/message-bubbles';
import { ScoreHero } from '../components/score-hero';
import { useDeleteInterview, useInterviewReport } from '../hooks/use-interview';
import { questionsToPractise, strongestAnswers, weakestAnswers } from '../lib/report';
import { interviewStrings } from '../strings';

type Tab = 'evaluation' | 'answers' | 'transcript';

/**
 * The evaluation of an interview: the overall score and what it means, a score and a reason for each skill, the strongest and
 * weakest answers, every answer next to a stronger version, the skills to work on with the Talino courses that teach them, and
 * the whole conversation. It is asked for once, when the screen opens for an interview that has none, and is kept on the phone.
 */
export function InterviewReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const strings = useLocalized(interviewStrings);
  const online = useIsOnline();
  const report = useInterviewReport(id);
  const remove = useDeleteInterview();
  const [tab, setTab] = useState<Tab>('evaluation');

  // Ask for the evaluation once, the first time this screen sees an interview that hasn't got one.
  const asked = useRef(false);
  const ready = !!report.detail && !report.detail.report;
  useEffect(() => {
    if (!ready || asked.current) return;
    asked.current = true;
    void report.generate();
    // `generate` is rebuilt every render; the ref makes this run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (report.failed) {
    return (
      <Screen>
        <ErrorState onRetry={() => void report.refetch()} />
      </Screen>
    );
  }
  if (report.loading) {
    return (
      <Screen>
        <View style={styles.stack}>
          <SkeletonBlock height={180} />
          <SkeletonBlock height={220} />
        </View>
      </Screen>
    );
  }
  const detail = report.detail;
  if (!detail) return <NotFoundState icon="insights" title={strings.notFoundTitle} message={strings.notFoundBody} />;

  const name = COMPANIONS[detail.setup.companion].name;
  const data = detail.report;

  if (!data) {
    const state = report.state;
    if (state.phase === 'too_short') {
      return (
        <Screen>
          <Card style={styles.center}>
            <Tali size={140} mood="encouraging" tight companion={detail.setup.companion} />
            <ThemedText type="section" style={styles.centerText}>
              {strings.tooShortTitle}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={styles.centerText}>
              {strings.tooShortBody}
            </ThemedText>
            <Button
              title={strings.continueInterview}
              icon="play_arrow"
              style={styles.stretch}
              onPress={async () => {
                await report.resume();
                router.replace({ pathname: '/interview/[id]', params: { id } });
              }}
            />
          </Card>
        </Screen>
      );
    }
    if (state.phase === 'failed') {
      return (
        <Screen>
          <Card style={styles.center}>
            <Tali size={140} mood="confused" tight companion={detail.setup.companion} />
            <Notice tone={state.code === 'network' ? 'info' : 'warning'} message={strings.reportFailed[state.code ?? 'unknown'] ?? strings.reportFailed.unknown} style={styles.stretch} />
            <Button title={strings.evaluate} icon="refresh" style={styles.stretch} disabled={!online} onPress={() => void report.generate()} />
          </Card>
        </Screen>
      );
    }
    return (
      <Screen>
        <Card style={styles.center}>
          <Tali size={140} mood="thinking" tight companion={detail.setup.companion} />
          <ThemedText type="section" style={styles.centerText}>
            {strings.preparing(name)}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.centerText}>
            {strings.preparingBody}
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  const answersByTurn = detail.messages.filter((message) => message.role === 'user');
  const answerStrings = { answerNumber: strings.answerNumber, answerScore: strings.answerScore, verdicts: strings.verdicts, whyLabel: strings.whyLabel, yourAnswer: strings.yourAnswer, betterAnswer: strings.betterAnswer, betterNote: strings.betterNote, outlineLabel: strings.outlineLabel, outlineNote: strings.outlineNote };
  const strongest = strongestAnswers(data);
  const weakest = weakestAnswers(data);
  const toPractise = questionsToPractise(data);
  const rating = strings.ratings[data.rating];

  const again = (practise: string[]) => {
    tapFeedback();
    router.push({ pathname: '/interview/setup', params: { setup: JSON.stringify(detail.setup), practise: JSON.stringify(practise) } });
  };
  const confirmDelete = () =>
    Alert.alert(strings.deleteTitle, strings.deleteBody, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.delete,
        style: 'destructive',
        onPress: async () => {
          await remove.mutateAsync(id);
          router.replace('/interview');
        },
      },
    ]);

  return (
    <Screen>
      <ScoreHero score={data.overall} rating={data.rating} ratingLabel={rating.label} ratingLine={rating.line} outOf={strings.outOf} summary={data.summary} />

      <SegmentedControl
        accessibilityLabel={strings.reportTitle}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'evaluation', label: strings.tabs.evaluation },
          { value: 'answers', label: strings.tabs.answers },
          { value: 'transcript', label: strings.tabs.transcript },
        ]}
      />

      {tab === 'evaluation' && (
        <>
          {report.comparison && (
            <Card tone="primarySoft" style={styles.compared}>
              <ThemedText type="cardTitle">{strings.comparedTitle}</ThemedText>
              <ThemedText type="body" themeColor={report.comparison.overall > 0 ? 'statusOk' : report.comparison.overall < 0 ? 'statusDanger' : 'text'}>
                {strings.comparedOverall(report.comparison.overall)}
              </ThemedText>
            </Card>
          )}

          <Section title={strings.categoriesTitle}>
            <CategoryBars categories={data.categories} labels={strings.categories} comparison={report.comparison} deltaLabel={strings.deltaLabel} confidenceNote={strings.confidenceNote} />
          </Section>

          {strongest.length > 0 && (
            <Section title={strings.strongestTitle}>
              <View style={styles.stack}>
                {strongest.map((entry) => (
                  <AnswerCard key={entry.turn} entry={entry} original={null} strings={answerStrings} compact />
                ))}
              </View>
            </Section>
          )}

          <Section title={strings.weakestTitle}>
            {weakest.length === 0 ? (
              <Notice tone="success" message={strings.noWeak} />
            ) : (
              <View style={styles.stack}>
                {weakest.map((entry) => (
                  <AnswerCard key={entry.turn} entry={entry} original={null} strings={answerStrings} compact />
                ))}
              </View>
            )}
          </Section>

          {data.skills.length > 0 && (
            <Section title={strings.skillsTitle}>
              <SettingsGroup>
                {data.skills.map((skill) => {
                  const course = skill.courseId ? getCourse(skill.courseId) : null;
                  return (
                    <ListRow
                      key={skill.skill}
                      icon="school"
                      tone="indigo"
                      title={skill.skill}
                      titleLines={2}
                      subtitle={course ? `${skill.why} · ${course.title}` : skill.why}
                      onPress={course ? () => router.push({ pathname: '/course/[id]', params: { id: course.id } }) : undefined}
                      trailing={course ? <ThemedText type="secondarySemiBold" themeColor="primaryText">{strings.openCourse}</ThemedText> : undefined}
                    />
                  );
                })}
              </SettingsGroup>
            </Section>
          )}

          {data.nextSteps.length > 0 && (
            <Section title={strings.stepsTitle}>
              <Card style={styles.stack}>
                {data.nextSteps.map((step) => (
                  <ThemedText key={step} type="body">
                    • {step}
                  </ThemedText>
                ))}
              </Card>
            </Section>
          )}
        </>
      )}

      {tab === 'answers' && (
        <View style={styles.stack}>
          {data.answers.length === 0 ? (
            <Notice tone="info" message={strings.noAnswers} />
          ) : (
            data.answers.map((entry) => <AnswerCard key={entry.turn} entry={entry} original={answersByTurn[entry.turn - 1]?.text ?? null} strings={answerStrings} />)
          )}
        </View>
      )}

      {tab === 'transcript' && (
        <View style={styles.stack}>
          {detail.messages.map((message) => (message.role === 'assistant' ? <InterviewerBubble key={message.id} companion={detail.setup.companion} text={message.text} /> : <AnswerBubble key={message.id} text={message.text} />))}
        </View>
      )}

      <View style={styles.actions}>
        {toPractise.length > 0 && <Button title={strings.practiseWeak} icon="fitness_center" onPress={() => again(toPractise)} />}
        <Button title={strings.repeat} icon="replay" variant={toPractise.length > 0 ? 'secondary' : 'primary'} onPress={() => again([])} />
        <Button title={strings.deleteInterview} variant="ghost" onPress={confirmDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  compared: {
    gap: Spacing.one,
  },
  actions: {
    gap: Spacing.two,
  },
});
