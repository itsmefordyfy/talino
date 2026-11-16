import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { arrangeStart, moveItem, swapItems } from '../lib/arrange';
import type { ArrangeActivity } from '../types';
import { ActivityFrame, CheckBar } from './activity-frame';
import { CodeLine } from './code-lines';

export type ArrangeViewProps = { activity: ArrangeActivity; session: ActivitySession };

/**
 * A Parsons problem: the lines of a program, shuffled. Reorder with the move buttons, or tap one line and
 * then another to swap them. Nothing needs dragging, so it works with a screen reader and one finger.
 */
export function ArrangeView({ activity, session }: ArrangeViewProps) {
  const theme = useTheme();
  const { text, done, result } = session;
  const [order, setOrder] = useState(() => arrangeStart(activity));
  const [selected, setSelected] = useState<number | null>(null);
  const [checkedOrder, setCheckedOrder] = useState<string | null>(null);

  const detail = result?.detail?.kind === 'arrange' && checkedOrder === order.join('\n') ? result.detail : null;

  const move = (from: number, to: number) => {
    tapFeedback();
    setOrder((current) => moveItem(current, from, to));
    setSelected(null);
  };

  const tapRow = (index: number) => {
    if (done) return;
    tapFeedback();
    if (selected === null) setSelected(index);
    else if (selected === index) setSelected(null);
    else {
      setOrder((current) => swapItems(current, selected, index));
      setSelected(null);
    }
  };

  return (
    <ActivityFrame session={session}>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.arrangeHelp}
      </ThemedText>
      <View style={styles.list}>
        {order.map((line, index) => {
          const isSelected = selected === index;
          const inPlace = detail?.inPlace[index] === true && index < (detail.firstWrong ?? order.length);
          const isFirstWrong = detail !== null && detail.firstWrong === index;
          return (
            <View
              key={`${index}:${line}`}
              style={[
                styles.row,
                { backgroundColor: isSelected ? theme.primarySoft : theme.codeBackground, borderColor: isSelected ? theme.primary : isFirstWrong ? theme.statusWarn : theme.codeBorder },
                (isSelected || isFirstWrong) && styles.rowStrong,
              ]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={text.lineRow(index + 1, line)}
                accessibilityState={{ selected: isSelected, disabled: done }}
                accessibilityActions={[
                  { name: 'increment', label: text.moveDown(index + 1) },
                  { name: 'decrement', label: text.moveUp(index + 1) },
                ]}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'increment') move(index, index + 1);
                  if (event.nativeEvent.actionName === 'decrement') move(index, index - 1);
                }}
                onPress={() => tapRow(index)}
                style={styles.rowMain}>
                <ThemedText type="code" style={[styles.number, { color: theme.codeComment }]}>
                  {index + 1}
                </ThemedText>
                <View style={styles.rowCode}>
                  <CodeLine code={line} language={activity.language} />
                </View>
                {inPlace && <Icon name="check_circle" size={18} color="statusOk" />}
                {isFirstWrong && <Icon name="warning" size={18} color="statusWarn" />}
              </Pressable>
              {!done && (
                <View style={styles.moves}>
                  <IconButton icon="arrow_upward" accessibilityLabel={text.moveUp(index + 1)} disabled={index === 0} onPress={() => move(index, index - 1)} background="backgroundSelected" color="text" iconSize={16} />
                  <IconButton icon="arrow_downward" accessibilityLabel={text.moveDown(index + 1)} disabled={index === order.length - 1} onPress={() => move(index, index + 1)} background="backgroundSelected" color="text" iconSize={16} />
                </View>
              )}
            </View>
          );
        })}
      </View>
      <CheckBar
        session={session}
        label={text.checkOrder}
        canCheck
        onCheck={() => {
          setCheckedOrder(order.join('\n'));
          void session.check({ kind: 'arrange', order });
        }}
      />
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.one + 2 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth, paddingRight: Spacing.two },
  rowStrong: { borderWidth: 2 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: MinTouchSize + 4, paddingLeft: Spacing.three, paddingVertical: Spacing.two },
  number: { minWidth: 18, textAlign: 'right' },
  rowCode: { flex: 1 },
  moves: { flexDirection: 'row', gap: Spacing.one },
});
