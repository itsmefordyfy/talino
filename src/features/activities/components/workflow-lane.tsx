import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useTones } from '@/hooks/use-tones';

import type { WorkflowLane } from '../types';

/** Each lane has its own icon as well as a tone, so a lane is never told apart by color alone. */
export const LANE_LOOK: Record<WorkflowLane, { icon: IconName; tone: Tone }> = {
  input: { icon: 'input', tone: 'indigo' },
  ai: { icon: 'smart_toy', tone: 'violet' },
  tool: { icon: 'build', tone: 'neutral' },
  human: { icon: 'person_search', tone: 'mint' },
  output: { icon: 'flag', tone: 'indigo' },
};

export type LaneTagProps = { lane: WorkflowLane; label: string };

/** A small pill with the lane's icon and name. */
export function LaneTag({ lane, label }: LaneTagProps) {
  const tones = useTones();
  const look = LANE_LOOK[lane];
  const colors = tones[look.tone];
  return (
    <View style={[styles.tag, { backgroundColor: colors.soft }]} accessible={false}>
      <Icon name={look.icon} size={14} tint={colors.ink} />
      <ThemedText type="caption" style={{ color: colors.ink }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, borderRadius: Radius.pill },
});
