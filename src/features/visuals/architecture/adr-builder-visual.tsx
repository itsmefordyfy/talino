import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Notice, type NoticeTone } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useSaveArtifact, type Artifact } from '@/features/architecture';
import {
  adrChallengePrompt,
  adrProblems,
  adrToContent,
  adrToMarkdown,
  isBlankDraft,
  newAdrDraft,
  parseAdrContent,
  todayIso,
  type AdrDraft,
} from '@/features/architecture/lib/adr';
import { useLocalized } from '@/hooks/use-strings';
import { copyText } from '@/lib/clipboard';
import { tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';

import { ARCHITECTURE_PROJECT_IDS, isArchitectureProjectId, type ArchitectureProjectId } from '../../architecture/adr/projects';
import { adrStrings } from '../../architecture/adr/strings';
import { VisualFrame } from '../components/visual-frame';
import { Panel } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { architectureVisualStrings } from './strings';
import { Disclosure } from '../productivity/disclosure';
import { AdrChecklist } from './adr-builder/adr-checklist';
import { AdrFields } from './adr-builder/adr-fields';
import { SavedAdrs } from './adr-builder/saved-adrs';

/** How long "Copied" stays on the button before it goes back to "Copy Markdown". */
const COPIED_MS = 2500;

type Saved = { content: string; projectId: ArchitectureProjectId | null };
type Pending = { kind: 'new' } | { kind: 'open'; artifact: Artifact };
type Message = { tone: NoticeTone; text: string };

/**
 * The decision record builder: guided fields, a calm checklist of what a useful record still needs (rules, never an AI), a Markdown preview, Copy, saved records on this
 * phone and a hand-off to Tali to challenge the decision. The decision and its reasons are always the learner's own.
 */
export function AdrBuilderVisual({ compact }: VisualProps) {
  const t = useLocalized(adrStrings);
  const v = useLocalized(architectureVisualStrings).adr;
  const router = useRouter();
  const save = useSaveArtifact();
  // The record's id is made once, here, so a double tap or a retry of Save updates the same row.
  const [artifactId, setArtifactId] = useState(() => newId());
  const [draft, setDraft] = useState<AdrDraft>(() => newAdrDraft(todayIso()));
  const [projectId, setProjectId] = useState<ArchitectureProjectId | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');

  const problems = adrProblems(draft);
  const markdown = adrToMarkdown(draft);
  const blank = isBlankDraft(draft);
  const dirty = saved ? adrToContent(draft) !== saved.content || projectId !== saved.projectId : !blank || projectId !== null;

  useEffect(() => {
    if (copied !== 'done') return;
    const id = setTimeout(() => setCopied('idle'), COPIED_MS);
    return () => clearTimeout(id);
  }, [copied]);

  const edit = (next: AdrDraft) => {
    setDraft(next);
    setMessage(null);
    setCopied('idle');
  };

  const startNew = () => {
    setArtifactId(newId());
    setDraft(newAdrDraft(todayIso()));
    setProjectId(null);
    setSaved(null);
    setMessage(null);
    setPending(null);
  };

  const openRecord = (artifact: Artifact) => {
    setPending(null);
    const parsed = parseAdrContent(artifact.content);
    if (!parsed) {
      setMessage({ tone: 'danger', text: t.openFailed });
      return;
    }
    const attached = isArchitectureProjectId(artifact.projectId) ? artifact.projectId : null;
    setArtifactId(artifact.id);
    setDraft(parsed);
    setProjectId(attached);
    setSaved({ content: adrToContent(parsed), projectId: attached });
    setMessage(null);
  };

  const requestOpen = (artifact: Artifact) => {
    if (artifact.id === artifactId) return;
    if (dirty) setPending({ kind: 'open', artifact });
    else openRecord(artifact);
  };

  const onDeleted = (id: string) => {
    // The open record is gone: what is on screen becomes a new, unsaved record under a new id, so Save never brings the old one back.
    if (id !== artifactId) return;
    setArtifactId(newId());
    setSaved(null);
    setMessage(null);
  };

  const saveRecord = async () => {
    if (blank) return;
    tapFeedback();
    const content = adrToContent(draft);
    try {
      const result = await save.mutateAsync({ id: artifactId, kind: 'adr', title: draft.title.trim() || t.savedUntitled, content, projectId });
      if (!result.ok) {
        setMessage({ tone: 'danger', text: t.saveRefused[result.reason] });
        return;
      }
      setSaved({ content, projectId });
      const missing = problems.filter((problem) => problem.severity === 'missing');
      if (missing.length === 0) setMessage({ tone: 'success', text: t.saveDone });
      else {
        const fields = [...new Set(missing.map((problem) => t.fields[problem.field].toLowerCase()))].join(', ');
        setMessage({ tone: 'warning', text: t.saveDoneMissing(missing.length, fields) });
      }
    } catch {
      setMessage({ tone: 'danger', text: t.saveFailed });
    }
  };

  const copy = async () => {
    tapFeedback();
    setCopied((await copyText(markdown)) ? 'done' : 'failed');
  };

  return (
    <VisualFrame title={v.title} description={v.description} compact={compact} caption={compact ? undefined : t.intro}>
      <View style={styles.stack}>
        <SavedAdrs currentId={artifactId} onOpen={requestOpen} onDeleted={onDeleted} />

        <View style={styles.headRow}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary" accessibilityLiveRegion="polite">
            {`${saved ? t.editing : t.editingNew} · ${dirty ? t.unsaved : t.saved}`}
          </ThemedText>
          <Button
            size="small"
            variant="outline"
            icon="note_add"
            title={t.newRecord}
            onPress={() => {
              tapFeedback();
              if (dirty) setPending({ kind: 'new' });
              else startNew();
            }}
          />
        </View>

        {pending ? (
          <Notice tone="warning">
            <ThemedText type="secondary">{t.discardAsk}</ThemedText>
            <View style={styles.buttons}>
              <Button size="small" variant="danger" title={t.discardYes} onPress={() => (pending.kind === 'new' ? startNew() : openRecord(pending.artifact))} />
              <Button size="small" variant="outline" title={t.discardKeep} onPress={() => setPending(null)} />
            </View>
          </Notice>
        ) : null}

        <AdrFields draft={draft} onChange={edit} />

        <ChipSelect
          wrap
          label={t.projectLabel}
          value={projectId ?? 'none'}
          onChange={(value) => {
            setProjectId(isArchitectureProjectId(value) ? value : null);
            setMessage(null);
          }}
          options={[{ value: 'none', label: t.projectNone }, ...ARCHITECTURE_PROJECT_IDS.map((id) => ({ value: id, label: t.project[id] ?? id }))]}
        />

        <AdrChecklist problems={problems} />

        <Disclosure title={t.previewTitle} showLabel={`Show: ${t.previewTitle}`} hideLabel={`Hide: ${t.previewTitle}`} defaultOpen>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.previewNote}
          </ThemedText>
          <Panel>
            <ThemedText type="code" selectable>
              {markdown}
            </ThemedText>
          </Panel>
        </Disclosure>

        {message ? <Notice tone={message.tone} message={message.text} /> : null}
        {copied === 'failed' ? <Notice tone="warning" message={t.copyFailed} /> : null}

        <View style={styles.buttons}>
          <Button style={styles.primary} title={save.isPending ? t.saving : blank ? t.saveBlank : t.save} icon="save" disabled={blank} loading={save.isPending} onPress={() => void saveRecord()} />
          <Button size="small" variant="secondary" icon={copied === 'done' ? 'check' : 'content_copy'} title={copied === 'done' ? t.copied : t.copy} disabled={blank} onPress={() => void copy()} />
        </View>

        <View style={styles.tali}>
          <Button
            variant="outline"
            icon="forum"
            title={t.askTali}
            disabled={blank}
            onPress={() => {
              tapFeedback();
              router.push({ pathname: '/tali', params: { prompt: adrChallengePrompt(draft), focus: 'architecture' } });
            }}
          />
          <ThemedText type="caption" themeColor="textSecondary">
            {t.askTaliNote}
          </ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  headRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  primary: { flexGrow: 1, minWidth: 140 },
  tali: { gap: Spacing.two },
});
