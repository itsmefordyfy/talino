import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { MAX_TITLE, MAX_TOOL_TASKS } from '../lib/state';
import { formatDuration, STEP } from '../lib/time';
import { productivityStrings } from '../strings';
import type { Priority } from '../types';
import { Stepper } from './stepper';

export type AddTaskFormProps = {
  onAdd: (task: { title: string; minutes: number; priority: Priority }) => void;
  /** How many tasks there are already, against the most the tool keeps. */
  count: number;
};

const DEFAULT_MINUTES = 30;
const MAX_ESTIMATE = 480;

/** The free tool's way in: a name, an estimate in quarter-hours and a priority. The name is checked when Add is pressed, with the message under the field. */
export function AddTaskForm({ onAdd, count }: AddTaskFormProps) {
  const t = useLocalized(productivityStrings);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);
  const full = count >= MAX_TOOL_TASKS;

  const submit = () => {
    if (full) return;
    const name = title.trim();
    if (!name) {
      setError(t.dayNameRequired);
      return;
    }
    tapFeedback();
    onAdd({ title: name.slice(0, MAX_TITLE), minutes, priority });
    setTitle('');
    setError(null);
  };

  return (
    <Card style={styles.card}>
      <TextField
        label={t.dayTaskName}
        placeholder={t.dayTaskPlaceholder}
        value={title}
        maxLength={MAX_TITLE}
        returnKeyType="done"
        onChangeText={(next) => {
          setTitle(next);
          if (error) setError(null);
        }}
        onSubmitEditing={submit}
        error={error}
        hint={full ? t.dayTaskLimit(MAX_TOOL_TASKS) : undefined}
      />
      <Stepper
        label={t.dayMinutes}
        valueText={formatDuration(minutes)}
        decrementLabel={t.dayEstimateLess}
        incrementLabel={t.dayEstimateMore}
        canDecrement={minutes > STEP}
        canIncrement={minutes < MAX_ESTIMATE}
        onDecrement={() => setMinutes((current) => Math.max(STEP, current - STEP))}
        onIncrement={() => setMinutes((current) => Math.min(MAX_ESTIMATE, current + STEP))}
      />
      <ChipSelect<Priority>
        label={t.dayPriority}
        value={priority}
        onChange={setPriority}
        options={[
          { value: 'high', label: t.dayPriorities.high },
          { value: 'medium', label: t.dayPriorities.medium },
          { value: 'low', label: t.dayPriorities.low },
        ]}
      />
      <Button title={t.dayAddTask} icon="add" variant="secondary" disabled={full} onPress={submit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
});
