import type { StyleProp, ViewStyle } from 'react-native';

export type TimeFieldProps = {
  label: string;
  /** "HH:MM" (24-hour), or null for no particular time. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Shown while `value` is null ("Any time"). */
  placeholder: string;
  /** Lets the owner clear the time; the label of that button. */
  clearLabel?: string;
  /** Where the picker opens while `value` is null (HH:MM); 09:00 by default. */
  initialTime?: string;
  /** Shown under the field, which turns red (a required time that's missing). */
  error?: string | null;
  hint?: string;
  style?: StyleProp<ViewStyle>;
};
