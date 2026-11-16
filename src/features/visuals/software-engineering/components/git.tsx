import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { PayloadBox } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { applyGit, commitById, currentBranch, headCommitId, initialGit, type GitCommand, type GitState } from '../lib/git';
import { outcomeText } from '../lib/git-text';
import { softwareStrings } from '../strings';
import { GitGraphView } from './git-graph';

const HISTORY = 6;

/** A mini Git the learner drives: each button is a real command on a pure model, and the graph is drawn from the result. */
export function GitVisual({ compact }: VisualProps) {
  const s = useLocalized(softwareStrings).git;
  const [git, setGit] = useState<GitState>(() => initialGit());
  const [history, setHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [name, setName] = useState<string>(s.names[0]);
  const [other, setOther] = useState<string | null>(null);

  const branch = currentBranch(git);
  const free = s.names.filter((candidate) => !git.branches.some((existing) => existing.name === candidate));
  const chosenName = free.includes(name) ? name : (free[0] ?? '');
  const candidates = git.branches.filter((item) => item.name !== branch).map((item) => item.name);
  const chosenOther = other !== null && candidates.includes(other) ? other : (candidates[0] ?? null);
  const parentId = commitById(git, headCommitId(git))?.parents[0];

  const run = (command: GitCommand) => {
    tapFeedback();
    const outcome = applyGit(git, command);
    if (outcome.ok) {
      setGit(outcome.state);
      if (outcome.kind !== 'up-to-date') setHistory((previous) => [...previous.slice(-(HISTORY - 1)), `$ ${outcome.command}`]);
    }
    setMessage({ text: outcomeText(outcome, s), error: !outcome.ok });
  };
  const reset = () => {
    setGit(initialGit());
    setHistory([]);
    setMessage(null);
    setOther(null);
  };

  const where = git.head.kind === 'branch' ? git.head.name : `commit ${git.head.id}`;
  const caption = message && !message.error ? message.text : s.headAt(where);

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.stack}>
          <View style={styles.row}>
            <Button title={s.commit} icon="add" size="small" onPress={() => run({ type: 'commit' })} />
            <Button title={s.detach} icon="link_off" size="small" variant="secondary" disabled={parentId === undefined} onPress={() => parentId && run({ type: 'checkout', target: parentId })} />
            <Button title={s.reset} icon="refresh" size="small" variant="ghost" onPress={reset} />
          </View>
          {free.length > 0 && (
            <View style={styles.stack}>
              <ChipSelect label={s.branchName} wrap value={chosenName} onChange={setName} options={free.map((value) => ({ value, label: value }))} />
              <View style={styles.row}>
                <Button title={`${s.newBranch}: ${chosenName}`} icon="call_split" size="small" variant="secondary" disabled={chosenName === ''} onPress={() => run({ type: 'branch', name: chosenName })} />
              </View>
            </View>
          )}
          <ChipSelect label={s.switchTo} wrap value={branch} onChange={(value) => run({ type: 'checkout', target: value })} options={git.branches.map((item) => ({ value: item.name, label: item.name }))} />
          {chosenOther !== null ? (
            <View style={styles.stack}>
              <ChipSelect label={s.withBranch} wrap value={chosenOther} onChange={setOther} options={candidates.map((value) => ({ value, label: value }))} />
              <View style={styles.row}>
                <Button title={s.merge} icon="merge" size="small" variant="secondary" onPress={() => run({ type: 'merge', branch: chosenOther })} />
                <Button title={s.rebase} icon="vertical_align_top" size="small" variant="secondary" onPress={() => run({ type: 'rebase', onto: chosenOther })} />
              </View>
            </View>
          ) : (
            <ThemedText type="caption" themeColor="textSecondary">
              {s.noOtherBranch}
            </ThemedText>
          )}
          {message?.error ? <Notice tone="warning" message={message.text} /> : null}
        </View>
      }>
      <View style={styles.stack}>
        <GitGraphView state={git} label={`${s.graphLabel(git.commits.length, git.branches.map((item) => item.name).join(', '))} ${s.headAt(where)}.`} />
        <PayloadBox title={s.commandsTitle} lines={history.length > 0 ? history : [s.commandsEmpty]} tone="info" />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.simplified}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
