import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MatrixBoard, productivityStrings } from '@/features/productivity';
import type { MatrixPlacements, PrioritizeChallenge } from '@/features/productivity/types';
import { useLocalized } from '@/hooks/use-strings';
import { Spacing } from '@/constants/theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { PlanningActivity } from '../types';
import { CheckBar } from './activity-frame';

export type PlanningPrioritizePanelProps = { activity: PlanningActivity; challenge: PrioritizeChallenge; session: ActivitySession };

/**
 * The graded sorting exercise: the free tool's board on the scenario's fixed tasks. Only each task's title and detail reach the board:
 * the expected box and the reason stay in the data until a check turns them into feedback. A wrong try leaves the board as it is.
 */
export function PlanningPrioritizePanel({ activity, challenge, session }: PlanningPrioritizePanelProps) {
  const t = useLocalized(productivityStrings);
  // Kept while the app is open, like every activity's picks (going back to the lesson and returning leaves the board as it was).
  const [placements, setPlacements] = useActivityDraft<MatrixPlacements>(activity.id, 'placements', {});
  // What the learner had placed when they last checked: a verdict only stands while the task still sits where it was checked.
  const [checked, setChecked] = useActivityDraft<MatrixPlacements>(activity.id, 'checked', {});

  const tasks = challenge.tasks.map(({ id, title, detail }) => ({ id, title, detail }));
  const unplaced = tasks.filter((task) => !placements[task.id]).length;
  const matrix = session.result?.detail?.kind === 'planning' && session.result.detail.mode === 'prioritize' ? session.result.detail.matrix : null;

  const verdicts: Record<string, 'right' | 'wrong'> = {};
  if (matrix) {
    for (const id of matrix.right) if (checked[id] && checked[id] === placements[id]) verdicts[id] = 'right';
    for (const wrong of matrix.wrong) if (checked[wrong.id] === wrong.got && placements[wrong.id] === wrong.got) verdicts[wrong.id] = 'wrong';
  }

  return (
    <View style={styles.root}>
      <ThemedText type="secondarySemiBold" themeColor="textSecondary" accessibilityRole="header">
        {t.sortBoardLabel}
      </ThemedText>
      <MatrixBoard
        tasks={tasks}
        placements={placements}
        verdicts={verdicts}
        readOnly={session.done}
        onMove={(taskId, to) =>
          setPlacements((current) => {
            const next = { ...current };
            if (to === null) delete next[taskId];
            else next[taskId] = to;
            return next;
          })
        }
      />
      {unplaced > 0 && !session.done ? (
        <ThemedText type="secondary" themeColor="textSecondary" accessibilityLiveRegion="polite">
          {t.sortWhyDisabled(unplaced)}
        </ThemedText>
      ) : null}
      <CheckBar
        session={session}
        label={t.sortCheck}
        canCheck={unplaced === 0}
        onCheck={() => {
          if (unplaced > 0) return;
          setChecked({ ...placements });
          void session.check({ kind: 'planning', mode: 'prioritize', placements });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
});
