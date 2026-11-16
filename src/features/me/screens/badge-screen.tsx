import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { LoadingState, NotFoundState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { badgeDefinitions, COURSES, useLearning } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { formatDate } from '@/lib/dates';

import { meExtraStrings } from '../me-extra-strings';

const MEDALLION = 112;

export type BadgeScreenProps = { badgeId: string };

/**
 * One badge, as a sheet over the screen that listed it (owner, 2026-11-16: "when I click a badge it should show a modal and information about
 * the badge"): the medallion, its name, whether and when it was earned, and what earns it (the same words the list shows, in full).
 */
export function BadgeScreen({ badgeId }: BadgeScreenProps) {
  const text = useLocalized(meExtraStrings);
  const language = useLanguage();
  const theme = useTheme();
  const tones = useTones();
  const learning = useLearning();
  if (learning.isPending) return <LoadingState />;
  const badge = badgeDefinitions(COURSES, language).find((entry) => entry.id === badgeId);
  if (!badge) return <NotFoundState icon="military_tech" title={text.badgeNotFound} />;
  const earnedAt = learning.badges.find((row) => row.badge_id === badge.id)?.earned_at ?? null;
  const tone = tones[badge.tone];
  const status = earnedAt ? text.badgeEarnedOn(formatDate(earnedAt.slice(0, 10))) : text.badgeNotYet;
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero} accessible accessibilityLabel={`${badge.title}. ${status}`}>
        <View style={[styles.medallion, { backgroundColor: earnedAt ? tone.soft : theme.backgroundSelected, borderColor: earnedAt ? tone.solid : theme.border }]}>
          <Icon name={badge.icon} size={52} tint={earnedAt ? tone.ink : theme.textTertiary} filled={!!earnedAt} />
        </View>
        <ThemedText type="title" style={styles.center} accessibilityRole="header">
          {badge.title}
        </ThemedText>
        <View style={[styles.status, { backgroundColor: earnedAt ? theme.statusOkSoft : theme.backgroundSelected }]}>
          <Icon name={earnedAt ? 'check_circle' : 'lock'} size={16} color={earnedAt ? 'statusOk' : 'textTertiary'} />
          <ThemedText type="secondarySemiBold" themeColor={earnedAt ? 'statusOk' : 'textSecondary'}>
            {status}
          </ThemedText>
        </View>
      </View>
      <Card>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
          {earnedAt ? text.badgeEarnedHow : text.badgeHowToEarn}
        </ThemedText>
        <ThemedText type="body" selectable>
          {badge.description}
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  medallion: {
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.one,
  },
});
