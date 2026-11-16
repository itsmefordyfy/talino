import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityView, type Activity } from '@/features/activities';
import { reportError } from '@/lib/monitoring';
import { Spacing } from '@/constants/theme';

import { useGame, useRecordAttempt } from '../hooks/use-game';
import { conceptOf } from '../lib/concepts';
import { guidanceFor } from '../lib/adaptive';
import { isActivityKind } from '../lib/kinds';
import { ActivityReward } from './activity-reward';

export type ActivitySlotProps = {
  activity: Activity;
  lessonId: string;
  courseId: string;
};

type Reward = { xp: number; alreadySolved: boolean; hintsUsed: number; wrong: number };

/**
 * An interactive activity inside a lesson, wired to the game layer: every try is recorded (for adaptive
 * difficulty and the achievements), the first correct solve pays XP once, and the hints it offers follow
 * how the learner has actually been doing on this concept. A failure to save never blocks the learner.
 */
export function ActivitySlot({ activity, lessonId, courseId }: ActivitySlotProps) {
  const game = useGame();
  const record = useRecordAttempt();
  const [reward, setReward] = useState<Reward | null>(null);
  const row = game.activityRows.find((entry) => entry.activity_id === activity.id);
  const concept = conceptOf({ lesson_id: lessonId, course_id: courseId, kind: activity.kind })[0] ?? activity.kind;
  const guidance = guidanceFor(game.adaptive, concept);

  return (
    <View style={styles.slot}>
      <ActivityView
        activity={activity}
        guidance={guidance}
        solved={row?.solved === 1}
        onAttempt={(event) => {
          if (!isActivityKind(activity.kind)) return;
          record
            .mutateAsync({ activityId: activity.id, lessonId, courseId, kind: activity.kind, correct: event.correct, hintsUsed: event.hintsUsed })
            .catch((error: unknown) => reportError(error, 'courses', { step: 'record_attempt' }));
        }}
        onSolved={(event) => setReward({ xp: row?.xp ?? 0, alreadySolved: row?.solved === 1, hintsUsed: event.hintsUsed, wrong: event.wrong })}
      />
      {reward && <ActivitySolvedReward activityId={activity.id} reward={reward} />}
    </View>
  );
}

/** The XP the solve actually paid, read back from the saved row (the single source of truth), with the honest note about hints or guessing. */
function ActivitySolvedReward({ activityId, reward }: { activityId: string; reward: Reward }) {
  const game = useGame();
  const row = game.activityRows.find((entry) => entry.activity_id === activityId);
  if (!row || row.solved !== 1) return null;
  return <ActivityReward xp={reward.alreadySolved ? 0 : row.xp} alreadySolved={reward.alreadySolved} hintsUsed={reward.hintsUsed} wrong={reward.wrong} />;
}

const styles = StyleSheet.create({
  slot: {
    gap: Spacing.two,
  },
});
