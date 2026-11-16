import { router, Stack } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { TaliSays } from '@/components/tali-says';
import { useCoachIdentity } from '@/features/coach';
import { openPaywall, useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { aiErrorKey, requestGenerated, type AiErrorKey } from '../api/ai-client';
import type { ResumeDocument } from '../api/document-repo';
import { GenerationProgress } from '../components/generation-progress';
import { builderStrings } from '../builder-strings';
import { applyGenerated } from '../lib/ai';
import { holdNotes } from '../lib/pending-notes';
import { useCreateDocument, useDocument } from '../hooks/use-documents';
import { resumeStrings } from '../strings';

const MIN_JOB_POST = 40;

/** Tailor a résumé to a job post: Tali rewords it for the job and the result is a new résumé; the original is never changed. */
export function TailorScreen({ docId }: { docId?: string }) {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const access = useAccess();
  const document = useDocument(docId ?? '');
  if (!docId) return <NotFoundState icon="description" title={s.doc.notFound} message={s.doc.notFoundBody} />;
  if (document.isPending) return <LoadingState />;
  if (document.isError) return <ErrorState message={r.loadError} onRetry={() => void document.refetch()} />;
  if (!document.data) return <NotFoundState icon="description" title={s.doc.notFound} message={s.doc.notFoundBody} />;
  if (!access.allAccess) {
    return (
      <Screen>
        <Stack.Screen options={{ title: s.tailor.title }} />
        <EmptyState icon="lock" title={s.tailor.lockedTitle} message={s.tailor.lockedBody} action={<Button title={s.assistant.seeAllAccess} onPress={() => void openPaywall('resume')} />} />
      </Screen>
    );
  }
  return <TailorForm source={document.data} />;
}

function TailorForm({ source }: { source: ResumeDocument }) {
  const s = useLocalized(builderStrings);
  const language = useLanguage();
  const identity = useCoachIdentity();
  const create = useCreateDocument();
  const [title, setTitle] = useState(source.target?.jobTitle ?? '');
  const [post, setPost] = useState(source.target?.jobDescription ?? '');
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AiErrorKey | null>(null);
  // One id per attempt: a retry after a failure is the same request and the same new résumé.
  const [requestId] = useState(newId);
  const [newDocumentId] = useState(newId);
  const text = post.trim();
  const short = text.length < MIN_JOB_POST;

  const tailor = async () => {
    setTried(true);
    if (short || busy) return;
    setBusy(true);
    setError(null);
    try {
      const generated = await requestGenerated(identity, { requestId, content: source.content, goal: '', level: null, job: { title: title.trim(), description: text }, language });
      const result = applyGenerated(source.content, generated);
      holdNotes(newDocumentId, { questions: result.questions, suggestedSkills: result.suggestedSkills, gaps: result.gaps });
      create.mutate(
        { id: newDocumentId, name: s.tailor.docName(source.name, title.trim()), style: source.style, content: result.content, target: { jobTitle: title.trim(), jobDescription: text, keywords: result.keywords } },
        {
          onSuccess: () => {
            successFeedback();
            router.replace({ pathname: '/resume/document/[id]', params: { id: newDocumentId } });
          },
          onError: (caught) => {
            reportError(caught, 'career', { action: 'save-tailored-resume' });
            setError('unknown');
            setBusy(false);
          },
        },
      );
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'tailor-resume' });
      setError(key);
      setBusy(false);
    }
  };

  if (busy) return <GenerationProgress />;

  return (
    <Screen footer={<Button title={s.tailor.tailor} icon="auto_awesome" onPress={() => void tailor()} />} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: s.tailor.title }} />
      <TaliSays mood="explaining" text={s.tailor.say(source.name)} />
      {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={s.errors[error]} />}
      <FormSection title={s.create.jobTitleSection} footer={s.tailor.footer}>
        <TextField label={s.create.jobTitleLabel} placeholder={s.create.jobTitlePlaceholder} value={title} onChangeText={setTitle} maxLength={120} autoCapitalize="words" />
        <TextField label={s.create.jobPostLabel} placeholder={s.create.jobPostPlaceholder} value={post} onChangeText={setPost} multiline error={tried && short ? s.create.jobPostTooShort : null} />
      </FormSection>
    </Screen>
  );
}
