import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { COURSES, badgeDefinitions } from '@/features/courses/data';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { adventureStrings } from '../strings';

export type AchievementGridProps = {
  /** Ids of the achievements earned. */
  earned: readonly string[];
  /** Show only this many (earned ones first); all when absent. */
  limit?: number;
};

/** Achievements as a grid of badges: earned ones in color, the rest muted with what earns them. */
export function AchievementGrid({ earned, limit }: AchievementGridProps) {
  const strings = useLocalized(adventureStrings);
  const language = useLanguage();
  const theme = useTheme();
  const tones = useTones();
  const have = new Set(earned);
  const all = badgeDefinitions(COURSES, language);
  const sorted = [...all.filter((badge) => have.has(badge.id)), ...all.filter((badge) => !have.has(badge.id))];
  const shown = limit ? sorted.slice(0, limit) : sorted;
  return (
    <View style={styles.grid} accessibilityRole="list">
      {shown.map((badge) => {
        const isEarned = have.has(badge.id);
        const tone = tones[badge.tone];
        return (
          <View
            key={badge.id}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${badge.title}. ${badge.description}. ${isEarned ? strings.earned : strings.notYet}`}
            style={[styles.tile, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={[styles.circle, { backgroundColor: isEarned ? tone.soft : theme.backgroundSelected }]}>
              <Icon name={isEarned ? badge.icon : 'lock'} size={24} tint={isEarned ? tone.ink : theme.textTertiary} filled={isEarned} />
            </View>
            <ThemedText type="caption" themeColor={isEarned ? 'text' : 'textSecondary'} numberOfLines={2} style={styles.title}>
              {badge.title}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: '31%',
    flexGrow: 1,
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two + Spacing.one,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
