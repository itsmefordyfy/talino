import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Tali, type TaliMood } from '@/components/brand/tali';
import { Wordmark } from '@/components/brand/wordmark';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { LoadingState } from '@/components/ui/state-view';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { CompanionPicker } from '@/features/companion/components/companion-picker';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { requestNotificationPermission } from '@/features/notifications';
import { dailyMinutesChanged, dailyReminderTimeChanged, dailyReminderToggled, focusCourseChanged, goalChanged, languageChanged, learnerNameChanged, onboardingFinished, reminderDaysChanged, selectDailyReminder, selectCompanion, selectDailyReminderTime, selectLanguage, selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { isLanguage, LANGUAGE_LABELS, SHOWN_LANGUAGES } from '@/lib/i18n';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { ExperienceStep, GoalsStep, InterestsStep, MinutesStep, NameStep, ScheduleStep, StylesStep } from '../components/profile-steps';
import { PlanView } from '../components/plan-view';
import { usePlanner, useProfile, useSaveProfile } from '../hooks/use-profile';
import { audienceFor } from '../lib/audience';
import type { ExperienceLevel, GoalId, InterestId, StyleId, TimeOfDay } from '../lib/options';
import { REQUIRED_FOR_PLAN, type LearnerProfile } from '../lib/profile';
import { onboardingFinishStrings } from '../finish-strings';
import { onboardingNotificationStrings } from '../notification-strings';
import { onboardingStrings } from '../strings';

export const STEPS = ['welcome', 'coach', 'name', 'experience', 'goals', 'interests', 'styles', 'time', 'schedule', 'notifications', 'plan'] as const;
export type StepId = (typeof STEPS)[number];

/** The questions nobody has to answer: each offers Skip. */
const OPTIONAL: readonly StepId[] = ['name', 'interests', 'styles', 'time', 'schedule'];
const POSES: Record<StepId, TaliMood> = { welcome: 'happy', coach: 'happy', name: 'confident', experience: 'curious', goals: 'explaining', interests: 'inspired', styles: 'learning', time: 'focused', schedule: 'encouraging', notifications: 'encouraging', plan: 'celebrating' };
const TIME_OF_DAY_HOUR: Record<TimeOfDay, number> = { morning: 8, afternoon: 13, evening: 19 };

/**
 * The personalized onboarding: a short, one-question-at-a-time flow (welcome, choose your coach, name, experience, goals,
 * interests, how you like to learn, daily time, schedule, notifications) ending on the
 * learner's own plan and first lesson. Every step saves as it is left, so closing the app resumes where
 * it stopped; everything but experience and goals can be skipped, and Back edits earlier answers.
 */
export function OnboardingFlow() {
  const strings = useLocalized(onboardingStrings);
  const finishText = useLocalized(onboardingFinishStrings);
  const notificationText = useLocalized(onboardingNotificationStrings);
  const dispatch = useAppDispatch();
  const profile = useProfile();
  const planner = usePlanner();
  const stored = profile.data ?? null;
  const isPending = profile.isPending || planner.isPending;
  const save = useSaveProfile();
  const savedName = useAppSelector(selectLearnerName);
  const reminderOn = useAppSelector(selectDailyReminder);
  const reminderTime = useAppSelector(selectDailyReminderTime);
  const coach = COMPANIONS[useAppSelector(selectCompanion)];

  const [step, setStep] = useState<number | null>(null);
  const [draft, setDraft] = useState<LearnerProfile | null>(null);
  const [name, setName] = useState(savedName);
  const [denied, setDenied] = useState(false);
  const [asking, setAsking] = useState(false);
  const started = useRef(false);

  // Resume: take the saved answers and the step they were left on, once.
  useEffect(() => {
    if (isPending || started.current) return;
    started.current = true;
    const base: LearnerProfile = stored ?? { experience: null, goals: [], interests: [], styles: [], dailyMinutes: null, days: [], timeOfDay: null, weeklyGoal: null, assessment: null, plan: null };
    setDraft(base);
    setStep(stored ? Math.min(stored.step, STEPS.length - 1) : 0);
  }, [isPending, stored]);

  if (step === null || draft === null) return <LoadingState />;

  const id = STEPS[step];
  const update = (patch: Partial<LearnerProfile>) => setDraft((current) => (current ? { ...current, ...patch } : current));
  const total = STEPS.length - 1;
  const plan = planner.planFor(draft);
  const resumed = !!stored && stored.step > 0 && step === stored.step && step === 0;

  const goTo = (index: number, patch: Partial<LearnerProfile> = {}) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, index));
    save.mutate({ ...draft, ...patch, step: next });
    setStep(next);
  };
  const advance = () => goTo(step + 1);

  const remindToggle = async (on: boolean) => {
    const granted = on ? await requestNotificationPermission() : false;
    setDenied(on && !granted);
    dispatch(dailyReminderToggled(on && granted));
  };

  const setTimeOfDay = (value: TimeOfDay | null) => {
    update({ timeOfDay: value });
    if (value) dispatch(dailyReminderTimeChanged({ hour: TIME_OF_DAY_HOUR[value], minute: 0 }));
  };

  const leaveStep = () => {
    // The things settings need to know, written as the step is left.
    if (id === 'name') dispatch(learnerNameChanged(name));
    if (id === 'time' && draft.dailyMinutes) dispatch(dailyMinutesChanged(draft.dailyMinutes));
    if (id === 'schedule') dispatch(reminderDaysChanged(draft.days));
  };

  const next = () => {
    leaveStep();
    advance();
  };
  const skip = () => {
    if (id === 'name') setName('');
    advance();
  };

  /** The notifications step: asks the phone for permission (nothing is asked again if it was already decided) and moves on either way. */
  const allowNotifications = async () => {
    setAsking(true);
    const granted = await requestNotificationPermission();
    setAsking(false);
    dispatch(dailyReminderToggled(granted));
    setDenied(!granted);
    if (granted) advance();
  };
  const declineNotifications = () => {
    dispatch(dailyReminderToggled(false));
    advance();
  };

  const finish = () => {
    const done: LearnerProfile = { ...draft, plan: plan ? { startCourseId: plan.startCourse.id, nextCourseIds: plan.nextCourses.map((course) => course.id), generatedAt: new Date().toISOString() } : null };
    save.mutate({ ...done, step: STEPS.length - 1, status: 'completed' });
    dispatch(goalChanged(audienceFor(done)));
    dispatch(focusCourseChanged(plan?.firstStep.courseId ?? plan?.startCourse.id ?? 'starter'));
    dispatch(onboardingFinished());
    // The tabs replace this screen as soon as the flag is set, and the learner lands on Home, their journey, where the first step is
    // waiting (owner, 2026-11-16: "after the onboarding the user should be brought to the home screen"; the first lesson used to open over it).
    router.navigate('/');
  };

  const required = id === 'experience' ? draft.experience !== null : id === 'goals' ? draft.goals.length > 0 : true;
  const optional = OPTIONAL.includes(id);
  const hasPlan = !!plan && REQUIRED_FOR_PLAN(draft);

  const copy: Record<Exclude<StepId, 'welcome' | 'plan'>, { title: string; body: string }> = {
    coach: { title: strings.coachTitle, body: strings.coachBody },
    name: { title: strings.nameTitle, body: strings.nameBody },
    experience: { title: strings.experienceTitle, body: strings.experienceBody },
    goals: { title: strings.goalsTitle, body: strings.goalsBody },
    interests: { title: strings.interestsTitle, body: strings.interestsBody },
    styles: { title: strings.stylesTitle, body: strings.stylesBody },
    time: { title: strings.timeTitle, body: strings.timeBody },
    schedule: { title: strings.scheduleTitle, body: strings.scheduleBody },
    notifications: { title: notificationText.title, body: notificationText.body },
  };

  const footer =
    id === 'welcome' ? (
      <Button title={strings.getStarted} icon="arrow_forward" onPress={advance} />

    ) : id === 'notifications' ? (
      <View style={styles.footer}>
        {denied ? (
          <Button title={strings.next} onPress={advance} />
        ) : (
          <>
            <Button title={notificationText.allow} icon="notifications" loading={asking} disabled={asking} onPress={() => void allowNotifications()} />
            <Button title={notificationText.notNow} variant="ghost" disabled={asking} onPress={declineNotifications} />
          </>
        )}
      </View>
    ) : id === 'plan' ? (
      <View style={styles.footer}>
        <Button title={finishText.goHome} icon="arrow_forward" onPress={finish} disabled={!hasPlan} />
      </View>
    ) : (
      <View style={styles.footer}>
        <Button title={strings.next} onPress={next} disabled={!required} />
        {optional && <Button title={strings.skipForNow} variant="ghost" onPress={skip} />}
      </View>
    );

  const body =
    id === 'coach' ? (
      <CompanionPicker autoPlay />
    ) : id === 'name' ? (
      <NameStep value={name} onChange={setName} />
    ) : id === 'experience' ? (
      <ExperienceStep value={draft.experience} onChange={(value: ExperienceLevel) => update({ experience: value })} />
    ) : id === 'goals' ? (
      <GoalsStep value={draft.goals} onChange={(value: GoalId[]) => update({ goals: value })} />
    ) : id === 'interests' ? (
      <InterestsStep value={draft.interests} onChange={(value: InterestId[]) => update({ interests: value })} />
    ) : id === 'styles' ? (
      <StylesStep value={draft.styles} onChange={(value: StyleId[]) => update({ styles: value })} />
    ) : id === 'time' ? (
      <MinutesStep value={draft.dailyMinutes} onChange={(value) => update({ dailyMinutes: value })} />
    ) : id === 'schedule' ? (
      <ScheduleStep
        days={draft.days}
        onDays={(days) => update({ days })}
        timeOfDay={draft.timeOfDay}
        onTimeOfDay={setTimeOfDay}
        weeklyGoal={draft.weeklyGoal}
        onWeeklyGoal={(value) => update({ weeklyGoal: value })}
        reminder={{ on: reminderOn, time: reminderTime, denied, onToggle: (on) => void remindToggle(on), onTime: (time) => dispatch(dailyReminderTimeChanged(time)) }}
      />
    ) : id === 'notifications' ? (
      <View style={styles.points}>
        {notificationText.points.map((point) => (
          <View key={point.text} style={styles.point}>
            <Icon name={point.icon as IconName} size={22} color="primaryText" />
            <ThemedText type="body" style={styles.flex}>
              {point.text}
            </ThemedText>
          </View>
        ))}
        {denied && (
          <ThemedText type="secondary" themeColor="textSecondary">
            {notificationText.denied}
          </ThemedText>
        )}
      </View>
    ) : null;

  return (
    // The welcome screen's content sits in the middle of the space between the top and the button.
    <Screen variant="tab" footer={footer} contentStyle={id === 'welcome' ? styles.centered : undefined}>
      {id !== 'welcome' && (
        <View style={styles.top}>
          <View style={styles.topRow}>
            <Button title={strings.back} variant="ghost" size="small" icon="arrow_back" onPress={() => goTo(step - 1)} />
            <ThemedText type="caption" themeColor="textSecondary" tabular>
              {strings.step(step, total)}
            </ThemedText>
          </View>
          <ProgressBar fraction={step / total} accessibilityLabel={strings.progressLabel(step, total)} />
        </View>
      )}

      {/* The mascot stays still; only the step's content fades in. */}
      {/* The coach step shows both coaches in its own cards, so no extra mascot above them. */}
      {id !== 'coach' && (
        <View style={styles.mascot}>
          <Tali size={id === 'welcome' ? 240 : 144} tight mood={POSES[id]} accessibilityLabel={id === 'welcome' ? `${coach.name}, your coach` : undefined} />
        </View>
      )}

      <Animated.View key={id} entering={FadeIn.duration(220)} style={styles.content}>
        {id === 'welcome' ? (
          <Welcome resumed={resumed} />
        ) : id === 'plan' ? (
          <>
            <ThemedText type="title" style={styles.center} accessibilityRole="header">
              {strings.planTitle}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
              {strings.planBody}
            </ThemedText>
            {plan ? <PlanView plan={plan} profile={draft} onStart={finish} showStart={false} /> : <PlanPending draft={draft} />}
          </>
        ) : (
          <>
            <View style={styles.heading}>
              {optional && (
                <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
                  {strings.optional}
                </ThemedText>
              )}
              <ThemedText type="title" accessibilityRole="header">
                {id === 'name' && name.trim() ? strings.nice(name.trim().split(' ')[0]) : copy[id].title}
              </ThemedText>
              <ThemedText type="body" themeColor="textSecondary">
                {copy[id].body}
              </ThemedText>
            </View>
            {body}
          </>
        )}
      </Animated.View>
    </Screen>
  );
}

