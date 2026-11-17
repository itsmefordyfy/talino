import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { IconSize, Spacing } from '@/constants/theme';
import { journeyFocusChanged, journeyStartLevelChanged, selectJourneyFocus, selectJourneyStartLevel } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
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
            showChevron={false}
            trailing={<PickMark on={chosenStart === null} />}
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
              showChevron={false}
              trailing={<PickMark on={chosenStart === level.level} />}
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
          showChevron={false}
          trailing={<ToggleMark on={chosen === null} />}
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
              showChevron={false}
              trailing={<ToggleMark on={on} />}
            />
          );
        })}
      </Card>
      </Section>
    </Screen>
  );
}

// The chosen row's mark (owner, 2026-11-17: "instead of highlight add check"). These rows choose, they open nothing, so they carry no
// chevron: a check beside a chevron was what looked awkward on 2026-11-16, when the rows were tinted instead.

/** Pick one (where to start): a check on the chosen row only, as in the system's own lists. */
function PickMark({ on }: { on: boolean }) {
  return on ? <Icon name="check" size={IconSize.large} color="primary" /> : <View style={styles.mark} />;
}

/** Pick several (where you are heading): an empty circle that fills with a check, so it reads as a box to tick. */
function ToggleMark({ on }: { on: boolean }) {
  return <Icon name={on ? 'check_circle' : 'circle'} size={IconSize.large} color={on ? 'primary' : 'textTertiary'} filled={on} />;
}

const styles = StyleSheet.create({
  mark: { width: IconSize.large, height: IconSize.large },
  head: { gap: Spacing.two },
});
