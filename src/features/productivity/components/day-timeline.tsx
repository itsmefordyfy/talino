import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import { findConflicts, MAX_BLOCK, MIN_BLOCK, timelineRows, type Conflicts } from '../lib/day-plan';
import { formatClock, formatDuration, MINUTES_PER_DAY, STEP } from '../lib/time';
import { productivityStrings, type ProductivityText } from '../strings';
import type { Block, FixedBlock, ScheduleScenario } from '../types';
import { BLOCK_ICONS, BLOCK_TONES, FIXED_ICONS, FIXED_TONES } from './day-kinds';
import { Stepper } from './stepper';

export type DayTimelineProps = {
  scenario: ScheduleScenario;
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, deltaMinutes: number) => void;
  onResize: (id: string, deltaMinutes: number) => void;
  onRemove: (id: string) => void;
  /** A break in the free stretch that starts at this time. */
  onAddBreakAt: (start: number) => void;
  readOnly?: boolean;
};

const range = (t: ProductivityText, start: number, minutes: number) => t.dayRange(formatClock(start), formatClock(start + minutes));
const ceilToStep = (minutes: number) => Math.ceil(minutes / STEP) * STEP;

/**
 * The day from its first hour to its last as one list in time order: commitments that cannot move, the learner's blocks (tap one to change its time
 * and length in quarter-hours) and the free stretches between. Anything that clashes or runs outside the day says so on the block, in words and with an icon.
 */
export function DayTimeline({ scenario, blocks, selectedId, onSelect, onMove, onResize, onRemove, onAddBreakAt, readOnly = false }: DayTimelineProps) {
  const t = useLocalized(productivityStrings);
  const rows = timelineRows(scenario, blocks);
  const conflicts = findConflicts(scenario, blocks);
  return (
    <View accessibilityLabel={t.dayTimeline} style={styles.list}>
      {rows.map((row, index) => {
        const key = row.type === 'gap' ? `gap-${row.start}` : row.item.id;
        return (
          <TimelineLine key={key} start={row.start} last={index === rows.length - 1}>
            {row.type === 'fixed' ? (
              <FixedCard item={row.item} conflicts={conflicts} t={t} />
            ) : row.type === 'block' ? (
              <BlockCard
                block={row.item}
                conflicts={conflicts}
                selected={selectedId === row.item.id}
                readOnly={readOnly}
                onSelect={onSelect}
                onMove={onMove}
                onResize={onResize}
                onRemove={onRemove}
                t={t}
              />
            ) : (
              <GapCard start={row.start} minutes={row.minutes} readOnly={readOnly} onAddBreakAt={onAddBreakAt} t={t} />
            )}
          </TimelineLine>
        );
      })}
    </View>
  );
}

