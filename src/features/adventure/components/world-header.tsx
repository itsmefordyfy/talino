import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing } from '@/constants/theme';
import { withCompanionName } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';
import { useAppSelector } from '@/store/hooks';

import type { WorldTheme } from '../lib/world-themes';
import type { World } from '../lib/world';
import { adventureStrings } from '../strings';

export type WorldHeaderProps = { world: World; theme: WorldTheme; xp: number };

/** The top of a world: its name, the light story, the progress and the XP earned here. */
export function WorldHeader({ world, theme: written, xp }: WorldHeaderProps) {
  // The stories are written for Tali; Tala's learner reads them with her name.
  const theme = withCompanionName(written, useAppSelector(selectCompanion));
  const strings = useLocalized(adventureStrings);
  const tone = useTones()[theme.tone];
  const nextLabel = world.next?.kind === 'mission' ? strings.nextMission(world.next.lesson.title) : world.next?.kind === 'boss' ? strings.nextBoss(world.next.project.title) : null;
  return (
    <View style={[styles.card, { backgroundColor: tone.soft }]}>
      <View style={styles.top}>
        <IconTile icon={theme.icon} tone={theme.tone} size={52} />
        <View style={styles.flex}>
          <ThemedText type="caption" style={[styles.eyebrow, { color: tone.ink }]}>
            {strings.worldMap}
          </ThemedText>
          <ThemedText type="section" accessibilityRole="header" style={{ color: tone.ink }}>
            {theme.name}
          </ThemedText>
        </View>
      </View>
      <View style={styles.story} accessibilityLabel={`${strings.storyLabel}. ${theme.story.premise} ${theme.story.mission}`} accessible>
        <ThemedText type="body">{theme.story.premise}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {theme.story.mission}
        </ThemedText>
      </View>
      <View style={styles.progress}>
        <ProgressBar fraction={world.fraction} done={world.complete} accessibilityLabel={strings.worldProgress(world.percent)} />
        <View style={styles.statsRow}>
          <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>
            {world.complete ? strings.worldComplete : strings.worldProgress(world.percent)}
          </ThemedText>
          <View style={styles.xp}>
            <Icon name="bolt" size={16} tint={tone.ink} filled />
            <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>
              {strings.worldXp(xp)}
            </ThemedText>
          </View>
        </View>
      </View>
      {nextLabel && (
        <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
          {nextLabel}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  story: {
    gap: Spacing.one,
  },
  progress: {
    gap: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  xp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
});
