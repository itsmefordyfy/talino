import { useState } from 'react';

import { formatDate, todayISO, type ISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';

import { Calendar } from './calendar';
import type { DateFieldProps } from './date-field.types';
import { PickerDialog } from './picker-dialog';
import { PickerRow } from './picker-row';

export type { DateFieldProps };

/**
 * A date in a form, the same on iPhone and Android (owner's call, 2026-10-17): the shared row
 * (PickerRow, the date on a mint capsule, or the placeholder so a date nobody entered never
 * reads as today), opening the app's calendar in a centred card. A tapped day is held until Done;
 * Cancel changes nothing. Limits apply only where a field sets them.
 */
export function DateField({ label, value, onChange, placeholder, clearLabel, initialDate, error, hint, maximumDate, minimumDate, disabled, bare, compact, style }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ISODate | null>(null);
  const [opened, setOpened] = useState(0);
  return (
    <>
      <PickerRow
        label={label}
        text={value ? formatDate(value) : null}
        placeholder={placeholder}
        onPress={() => {
          tapFeedback();
          setDraft(value ?? initialDate ?? todayISO());
          setOpened((count) => count + 1);
          setOpen(true);
        }}
        clearLabel={clearLabel}
        onClear={() => onChange(null)}
        error={error}
        hint={hint}
        disabled={disabled}
        bare={bare}
        compact={compact}
        style={style}
      />
      <PickerDialog
        visible={open}
        onCancel={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          if (draft) onChange(draft);
        }}>
        {/* A new calendar each opening (`opened`), so it starts on the field's month; it stays while the card fades out. */}
        {draft && <Calendar key={opened} accessibilityLabel={label} value={draft} initialDate={draft ?? initialDate ?? todayISO()} minimumDate={minimumDate} maximumDate={maximumDate} onSelect={setDraft} />}
      </PickerDialog>
    </>
  );
}
