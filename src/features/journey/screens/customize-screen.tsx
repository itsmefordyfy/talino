import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { journeyFocusChanged, journeyStartLevelChanged, selectJourneyFocus, selectJourneyStartLevel } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { closeScreen } from '@/lib/navigation';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { Section } from '@/components/ui/section';

import { useJourney } from '../hooks/use-journey';
import { JOURNEY_FOCUS_IDS, type JourneyFocusId } from '../lib/focus-ids';
import { journeyStrings } from '../strings';

const ICONS = { web: 'language', ai: 'smart_toy', mobile: 'smartphone', freelance: 'work', hired: 'badge', teach: 'school' } as const;

/**
 * Where the learner is heading. Choosing a direction makes the milestones for the others optional (still there, never blocking), and
 * choosing "Automatic" goes back to what the welcome learned. It changes only the plan, never a lesson, a project or a badge.
 */
export function CustomizeJourneyScreen() {
  const text = useLocalized(journeyStrings).customize;
  const chosen = useAppSelector(selectJourneyFocus);
  const chosenStart = useAppSelector(selectJourneyStartLevel);
  const journey = useJourney();
  const dispatch = useAppDispatch();
  // A chosen row is tinted instead of carrying a check mark (owner, 2026-11-16: the ✓ beside the chevron looked awkward).
  const theme = useTheme();
  const selectedRow = { backgroundColor: theme.primarySoft };
  const levels = journey.definition.stages;
  const start = journey.state.start;
  const startTitle = levels[start.index]?.title ?? '';
  const toggle = (id: JourneyFocusId) => {
    tapFeedback();
    const current = chosen ?? [];
    const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
    dispatch(journeyFocusChanged(next.length > 0 ? next : null));
  };
  return (
    <Screen footer={<Button title={text.save} onPress={closeScreen} />}>
      <View style={styles.head}>
        <ThemedText type="title" accessibilityRole="header">
          {text.title}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.body}
        </ThemedText>
      </View>
      <Section title={text.startTitle}>
        <Card padded={false}>
          <ListRow
            title={chosenStart === null ? text.startAutomatic(startTitle) : text.automatic}
            subtitle={chosenStart === null ? text.reasons[start.reason] : text.automaticBody}
            icon="auto_awesome"
            tone="violet"
            selected={chosenStart === null}
            onPress={() => {
              tapFeedback();
              dispatch(journeyStartLevelChanged(null));
            }}
            style={chosenStart === null ? selectedRow : undefined}
          />
          {levels.map((level, index) => (
            <ListRow
              key={level.id}
              title={`${index + 1}. ${level.title}`}
              subtitle={level.forWhom}
              titleLines={1}
              icon={level.icon}
              tone="violet"
              selected={chosenStart === level.level}
              onPress={() => {
                tapFeedback();
                dispatch(journeyStartLevelChanged(level.level));
              }}
              style={chosenStart === level.level ? selectedRow : undefined}
            />
          ))}
        </Card>
        <ThemedText type="caption" themeColor="textSecondary">
          {text.startBody}
        </ThemedText>
      </Section>
      <Section title={text.directionTitle}>
      <Card padded={false}>
        <ListRow
          title={text.automatic}
          subtitle={text.automaticBody}
          icon="auto_awesome"
          tone="violet"
          selected={chosen === null}
          onPress={() => {
            tapFeedback();
            dispatch(journeyFocusChanged(null));
          }}
          style={chosen === null ? selectedRow : undefined}
        />
        {JOURNEY_FOCUS_IDS.map((id) => {
          const on = chosen?.includes(id) ?? false;
          return (
            <ListRow
              key={id}
              title={text.focus[id]}
              icon={ICONS[id]}
              tone="violet"
              checked={on}
              onPress={() => toggle(id)}
              style={on ? selectedRow : undefined}
            />
          );
        })}
      </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: Spacing.two },
});
