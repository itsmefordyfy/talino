import type { StyleProp, ViewStyle } from 'react-native';

import type { ISODate } from '@/lib/dates';

export type DateFieldProps = {
  label: string;
  /** Null shows the field empty (with `placeholder`) until a date is picked. */
  value: ISODate | null;
  onChange: (value: ISODate | null) => void;
  /** Shown while `value` is null. */
  placeholder: string;
  /** Lets the owner clear a picked date; the label of that button. Omit for a required date. */
  clearLabel?: string;
  /** Where the picker opens while `value` is null; today by default. */
  initialDate?: ISODate;
  /** Shown under the field, which turns red. */
  error?: string | null;
  hint?: string;
  maximumDate?: ISODate;
  minimumDate?: ISODate;
  disabled?: boolean;
  /** No box of its own: a row inside a card that already draws one. */
  bare?: boolean;
  /** Smaller text and padding, label and date still on one line, for two fields side by side (a From and a To). */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};
