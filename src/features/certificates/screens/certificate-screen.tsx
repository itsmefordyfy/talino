import * as Print from 'expo-print';
import { Stack } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { CAREER_COURSES, getCourse, useLearning } from '@/features/courses';
import { learnerNameChanged, selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { formatDate } from '@/lib/dates';
import { reportError } from '@/lib/monitoring';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { CertificateCard } from '../components/certificate-card';
import { ensureCertificate, readCertificates } from '../api/repo';
import { certificateHtml } from '../lib/certificate-html';
import { linkedInAddUrl } from '../lib/linkedin';
import { JOURNEY_CERTIFICATE_ID } from '../lib/journey-certificate';
import { certificateStrings } from '../strings';
import { JourneyCertificateScreen } from './journey-certificate-screen';

export const MASTER_COURSE_ID = 'master';

/** The certificate for an id: the AI Expert certificate (the whole journey) has its own screen and design; every other is a course's. */
export function CertificateScreen({ courseId }: { courseId: string }) {
  return courseId === JOURNEY_CERTIFICATE_ID ? <JourneyCertificateScreen /> : <CourseCertificateScreen courseId={courseId} />;
}

/** A course's certificate (or Talino Master): earned on the phone, shared as a PDF or added to LinkedIn. No verification link (owner, 2026-11-15). */
function CourseCertificateScreen({ courseId }: { courseId: string }) {
  const strings = useLocalized(certificateStrings);
  const dispatch = useAppDispatch();
  const learnerName = useAppSelector(selectLearnerName);
  const learning = useLearning();
  const certificates = useDbQuery(['certificates'], readCertificates);
  const ensure = useDbMutation((db, input: { courseId: string; name: string }) => ensureCertificate(db, input.courseId, input.name));
  const [nameDraft, setNameDraft] = useState(learnerName);
  const [notice, setNotice] = useState<{ tone: 'warning'; text: string } | null>(null);

  const master = courseId === MASTER_COURSE_ID;
  const course = master ? null : getCourse(courseId);
  const title = master ? strings.master : (course?.title ?? '');
  const complete = master ? CAREER_COURSES.every((career) => learning.progressFor(career.id)?.complete) : !!learning.progressFor(courseId)?.complete;
  const row = certificates.data?.find((entry) => entry.course_id === courseId) ?? null;
  const ready = complete && learnerName.length >= 2;

  useEffect(() => {
    if (ready && certificates.data && !row) ensure.mutate({ courseId, name: learnerName });
  }, [ready, certificates.data, row, courseId, learnerName, ensure]);

  if (learning.isPending || certificates.isPending) return <LoadingState />;
  if (!master && !course) return <EmptyState icon="workspace_premium" title={strings.notYet} />;

  if (!complete) {
    return (
      <Screen>
        <Stack.Screen options={{ title: strings.title }} />
        <EmptyState icon="workspace_premium" title={strings.notYet} message={strings.notYetBody} />
      </Screen>
    );
  }

  if (learnerName.length < 2) {
    return (
      <Screen footer={<Button title={strings.saveName} onPress={() => dispatch(learnerNameChanged(nameDraft))} disabled={nameDraft.trim().length < 2} />}>
        <Stack.Screen options={{ title: strings.title }} />
        <Notice tone="info" message={strings.nameNeeded} />
        <TextField label={strings.nameLabel} value={nameDraft} onChangeText={setNameDraft} placeholder={strings.namePlaceholder} autoCapitalize="words" />
      </Screen>
    );
  }

  const issued = formatDate((row?.issued_at ?? new Date().toISOString()).slice(0, 10), { month: 'long' });

  const sharePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: certificateHtml({ learnerName, courseTitle: title, issued, master }), width: 842, height: 595 });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: title });
    } catch (error) {
      reportError(error, 'certificates', { step: 'pdf' });
      setNotice({ tone: 'warning', text: strings.shareFailed });
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.actions}>
          <Button title={strings.sharePdf} icon="picture_as_pdf" onPress={() => void sharePdf()} />
          <Button
            title={strings.linkedIn}
            icon="work"
            variant="secondary"
            onPress={() => void Linking.openURL(linkedInAddUrl({ name: `${title} (Talino)`, issuedAt: row?.issued_at ?? new Date().toISOString(), url: null, certId: null }))}
          />
        </View>
      }>
      <Stack.Screen options={{ title: strings.title }} />
      <CertificateCard learnerName={learnerName} courseTitle={title} master={master} issued={issued} />
      {notice && <Notice tone={notice.tone} message={notice.text} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
  },
});
