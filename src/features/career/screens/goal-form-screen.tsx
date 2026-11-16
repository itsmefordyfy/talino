import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { DateField } from '@/components/ui/date-field';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { todayISO } from '@/lib/dates';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { currencyDigits, currencySymbol, minorToInput, parseMoney } from '@/lib/money';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { useCareer, useDeleteGoal, useSaveGoal } from '../hooks/use-career';
import { careerStrings } from '../strings';
import { CURRENCIES, DEFAULT_CURRENCY, GOAL_METRICS, type GoalMetric, type GoalRow } from '../types';

export type GoalFormScreenProps = {
  /** Editing this goal; a new one when absent. */
  id?: string;
};

/** Set or edit a career goal ("first client by March"); its progress is worked out from the tracker. */
export function GoalFormScreen({ id }: GoalFormScreenProps) {
  const strings = useLocalized(careerStrings);
  const career = useCareer();
  const found = id ? (career.data?.goals.find((row) => row.id === id) ?? null) : null;
  // Kept once loaded, so deleting it doesn't flash "gone" while the sheet closes.
  const [loaded, setLoaded] = useState<GoalRow | null>(null);
  if (found && loaded?.id !== found.id) setLoaded(found);

  if (!id) return <GoalForm initial={null} />;
  const row = found ?? loaded;
  if (row) return <GoalForm key={row.id} initial={row} />;
  if (career.isError) return <ErrorState onRetry={() => void career.refetch()} />;
  if (!career.data) return <LoadingState />;
  return <NotFoundState icon="flag" title={strings.notFound} />;
}

/** The target as typed: a whole count, or an amount in major units for income. */
function parseTarget(text: string, metric: GoalMetric, currency: string): number | null {
  if (metric === 'income') {
    const minor = parseMoney(text, currency);
    return minor === null ? null : minor / 10 ** currencyDigits(currency);
  }
  const value = Number(text.replace(/[^0-9]/g, ''));
  return text.trim() === '' || !Number.isFinite(value) ? null : value;
}

function GoalForm({ initial }: { initial: GoalRow | null }) {
  const strings = useLocalized(careerStrings);
  const common = useStrings().common;
  const save = useSaveGoal();
  const remove = useDeleteGoal();
  // The id is made when the form opens: a second tap on Save updates this row instead of adding another.
  const [id] = useState(() => initial?.id ?? newId());
  const [title, setTitle] = useState(initial?.title ?? '');
  const [metric, setMetric] = useState<GoalMetric>(initial?.metric ?? 'applications');
  const [currency, setCurrency] = useState(initial?.currency ?? DEFAULT_CURRENCY);
  const [target, setTarget] = useState(initial ? (initial.metric === 'income' ? minorToInput(Math.round(initial.target * 10 ** currencyDigits(initial.currency ?? DEFAULT_CURRENCY)), initial.currency ?? DEFAULT_CURRENCY) : String(initial.target)) : '');
  const [dueOn, setDueOn] = useState<string | null>(initial?.due_on ?? null);
  const [tried, setTried] = useState(false);

  const value = parseTarget(target, metric, currency);
  const titleError = tried && title.trim() === '' ? common.required : null;
  const targetError = tried && (value === null || value <= 0) ? strings.invalidTarget : null;
  const busy = save.isPending || remove.isPending;

  const submit = () => {
    setTried(true);
    if (title.trim() === '' || value === null || value <= 0 || busy) return;
    save.mutate(
      { id, title, metric, target: value, currency: metric === 'income' ? currency : null, dueOn },
      {
        onSuccess: () => {
          successFeedback();
          closeScreen();
        },
        onError: (error) => reportError(error, 'career', { action: 'save-goal' }),
      },
    );
  };

  const confirmDelete = () => {
    Alert.alert(common.deleteConfirmTitle, common.deleteConfirmBody, [
      { text: common.cancel, style: 'cancel' },
      {
        text: common.delete,
        style: 'destructive',
        onPress: () =>
          remove.mutate(id, {
            onSuccess: closeScreen,
            onError: (error) => reportError(error, 'career', { action: 'delete-goal' }),
          }),
      },
    ]);
  };

  const footer = (
    <FormActions>
      <Button title={save.isPending ? common.saving : common.save} loading={save.isPending} disabled={busy} onPress={submit} />
      {initial && <Button title={common.delete} variant="danger" disabled={busy} onPress={confirmDelete} />}
    </FormActions>
  );

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      {(save.isError || remove.isError) && <Notice tone="danger" message={strings.saveFailed} />}
      <FormSection title={strings.detailsSection} footer={strings.goalHint}>
        <TextField label={strings.goalTitleLabel} placeholder={strings.goalTitlePlaceholder} value={title} onChangeText={setTitle} error={titleError} />
        <ChipSelect<GoalMetric> label={strings.metricLabel} wrap options={GOAL_METRICS.map((option) => ({ value: option, label: strings.metrics[option] }))} value={metric} onChange={setMetric} />
        {metric === 'income' && <ChipSelect<string> label={strings.currencyLabel} options={CURRENCIES.map((code) => ({ value: code, label: code }))} value={currency} onChange={setCurrency} />}
        <TextField
          label={strings.targetLabel(metric)}
          placeholder={strings.targetPlaceholder(metric)}
          value={target}
          onChangeText={setTarget}
          numeric={metric === 'income' ? 'decimal' : 'integer'}
          suffix={metric === 'income' ? currencySymbol(currency) : undefined}
          error={targetError}
        />
        <DateField label={strings.dueLabel} value={dueOn} onChange={setDueOn} placeholder={strings.noDueDate} clearLabel={strings.clear} minimumDate={todayISO()} />
      </FormSection>
    </Screen>
  );
}