function Welcome({ resumed }: { resumed: boolean }) {
  const strings = useLocalized(onboardingStrings);
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);
  return (
    <View style={styles.welcome}>
      {/* "Welcome to ✦ Talino" on one line (it shrinks a little on the narrowest phones rather than wrapping). */}
      <View style={styles.welcomeTitle} accessible accessibilityRole="header" accessibilityLabel={`${strings.welcomeTitle} Talino`}>
        <ThemedText type="wordmark" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={styles.welcomeLead}>
          {strings.welcomeTitle}
        </ThemedText>
        <Wordmark />
      </View>
      <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
        {resumed ? strings.welcomeBack : strings.welcomeBody}
      </ThemedText>
      {/* Chosen here too, not only in Settings, so a learner on an English phone can start in Tagalog from the first screen. Each name is in its own language. Hidden while Tagalog is switched off (`TAGALOG_ENABLED`). */}
      {SHOWN_LANGUAGES.length > 1 && (
        <SegmentedControl
          accessibilityLabel={SHOWN_LANGUAGES.map((code) => LANGUAGE_LABELS[code]).join(' / ')}
          value={language}
          options={SHOWN_LANGUAGES.map((code) => ({ value: code, label: LANGUAGE_LABELS[code] }))}
          onChange={(value) => {
            if (isLanguage(value)) dispatch(languageChanged(value));
          }}
        />
      )}
      <View style={styles.points}>
        {strings.welcomePoints.map((point) => (
          <View key={point.text} style={styles.point}>
            <Icon name={point.icon as IconName} size={22} color="primaryText" />
            <ThemedText type="body" style={styles.flex}>
              {point.text}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Shown if the plan can't be made yet (experience or goals were skipped through Back and cleared). */
function PlanPending({ draft }: { draft: LearnerProfile }) {
  const strings = useLocalized(onboardingStrings);
  return (
    <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
      {draft.experience ? strings.goalsBody : strings.experienceBody}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  top: {
    gap: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascot: {
    alignItems: 'center',
  },
  content: {
    gap: Spacing.four,
  },
  heading: {
    gap: Spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  welcome: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  welcomeTitle: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  welcomeLead: {
    flexShrink: 1,
  },
  points: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    gap: Spacing.one,
  },
});
