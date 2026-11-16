import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { activityStrings } from '../strings';

export type ResultTableProps = {
  columns: string[];
  rows: unknown[][];
  truncated?: boolean;
};

function cellText(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

/** A query result as a table: scrolls sideways for wide results and up and down past about ten rows. */
export function ResultTable({ columns, rows, truncated = false }: ResultTableProps) {
  const theme = useTheme();
  const strings = useLocalized(activityStrings);
  return (
    <View style={styles.wrap} accessibilityLabel={`${strings.resultTable}. ${strings.rowCount(rows.length)}`}>
      <ScrollView horizontal showsHorizontalScrollIndicator style={[styles.table, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
        <View>
          <View style={[styles.row, { backgroundColor: theme.backgroundSelected }]}>
            {columns.map((column, index) => (
              <Cell key={index} text={column} bold />
            ))}
          </View>
          <ScrollView nestedScrollEnabled style={styles.body}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
                {row.map((value, index) => (
                  <Cell key={index} text={cellText(value)} muted={value === null || value === undefined} />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <ThemedText type="caption" themeColor="textSecondary">
        {rows.length === 0 ? strings.noRows : strings.rowCount(rows.length)}
        {truncated ? ` · ${strings.truncated}` : ''}
      </ThemedText>
    </View>
  );
}

function Cell({ text, bold = false, muted = false }: { text: string; bold?: boolean; muted?: boolean }) {
  return (
    <View style={styles.cell}>
      <ThemedText type="code" themeColor={muted ? 'textSecondary' : 'text'} style={[styles.cellText, bold && styles.bold]} numberOfLines={1}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  table: { borderWidth: StyleSheet.hairlineWidth, borderRadius: Radius.small },
  body: { maxHeight: Typography.code.lineHeight * 10 + Spacing.three * 10 },
  row: { flexDirection: 'row' },
  cell: { minWidth: 96, maxWidth: 220, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  cellText: { fontFamily: Fonts.mono },
  bold: { fontWeight: 700 },
});
