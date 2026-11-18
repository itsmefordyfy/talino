import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { architectureStrings } from '../strings';
import type { Artifact } from '../types';

export type ProjectArtifactsNoteProps = { artifacts: readonly Artifact[] };

/** On an architecture project: how many diagrams, decision records and matrices the learner has attached, and that the review reads them. */
export function ProjectArtifactsNote({ artifacts }: ProjectArtifactsNoteProps) {
  const t = useLocalized(architectureStrings);
  const counts = {
    diagrams: artifacts.filter((artifact) => artifact.kind === 'diagram').length,
    records: artifacts.filter((artifact) => artifact.kind === 'adr').length,
    matrices: artifacts.filter((artifact) => artifact.kind === 'matrix').length,
  };
  return (
    <Card>
      <View style={styles.line}>
        <Icon name="account_tree" size={20} color="secondaryText" />
        <View style={styles.flex}>
          <ThemedText type="secondarySemiBold">{t.noteTitle}</ThemedText>
          <ThemedText type="body">{artifacts.length === 0 ? t.noteNone : t.noteSome(counts)}</ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  flex: { flex: 1, gap: Spacing.one },
});