/** The start time on the left, the rail with its dot, then the card. */
function TimelineLine({ start, last, children }: { start: number; last: boolean; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.line}>
      <ThemedText type="caption" themeColor="textSecondary" tabular style={styles.time}>
        {formatClock(start)}
      </ThemedText>
      <View style={styles.rail} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.dot, { backgroundColor: theme.primary }]} />
        {!last && <View style={[styles.railLine, { backgroundColor: theme.border }]} />}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function ConflictLines({ id, title, conflicts, t }: { id: string; title: string; conflicts: Conflicts; t: ProductivityText }) {
  const clashes = conflicts.overlaps.get(id) ?? [];
  const outside = conflicts.outside.has(id);
  if (clashes.length === 0 && !outside) return null;
  return (
    <View style={styles.conflicts} accessibilityLiveRegion="polite">
      {clashes.map((other, index) => (
        <View key={`${other}-${index}`} style={styles.conflictRow}>
          <Icon name="warning" size={16} color="danger" />
          <ThemedText type="secondary" themeColor="danger" style={styles.conflictText}>
            {`${t.dayConflictTag}: ${t.dayConflict(title, other)}`}
          </ThemedText>
        </View>
      ))}
      {outside && (
        <View style={styles.conflictRow}>
          <Icon name="event_busy" size={16} color="danger" />
          <ThemedText type="secondary" themeColor="danger" style={styles.conflictText}>
            {`${t.dayConflictTag}: ${t.dayOutside(title)}`}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const conflictSummary = (id: string, title: string, conflicts: Conflicts, t: ProductivityText): string => {
  const parts = (conflicts.overlaps.get(id) ?? []).map((other) => t.dayConflict(title, other));
  if (conflicts.outside.has(id)) parts.push(t.dayOutside(title));
  return parts.length ? `${t.dayConflictTag}. ${parts.join('. ')}` : '';
};

function FixedCard({ item, conflicts, t }: { item: FixedBlock; conflicts: Conflicts; t: ProductivityText }) {
  const theme = useTheme();
  const tones = useTones();
  const tone = tones[FIXED_TONES[item.kind] as Tone];
  const clash = conflicts.overlaps.has(item.id);
  const kind = t.dayFixedKinds[item.kind];
  return (
    <View
      accessible
      accessibilityLabel={`${item.title}. ${t.dayFixedTag(kind)}. ${range(t, item.start, item.minutes)}. ${conflictSummary(item.id, item.title, conflicts, t)}`}
      style={[styles.card, { backgroundColor: tone.soft, borderColor: clash ? theme.danger : theme.border }, clash && styles.conflictBorder]}>
      <View style={styles.cardHead}>
        <Icon name={FIXED_ICONS[item.kind]} size={20} tint={tone.ink} />
        <View style={styles.cardTitle}>
          <ThemedText type="bodySemiBold">{item.title}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {`${range(t, item.start, item.minutes)} · ${formatDuration(item.minutes)}`}
          </ThemedText>
        </View>
        <View style={styles.tag}>
          <Icon name="lock" size={14} tint={tone.ink} />
          <ThemedText type="caption" style={{ color: tone.ink }}>
            {kind}
          </ThemedText>
        </View>
      </View>
      <ConflictLines id={item.id} title={item.title} conflicts={conflicts} t={t} />
    </View>
  );
}

type BlockCardProps = {
  block: Block;
  conflicts: Conflicts;
  selected: boolean;
  readOnly: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, deltaMinutes: number) => void;
  onResize: (id: string, deltaMinutes: number) => void;
  onRemove: (id: string) => void;
  t: ProductivityText;
};

function BlockCard({ block, conflicts, selected, readOnly, onSelect, onMove, onResize, onRemove, t }: BlockCardProps) {
  const theme = useTheme();
  const tones = useTones();
  const tone = tones[BLOCK_TONES[block.kind] as Tone];
  const title = block.title || t.dayBlockKinds[block.kind];
  const clash = conflicts.overlaps.has(block.id) || conflicts.outside.has(block.id);
  const summary = conflictSummary(block.id, title, conflicts, t);
  const header = (
    <View style={styles.cardHead}>
      <Icon name={BLOCK_ICONS[block.kind]} size={20} tint={tone.ink} />
      <View style={styles.cardTitle}>
        <ThemedText type="bodySemiBold">{title}</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {`${t.dayBlockKinds[block.kind]} · ${range(t, block.start, block.minutes)} · ${formatDuration(block.minutes)}`}
        </ThemedText>
        {block.kind === 'buffer' && (
          <ThemedText type="caption" themeColor="textSecondary">
            {t.dayBufferNote}
          </ThemedText>
        )}
      </View>
      {!readOnly && <Icon name={selected ? 'expand_less' : 'expand_more'} size={20} color="textSecondary" />}
    </View>
  );
  const cardStyle = [styles.card, { backgroundColor: theme.backgroundElement, borderColor: clash ? theme.danger : selected ? theme.primary : theme.border }, (clash || selected) && styles.conflictBorder];
  return (
    <View style={cardStyle}>
      {readOnly ? (
        <View accessible accessibilityLabel={`${title}. ${t.dayBlockKinds[block.kind]}. ${range(t, block.start, block.minutes)}. ${summary}`}>
          {header}
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${t.dayBlockKinds[block.kind]}. ${range(t, block.start, block.minutes)}. ${summary}`}
          accessibilityHint={t.dayBlockHint}
          accessibilityState={{ expanded: selected }}
          onPress={() => {
            tapFeedback();
            onSelect(selected ? null : block.id);
          }}
          style={({ pressed }) => pressed && styles.pressed}>
          {header}
        </Pressable>
      )}
      <ConflictLines id={block.id} title={title} conflicts={conflicts} t={t} />
      {selected && !readOnly && (
        <View style={styles.controls}>
          <Stepper
            label={t.dayStart}
            valueText={formatClock(block.start)}
            decrementLabel={t.dayEarlier(title)}
            incrementLabel={t.dayLater(title)}
            canDecrement={block.start > 0}
            canIncrement={block.start + block.minutes < MINUTES_PER_DAY}
            onDecrement={() => onMove(block.id, -STEP)}
            onIncrement={() => onMove(block.id, STEP)}
          />
          <Stepper
            label={t.dayLength}
            valueText={formatDuration(block.minutes)}
            decrementLabel={t.dayShorter(title)}
            incrementLabel={t.dayLonger(title)}
            canDecrement={block.minutes > MIN_BLOCK}
            canIncrement={block.minutes < MAX_BLOCK && block.start + block.minutes < MINUTES_PER_DAY}
            onDecrement={() => onResize(block.id, -STEP)}
            onIncrement={() => onResize(block.id, STEP)}
          />
          <Button title={t.dayRemoveBlock} icon="delete" size="small" variant="danger" accessibilityLabel={t.dayRemove(title)} onPress={() => onRemove(block.id)} style={styles.remove} />
        </View>
      )}
    </View>
  );
}

function GapCard({ start, minutes, readOnly, onAddBreakAt, t }: { start: number; minutes: number; readOnly: boolean; onAddBreakAt: (start: number) => void; t: ProductivityText }) {
  const theme = useTheme();
  return (
    <View accessible={readOnly} accessibilityLabel={`${t.dayFree(formatDuration(minutes))}. ${range(t, start, minutes)}`} style={[styles.gap, { borderColor: theme.border }]}>
      <View style={styles.cardTitle}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary" tabular>
          {t.dayFree(formatDuration(minutes))}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {range(t, start, minutes)}
        </ThemedText>
      </View>
      {!readOnly && (
        <Button
          title={t.dayGapAdd}
          icon="coffee"
          size="small"
          variant="ghost"
          accessibilityLabel={`${t.dayGapAdd}, ${range(t, start, minutes)}`}
          onPress={() => {
            tapFeedback();
            onAddBreakAt(ceilToStep(start));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  line: { flexDirection: 'row', gap: Spacing.two, paddingBottom: Spacing.two },
  time: { minWidth: 62, paddingTop: Spacing.two + 2 },
  rail: { width: 12, alignItems: 'center', paddingTop: Spacing.two + 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  railLine: { width: 2, flex: 1, marginTop: Spacing.one },
  body: { flex: 1 },
  card: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  conflictBorder: { borderWidth: 1.5 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  cardTitle: { flex: 1, gap: Spacing.half },
  tag: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  conflicts: { gap: Spacing.one },
  conflictRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  conflictText: { flex: 1 },
  controls: { gap: Spacing.three, paddingTop: Spacing.two },
  remove: { alignSelf: 'flex-start' },
  gap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1, borderStyle: 'dashed' },
  pressed: { opacity: 0.8 },
});
