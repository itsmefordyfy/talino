import { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { CelebrationCard } from '@/components/celebration-card';
import { badgeLine } from '@/features/companion/lib/messages';
import { selectLearnerName } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';
import { ConfettiFall } from '@/components/confetti-fall';
import { Icon } from '@/components/ui/icon';
import { HeroInk, Spacing } from '@/constants/theme';
import { useDbQuery } from '@/db/use-db-query';
import { useGame } from '@/features/adventure';
import { badgeDefinitions, COURSES, earnedBadges, useAwardBadges, useLearning, useMarkBadgesSeen } from '@/features/courses';
import { completedStageIds, useJourney } from '@/features/journey';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { useViewport } from '@/hooks/use-viewport';
import { reportError } from '@/lib/monitoring';

import { readTrackerCounts } from '../api/career-counts';
import { meStrings } from '../strings';

/**
 * Awards badges as progress changes (lessons, quizzes, projects, streaks, the career tracker), then
 * celebrates the new ones with Tali and confetti. A badge is never taken back.
 */
export function BadgeSync() {
  const name = useAppSelector(selectLearnerName);
  const language = useLanguage();
  const learning = useLearning();
  const counts = useDbQuery(['tracker-counts'], readTrackerCounts);
  const game = useGame();
  const journey = useJourney();
  const award = useAwardBadges();
  const markSeen = useMarkBadgesSeen();
  const strings = useLocalized(meStrings);
  const theme = useTheme();
  const tones = useTones();
  const { height } = useViewport();

  // The game rows are read too, so the activity badges are never judged against rows that haven't loaded yet.
  const ready = !learning.isPending && !game.isPending && !journey.isPending && !!counts.data;
  const earned = ready
    ? earnedBadges({
        courses: COURSES,
        progress: learning.progress,
        bestStreak: learning.streak.best,
        passedProjects: new Set((learning.data?.projects ?? []).filter((row) => row.status === 'passed').map((row) => row.project_id)),
        ...counts.data,
        ...game.badgeStats,
        journeyStagesDone: completedStageIds(journey.state),
        journeyComplete: journey.state.complete,
      })
    : [];
  const have = new Set(learning.badges.map((badge) => badge.badge_id));
  const missing = earned.filter((id) => !have.has(id));
  const missingKey = missing.join(',');

  useEffect(() => {
    if (!missingKey || award.isPending) return;
    award.mutateAsync(missingKey.split(',')).catch((error: unknown) => reportError(error, 'courses', { step: 'badges' }));
  }, [missingKey, award]);

  const unseen = learning.badges.filter((badge) => badge.seen === 0);
  const definitions = new Map(badgeDefinitions(COURSES, language).map((badge) => [badge.id, badge]));
  const first = unseen.map((badge) => definitions.get(badge.badge_id)).find((badge) => !!badge);
  if (!first) return null;
  const tone = tones[first.tone];
  const line = badgeLine({ title: first.title, name, language });
  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => markSeen.mutate()}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <CelebrationCard
          mood={line.mood}
          announcement={line.text}
          prize={
            <View style={[styles.medallion, { backgroundColor: tone.soft }]}>
              <Icon name={first.icon} size={44} tint={tone.ink} filled />
            </View>
          }
          eyebrow={unseen.length > 1 ? strings.newBadges(unseen.length) : strings.newBadge}
          title={first.title}
          message={first.description}
          actionLabel={strings.nice}
          onAction={() => markSeen.mutate()}
        />
        {/* After the card, so it falls over it: on top of everything, but never in the way of a tap (it takes no touches). */}
        <ConfettiFall height={height} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  // The badge as a medallion: its soft colour with a light ring, so it reads on the gradient behind it.
  medallion: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: HeroInk.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
});
