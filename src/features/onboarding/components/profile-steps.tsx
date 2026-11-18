import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect, type ChipOption } from '@/components/ui/chip-select';
import type { IconName } from '@/components/ui/icon';
import { OptionCard } from '@/components/ui/option-card';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { TimeField } from '@/components/ui/time-field';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { parseTime } from '@/lib/dates';

import { cleanInterests } from '../lib/profile';
import { DAILY_MINUTE_CHOICES, EXPERIENCE_LEVELS, GOAL_IDS, INTEREST_GROUPS, NOT_SURE, STYLE_IDS, TIMES_OF_DAY, WEEKDAYS, WEEKLY_GOAL_CHOICES, type ExperienceLevel, type GoalId, type InterestId, type StyleId, type TimeOfDay } from '../lib/options';
import { onboardingCourseStrings } from '../course-strings';
import { onboardingStrings } from '../strings';

/**
 * One section per onboarding question. Each is a plain controlled component (value in, change out), so
 * the same section is used in the step-by-step onboarding and, later, in Settings → Learning profile.
 */

const EXPERIENCE_ICONS: Record<ExperienceLevel, IconName> = { 'complete-beginner': 'flag', beginner: 'school', intermediate: 'build', advanced: 'rocket_launch', professional: 'work' };
const GOAL_ICONS: Record<GoalId, IconName> = {
  'from-scratch': 'play_circle',
  'software-engineer': 'terminal',
  frontend: 'web',
  backend: 'storage',
  'full-stack': 'layers',
  mobile: 'smartphone',
  ai: 'smart_toy',
  'data-science': 'insights',
  'game-dev': 'sports_esports',
  'improve-skills': 'trending_up',
  'interview-prep': 'record_voice_over',
  'build-startup': 'rocket_launch',
  'explore-cs': 'explore',
  freelance: 'work',
  teach: 'groups',
};
const STYLE_ICONS: Record<StyleId, IconName> = { 'short-lessons': 'timer', 'step-by-step': 'format_list_numbered', interactive: 'code', projects: 'build', video: 'videocam', reading: 'menu_book', quizzes: 'quiz', 'ai-guided': 'auto_awesome' };

const toggle = <T,>(list: readonly T[], item: T): T[] => (list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]);

export function NameStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const strings = useLocalized(onboardingStrings);
  return <TextField label={strings.nameLabel} value={value} onChangeText={onChange} placeholder={strings.namePlaceholder} autoCapitalize="words" autoComplete="name" textContentType="name" />;
}

export function ExperienceStep({ value, onChange }: { value: ExperienceLevel | null; onChange: (value: ExperienceLevel) => void }) {
  const strings = useLocalized(onboardingStrings);
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {EXPERIENCE_LEVELS.map((level) => (
        <OptionCard key={level} mode="single" icon={EXPERIENCE_ICONS[level]} title={strings.experience[level].label} detail={strings.experience[level].detail} selected={value === level} onPress={() => onChange(level)} />
      ))}
    </View>
  );
}

export function GoalsStep({ value, onChange }: { value: readonly GoalId[]; onChange: (value: GoalId[]) => void }) {
  const strings = useLocalized(onboardingStrings);
  return (
    <View style={styles.stack}>
      {GOAL_IDS.map((goal) => (
        <OptionCard key={goal} mode="multiple" icon={GOAL_ICONS[goal]} title={strings.goals[goal].label} selected={value.includes(goal)} onPress={() => onChange(toggle(value, goal))} />
      ))}
    </View>
  );
}

export function InterestsStep({ value, onChange }: { value: readonly InterestId[]; onChange: (value: InterestId[]) => void }) {
  const strings = useLocalized(onboardingStrings);
  const notSure = value.includes(NOT_SURE);
  return (
    <View style={styles.groups}>
      <OptionCard mode="multiple" icon="explore" title={strings.interests[NOT_SURE]} detail={strings.notSureDetail} selected={notSure} onPress={() => onChange(notSure ? [] : [NOT_SURE])} />
      {INTEREST_GROUPS.map((group) => {
        const options: ChipOption<InterestId>[] = group.interests.map((id) => ({ value: id, label: strings.interests[id] }));
        return (
          <View key={group.id} style={styles.group}>
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {strings.interestGroups[group.id]}
            </ThemedText>
            <ChipSelect multiple wrap options={options} value={value} onChange={(next) => onChange(cleanInterests(next.filter((id) => id !== NOT_SURE)))} />
          </View>
        );
      })}
    </View>
  );
}

