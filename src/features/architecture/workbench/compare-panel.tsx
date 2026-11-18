import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect, type ChipOption } from '@/components/ui/chip-select';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useArtifacts } from '@/features/architecture';
import { DiagramFromMermaid, parseMermaidSubset } from '@/features/visuals/diagrams';
import { useLocalized } from '@/hooks/use-strings';

import { diffSources, type DiagramDiff } from '../lib/diagram-diff';
import { architectureToolStrings } from './strings';

const CURRENT = 'current';

export type ComparePanelProps = {
  /** What is in the editor right now, offered as one of the versions. */
  currentSource: string;
};

type Version = { key: string; label: string; source: string };

/** Two versions, one after the other, and a plain summary of what changed between them. */
export function ComparePanel({ currentSource }: ComparePanelProps) {
  const text = useLocalized(architectureToolStrings);
  const t = text.workbench.compare;
  const query = useArtifacts('diagram');
  const [pickedA, setPickedA] = useState<string | null>(null);
  const [pickedB, setPickedB] = useState<string | null>(null);

  if (query.isPending) return <SkeletonBlock height={120} />;
  if (query.isError) {
    return (
      <View style={styles.root}>
        <Notice tone="danger" message={t.loadError} />
        <Button size="small" variant="secondary" icon="refresh" title={text.common.retry} onPress={() => void query.refetch()} />
      </View>
    );
  }

  const versions: Version[] = [{ key: CURRENT, label: t.current, source: currentSource }, ...query.data.map((artifact) => ({ key: artifact.id, label: artifact.title, source: artifact.content }))];
  const options: ChipOption<string>[] = versions.map((version) => ({ value: version.key, label: version.label }));
  const a = versions.find((version) => version.key === pickedA) ?? null;
  const b = versions.find((version) => version.key === pickedB) ?? null;

  return (
    <View style={styles.root}>
      <ThemedText type="body">{t.intro}</ThemedText>
      {query.data.length === 0 ? <Notice tone="info" message={t.noSaved} /> : null}
      <ChipSelect label={t.sideA} options={options} value={a?.key ?? null} onChange={setPickedA} />
      <ChipSelect label={t.sideB} options={options} value={b?.key ?? null} onChange={setPickedB} />
      {!a || !b ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.needTwo}
        </ThemedText>
      ) : a.source === b.source ? (
        <Notice tone="info" message={t.same} />
      ) : (
        <Compared a={a} b={b} />
      )}
    </View>
  );
}

function Compared({ a, b }: { a: Version; b: Version }) {
  const t = useLocalized(architectureToolStrings).workbench.compare;
  const diff = diffSources(a.source, b.source);
  return (
    <View style={styles.root}>
      <Side side="A" version={a} />
      <Side side="B" version={b} />
      {diff.ok ? <DiffSummary diff={diff.diff} /> : <Notice tone="warning" message={t.cantDraw(diff.side === 'a' ? 'A' : 'B')} />}
    </View>
  );
}

function Side({ side, version }: { side: 'A' | 'B'; version: Version }) {
  const t = useLocalized(architectureToolStrings).workbench.compare;
  const result = parseMermaidSubset(version.source);
  return (
    <View style={styles.side}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {t.drawingOf(side, version.label)}
      </ThemedText>
      {result.ok ? (
        <DiagramFromMermaid source={version.source} />
      ) : (
        <Notice tone="warning">
          <ThemedText type="secondary">{t.cantDraw(side)}</ThemedText>
          {result.errors.slice(0, 3).map((error) => (
            <ThemedText key={error} type="secondary" themeColor="textSecondary">
              {error}
            </ThemedText>
          ))}
        </Notice>
      )}
    </View>
  );
}

function DiffSummary({ diff }: { diff: DiagramDiff }) {
  const t = useLocalized(architectureToolStrings).workbench.compare;
  if (!diff.comparable) return <Notice tone="info" message={t.notComparable(diff.kindA, diff.kindB)} />;
  const groups: { title: string; items: string[] }[] = [
    { title: t.partsAdded, items: diff.nodes.added.map((node) => t.part(node.id, node.label)) },
    { title: t.partsRemoved, items: diff.nodes.removed.map((node) => t.part(node.id, node.label)) },
    { title: t.partsRenamed, items: diff.nodes.relabelled.map((node) => `${node.id}: ${t.renamed(node.before, node.after)}`) },
    { title: t.arrowsAdded, items: diff.arrows.added.map((arrow) => t.arrow(arrow.from, arrow.to, arrow.label)) },
    { title: t.arrowsRemoved, items: diff.arrows.removed.map((arrow) => t.arrow(arrow.from, arrow.to, arrow.label)) },
    { title: t.arrowsRenamed, items: diff.arrows.relabelled.map((arrow) => `${arrow.from} to ${arrow.to}: ${t.renamed(arrow.before, arrow.after)}`) },
  ].filter((group) => group.items.length > 0);
  const nodeChanges = diff.nodes.added.length + diff.nodes.removed.length + diff.nodes.relabelled.length;
  const arrowChanges = diff.arrows.added.length + diff.arrows.removed.length + diff.arrows.relabelled.length;
  return (
    <View style={styles.side} accessibilityLiveRegion="polite">
      <ThemedText type="cardTitle" accessibilityRole="header">
        {t.changedHeading}
      </ThemedText>
      {diff.identical ? (
        <ThemedText type="body">{t.identical}</ThemedText>
      ) : (
        <>
          <ThemedText type="body">{t.summary(nodeChanges, arrowChanges)}</ThemedText>
          {groups.map((group) => (
            <View key={group.title} style={styles.group}>
              <ThemedText type="secondarySemiBold">{`${group.title} (${group.items.length})`}</ThemedText>
              {group.items.map((item, index) => (
                <ThemedText key={`${item}-${index}`} type="secondary" themeColor="textSecondary" selectable>
                  {`• ${item}`}
                </ThemedText>
              ))}
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  side: { gap: Spacing.two },
  group: { gap: Spacing.half },
});
