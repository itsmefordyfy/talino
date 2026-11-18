import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useArtifacts, type Artifact } from '@/features/architecture';
import { useLocalized } from '@/hooks/use-strings';
import { newId } from '@/lib/id';

import { reviewMatrixPrompt } from '../lib/tali-prompts';
import { parseMatrixState, scoreMatrix, serializeMatrix, type MatrixState } from '../lib/tradeoff';
import { findPreset, TRADEOFF_PRESETS, type TradeoffPresetId } from '../lib/tradeoff-presets';
import { AskTaliButton } from './ask-tali-button';
import { MatrixEditor } from './matrix-editor';
import { MatrixResultView } from './matrix-result';
import { SavePanel } from './save-panel';
import { SavedList } from './saved-list';
import { architectureToolStrings } from './strings';

const START_PRESET: TradeoffPresetId = 'style';
const startMatrix = (id: TradeoffPresetId = START_PRESET) => (findPreset(id) as NonNullable<ReturnType<typeof findPreset>>).build();

type Confirm = { kind: 'preset'; id: TradeoffPresetId } | { kind: 'open'; artifact: Artifact } | { kind: 'new' };

/**
 * Weigh two to four options against three to eight qualities. The result updates as the learner edits, names a leader only when the gap is half a point or more,
 * and says plainly that the matrix organises their judgment rather than deciding. Matrices are kept on this phone.
 */
export function TradeoffMatrix() {
  const text = useLocalized(architectureToolStrings);
  const t = text.matrix;
  const saved = useArtifacts('matrix');

  const [state, setState] = useState<MatrixState>(() => startMatrix());
  const [presetId, setPresetId] = useState<TradeoffPresetId | null>(START_PRESET);
  /** The matrix as last applied from a preset, opened or saved: what "unsaved changes" is measured against. */
  const [baseline, setBaseline] = useState(() => serializeMatrix(startMatrix()));
  const [draftId, setDraftId] = useState(() => newId());
  const [title, setTitle] = useState(t.defaultTitle);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [unreadable, setUnreadable] = useState(false);

  const content = serializeMatrix(state);
  const dirty = content !== baseline;
  const result = scoreMatrix(state);

  const load = (next: MatrixState) => {
    setState(next);
    setBaseline(serializeMatrix(next));
    setConfirm(null);
    setUnreadable(false);
  };
  const applyPreset = (id: TradeoffPresetId) => {
    setPresetId(id);
    load(startMatrix(id));
  };
  const startNew = () => {
    setDraftId(newId());
    setTitle(t.defaultTitle);
    setProjectId(null);
    applyPreset(START_PRESET);
  };
  const openSaved = (artifact: Artifact) => {
    const parsed = parseMatrixState(artifact.content);
    setConfirm(null);
    if (!parsed) {
      setUnreadable(true);
      return;
    }
    setDraftId(artifact.id);
    setTitle(artifact.title);
    setProjectId(artifact.projectId);
    setPresetId(null);
    load(parsed);
  };

  const run = (next: Confirm) => {
    if (next.kind === 'preset') applyPreset(next.id);
    else if (next.kind === 'open') openSaved(next.artifact);
    else startNew();
  };
  const askOrDo = (next: Confirm) => (dirty ? setConfirm(next) : run(next));

  const alreadySaved = saved.data?.some((artifact) => artifact.id === draftId) ?? false;

  return (
    <View style={styles.root}>
      <ChipSelect label={t.presetsLabel} options={TRADEOFF_PRESETS.map((preset) => ({ value: preset.id, label: preset.label }))} value={presetId} onChange={(id) => askOrDo({ kind: 'preset', id })} />

      {confirm ? (
        <View style={styles.confirm} accessibilityLiveRegion="polite">
          <ThemedText type="secondary">{t.leaveAsk}</ThemedText>
          <View style={styles.actions}>
            <Button size="small" variant="danger" title={t.leaveYes} onPress={() => run(confirm)} />
            <Button size="small" variant="outline" title={t.leaveKeep} onPress={() => setConfirm(null)} />
          </View>
        </View>
      ) : null}
      {unreadable ? <Notice tone="warning" message={t.unreadable} /> : null}

      <MatrixEditor state={state} onChange={setState} />

      <MatrixResultView state={state} result={result} />

      <View style={styles.actions}>
        <Button size="small" variant="outline" icon="add" title={t.newMatrix} onPress={() => askOrDo({ kind: 'new' })} />
      </View>

      <View style={styles.field}>
        <AskTaliButton title={text.common.askTali} prompt={reviewMatrixPrompt(state)} />
        <ThemedText type="caption" themeColor="textSecondary">
          {t.taliHint}
        </ThemedText>
      </View>

      <SavePanel
        heading={t.saveHeading}
        kind="matrix"
        kindName={text.workbench.kindNames.matrix}
        id={draftId}
        content={content}
        title={title}
        onTitleChange={setTitle}
        projectId={projectId}
        onProjectChange={setProjectId}
        alreadySaved={alreadySaved}
        onSaved={() => setBaseline(content)}
      />

      <SavedList
        kind="matrix"
        heading={text.common.savedHeading}
        emptyText={t.savedEmpty}
        activeId={draftId}
        onOpen={(artifact) => askOrDo({ kind: 'open', artifact })}
        onDeleted={(id) => {
          if (id === draftId) startNew();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.four },
  field: { gap: Spacing.two },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, alignItems: 'center' },
  confirm: { gap: Spacing.two },
});
