import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { onToneSolid, Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import type { PathNode } from '../lib/course-path';
import { CURRENT_NODE_SIZE, NODE_CENTER, NODE_SIZE } from '../lib/layout';
import { journeyStrings } from '../strings';

export const LABEL_WIDTH = 156;

export type CourseNodeProps = {
  node: PathNode;
  /** The color of the level the course is in: its ring, glow, glyph and the current course's fill. */
  tone: Tone;
  /** Centre of the node, and the top of its row (below any guide). */
  x: number;
  top: number;
  /** Shows the course's lessons on Home. */
  onOpen: (node: PathNode) => void;
};

/**
 * A course as a neuron on the map: a glowing circle with its icon and a ring of the lessons done, then its name and one line of fact (how
 * many lessons, how far along). The status is in the colour, the badge and the words, never the colour alone. The course's description
 * is in the screen reader's label and at the top of its timeline: the owner asked for no subtitles under the nodes (2026-11-16).
 */
export function CourseNode({ node, tone, x, top, onOpen }: CourseNodeProps) {
  const strings = useLocalized(journeyStrings).map;
  const theme = useTheme();
  const level = useTones()[tone];
  const { status } = node;
  const current = status === 'current';
  const size = current ? CURRENT_NODE_SIZE : NODE_SIZE;
  const dashed = status === 'skipped';
  const completed = status === 'completed';
  const showRing = !completed && node.kind === 'course' && node.fraction > 0;
  const needsPro = node.kind === 'course' && !completed && !node.owned;

  // The level's color (Beginner mint, Intermediate blue, Advanced violet, Expert gold) is the course's ring and glow; a finished course is green with a check.
  const fill = completed ? theme.success : current ? level.solid : dashed ? theme.backgroundSelected : theme.backgroundElement;
  const border = status === 'available' || status === 'in-progress' ? level.solid : dashed ? theme.textTertiary : current ? level.soft : 'transparent';
  const glyph = completed ? onToneSolid('mint') : current ? onToneSolid(tone) : dashed ? theme.textTertiary : level.ink;
  const glow = current ? `0 0 26px ${level.solid}AA` : completed ? `0 0 18px ${theme.success}99` : status === 'available' || status === 'in-progress' ? `0 0 14px ${level.solid}66` : theme.shadowCard;

  const detail =
    node.kind === 'action'
      ? node.description
      : completed
        ? strings.completedMeta(node.lessonsTotal)
        : node.started
          ? strings.lessonProgress(node.lessonsDone, node.lessonsTotal, node.percent)
          : strings.lessonCount(node.lessonsTotal);
  const tags = [
    current ? { text: node.started ? strings.continueTag : strings.startTag, tone: 'level' as const } : null,
    node.optional && !completed ? { text: strings.optional, tone: 'neutral' as const } : null,
    needsPro ? { text: strings.pro, tone: 'neutral' as const } : null,
  ].filter((tag): tag is { text: string; tone: 'level' | 'neutral' } => tag !== null);
  const statusText = strings.courseStatus[status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.courseLabel(node.title, statusText, detail, node.description)}
      onPress={() => onOpen(node)}
      style={({ pressed }) => [styles.node, { left: x - LABEL_WIDTH / 2, top }, pressed && styles.pressed]}>
      <View style={[styles.circleBox, { top: NODE_CENTER - size / 2 - 8, width: size + 16, height: size + 16 }]}>
        {showRing && (
          <Svg width={size + 16} height={size + 16} style={styles.ring}>
            <Circle cx={(size + 16) / 2} cy={(size + 16) / 2} r={(size + 10) / 2} stroke={theme.border} strokeWidth={4} fill="none" />
            <Circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={(size + 10) / 2}
              stroke={level.solid}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${Math.PI * (size + 10) * node.fraction} ${Math.PI * (size + 10)}`}
              transform={`rotate(-90 ${(size + 16) / 2} ${(size + 16) / 2})`}
            />
          </Svg>
        )}
        <View
          style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: fill, borderColor: border, borderStyle: dashed ? 'dashed' : 'solid', borderWidth: current ? 6 : status === 'available' || status === 'in-progress' || dashed ? 3 : 0, boxShadow: glow }]}>
          <Icon name={node.icon} size={current ? 40 : 32} tint={glyph} filled={completed || current} />
        </View>
        {(completed || dashed) && (
          <View style={[styles.badge, { backgroundColor: completed ? theme.statusOk : theme.textTertiary, borderColor: theme.background }]}>
            <Icon name={completed ? 'check' : 'skip_next'} size={14} tint="#FFFFFF" />
          </View>
        )}
      </View>
      {/* The synapses pass behind the words: a see-through page-coloured backing keeps them readable without boxing the label in. */}
      <View style={[styles.label, { top: NODE_CENTER + CURRENT_NODE_SIZE / 2 + 12, backgroundColor: `${theme.background}CC` }]}>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <View key={tag.text} style={[styles.tag, { backgroundColor: tag.tone === 'level' ? level.solid : theme.primarySoft }]}>
                <ThemedText type="caption" style={[styles.tagText, { color: tag.tone === 'level' ? onToneSolid(tone) : theme.primaryText }]}>
                  {tag.text}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
        <ThemedText type="cardTitle" numberOfLines={2} style={styles.title} themeColor="text">
          {node.title}
        </ThemedText>
        <ThemedText type="caption" numberOfLines={1} tabular style={styles.title} themeColor={completed ? 'statusOk' : 'textSecondary'}>
          {detail}
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
