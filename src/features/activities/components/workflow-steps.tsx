import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { WorkflowCountState } from '../lib/workflow';
import type { WorkflowPart } from '../types';
import type { WorkflowText } from '../workflow-strings';
import { LaneTag } from './workflow-lane';

export type WorkflowStepsProps = {
  order: readonly string[];
  parts: readonly WorkflowPart[];
  minSteps: number;
  maxSteps: number;
  countState: WorkflowCountState;
  /** Steps a check found in a broken rule (marked with a warning icon and words). */
  flagged: readonly string[];
  locked: boolean;
  /** Buttons sit beside the text instead of under it. */
  wide: boolean;
  text: WorkflowText;
  onMove: (from: number, to: number) => void;
  onRemove: (partId: string) => void;
};

/** The learner's workflow: numbered steps with a lane tag, move up/down and remove buttons (no dragging needed), and the step counter. */
export function WorkflowSteps({ order, parts, minSteps, maxSteps, countState, flagged, locked, wide, text, onMove, onRemove }: WorkflowStepsProps) {
  const theme = useTheme();
  const countOk = countState === 'ok' || countState === 'full';
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.yourWorkflow}
        </ThemedText>
        {/* The counter says what is needed in words and carries an icon: it is never only a color. */}
        <View style={styles.counter} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${text.stepCount(order.length, minSteps, maxSteps)}. ${text.stepCountState[countState]}`}>
          <Icon name={countOk ? 'check_circle' : 'pending'} size={16} color={countOk ? 'statusOk' : 'textSecondary'} filled={countOk} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {text.stepCount(order.length, minSteps, maxSteps)}
          </ThemedText>
        </View>
      </View>
      {order.length === 0 ? (
        <View style={[styles.empty, { borderColor: theme.border }]} accessible accessibilityLabel={text.emptyWorkflow}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {text.emptyWorkflow}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list} accessibilityRole="list">
          {order.map((id, index) => {
            const part = parts.find((candidate) => candidate.id === id);
            if (!part) return null;
            const laneName = text.lanes[part.lane];
            const isFlagged = flagged.includes(id);
            const actions = !locked && (
              <View style={styles.actions}>
                <IconButton icon="arrow_upward" accessibilityLabel={text.moveUp(index + 1, part.label)} disabled={index === 0} onPress={() => { tapFeedback(); onMove(index, index - 1); }} background="backgroundSelected" color="text" iconSize={18} />
                <IconButton icon="arrow_downward" accessibilityLabel={text.moveDown(index + 1, part.label)} disabled={index === order.length - 1} onPress={() => { tapFeedback(); onMove(index, index + 1); }} background="backgroundSelected" color="text" iconSize={18} />
                <IconButton icon="close" accessibilityLabel={text.remove(index + 1, part.label)} onPress={() => { tapFeedback(); onRemove(id); }} background="backgroundSelected" color="text" iconSize={18} />
              </View>
            );
            return (
              <View key={id} style={[styles.row, { backgroundColor: isFlagged ? theme.statusWarnSoft : theme.backgroundElement, borderColor: isFlagged ? theme.statusWarn : theme.border }, isFlagged && styles.rowStrong]}>
                <View style={styles.main}>
                  <View style={[styles.number, { backgroundColor: theme.backgroundSelected }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    <ThemedText type="caption" themeColor="textSecondary" tabular>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <View style={styles.body} accessible accessibilityLabel={`${text.stepRow(index + 1, laneName, part.label)}${isFlagged ? `. ${text.flagged}` : ''}`}>
                    <LaneTag lane={part.lane} label={laneName} />
                    <ThemedText type="bodySemiBold">{part.label}</ThemedText>
                    {isFlagged && (
                      <View style={styles.flag}>
                        <Icon name="warning" size={16} color="statusWarn" />
                        <ThemedText type="caption" themeColor="statusWarn">
                          {text.flagged}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  {wide && actions}
                </View>
                {!wide && actions}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: Spacing.two },
  counter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  empty: { padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5, borderStyle: 'dashed' },
  list: { gap: Spacing.two },
  row: { gap: Spacing.two, padding: Spacing.three - 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  rowStrong: { borderWidth: 2 },
  main: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  number: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: Spacing.one },
  flag: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.one },
});
