import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { MatrixBoard, MAX_TOOL_TASKS, productivityStrings, readMatrixState, writeMatrixState, EMPTY_MATRIX, type MatrixToolState } from '@/features/productivity';
import { useLocalized } from '@/hooks/use-strings';
import { newId } from '@/lib/id';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { addMatrixTask, isMatrixFull, placeMatrixTask, removeMatrixTask } from './eisenhower-state';
import { productivityVisualStrings } from './strings';

const MATRIX_KEY = ['productivity', 'matrix'] as const;

/**
 * The free Eisenhower matrix: the learner's own tasks and where they put them, kept on this phone between visits. Every change is
 * read-modified-written in one go against the saved state, so two quick taps never overwrite each other with an old copy.
 */
export function EisenhowerVisual({ compact }: VisualProps) {
  const frame = useLocalized(productivityVisualStrings).eisenhower;
  const t = useLocalized(productivityStrings);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const query = useDbQuery(MATRIX_KEY, readMatrixState);
  const change = useDbMutation(
    async (db, update: (state: MatrixToolState) => MatrixToolState) => {
      await writeMatrixState(db, update(await readMatrixState(db)));
    },
    // The tools are not part of the cloud backup, so a change here must not start one.
    { notify: false },
  );

  const state = query.data;
  const apply = (update: (current: MatrixToolState) => MatrixToolState) => change.mutate(update);

  const body = query.isPending ? (
    <View style={styles.loading} accessibilityLabel={t.matrixTitle} accessibilityState={{ busy: true }}>
      <SkeletonBlock height={44} />
      <SkeletonBlock height={120} />
      <SkeletonBlock height={120} />
    </View>
  ) : query.isError || !state ? (
    <View style={styles.loading}>
      <Notice tone="danger" message={t.matrixLoadError} />
      <Button size="small" variant="secondary" icon="refresh" title={t.matrixRetry} onPress={() => void query.refetch()} />
    </View>
  ) : (
    <MatrixBoard
      tasks={state.tasks}
      placements={state.placements}
      onMove={(taskId, to) => apply((current) => placeMatrixTask(current, taskId, to))}
      onAdd={isMatrixFull(state) ? undefined : (title) => apply((current) => addMatrixTask(current, newId(), title))}
      onRemove={(taskId) => apply((current) => removeMatrixTask(current, taskId))}
    />
  );

  const hasTasks = (state?.tasks.length ?? 0) > 0;
  return (
    <VisualFrame
      title={frame.title}
      description={frame.description}
      compact={compact}
      caption={change.isError ? t.matrixSaveError : compact ? undefined : t.matrixIntro}
      controls={
        state && hasTasks ? (
          <View style={styles.controls}>
            {isMatrixFull(state) ? <Notice tone="info" message={t.matrixFull(MAX_TOOL_TASKS)} /> : null}
            {confirmingClear ? (
              <View style={styles.confirm} accessibilityLiveRegion="polite">
                <ThemedText type="secondary">{t.matrixResetAsk}</ThemedText>
                <View style={styles.confirmButtons}>
                  <Button
                    size="small"
                    variant="danger"
                    icon="delete"
                    title={t.matrixResetYes}
                    onPress={() => {
                      setConfirmingClear(false);
                      apply(() => EMPTY_MATRIX);
                    }}
                  />
                  <Button size="small" variant="outline" title={t.matrixResetKeep} onPress={() => setConfirmingClear(false)} />
                </View>
              </View>
            ) : (
              <Button size="small" variant="ghost" icon="restart_alt" title={t.matrixReset} onPress={() => setConfirmingClear(true)} style={styles.clear} />
            )}
          </View>
        ) : undefined
      }>
      {body}
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  loading: { gap: Spacing.two, alignItems: 'stretch' },
  controls: { gap: Spacing.two },
  clear: { alignSelf: 'flex-start' },
  confirm: { gap: Spacing.two },
  confirmButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
