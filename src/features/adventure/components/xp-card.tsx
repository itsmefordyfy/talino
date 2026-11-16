import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { adventureStrings } from '../strings';
import type { LevelProgress } from '../lib/xp';
import { LevelBadge } from './level-badge';

export type XpCardProps = {
  xp: number;
  levelTitle: string;
  progress: LevelProgress;
  onPress?: () => void;
};

/** Total XP, the level with its warm title, and how far it is to the next level. */
export function XpCard({ xp, levelTitle, progress, onPress }: XpCardProps) {
  const strings = useLocalized(adventureStrings);
  return (
    <Card onPress={onPress} accessibilityLabel={`${strings.level(progress.level)}, ${levelTitle}. ${strings.xpTotal(xp)}. ${strings.xpToNext(progress.xpToNext, progress.level + 1)}`}>
      <View style={styles.row}>
        <LevelBadge level={progress.level} size={52} />
        <View style={styles.flex}>
          <ThemedText type="cardTitle">{levelTitle}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary" tabular>
            {strings.xpTotal(xp)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.bar}>
        <ProgressBar fraction={progress.fraction} accessibilityLabel={strings.xpToNext(progress.xpToNext, progress.level + 1)} />
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {strings.xpToNext(progress.xpToNext, progress.level + 1)}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  bar: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
});
