import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { DateField } from '@/components/ui/date-field';
import { combineDateTime } from '@/components/ui/date-time-field';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { TimeField } from '@/components/ui/time-field';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { todayISO, toISODate, toTimeString } from '@/lib/dates';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { useCareer, useDeleteApplication, useSaveApplication } from '../hooks/use-career';
import { careerStrings } from '../strings';
import { APPLICATION_KINDS, SOURCES, STAGES, type ApplicationKind, type ApplicationRow, type Source, type Stage } from '../types';

const DEFAULT_INTERVIEW_TIME = '09:00';

export type ApplicationFormScreenProps = {
  /** Editing this application; a new one when absent. */
  id?: string;
};

/** Add or edit a job application or a freelance proposal. */
export function ApplicationFormScreen({ id }: ApplicationFormScreenProps) {
  const strings = useLocalized(careerStrings);
  const career = useCareer();
  const found = id ? (career.data?.applications.find((row) => row.id === id) ?? null) : null;
  // Kept once loaded, so deleting it doesn't flash "gone" while the sheet closes.
  const [loaded, setLoaded] = useState<ApplicationRow | null>(null);
  if (found && loaded?.id !== found.id) setLoaded(found);

  if (!id) return <ApplicationForm initial={null} />;
  const row = found ?? loaded;
  if (row) return <ApplicationForm key={row.id} initial={row} />;
  if (career.isError) return <ErrorState onRetry={() => void career.refetch()} />;
  if (!career.data) return <LoadingState />;
  return <NotFoundState icon="work" title={strings.notFound} />;
}

type ApplicationFormProps = { initial: ApplicationRow | null };

function ApplicationForm({ initial }: ApplicationFormProps) {
  const strings = useLocalized(careerStrings);
  const common = useStrings().common;
  const save = useSaveApplication();
  const remove = useDeleteApplication();
  // The id is made when the form opens: a second tap on Save updates this row instead of adding another.
  const [id] = useState(() => initial?.id ?? newId());
  const [kind, setKind] = useState<ApplicationKind>(initial?.kind ?? 'job');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [company, setCompany] = useState(initial?.company ?? '');
  const [link, setLink] = useState(initial?.link ?? '');
  const [source, setSource] = useState<Source | null>(initial?.source ?? null);
  const [stage, setStage] = useState<Stage>(initial?.stage ?? 'saved');
  const [appliedOn, setAppliedOn] = useState<string | null>(initial?.applied_on ?? null);
  const [followUpOn, setFollowUpOn] = useState<string | null>(initial?.follow_up_on ?? null);
  const [interviewDate, setInterviewDate] = useState<string | null>(initial?.interview_at ? toISODate(new Date(initial.interview_at)) : null);
  const [interviewTime, setInterviewTime] = useState<string | null>(initial?.interview_at ? toTimeString(new Date(initial.interview_at)) : null);
  const [pay, setPay] = useState(initial?.pay ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [tried, setTried] = useState(false);

  const titleError = tried && title.trim() === '' ? common.required : null;
  const companyError = tried && company.trim() === '' ? common.required : null;
  const busy = save.isPending || remove.isPending;

  const changeStage = (next: Stage) => {
    setStage(next);
    // Moving it to Applied usually means it was sent today.
    if (next === 'applied' && appliedOn === null) setAppliedOn(todayISO());
  };

  const submit = () => {
    setTried(true);
    if (title.trim() === '' || company.trim() === '' || busy) return;
    save.mutate(
      {
        id,
        kind,
        title,
        company,
        link,
        source,
        stage,
        appliedOn,
        followUpOn,
        interviewAt: interviewDate ? combineDateTime(interviewDate, interviewTime ?? DEFAULT_INTERVIEW_TIME) : null,
        pay,
        notes,
      },
      {
        onSuccess: () => {
          successFeedback();
          closeScreen();
        },
        onError: (error) => reportError(error, 'career', { action: 'save-application' }),
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
            onError: (error) => reportError(error, 'career', { action: 'delete-application' }),
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
      <SegmentedControl<ApplicationKind> accessibilityLabel={strings.kindLabel} options={APPLICATION_KINDS.map((value) => ({ value, label: strings.kinds[value] }))} value={kind} onChange={setKind} />
      {(save.isError || remove.isError) && <Notice tone="danger" message={strings.saveFailed} />}

      <FormSection title={strings.detailsSection}>
        <TextField label={strings.titleLabel(kind)} placeholder={strings.titlePlaceholder(kind)} value={title} onChangeText={setTitle} error={titleError} autoCapitalize="words" />
        <TextField label={strings.companyLabel(kind)} placeholder={strings.companyPlaceholder(kind)} value={company} onChangeText={setCompany} error={companyError} autoCapitalize="words" />
        <TextField label={strings.linkLabel} placeholder={strings.linkPlaceholder} value={link} onChangeText={setLink} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <ChipSelect<Source>
          label={strings.sourceLabel}
          wrap
          options={SOURCES.map((value) => ({ value, label: strings.sources[value] }))}
          value={source}
          // Tapping the chosen source again clears it: where it came from is optional.
          onChange={(value) => setSource(value === source ? null : value)}
        />
      </FormSection>

      <FormSection title={strings.stageSection}>
        <ChipSelect<Stage> wrap options={STAGES.map((value) => ({ value, label: strings.stageLabel(value, kind) }))} value={stage} onChange={changeStage} />
      </FormSection>

      <FormSection title={strings.datesSection} footer={strings.remindersHint}>
        <DateField label={strings.appliedOn(kind)} value={appliedOn} onChange={setAppliedOn} placeholder={strings.pickDate} clearLabel={strings.clear} maximumDate={todayISO()} />
        <DateField label={strings.followUpOn} value={followUpOn} onChange={setFollowUpOn} placeholder={strings.pickDate} clearLabel={strings.clear} />
        <DateField
          label={strings.interviewDate(kind)}
          value={interviewDate}
          onChange={(value) => {
            setInterviewDate(value);
            if (value && interviewTime === null) setInterviewTime(DEFAULT_INTERVIEW_TIME);
          }}
          placeholder={strings.pickDate}
          clearLabel={strings.clear}
        />
        {interviewDate && <TimeField label={strings.interviewTime} value={interviewTime} onChange={setInterviewTime} placeholder={strings.pickTime} initialTime={DEFAULT_INTERVIEW_TIME} />}
      </FormSection>

      <FormSection title={strings.payNotesSection}>
        <TextField label={strings.payLabel} placeholder={strings.payPlaceholder} value={pay} onChangeText={setPay} />
        <TextField label={strings.notesLabel} placeholder={strings.notesPlaceholder} value={notes} onChangeText={setNotes} multiline />
      </FormSection>
    </Screen>
  );
}