export function StylesStep({ value, onChange }: { value: readonly StyleId[]; onChange: (value: StyleId[]) => void }) {
  const strings = useLocalized(onboardingStrings);
  return (
    <View style={styles.stack}>
      {STYLE_IDS.map((style) => (
        <OptionCard key={style} mode="multiple" icon={STYLE_ICONS[style]} title={strings.styles[style].label} selected={value.includes(style)} onPress={() => onChange(toggle(value, style))} />
      ))}
      {value.includes('video') && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.videoNote}
        </ThemedText>
      )}
    </View>
  );
}

export function MinutesStep({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  const strings = useLocalized(onboardingStrings);
  const goals = useLocalized(onboardingCourseStrings);
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {DAILY_MINUTE_CHOICES.map((minutes) => (
        <OptionCard key={minutes} mode="single" icon="timer" title={goals.tiers[minutes] ? goals.tierTitle(goals.tiers[minutes], minutes) : strings.minutes(minutes)} detail={strings.minutesDetail(minutes)} selected={value === minutes} onPress={() => onChange(minutes)} />
      ))}
    </View>
  );
}

export type ScheduleStepProps = {
  days: readonly number[];
  onDays: (days: number[]) => void;
  timeOfDay: TimeOfDay | null;
  onTimeOfDay: (value: TimeOfDay | null) => void;
  weeklyGoal: number | null;
  onWeeklyGoal: (value: number | null) => void;
  reminder: { on: boolean; time: { hour: number; minute: number }; denied: boolean; onToggle: (on: boolean) => void; onTime: (time: { hour: number; minute: number }) => void };
};

const pad = (value: number) => String(value).padStart(2, '0');

/** Optional: which days, what time of day, a weekly goal, and the reminder (its permission is asked only when it is switched on). */
export function ScheduleStep({ days, onDays, timeOfDay, onTimeOfDay, weeklyGoal, onWeeklyGoal, reminder }: ScheduleStepProps) {
  const strings = useLocalized(onboardingStrings);
  const dayOptions: ChipOption<string>[] = WEEKDAYS.map((day) => ({ value: String(day), label: strings.weekdays[day] }));
  const timeOptions: ChipOption<TimeOfDay>[] = TIMES_OF_DAY.map((time) => ({ value: time, label: strings.timesOfDay[time] }));
  const goalOptions: ChipOption<string>[] = [{ value: 'auto', label: strings.weeklyGoalAuto }, ...WEEKLY_GOAL_CHOICES.map((count) => ({ value: String(count), label: strings.weeklyGoal(count) }))];
  return (
    <View style={styles.groups}>
      <View style={styles.group}>
        <ThemedText type="secondarySemiBold">{strings.daysLabel}</ThemedText>
        <ChipSelect multiple wrap options={dayOptions} value={days.map(String)} onChange={(next) => onDays(next.map(Number).sort((a, b) => a - b))} />
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.daysHint}
        </ThemedText>
      </View>
      <View style={styles.group}>
        <ThemedText type="secondarySemiBold">{strings.timeOfDayLabel}</ThemedText>
        <ChipSelect wrap options={timeOptions} value={timeOfDay} onChange={(next) => onTimeOfDay(next === timeOfDay ? null : next)} />
      </View>
      <View style={styles.group}>
        <ThemedText type="secondarySemiBold">{strings.weeklyGoalLabel}</ThemedText>
        <ChipSelect wrap options={goalOptions} value={weeklyGoal === null ? 'auto' : String(weeklyGoal)} onChange={(next) => onWeeklyGoal(next === 'auto' ? null : Number(next))} />
      </View>
      <View style={styles.group}>
        <View style={styles.reminderRow}>
          <ThemedText type="secondarySemiBold" style={styles.reminderLabel}>
            {strings.reminderLabel}
          </ThemedText>
          <Toggle value={reminder.on} onValueChange={reminder.onToggle} accessibilityLabel={strings.reminderLabel} />
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {reminder.denied ? strings.reminderDenied : strings.reminderWhy}
        </ThemedText>
        {reminder.on && (
          <TimeField
            label={strings.reminderTime}
            value={`${pad(reminder.time.hour)}:${pad(reminder.time.minute)}`}
            placeholder="19:00"
            onChange={(value) => {
              const parsed = parseTime(value);
              if (parsed) reminder.onTime(parsed);
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  groups: {
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  reminderLabel: {
    flex: 1,
  },
});
