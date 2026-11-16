import * as Print from 'expo-print';
import { router, Stack } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
// The hook by its path: the journey's index also exports its screens.
import { useJourney } from '@/features/journey/hooks/use-journey';
import { learnerNameChanged, selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { formatDate } from '@/lib/dates';
import { reportError } from '@/lib/monitoring';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { ensureCertificate, readCertificates } from '../api/repo';
import { JourneyCertificateCard } from '../components/journey-certificate-card';
import { journeyCertificateStrings } from '../journey-strings';
import { JOURNEY_CERTIFICATE_ID, JOURNEY_CERTIFICATE_TITLE, journeyCertificateStatus } from '../lib/journey-certificate';
import { journeyCertificateHtml } from '../lib/journey-certificate-html';
import { linkedInAddUrl } from '../lib/linkedin';
import { certificateStrings } from '../strings';

/**
 * The AI Expert certificate: the whole AI Builder Journey finished, every level Beginner to Expert (`journeyCertificateStatus`).
 * Earned on the phone the first time it is complete and saved once (its issue date never moves), then shared as a PDF or added to
 * LinkedIn, like a course certificate.
 */
export function JourneyCertificateScreen() {
  const strings = useLocalized(journeyCertificateStrings);
  const common = useLocalized(certificateStrings);
  const dispatch = useAppDispatch();
  const learnerName = useAppSelector(selectLearnerName);
  const journey = useJourney();
  const certificates = useDbQuery(['certificates'], readCertificates);
  const ensure = useDbMutation((db, input: { name: string }) => ensureCertificate(db, JOURNEY_CERTIFICATE_ID, input.name));
  const [nameDraft, setNameDraft] = useState(learnerName);
  const [notice, setNotice] = useState<string | null>(null);

  const status = journeyCertificateStatus({ complete: journey.state.complete, stages: journey.state.stages.map((stage) => ({ level: stage.def.level, complete: stage.complete, done: stage.done, total: stage.total })) });
  const row = certificates.data?.find((entry) => entry.course_id === JOURNEY_CERTIFICATE_ID) ?? null;
  // Once issued it stays: a later change to the journey (a new course placed in it) never takes a certificate away.
  const earned = !!row || (!journey.isPending && status.earned);
  const ready = earned && learnerName.length >= 2;

  useEffect(() => {
    if (ready && certificates.data && !row) ensure.mutate({ name: learnerName });
  }, [ready, certificates.data, row, learnerName, ensure]);

  if (journey.isError || certificates.isError) return <ErrorState onRetry={() => { journey.refetch(); void certificates.refetch(); }} />;
  if (journey.isPending || certificates.isPending) return <LoadingState />;

  if (!earned) {
    return (
      <Screen footer={<Button title={strings.backToJourney} icon="hub" onPress={() => router.navigate('/')} />}>
        <Stack.Screen options={{ title: strings.title }} />
        <EmptyState icon="workspace_premium" title={strings.notYet} message={`${strings.notYetBody} ${strings.levelsProgress(status.levelsComplete)}.`} />
      </Screen>
    );
  }

  if (learnerName.length < 2) {
    return (
      <Screen footer={<Button title={common.saveName} onPress={() => dispatch(learnerNameChanged(nameDraft))} disabled={nameDraft.trim().length < 2} />}>
        <Stack.Screen options={{ title: strings.title }} />
        <Notice tone="info" message={common.nameNeeded} />
        <TextField label={common.nameLabel} value={nameDraft} onChangeText={setNameDraft} placeholder={common.namePlaceholder} autoCapitalize="words" />
      </Screen>
    );
  }

  const issuedAt = row?.issued_at ?? new Date().toISOString();
  const issued = formatDate(issuedAt.slice(0, 10), { month: 'long' });

  const sharePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: journeyCertificateHtml({ learnerName, issued }), width: 842, height: 595 });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: JOURNEY_CERTIFICATE_TITLE });
    } catch (error) {
      reportError(error, 'certificates', { step: 'journey-pdf' });
      setNotice(common.shareFailed);
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.actions}>
          <Button title={common.sharePdf} icon="picture_as_pdf" onPress={() => void sharePdf()} />
          <Button
            title={common.linkedIn}
            icon="work"
            variant="secondary"
            onPress={() => void Linking.openURL(linkedInAddUrl({ name: `${JOURNEY_CERTIFICATE_TITLE} (Talino)`, issuedAt, url: null, certId: null }))}
          />
        </View>
      }>
      <Stack.Screen options={{ title: strings.title }} />
      <JourneyCertificateCard learnerName={learnerName} issued={issued} />
      {notice && <Notice tone="warning" message={notice} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
  },
});
