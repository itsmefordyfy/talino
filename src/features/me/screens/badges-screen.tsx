import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { LoadingState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { badgeDefinitions, COURSES, useLearning } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { formatDate } from '@/lib/dates';

import { meStrings } from '../strings';

/** Every badge: earned ones with their date, the rest with what earns them. */
export function BadgesScreen() {
  const strings = useLocalized(meStrings);
  const language = useLanguage();
  const theme = useTheme();
  const tones = useTones();
  const learning = useLearning();
  if (learning.isPending) return <LoadingState />;
  const earned = new Map(learning.badges.map((badge) => [badge.badge_id, badge.earned_at]));
  return (
    <Screen>
      {badgeDefinitions(COURSES, language).map((badge) => {
        const date = earned.get(badge.id);
        return (
          <Card
            key={badge.id}
            onPress={() => router.push({ pathname: '/badge/[id]', params: { id: badge.id } })}
            accessibilityLabel={`${badge.title}. ${badge.description}. ${date ? strings.earned(formatDate(date.slice(0, 10))) : strings.locked}`}>
            <View style={styles.row}>
              <View style={[styles.circle, { backgroundColor: date ? tones[badge.tone].soft : theme.backgroundSelected }]}>
                <Icon name={badge.icon} size={26} tint={date ? tones[badge.tone].ink : theme.textTertiary} filled={!!date} />
              </View>
              <View style={styles.flex}>
                <ThemedText type="cardTitle" themeColor={date ? 'text' : 'textSecondary'}>
                  {badge.title}
                </ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {badge.description}
                </ThemedText>
                <ThemedText type="caption" themeColor={date ? 'statusOk' : 'textTertiary'}>
                  {date ? strings.earned(formatDate(date.slice(0, 10))) : strings.locked}
                </ThemedText>
              </View>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
});
