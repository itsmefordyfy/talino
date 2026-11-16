import { useState } from 'react';

import { formatTime } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';

import { PickerDialog } from './picker-dialog';
import { PickerRow } from './picker-row';
import type { TimeFieldProps } from './time-field.types';
import { TimeWheels } from './time-wheels';

export type { TimeFieldProps };

const DEFAULT_TIME = '09:00';

/**
 * A time of day in a form, the same on iPhone and Android (owner's call, 2026-10-17): the shared
 * row (PickerRow), opening the app's hour and minute wheels in a centred card. Only Done sets it.
 */
export function TimeField({ label, value, onChange, placeholder, clearLabel, initialTime, error, hint, style }: TimeFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_TIME);
  const [opened, setOpened] = useState(0);
  return (
    <>
      <PickerRow
        label={label}
        text={value ? formatTime(value) : null}
        placeholder={placeholder}
        onPress={() => {
          tapFeedback();
          setDraft(value ?? initialTime ?? DEFAULT_TIME);
          setOpened((count) => count + 1);
          setOpen(true);
        }}
        clearLabel={clearLabel}
        onClear={() => onChange(null)}
        error={error}
        hint={hint}
        style={style}
      />
      <PickerDialog
        visible={open}
        onCancel={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          onChange(draft);
        }}>
        {/* New wheels each opening (they scroll to the value once, when laid out); they stay while the card fades out. */}
        <TimeWheels key={opened} value={draft} onChange={setDraft} />
      </PickerDialog>
    </>
  );
}
