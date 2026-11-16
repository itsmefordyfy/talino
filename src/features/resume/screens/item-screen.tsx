import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { useDeleteItem, useResumeItem, useSaveItem } from '../hooks/use-resume';
import { resumeStrings } from '../strings';
import { isResumeItemKind, type ResumeItem, type ResumeItemKind } from '../types';

export type ResumeItemScreenProps = {
  /** Editing this entry; a new one of `kind` when absent. */
  id?: string;
  kind?: string;
};

/** Add or edit one of the learner's own résumé entries. */
export function ResumeItemScreen({ id, kind }: ResumeItemScreenProps) {
  const strings = useLocalized(resumeStrings);
  if (!id) return <ItemForm initial={null} kind={isResumeItemKind(kind) ? kind : 'experience'} />;
  return <EditItem id={id} notFound={strings.notFound} notFoundBody={strings.notFoundBody} loadError={strings.loadError} />;
}

function EditItem({ id, notFound, notFoundBody, loadError }: { id: string; notFound: string; notFoundBody: string; loadError: string }) {
  const item = useResumeItem(id);
  // Kept once loaded, so deleting it doesn't flash "gone" while the sheet closes.
  const [loaded, setLoaded] = useState<ResumeItem | null>(null);
  if (item.data && loaded?.id !== item.data.id) setLoaded(item.data);
  const row = item.data ?? loaded;
  if (row) return <ItemForm key={row.id} initial={row} kind={row.kind} />;
  if (item.isPending) return <LoadingState />;
  if (item.isError) return <ErrorState message={loadError} onRetry={() => void item.refetch()} />;
  return <NotFoundState icon="description" title={notFound} message={notFoundBody} />;
}

type ItemFormProps = { initial: ResumeItem | null; kind: ResumeItemKind };

function ItemForm({ initial, kind }: ItemFormProps) {
  const strings = useLocalized(resumeStrings);
  const common = useStrings().common;
  const save = useSaveItem();
  const remove = useDeleteItem();
  // Made when the form opens: a second tap on Save updates this row instead of adding another.
  const [id] = useState(() => initial?.id ?? newId());
  const [title, setTitle] = useState(initial?.title ?? '');
  const [organization, setOrganization] = useState(initial?.organization ?? '');
  const [startOn, setStartOn] = useState<string | null>(initial?.start_on ?? null);
  const [endOn, setEndOn] = useState<string | null>(initial?.end_on ?? null);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [link, setLink] = useState(initial?.link ?? '');
  // Dates an imported résumé gave only as words ("2019 – 2021"): kept until the learner picks real ones.
  const datesText = initial?.dates_text ?? null;
  const [tried, setTried] = useState(false);

  // A skill is just its name; an achievement a name and a few words; a certification has one date (when it was earned).
  const hasOrganization = kind !== 'skill' && kind !== 'achievement';
  const hasRange = kind === 'experience' || kind === 'education' || kind === 'project';
  const hasDate = kind !== 'skill' && kind !== 'achievement';
  const hasPlace = hasRange;
  const hasLink = kind === 'project' || kind === 'certification';
  const hasDescription = kind !== 'skill';
  const busy = save.isPending || remove.isPending;

  const titleError = tried && title.trim() === '' ? strings.titleRequired : null;
  const rangeError = hasRange && startOn && endOn && endOn < startOn ? strings.endBeforeStart : null;

  const submit = () => {
    setTried(true);
    if (title.trim() === '' || rangeError || busy) return;
    save.mutate(
      { id, kind, title, organization: hasOrganization ? organization : '', startOn: hasRange ? startOn : null, endOn: hasDate ? endOn : null, description: hasDescription ? description : '', location: hasPlace ? location : '', link: hasLink ? link : '', datesText },
      {
        onSuccess: () => {
          successFeedback();
          closeScreen();
        },
        onError: (error) => reportError(error, 'career', { action: 'save-resume-item' }),
      },
    );
  };

  const confirmDelete = () =>
    Alert.alert(strings.deleteConfirm, strings.deleteConfirmBody, [
      { text: common.cancel, style: 'cancel' },
      {
        text: common.delete,
        style: 'destructive',
        onPress: () =>
          remove.mutate(id, {
            onSuccess: closeScreen,
            onError: (error) => reportError(error, 'career', { action: 'delete-resume-item' }),
          }),
      },
    ]);

  const kindLabel = strings.kinds[kind];
  const footer = (
    <FormActions>
      <Button title={save.isPending ? common.saving : common.save} loading={save.isPending} disabled={busy} onPress={submit} />
      {initial && <Button title={strings.deleteItem} variant="danger" disabled={busy} onPress={confirmDelete} />}
    </FormActions>
  );

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: initial ? strings.editItemTitle(kindLabel) : strings.newItemTitle(kindLabel) }} />
      {(save.isError || remove.isError) && <Notice tone="warning" message={strings.saveFailed} />}
      <FormSection title={kindLabel}>
        <TextField label={strings.itemTitleLabel[kind]} placeholder={strings.itemTitlePlaceholder[kind]} value={title} onChangeText={setTitle} error={titleError} autoCapitalize="sentences" />
        {hasOrganization && <TextField label={strings.organizationLabel[kind]} value={organization} onChangeText={setOrganization} autoCapitalize="words" />}
        {hasPlace && <TextField label={strings.locationLabel} placeholder={strings.locationPlaceholder} value={location} onChangeText={setLocation} autoCapitalize="words" />}
        {hasRange && <DateField label={strings.startLabel} value={startOn} onChange={setStartOn} placeholder={strings.datePlaceholder} clearLabel={strings.clearDate} hint={datesText && !startOn && !endOn ? strings.datesAsWritten(datesText) : undefined} />}
        {hasDate && (
          <DateField
            label={hasRange ? strings.endLabel : strings.earnedLabel}
            value={endOn}
            onChange={setEndOn}
            placeholder={strings.datePlaceholder}
            clearLabel={strings.clearDate}
            hint={hasRange ? strings.endHint : undefined}
            error={rangeError}
          />
        )}
        {hasLink && <TextField label={strings.linkLabel} placeholder="example.com" value={link} onChangeText={setLink} keyboardType="url" autoCapitalize="none" autoCorrect={false} />}
        {hasDescription && <TextField label={strings.descriptionLabel} placeholder={strings.descriptionPlaceholder} value={description} onChangeText={setDescription} multiline />}
      </FormSection>
    </Screen>
  );
}
