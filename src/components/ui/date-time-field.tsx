import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { toISODate, toTimeString } from '@/lib/dates';

import { DateField } from './date-field';
import { TimeField } from './time-field';

export type DateTimeFieldProps = {
  dateLabel: string;
  timeLabel: string;
  /** An ISO timestamp (local date and time picked, stored as UTC ISO). */
  value: string;
  onChange: (value: string) => void;
  /** Latest selectable date (YYYY-MM-DD); today by default, since a log entry is never in the future. */
  maximumDate?: string;
  minimumDate?: string;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

/** Combines a local calendar date and an "HH:MM" time into an ISO timestamp. */
export function combineDateTime(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute).toISOString();
}

/**
 * When something happened: the shared date field over the time field (side by side, the time's
 * label was cut to "Ti…" at phone width), as one ISO timestamp. Used by every log, dose and reading form so times are picked the same way everywhere.
 */
export function DateTimeField({ dateLabel, timeLabel, value, onChange, maximumDate, minimumDate, error, style }: DateTimeFieldProps) {
  const at = new Date(value);
  const date = toISODate(at);
  const time = toTimeString(at);
  return (
    <View style={[styles.row, style]}>
      <DateField
        label={dateLabel}
        value={date}
        placeholder={dateLabel}
        maximumDate={maximumDate ?? toISODate(new Date())}
        minimumDate={minimumDate}
        onChange={(next) => next && onChange(combineDateTime(next, time))}
        error={error}
      />
      <TimeField label={timeLabel} value={time} placeholder={timeLabel} onChange={(next) => next && onChange(combineDateTime(date, next))} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.three,
  },
});
