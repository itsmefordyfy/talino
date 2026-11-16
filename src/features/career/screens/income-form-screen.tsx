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
import { currencySymbol, minorToInput, parseMoney } from '@/lib/money';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { useCareer, useDeleteIncome, useSaveIncome } from '../hooks/use-career';
import { careerStrings } from '../strings';
import { CURRENCIES, DEFAULT_CURRENCY, type ApplicationRow, type IncomeRow } from '../types';

const NONE = 'none';

export type IncomeFormScreenProps = {
  /** Editing this payment; a new one when absent. */
  id?: string;
};

/** Log or edit a payment from a client. */
export function IncomeFormScreen({ id }: IncomeFormScreenProps) {
  const strings = useLocalized(careerStrings);
  const career = useCareer();
  const found = id ? (career.data?.income.find((row) => row.id === id) ?? null) : null;
  // Kept once loaded, so deleting it doesn't flash "gone" while the sheet closes.
  const [loaded, setLoaded] = useState<IncomeRow | null>(null);
  if (found && loaded?.id !== found.id) setLoaded(found);

  if (career.isError) return <ErrorState onRetry={() => void career.refetch()} />;
  if (!career.data) return <LoadingState />;
  const applications = career.data.applications;
  if (!id) return <IncomeForm initial={null} applications={applications} />;
  const row = found ?? loaded;
  if (row) return <IncomeForm key={row.id} initial={row} applications={applications} />;
  return <NotFoundState icon="payments" title={strings.notFound} />;
}

type IncomeFormProps = { initial: IncomeRow | null; applications: readonly ApplicationRow[] };

function IncomeForm({ initial, applications }: IncomeFormProps) {
  const strings = useLocalized(careerStrings);
  const common = useStrings().common;
  const save = useSaveIncome();
  const remove = useDeleteIncome();
  // The id is made when the form opens: a second tap on Save updates this row instead of adding another.
  const [id] = useState(() => initial?.id ?? newId());
  const [client, setClient] = useState(initial?.client ?? '');
  const [currency, setCurrency] = useState(initial?.currency ?? DEFAULT_CURRENCY);
  const [amount, setAmount] = useState(initial ? minorToInput(initial.amount_minor, initial.currency) : '');
  const [receivedOn, setReceivedOn] = useState<string | null>(initial?.received_on ?? todayISO());
  const [applicationId, setApplicationId] = useState<string>(initial?.application_id ?? NONE);
  const [note, setNote] = useState(initial?.note ?? '');
  const [tried, setTried] = useState(false);

  const minor = parseMoney(amount, currency);
  const clientError = tried && client.trim() === '' ? common.required : null;
  const amountError = tried && (minor === null || minor <= 0) ? strings.invalidAmount : null;
  const dateError = tried && receivedOn === null ? common.required : null;
  const busy = save.isPending || remove.isPending;

  // Gigs to link: freelance ones, plus whatever this payment is already linked to.
  const gigs = applications.filter((row) => row.kind === 'freelance' || row.id === initial?.application_id);
  const currencies = CURRENCIES.includes(currency as (typeof CURRENCIES)[number]) ? [...CURRENCIES] : [currency, ...CURRENCIES];

  const pickApplication = (value: string) => {
    setApplicationId(value);
    const gig = gigs.find((row) => row.id === value);
    if (gig && client.trim() === '') setClient(gig.company);
  };

  const submit = () => {
    setTried(true);
    if (client.trim() === '' || minor === null || minor <= 0 || receivedOn === null || busy) return;
    save.mutate(
      { id, client, amountMinor: minor, currency, receivedOn, applicationId: applicationId === NONE ? null : applicationId, note },
      {
        onSuccess: () => {
          successFeedback();
          closeScreen();
        },
        onError: (error) => reportError(error, 'career', { action: 'save-income' }),
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
            onError: (error) => reportError(error, 'career', { action: 'delete-income' }),
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
      <FormSection title={strings.detailsSection}>
        <TextField label={strings.clientLabel} placeholder={strings.clientPlaceholder} value={client} onChangeText={setClient} error={clientError} autoCapitalize="words" />
        <TextField label={strings.amountLabel} placeholder="0" value={amount} onChangeText={setAmount} numeric="decimal" suffix={currencySymbol(currency)} error={amountError} selectTextOnFocus />
        <ChipSelect<string> label={strings.currencyLabel} options={currencies.map((code) => ({ value: code, label: code }))} value={currency} onChange={setCurrency} />
        <DateField label={strings.receivedOn} value={receivedOn} onChange={setReceivedOn} placeholder={strings.pickDate} maximumDate={todayISO()} error={dateError} />
      </FormSection>

      {gigs.length > 0 && (
        <FormSection title={strings.linkedApplication}>
          <ChipSelect<string>
            wrap
            options={[{ value: NONE, label: strings.noLinkedApplication }, ...gigs.map((row) => ({ value: row.id, label: `${row.title} · ${row.company}` }))]}
            value={applicationId}
            onChange={pickApplication}
          />
        </FormSection>
      )}

      <FormSection title={strings.notesLabel}>
        <TextField label={common.note} labelHidden placeholder={common.notePlaceholder} value={note} onChangeText={setNote} multiline />
      </FormSection>
    </Screen>
  );
}
