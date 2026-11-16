import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { CURRENT_NODE_SIZE, NODE_CENTER, NODE_SIZE } from '../lib/layout';
import type { MilestoneState } from '../lib/types';
import { journeyStrings } from '../strings';

export const LABEL_WIDTH = 156;
/** Dark ink for the glyph on a mint fill (white would not read on it). */
const MINT_INK = '#063B34';

export type MilestoneNodeProps = {
  milestone: MilestoneState;
  /** Centre of the node, and the top of its row (below any guide). */
  x: number;
  top: number;
  onPress: (milestone: MilestoneState) => void;
};

/** A milestone as a neuron on the map: a glowing circle with its own icon, a ring of progress, then its title and one line about it. */
export function MilestoneNode({ milestone, x, top, onPress }: MilestoneNodeProps) {
  const strings = useLocalized(journeyStrings).map;
  const theme = useTheme();
  const { status } = milestone;
  const size = status === 'current' ? CURRENT_NODE_SIZE : NODE_SIZE;
  const locked = status === 'locked';
  const dashed = status === 'skipped' || status === 'soon';
  const showRing = status !== 'done' && milestone.fraction > 0;
  const needsPro = milestone.steps.some((step) => !step.done && !step.soon && !step.optional && !step.owned);

  const fill = status === 'done' ? theme.success : status === 'current' ? theme.primary : locked || dashed ? theme.backgroundSelected : theme.backgroundElement;
  const border = status === 'available' ? theme.primary : dashed ? theme.textTertiary : status === 'current' ? theme.primarySoft : 'transparent';
  const glyph = status === 'done' ? MINT_INK : status === 'current' ? theme.onPrimary : locked || dashed ? theme.textTertiary : theme.primaryText;
  const tags = [
    status === 'current' ? { text: strings.youAreHere, tone: 'primary' as const } : null,
    milestone.def.kind === 'challenge' ? { text: strings.challenge, tone: 'neutral' as const } : milestone.def.kind === 'capstone' ? { text: strings.capstone, tone: 'neutral' as const } : null,
    milestone.optional && status !== 'done' ? { text: strings.optional, tone: 'neutral' as const } : null,
    needsPro && status !== 'locked' ? { text: strings.pro, tone: 'neutral' as const } : null,
  ].filter((tag): tag is { text: string; tone: 'primary' | 'neutral' } => tag !== null);
  const statusText = strings.status[status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.nodeLabel(milestone.def.title, statusText, milestone.def.summary)}
      onPress={() => {
        tapFeedback();
        onPress(milestone);
      }}
      style={({ pressed }) => [styles.node, { left: x - LABEL_WIDTH / 2, top }, pressed && styles.pressed]}>
      <View style={[styles.circleBox, { top: NODE_CENTER - size / 2, width: size + 16, height: size + 16 }]}>
        {showRing && (
          <Svg width={size + 16} height={size + 16} style={styles.ring}>
            <Circle cx={(size + 16) / 2} cy={(size + 16) / 2} r={(size + 10) / 2} stroke={theme.border} strokeWidth={4} fill="none" />
            <Circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={(size + 10) / 2}
              stroke={theme.primary}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${Math.PI * (size + 10) * milestone.fraction} ${Math.PI * (size + 10)}`}
              transform={`rotate(-90 ${(size + 16) / 2} ${(size + 16) / 2})`}
            />
          </Svg>
        )}
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: fill, borderColor: border, borderStyle: dashed ? 'dashed' : 'solid', borderWidth: status === 'current' ? 6 : status === 'available' || dashed ? 3 : 0, boxShadow: status === 'current' ? `0 0 26px ${theme.primary}AA` : status === 'done' ? `0 0 18px ${theme.success}99` : status === 'available' ? `0 0 14px ${theme.primary}55` : theme.shadowCard }]}>
          <Icon name={milestone.def.icon} size={status === 'current' ? 40 : 32} tint={glyph} filled={status === 'done' || status === 'current'} />
        </View>
        {(status === 'done' || locked || status === 'skipped') && (
          <View style={[styles.badge, { backgroundColor: status === 'done' ? theme.statusOk : theme.textTertiary, borderColor: theme.background }]}>
            <Icon name={status === 'done' ? 'check' : locked ? 'lock' : 'skip_next'} size={14} tint="#FFFFFF" />
          </View>
        )}
      </View>
      {/* The synapses pass behind the words: a see-through page-coloured backing keeps them readable without boxing the label in. */}
      <View style={[styles.label, { top: NODE_CENTER + CURRENT_NODE_SIZE / 2 + 12, backgroundColor: `${theme.background}CC` }]}>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <View key={tag.text} style={[styles.tag, { backgroundColor: tag.tone === 'primary' ? theme.primary : theme.primarySoft }]}>
                <ThemedText type="caption" style={[styles.tagText, { color: tag.tone === 'primary' ? theme.onPrimary : theme.primaryText }]}>
                  {tag.text}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
        {/* Only the course's name under the node (owner, 2026-11-16: "remove subtitles on each course"); the summary is in the details and read out by screen readers. */}
        <ThemedText type="cardTitle" numberOfLines={2} style={styles.title} themeColor={locked ? 'textSecondary' : 'text'}>
          {milestone.def.title}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    width: LABEL_WIDTH,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  circleBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  badge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    width: LABEL_WIDTH,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.half,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  tag: {
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  tagText: {
    fontWeight: '700',
    lineHeight: 16,
  },
  title: {
    textAlign: 'center',
  },
});
