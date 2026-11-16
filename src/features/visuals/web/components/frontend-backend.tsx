import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { DiagramView, stableValue, type DiagramSpec } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { answerJob, JOB_IDS, JOB_PLACE, nextJob, nodesFor, START, type Place } from '../lib/where-runs';
import { webStrings, type WebStrings } from '../strings';

const PLACES: readonly Place[] = ['frontend', 'backend', 'both'];

function whereSpec(s: WebStrings['where']): DiagramSpec {
  return {
    kind: 'architecture',
    title: s.title,
    summary: s.diagramSummary,
    direction: 'TD',
    nodes: [
      { id: 'frontend', label: s.diagram.frontend, group: 'Client' },
      { id: 'backend', label: s.diagram.backend, group: 'Server' },
    ],
    edges: [{ from: 'frontend', to: 'backend', label: s.diagram.edge, bidirectional: true }],
  };
}

/** A ten-job quiz: does each job run in the frontend, the backend or both? The reason is shown after each answer. */
export function FrontendBackendVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).where;
  const [state, setState] = useState(START);
  const spec = stableValue(s, 'spec', () => whereSpec(s));
  const total = JOB_IDS.length;
  const jobId = JOB_IDS[state.index];
  const job = s.jobs[jobId];
  const place = JOB_PLACE[jobId];
  const answered = state.picked !== null;
  const correct = state.picked === place;

  const caption = state.finished ? s.done(state.right, total) : answered ? (correct ? s.correct : s.notQuite) : s.question(state.index + 1, total);

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={caption}
      controls={
        state.finished ? (
          <Button title={s.restart} icon="refresh" size="small" onPress={() => setState(START)} />
        ) : answered ? (
          <View style={styles.stack}>
            <Notice tone={correct ? 'success' : 'warning'}>
              <ThemedText type="secondary">{`${s.answerWas(s.answers[place])} ${job.reason}`}</ThemedText>
            </Notice>
            <Button title={state.index === total - 1 ? s.finish : s.next} icon="arrow_forward" size="small" onPress={() => setState(nextJob(state))} />
          </View>
        ) : (
          <View style={styles.row}>
            {PLACES.map((choice) => (
              <Button
                key={choice}
                title={s.answers[choice]}
                size="small"
                variant="secondary"
                onPress={() => {
                  tapFeedback();
                  setState(answerJob(state, choice));
                }}
              />
            ))}
          </View>
        )
      }>
      <View style={styles.stack}>
        {state.finished ? (
          <ThemedText type="cardTitle">{s.score(state.right, total)}</ThemedText>
        ) : (
          <>
            <ThemedText type="caption" themeColor="textSecondary" tabular>
              {s.question(state.index + 1, total)}
            </ThemedText>
            <ThemedText type="cardTitle">{job.job}</ThemedText>
          </>
        )}
        <DiagramView spec={spec} highlightNodes={answered && !state.finished ? nodesFor(place) : undefined} hideNote hideHint />
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
