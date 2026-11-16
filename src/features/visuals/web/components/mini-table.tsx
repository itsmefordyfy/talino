import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { Cell } from '../lib/joins';

export type MiniTableColumn = { name: string; key?: 'PK' | 'FK' };

export type MiniTableProps = {
  title: string;
  columns: readonly MiniTableColumn[];
  rows: readonly (readonly Cell[])[];
  /** Row positions drawn emphasized (the rows a JOIN just used). */
  highlight?: readonly number[];
  nullText: string;
  emptyText?: string;
};

/** A small table of values: key columns are tagged PK / FK in text (not by color alone) and highlighted rows are bold on a tinted row. */
export function MiniTable({ title, columns, rows, highlight = [], nullText, emptyText }: MiniTableProps) {
  const theme = useTheme();
  const summary = `${title}. Columns: ${columns.map((column) => `${column.name}${column.key ? ` (${column.key})` : ''}`).join(', ')}. ${rows.length} rows.`;
  return (
    <View accessible accessibilityLabel={summary} style={[styles.table, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="secondarySemiBold" style={styles.title}>
        {title}
      </ThemedText>
      <View style={[styles.row, styles.head, { borderBottomColor: theme.border }]}>
        {columns.map((column) => (
          <ThemedText key={column.name} type="caption" themeColor={column.key ? 'primary' : 'textSecondary'} style={styles.cell} numberOfLines={1}>
            {column.key ? `${column.name} ${column.key}` : column.name}
          </ThemedText>
        ))}
      </View>
      {rows.length === 0 && emptyText ? (
        <ThemedText type="secondary" themeColor="textSecondary" style={styles.empty}>
          {emptyText}
        </ThemedText>
      ) : null}
      {rows.map((row, rowIndex) => {
        const on = highlight.includes(rowIndex);
        return (
          <View key={rowIndex} style={[styles.row, on && { backgroundColor: theme.primarySoft }]}>
            {row.map((cell, cellIndex) => (
              <ThemedText key={cellIndex} type={on ? 'secondarySemiBold' : 'secondary'} themeColor={cell === null ? 'textSecondary' : 'text'} tabular style={[styles.cell, cell === null && styles.nullCell]} numberOfLines={1}>
                {cell === null ? nullText : String(cell)}
              </ThemedText>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderRadius: Radius.medium, borderCurve: 'continuous', overflow: 'hidden' },
  title: { paddingHorizontal: Spacing.two + 2, paddingTop: Spacing.two },
  row: { flexDirection: 'row', gap: Spacing.one, paddingHorizontal: Spacing.two + 2, paddingVertical: Spacing.one + 1 },
  head: { borderBottomWidth: StyleSheet.hairlineWidth },
  cell: { flex: 1 },
  nullCell: { fontStyle: 'italic' },
  empty: { paddingHorizontal: Spacing.two + 2, paddingVertical: Spacing.two },
});
