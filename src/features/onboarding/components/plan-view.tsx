import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { Section } from '@/components/ui/section';
import { BrandGradient, HeroInk, Radius, Spacing } from '@/constants/theme';
import { findProject, getCourse, localizedCourse, localizedProject } from '@/features/courses/data';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { LearningPlan, PlanReason, TopicCoverage } from '../lib/plan';
import type { LearnerProfile } from '../lib/profile';
import { onboardingStrings } from '../strings';

export type PlanViewProps = {
  plan: LearningPlan;
  profile: LearnerProfile;
  /** Opens the first step's lesson (or course). */
  onStart: () => void;
  /** Draw the Start button inside the first-step card (the plan screen); onboarding has its own primary button below. */
  showStart?: boolean;
};

/**
 * The personalized learning plan: the first step to take right now, the recommended path, the skills
 * and projects it builds, the schedule, a summary of the profile it came from and why it was chosen.
 * Every course shown exists in the catalog; topics without one are marked coming soon.
 */
export function PlanView({ plan, profile, onStart, showStart = true }: PlanViewProps) {
  const strings = useLocalized(onboardingStrings);
  const language = useLanguage();
  const theme = useTheme();
  const reasonText = (reason: PlanReason): string => {
    switch (reason.kind) {
      case 'experience':
        return strings.reasons.experience(strings.experience[reason.level].label);
      case 'assessment':
        return reason.raised ? strings.reasons.raised : strings.reasons.assessment(strings.checkLevels[reason.level].label);
      case 'goal':
        return strings.reasons.goal(strings.goals[reason.goal].label);
      case 'interest':
        return strings.reasons.interest(strings.interests[reason.interest]);
    }
  };

  const step = plan.firstStep;
  const stepTitle = step.kind === 'lesson' ? strings.lessonLabel(step.day, step.lessonTitle) : plan.startCourse.title;
  const soon = plan.topics.filter((topic: TopicCoverage) => topic.status === 'soon');
  const days = plan.schedule.days.length > 0 ? plan.schedule.days.map((day) => strings.weekdays[day]).join(', ') : null;
  const when = [strings.lessonsWeek(plan.schedule.lessonsPerWeek), days ? strings.scheduleDays(days) : strings.anyDay, plan.schedule.timeOfDay ? strings.scheduleAt(strings.timesOfDay[plan.schedule.timeOfDay]) : null].filter(Boolean).join(' ');

  return (
    <View style={styles.stack}>
      <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <ThemedText type="caption" style={[styles.heroLabel, { color: HeroInk.muted }]}>
          {strings.firstStepTitle}
        </ThemedText>
        <ThemedText type="section" style={{ color: HeroInk.text }} accessibilityRole="header">
          {strings.journeyStarts(localizedCourse(getCourse(step.courseId), language)?.title ?? localizedCourse(plan.startCourse, language).title)}
        </ThemedText>
        <ThemedText type="bodySemiBold" style={{ color: HeroInk.text }}>
          {stepTitle}
        </ThemedText>
        <ThemedText type="secondary" style={{ color: HeroInk.muted }}>
          {plan.startsWithFree ? strings.freeFirst(plan.startCourse.title) : plan.reasons.slice(0, 2).map(reasonText).join(' ')}
        </ThemedText>
        {showStart && <Button title={step.kind === 'lesson' ? strings.startNow : strings.openCourse} icon="play_arrow" variant="outline" material="solid" onPress={onStart} />}
      </LinearGradient>

      <Section title={strings.pathTitle}>
        <Card padded={false}>
          <CourseRow course={plan.startCourse} caption={`${strings.startingCourse} · ${strings.weeksAtPace(plan.schedule.weeksToFinish)}`} />
          {plan.nextCourses.map((course) => (
            <CourseRow key={course.id} course={course} caption={strings.nextCourses} />
          ))}
        </Card>
      </Section>

      {plan.skills.length > 0 && (
        <Section title={strings.skillsTitle}>
          <Card>
            <View style={styles.chips}>
              {plan.skills.map((skill) => (
                <View key={skill} style={[styles.chip, { backgroundColor: theme.primarySoft }]}>
                  <Icon name="check_circle" size={16} color="primaryText" />
                  <ThemedText type="secondarySemiBold" themeColor="primaryText">
                    {skill}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>
        </Section>
      )}

      {plan.projects.length > 0 && (
        <Section title={strings.projectsTitle}>
          <Card>
            {plan.projects.map((project) => (
              <View key={project.id} style={styles.line}>
                <IconTile icon="rocket_launch" tone="mint" size={32} />
                <ThemedText type="body" style={styles.flex}>
                  {(() => {
                    const found = findProject(project.id);
                    return found ? localizedProject(found.course, found.project, language).title : project.title;
                  })()}
                </ThemedText>
              </View>
            ))}
          </Card>
        </Section>
      )}

      <Section title={strings.scheduleSummary}>
        <Card>
          <View style={styles.line}>
            <IconTile icon="calendar_month" tone="indigo" size={32} />
            <View style={styles.flex}>
              <ThemedText type="bodySemiBold">{strings.minutes(plan.schedule.minutesPerDay)}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {when}
              </ThemedText>
            </View>
          </View>
        </Card>
      </Section>

      <Section title={strings.profileTitle}>
        <Card>
          <FactRow label={strings.experienceTitleShort} value={strings.experience[profile.experience ?? 'complete-beginner'].label} />
          <FactRow label={strings.goalsShort} value={profile.goals.map((goal) => strings.goals[goal].label).join(' · ') || strings.none} />
          <FactRow label={strings.interestsShort} value={profile.interests.map((interest) => strings.interests[interest]).join(' · ') || strings.none} />
          <FactRow label={strings.stylesShort} value={profile.styles.map((style) => strings.styles[style].label).join(' · ') || strings.none} />
          <FactRow label={strings.timeShort} value={profile.dailyMinutes ? strings.minutes(profile.dailyMinutes) : strings.none} />
          {profile.assessment && <FactRow label={strings.checkShort} value={strings.checkLevels[profile.assessment.level].label} last />}
        </Card>
      </Section>

      <Section title={strings.whyThis}>
        <Card>
          {plan.reasons.map((reason, index) => (
            <View key={index} style={styles.reason}>
              <ThemedText type="body" themeColor="primaryText">
                •
              </ThemedText>
              <ThemedText type="body" style={styles.flex}>
                {reasonText(reason)}
              </ThemedText>
            </View>
          ))}
        </Card>
      </Section>

      {soon.length > 0 && (
        <Card tone="backgroundSelected">
          <ThemedText type="cardTitle">{strings.comingSoon}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.comingSoonBody(soon.map((topic) => strings.interests[topic.interest]).join(', '))}
          </ThemedText>
        </Card>
      )}
      {plan.comingSoonGoals.length > 0 && (
        <Card tone="backgroundSelected">
          <ThemedText type="cardTitle">{strings.comingSoon}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.comingSoonBody(plan.comingSoonGoals.map((goal) => strings.goals[goal].label).join(', '))}
          </ThemedText>
        </Card>
      )}
    </View>
  );
}

function CourseRow({ course: englishCourse, caption }: { course: LearningPlan['startCourse']; caption: string }) {
  const course = localizedCourse(englishCourse, useLanguage());
  return (
    <View style={styles.courseRow}>
      <IconTile icon={course.icon as MaterialSymbolName} tone={course.kind === 'mini' ? 'mint' : course.kind === 'starter' || course.kind === 'path' ? 'indigo' : 'violet'} />
      <View style={styles.flex}>
        <ThemedText type="cardTitle" numberOfLines={2}>
          {course.title}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
          {course.tagline}
        </ThemedText>
        <ThemedText type="caption" themeColor="primaryText">
          {caption}
        </ThemedText>
      </View>
      <Button title="" icon="arrow_forward" size="small" variant="ghost" accessibilityLabel={course.title} onPress={() => router.push({ pathname: '/course/[id]', params: { id: course.id } })} />
    </View>
  );
}

function FactRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.fact, !last && styles.factGap]}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="body">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  hero: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  heroLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  // A bullet that lines up with the FIRST line of its text, however many lines the text wraps to (centered, it floated beside the middle line).
  reason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  flex: {
    flex: 1,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  fact: {
    gap: 2,
  },
  factGap: {
    marginBottom: Spacing.three,
  },
});
