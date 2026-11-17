import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import { workflowLaneGroups } from '../lib/workflow';
import type { WorkflowPart } from '../types';
import type { WorkflowText } from '../workflow-strings';
import { LANE_LOOK } from './workflow-lane';

export type WorkflowPaletteProps = {
  parts: readonly WorkflowPart[];
  /** Ids in the workflow, in order. */
  order: readonly string[];
  /** No more steps can be added. */
  full: boolean;
  /** The workflow is finished: nothing can change. */
  locked: boolean;
  /** Two columns of parts inside a lane. */
  wide: boolean;
  text: WorkflowText;
  onAdd: (partId: string) => void;
};

/** The parts to build with, grouped under their lane. Tap one to add it to the end of the workflow; a part already in it shows as added. */
export function WorkflowPalette({ parts, order, full, locked, wide, text, onAdd }: WorkflowPaletteProps) {
  const theme = useTheme();
  const tones = useTones();
  return (
    <View style={styles.palette}>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.paletteHelp}
      </ThemedText>
      {workflowLaneGroups(parts).map((group) => {
        const look = LANE_LOOK[group.lane];
        const colors = tones[look.tone];
        const laneName = text.lanes[group.lane];
        return (
          <View key={group.lane} style={styles.lane} accessibilityRole="list">
            <View style={styles.laneHeader} accessible accessibilityRole="header" accessibilityLabel={`${laneName}. ${text.laneHints[group.lane]}`}>
              <Icon name={look.icon} size={18} tint={colors.ink} />
              <ThemedText type="secondarySemiBold">{laneName}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.laneHint}>
                {text.laneHints[group.lane]}
              </ThemedText>
            </View>
            <View style={styles.parts}>
              {group.parts.map((part) => {
                const position = order.indexOf(part.id);
                const added = position !== -1;
                const blocked = locked || added || full;
                return (
                  <Pressable
                    key={part.id}
                    accessibilityRole="button"
                    accessibilityLabel={added ? text.addedPart(laneName, part.label, position + 1) : full ? text.fullPart(laneName, part.label) : text.addPart(laneName, part.label, part.detail)}
                    accessibilityState={{ disabled: blocked, selected: added }}
                    disabled={blocked}
                    onPress={() => {
                      tapFeedback();
                      onAdd(part.id);
                    }}
                    style={({ pressed }) => [
                      styles.part,
                      wide && styles.partWide,
                      { backgroundColor: added ? theme.primarySoft : theme.backgroundElement, borderColor: added ? theme.primary : theme.border },
                      !added && blocked && styles.dimmed,
                      pressed && styles.pressed,
                    ]}>
                    <View style={styles.partText}>
                      <ThemedText type="bodySemiBold">{part.label}</ThemedText>
                      <ThemedText type="secondary" themeColor="textSecondary">
                        {part.detail}
                      </ThemedText>
                    </View>
                    {/* The state has a shape and a word, not just a fill: a check and "Added", or a plus. */}
                    <View style={styles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                      <Icon name={added ? 'check_circle' : 'add_circle'} size={22} color={added ? 'primary' : 'textSecondary'} filled={added} />
                      {added && (
                        <ThemedText type="caption" themeColor="primary">
                          {text.added}
                        </ThemedText>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  palette: { gap: Spacing.three },
  lane: { gap: Spacing.two },
  laneHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  laneHint: { flexShrink: 1 },
  parts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  part: {
    flexGrow: 1,
    flexBasis: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize + Spacing.three,
    paddingVertical: Spacing.three - 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: 1.5,
  },
  partWide: { flexBasis: '48%' },
  partText: { flex: 1, gap: 2 },
  mark: { alignItems: 'center', minWidth: 44, gap: 2 },
  dimmed: { opacity: 0.5 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
