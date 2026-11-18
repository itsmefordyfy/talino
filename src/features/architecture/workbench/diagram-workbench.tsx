import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Notice } from '@/components/ui/notice';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useArtifacts, type Artifact } from '@/features/architecture';
import { DiagramFromMermaid } from '@/features/visuals/diagrams';
import { MERMAID_MAX_CHARS } from '@/features/visuals/diagrams/mermaid';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { copyText } from '@/lib/clipboard';
import { tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';

import { defaultTemplate, DIAGRAM_TEMPLATES, findTemplate, type DiagramTemplateId } from '../lib/diagram-templates';
import { evaluateSource, normalizeTyping } from '../lib/diagram-source';
import { reviewDiagramPrompt } from '../lib/tali-prompts';
import { AskTaliButton } from './ask-tali-button';
import { ComparePanel } from './compare-panel';
import { SavePanel } from './save-panel';
import { SavedList } from './saved-list';
import { architectureToolStrings } from './strings';

/** How long the text must sit still before it is drawn, so the drawing does not flicker on every key. */
export const DRAW_PAUSE_MS = 350;
const COPIED_MS = 1600;

type Mode = 'edit' | 'compare';
type Confirm = { kind: 'reset' } | { kind: 'template'; id: DiagramTemplateId } | { kind: 'open'; artifact: Artifact } | { kind: 'new' };

/**
 * Write the course's Mermaid text, see it drawn after a short pause, keep the last good drawing while the text is wrong, copy it, save it on this phone and
 * compare two versions. The text is only parsed (never run) by the same engine the lessons use.
 */
export function DiagramWorkbench() {
  const text = useLocalized(architectureToolStrings);
  const t = text.workbench;
  const theme = useTheme();
  const saved = useArtifacts('diagram');

  const [mode, setMode] = useState<Mode>('edit');
  const [templateId, setTemplateId] = useState<DiagramTemplateId | null>(defaultTemplate().id);
  const [source, setSource] = useState(() => defaultTemplate().source);
  /** The text as last applied from a template, opened or saved: what "unsaved changes" is measured against. */
  const [baseline, setBaseline] = useState(() => defaultTemplate().source);
  const [view, setView] = useState(() => evaluateSource(defaultTemplate().source, null));
  const [draftId, setDraftId] = useState(() => newId());
  const [title, setTitle] = useState(t.defaultTitle);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');

  // Draw once the text has sat still; an immediate change (a template, an opened diagram) skips the wait.
  const viewSource = view.source;
  useEffect(() => {
    if (viewSource === source) return;
    const handle = setTimeout(() => setView((current) => evaluateSource(source, current.goodSource)), DRAW_PAUSE_MS);
    return () => clearTimeout(handle);
  }, [source, viewSource]);
  const drawing = viewSource !== source;

  const dirty = source !== baseline;
  const showNow = (next: string) => {
    setSource(next);
    setView((current) => evaluateSource(next, current.goodSource));
  };

  const applyTemplate = (id: DiagramTemplateId) => {
    const template = findTemplate(id);
    if (!template) return;
    setTemplateId(id);
    setBaseline(template.source);
    showNow(template.source);
    setConfirm(null);
  };
  const startNew = () => {
    setDraftId(newId());
    setTitle(t.defaultTitle);
    setProjectId(null);
    applyTemplate(defaultTemplate().id);
  };
  const openSaved = (artifact: Artifact) => {
    setDraftId(artifact.id);
    setTitle(artifact.title);
    setProjectId(artifact.projectId);
    setTemplateId(null);
    setBaseline(artifact.content);
    showNow(artifact.content);
    setConfirm(null);
    setMode('edit');
  };

  const askOrDo = (next: Confirm) => (dirty ? setConfirm(next) : run(next));
  const run = (next: Confirm) => {
    if (next.kind === 'reset') applyTemplate(templateId ?? defaultTemplate().id);
    else if (next.kind === 'template') applyTemplate(next.id);
    else if (next.kind === 'open') openSaved(next.artifact);
    else startNew();
  };

  const onCopy = async () => {
    tapFeedback();
    setCopy((await copyText(source)) ? 'copied' : 'failed');
  };
  // The confirmation fades after a moment; the timer goes with the screen so nothing fires after it closes.
  useEffect(() => {
    if (copy === 'idle') return;
    const handle = setTimeout(() => setCopy('idle'), COPIED_MS);
    return () => clearTimeout(handle);
  }, [copy]);

  const confirmMessage = !confirm
    ? null
    : confirm.kind === 'reset'
      ? t.resetAsk
      : confirm.kind === 'template'
        ? t.switchAsk(findTemplate(confirm.id)?.label ?? '')
        : t.leaveAsk;

  const alreadySaved = saved.data?.some((artifact) => artifact.id === draftId) ?? false;
  const errors = view.errors.slice(0, 5);

  return (
    <View style={styles.root}>
      <SegmentedControl
        accessibilityLabel={t.modesLabel}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'edit', label: t.modes.edit },
          { value: 'compare', label: t.modes.compare },
        ]}
      />

      {mode === 'compare' ? (
        <ComparePanel currentSource={source} />
      ) : (
        <>
          <ChipSelect
            label={t.templatesLabel}
            options={DIAGRAM_TEMPLATES.map((template) => ({ value: template.id, label: template.label }))}
            value={templateId}
            onChange={(id) => askOrDo({ kind: 'template', id })}
          />

          <View style={styles.field}>
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {t.sourceLabel}
            </ThemedText>
            <TextInput
              accessibilityLabel={t.sourceLabel}
              accessibilityHint={t.sourceHint}
              value={source}
              onChangeText={(next) => setSource(normalizeTyping(next))}
              placeholder={t.sourcePlaceholder}
              placeholderTextColor={theme.textTertiary}
              selectionColor={theme.primary}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textAlignVertical="top"
              scrollEnabled={false}
              style={[styles.source, { color: theme.text, backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}
            />
            <ThemedText type="caption" themeColor={source.length > MERMAID_MAX_CHARS ? 'danger' : 'textSecondary'}>
              {`${t.sourceHint} ${t.charCount(source.length, MERMAID_MAX_CHARS)}`}
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Button size="small" variant="secondary" icon={copy === 'copied' ? 'check' : 'content_copy'} title={copy === 'copied' ? t.copied : copy === 'failed' ? t.copyFailed : t.copy} disabled={source.trim() === ''} onPress={() => void onCopy()} />
            {templateId ? <Button size="small" variant="outline" icon="restart_alt" title={t.reset} onPress={() => askOrDo({ kind: 'reset' })} /> : null}
            <Button size="small" variant="outline" icon="add" title={t.newDiagram} onPress={() => askOrDo({ kind: 'new' })} />
          </View>

          {confirm && confirmMessage ? (
            <View style={styles.confirm} accessibilityLiveRegion="polite">
              <ThemedText type="secondary">{confirmMessage}</ThemedText>
              <View style={styles.actions}>
                <Button size="small" variant="danger" title={confirm.kind === 'reset' ? t.resetYes : confirm.kind === 'template' ? t.switchYes : t.leaveYes} onPress={() => run(confirm)} />
                <Button size="small" variant="outline" title={confirm.kind === 'reset' ? t.resetKeep : confirm.kind === 'template' ? t.switchKeep : t.leaveKeep} onPress={() => setConfirm(null)} />
              </View>
            </View>
          ) : null}

          <View style={styles.field}>
            <ThemedText type="cardTitle" accessibilityRole="header">
              {t.drawingHeading}
            </ThemedText>
            {errors.length > 0 && !drawing ? (
              <Notice tone="warning">
                <ThemedText type="bodySemiBold">{t.errorsHeading(view.errors.length)}</ThemedText>
                {errors.map((error) => (
                  <ThemedText key={error} type="secondary" selectable>
                    {error}
                  </ThemedText>
                ))}
                <ThemedText type="secondary" themeColor="textSecondary">
                  {view.goodSource ? t.lastGood : t.noGoodYet}
                </ThemedText>
              </Notice>
            ) : null}
            {view.goodSource ? (
              <DiagramFromMermaid source={view.goodSource} />
            ) : (
              <ThemedText type="secondary" themeColor="textSecondary">
                {drawing ? t.drawingWaiting : t.emptyDrawing}
              </ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <AskTaliButton title={text.common.askTali} prompt={reviewDiagramPrompt(source)} disabled={source.trim() === ''} />
            <ThemedText type="caption" themeColor="textSecondary">
              {t.taliHint}
            </ThemedText>
          </View>

          <SavePanel
            heading={t.saveHeading}
            kind="diagram"
            kindName={t.kindNames.diagram}
            id={draftId}
            content={source}
            title={title}
            onTitleChange={setTitle}
            projectId={projectId}
            onProjectChange={setProjectId}
            alreadySaved={alreadySaved}
            onSaved={() => setBaseline(source)}
          />

          <SavedList
            kind="diagram"
            heading={text.common.savedHeading}
            emptyText={t.savedEmpty}
            activeId={draftId}
            onOpen={(artifact) => askOrDo({ kind: 'open', artifact })}
            onDeleted={(id) => {
              if (id === draftId) startNew();
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  field: { gap: Spacing.two },
  source: {
    minHeight: 220,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: Fonts.mono,
    fontSize: 13,
    lineHeight: 20,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, alignItems: 'center' },
  confirm: { gap: Spacing.two },
});
