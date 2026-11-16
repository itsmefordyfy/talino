import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { LoadingState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { requestNotificationPermission } from '@/features/notifications';
import { dailyMinutesChanged, dailyReminderTimeChanged, dailyReminderToggled, goalChanged, reminderDaysChanged, selectDailyReminder, selectDailyReminderTime } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { LevelSuggestionCard } from '../components/level-suggestion-card';
import { SkillCheck } from '../components/skill-check';
import { ExperienceStep, GoalsStep, InterestsStep, MinutesStep, ScheduleStep, StylesStep } from '../components/profile-steps';
import { usePlanner, useProfile, useSaveProfile, useSetLearnerLevel } from '../hooks/use-profile';
import { effectiveExperience } from '../lib/assessment';
import { levelControlStrings } from '../level-strings';
import { audienceFor } from '../lib/audience';
import type { TimeOfDay } from '../lib/options';
import { EMPTY_PROFILE, type LearnerProfile } from '../lib/profile';
import { onboardingStrings } from '../strings';

const TIME_OF_DAY_HOUR: Record<TimeOfDay, number> = { morning: 8, afternoon: 13, evening: 19 };

/**
 * Settings → Learning profile: every onboarding answer, editable at any time and saved as it changes.
 * Changing an answer updates the plan and the recommendations; progress, badges and certificates are never touched.
 */
export function LearningProfileScreen() {
  const strings = useLocalized(onboardingStrings);
  const levelWords = useLocalized(levelControlStrings);
  const { setLevel } = useSetLearnerLevel();
  const [checking, setChecking] = useState(false);
  const dispatch = useAppDispatch();
  const query = useProfile();
  const planner = usePlanner();
  const save = useSaveProfile();
  const reminderOn = useAppSelector(selectDailyReminder);
  const reminderTime = useAppSelector(selectDailyReminderTime);
  const [denied, setDenied] = useState(false);

  if (query.isPending || planner.isPending) return <LoadingState />;
  const stored = query.data ?? null;
  const profile: LearnerProfile = stored ?? EMPTY_PROFILE;

  /** Saves a change and refreshes the stored plan; a first save from settings (an older install) counts as completed. */
  const change = (patch: Partial<LearnerProfile>) => {
    const merged: LearnerProfile = { ...profile, ...patch };
    const plan = planner.planFor(merged);
    save.mutate({ ...patch, plan: plan ? { startCourseId: plan.startCourse.id, nextCourseIds: plan.nextCourses.map((course) => course.id), generatedAt: new Date().toISOString() } : null, status: 'completed' });
    if (merged.experience && merged.goals.length > 0) dispatch(goalChanged(audienceFor(merged)));
  };

  // The skill check lives here only (it was removed from onboarding on purpose). It suggests a level; the learner decides.
  if (checking && profile.experience) {
    const declared = profile.experience;
    return (
      <SkillCheck
        experience={declared}
        onLeave={() => setChecking(false)}
        onFinish={() => setChecking(false)}
        resultFooter={(result) => {
          const suggested = effectiveExperience(declared, result.level);
          const same = suggested === declared;
          return (
            <View style={styles.checkFooter}>
              <ThemedText type="bodySemiBold" style={styles.centerText}>
                {same ? levelWords.checkAgrees : levelWords.checkSuggests(strings.experience[suggested].label)}
              </ThemedText>
              {!same && (
                <Button
                  title={levelWords.useThisLevel}
                  icon="check"
                  onPress={() => {
                    setLevel(suggested);
                    setChecking(false);
                  }}
                />
              )}
              <Button title={same ? strings.done : levelWords.keepMyLevel} variant="secondary" onPress={() => setChecking(false)} />
              <ThemedText type="caption" themeColor="textSecondary" style={styles.centerText}>
                {levelWords.progressStays}
              </ThemedText>
            </View>
          );
        }}
      />
    );
  }

  const remind = async (on: boolean) => {
    const granted = on ? await requestNotificationPermission() : false;
    setDenied(on && !granted);
    dispatch(dailyReminderToggled(on && granted));
  };

  return (
    <Screen>
      <ThemedText type="body" themeColor="textSecondary">
        {strings.settingsBody}
      </ThemedText>

      <LevelSuggestionCard />

      <Card>
        <ThemedText type="section" accessibilityRole="header">
          {levelWords.yourLevelTitle}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary" style={styles.levelBody}>
          {levelWords.yourLevelBody}
        </ThemedText>
        <View style={styles.section}>
          {/* Saved as it is chosen. setLevel replaces any older skill-check result and never touches progress, badges or certificates. */}
          <ExperienceStep value={profile.experience} onChange={setLevel} />
        </View>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.levelBody}>
          {levelWords.progressStays}
        </ThemedText>
        <View style={styles.section}>
          <Button title={levelWords.checkMyLevel} icon="fact_check" variant="secondary" disabled={!profile.experience} onPress={() => setChecking(true)} />
          <ThemedText type="caption" themeColor="textSecondary">
            {profile.experience ? levelWords.checkMyLevelBody : levelWords.chooseLevelFirst}
          </ThemedText>
        </View>
      </Card>

      <Card>
        <ThemedText type="section">{strings.goalsTitle}</ThemedText>
        <View style={styles.section}>
          <GoalsStep value={profile.goals} onChange={(goals) => change({ goals })} />
        </View>
      </Card>

      <Card>
        <ThemedText type="section">{strings.interestsTitle}</ThemedText>
        <View style={styles.section}>
          <InterestsStep value={profile.interests} onChange={(interests) => change({ interests })} />
        </View>
      </Card>

      <Card>
        <ThemedText type="section">{strings.stylesTitle}</ThemedText>
        <View style={styles.section}>
          <StylesStep value={profile.styles} onChange={(styles) => change({ styles })} />
        </View>
      </Card>

      <Card>
        <ThemedText type="section">{strings.timeTitle}</ThemedText>
        <View style={styles.section}>
          <MinutesStep
            value={profile.dailyMinutes}
            onChange={(dailyMinutes) => {
              dispatch(dailyMinutesChanged(dailyMinutes));
              change({ dailyMinutes });
            }}
          />
        </View>
      </Card>

      <Card>
        <ThemedText type="section">{strings.scheduleTitle}</ThemedText>
        <View style={styles.section}>
          <ScheduleStep
            days={profile.days}
            onDays={(days) => {
              dispatch(reminderDaysChanged(days));
              change({ days });
            }}
            timeOfDay={profile.timeOfDay}
            onTimeOfDay={(timeOfDay) => {
              if (timeOfDay) dispatch(dailyReminderTimeChanged({ hour: TIME_OF_DAY_HOUR[timeOfDay], minute: 0 }));
              change({ timeOfDay });
            }}
            weeklyGoal={profile.weeklyGoal}
            onWeeklyGoal={(weeklyGoal) => change({ weeklyGoal })}
            reminder={{ on: reminderOn, time: reminderTime, denied, onToggle: (on) => void remind(on), onTime: (time) => dispatch(dailyReminderTimeChanged(time)) }}
          />
        </View>
      </Card>

      <Button title={strings.seeFullPlan} icon="route" onPress={() => router.push('/my-plan')} disabled={!profile.experience || profile.goals.length === 0} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  levelBody: {
    marginTop: Spacing.two,
  },
  checkFooter: {
    gap: Spacing.two,
  },
  centerText: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
});
