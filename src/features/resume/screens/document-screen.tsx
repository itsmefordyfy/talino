import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FormActions } from '@/components/ui/form-actions';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { openPaywall, useAccess } from '@/features/store';
import { useViewport } from '@/hooks/use-viewport';
import { useLocalized } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { exportDocx, exportPdf } from '../api/export';
import type { ResumeDocument } from '../api/document-repo';
import { AssistantPanel } from '../components/assistant-panel';
import { ContentEditor } from '../components/content-editor';
import { DesignPanel } from '../components/design-panel';
import { DocumentPreview } from '../components/document-preview';
import { useDocumentDraft } from '../hooks/use-document-draft';
import { useDeleteDocument, useDocument, useDuplicateDocument } from '../hooks/use-documents';
import { useProfilePhoto } from '../hooks/use-resume';
import { takeNotes } from '../lib/pending-notes';
import { builderStrings } from '../builder-strings';
import { resumeStrings } from '../strings';

type Tab = 'preview' | 'edit' | 'design' | 'ai';

/** Wide enough to show the preview beside the editor (an iPad, a phone on its side, an open iPhone Duo). */
const SIDE_BY_SIDE = 720;

export function DocumentScreen({ id }: { id: string }) {
  const r = useLocalized(resumeStrings);
  const s = useLocalized(builderStrings);
  const document = useDocument(id);
  // Kept once loaded, so deleting it doesn't flash "gone" while the screen closes.
  const [loaded, setLoaded] = useState<ResumeDocument | null>(null);
  if (document.data && loaded?.id !== document.data.id) setLoaded(document.data);
  const row = loaded ?? document.data;
  if (row) return <DocumentEditor key={row.id} initial={row} />;
  if (document.isPending) return <LoadingState />;
  if (document.isError) return <ErrorState message={r.loadError} onRetry={() => void document.refetch()} />;
  return <NotFoundState icon="description" title={s.doc.notFound} message={s.doc.notFoundBody} />;
}

function DocumentEditor({ initial }: { initial: ResumeDocument }) {
  const s = useLocalized(builderStrings);
  const access = useAccess();
  const { width } = useViewport();
  const draft = useDocumentDraft(initial);
  const duplicate = useDuplicateDocument();
  const remove = useDeleteDocument();
  const profilePhoto = useProfilePhoto();
  const [tab, setTab] = useState<Tab>('preview');
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  // Read once: what Tali said while writing this résumé, for the AI tab.
  const [notes] = useState(() => takeNotes(initial.id));
  const wide = width >= SIDE_BY_SIDE;
  const busy = duplicate.isPending || remove.isPending;

  const run = async (kind: 'pdf' | 'docx') => {
    if (exporting) return;
    setExporting(kind);
    setExportError(null);
    try {
      await draft.flush();
      const shared = await (kind === 'pdf' ? exportPdf(draft.content, draft.style, draft.name) : exportDocx(draft.content, draft.style, draft.name));
      if (!shared) setExportError(s.export.unavailable);
      else successFeedback();
    } catch (error) {
      reportError(error, 'career', { step: `resume-${kind}` });
      setExportError(s.export.failed);
    } finally {
      setExporting(null);
    }
  };

  const copy = () => {
    void draft.flush().then(() =>
      duplicate.mutate(
        { id: initial.id, name: s.design.copyName(draft.name) },
        {
          onSuccess: (copyId) => {
            if (copyId) router.replace({ pathname: '/resume/document/[id]', params: { id: copyId } });
          },
          onError: (error) => reportError(error, 'career', { action: 'duplicate-resume' }),
        },
      ),
    );
  };

  const preview = <DocumentPreview content={draft.content} style={draft.style} accessibilityLabel={s.doc.previewLabel(draft.name)} />;
  const panel = (current: Exclude<Tab, 'preview'>) =>
    current === 'edit' ? (
      <ContentEditor content={draft.content} style={draft.style} onChange={draft.setContent} canImprove={access.allAccess} onUpgrade={() => void openPaywall('resume')} />
    ) : current === 'design' ? (
      <DesignPanel
        style={draft.style}
        onStyle={draft.setStyle}
        name={draft.name}
        onName={draft.setName}
        onDuplicate={copy}
        onDelete={() =>
          remove.mutate(initial.id, {
            onSuccess: closeScreen,
            onError: (error) => reportError(error, 'career', { action: 'delete-resume' }),
          })
        }
        busy={busy}
        photoAvailable={Boolean(profilePhoto.data || draft.content.photo)}
        onPhoto={(on) => {
          // Turning it on copies the profile's current picture into this résumé (a snapshot, like the rest of its content); turning it off keeps the copy for later.
          if (on && profilePhoto.data && draft.content.photo !== profilePhoto.data) draft.setContent({ ...draft.content, photo: profilePhoto.data });
          draft.setStyle({ ...draft.style, photo: on });
        }}
      />
    ) : (
      <AssistantPanel documentId={initial.id} content={draft.content} style={draft.style} target={draft.target} onContent={draft.setContent} allAccess={access.allAccess} notes={notes} flush={draft.flush} />
    );

  const footer = (
    <FormActions>
      <Button title={exporting === 'pdf' ? s.export.makingPdf : s.export.pdf} icon="picture_as_pdf" loading={exporting === 'pdf'} disabled={exporting !== null} onPress={() => void run('pdf')} />
      <Button title={exporting === 'docx' ? s.export.makingWord : s.export.word} icon="description" variant="secondary" loading={exporting === 'docx'} disabled={exporting !== null} onPress={() => void run('docx')} />
    </FormActions>
  );

  const notices = (
    <>
      {exportError && <Notice tone="warning" message={exportError} />}
      {draft.saveFailed && <Notice tone="warning" message={s.doc.saveFailed} />}
    </>
  );

  const pageNote = (
    <ThemedText type="caption" themeColor="textSecondary" style={styles.note}>
      {s.doc.previewNote}
    </ThemedText>
  );

  if (wide) {
    return (
      <View style={styles.row}>
        <ScrollView style={styles.half} contentContainerStyle={styles.previewContent} contentInsetAdjustmentBehavior="automatic">
          <Stack.Screen options={{ title: draft.name }} />
          {preview}
          {pageNote}
        </ScrollView>
        <View style={styles.half}>
          <Screen footer={footer} keyboardShouldPersistTaps="handled">
            <SegmentedControl
              options={[
                { value: 'edit', label: s.doc.tabs.edit },
                { value: 'design', label: s.doc.tabs.design },
                { value: 'ai', label: s.doc.tabs.ai },
              ]}
              value={tab === 'preview' ? 'edit' : tab}
              onChange={setTab}
              accessibilityLabel={s.doc.tabsLabel}
            />
            {notices}
            {panel(tab === 'preview' ? 'edit' : tab)}
          </Screen>
        </View>
      </View>
    );
  }

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: draft.name }} />
      <SegmentedControl
        options={[
          { value: 'preview', label: s.doc.tabs.preview },
          { value: 'edit', label: s.doc.tabs.edit },
          { value: 'design', label: s.doc.tabs.design },
          { value: 'ai', label: s.doc.tabs.ai },
        ]}
        value={tab}
        onChange={setTab}
        accessibilityLabel={s.doc.tabsLabel}
      />
      {notices}
      {tab === 'preview' ? (
        <>
          {preview}
          {pageNote}
        </>
      ) : (
        panel(tab)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  half: {
    flex: 1,
  },
  previewContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  note: {
    paddingHorizontal: Spacing.three,
  },
});
