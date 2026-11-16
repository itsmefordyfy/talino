import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { DiagramView, PayloadBox, stableValue } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { createNotifier, getInstance, notifyObservers, OBSERVERS, patternSpec, PATTERN_IDS, SINGLETON_START, type ObserverId, type PatternId } from '../lib/patterns';
import { softwareStrings, type SoftwareStrings } from '../strings';

const FACTORY_KINDS = ['email', 'sms', 'push', 'fax'] as const;
type FactoryKind = (typeof FACTORY_KINDS)[number];

/** Three patterns, each with an accurate class diagram, a small working demo and a note on when not to use it. */
export function PatternsVisual({ compact }: VisualProps) {
  const s = useLocalized(softwareStrings).patterns;
  const theme = useTheme();
  const [pattern, setPattern] = useState<PatternId>('observer');
  const spec = stableValue(s, `spec-${pattern}`, () =>
    patternSpec(pattern, {
      observer: { title: s.diagramTitles.observer, summary: s.diagramSummaries.observer, notes: s.notes.observer },
      factory: { title: s.diagramTitles.factory, summary: s.diagramSummaries.factory, notes: s.notes.factory },
      singleton: { title: s.diagramTitles.singleton, summary: s.diagramSummaries.singleton, notes: s.notes.singleton },
    }),
  );

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={s.idea[pattern]}
      controls={<ChipSelect label={s.patternLabel} wrap value={pattern} onChange={setPattern} options={PATTERN_IDS.map((id) => ({ value: id, label: s.names[id] }))} />}>
      <View style={styles.stack}>
        <DiagramView spec={spec} />
        {pattern === 'observer' ? <ObserverDemo words={s.demos.observer} /> : pattern === 'factory' ? <FactoryDemo words={s.demos.factory} /> : <SingletonDemo words={s.demos.singleton} />}
        <View style={[styles.note, { backgroundColor: theme.statusOkSoft }]}>
          <ThemedText type="secondarySemiBold" themeColor="statusOk">
            {s.useTitle}
          </ThemedText>
          <ThemedText type="secondary">{s.use[pattern]}</ThemedText>
        </View>
        <View style={[styles.note, { backgroundColor: theme.statusWarnSoft }]}>
          <ThemedText type="secondarySemiBold" themeColor="statusWarn">
            {s.avoidTitle}
          </ThemedText>
          <ThemedText type="secondary">{s.avoid[pattern]}</ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

function ObserverDemo({ words }: { words: SoftwareStrings['patterns']['demos']['observer'] }) {
  const [subscribed, setSubscribed] = useState<ObserverId[]>(['email']);
  const [log, setLog] = useState<string[]>([]);
  const [events, setEvents] = useState(0);
  const publish = () => {
    tapFeedback();
    const told = notifyObservers(subscribed).map((id) => words.observers[id]);
    const n = events + 1;
    setEvents(n);
    setLog((previous) => [...previous.slice(-3), told.length > 0 ? words.told(told.join(', '), n) : words.none(n)]);
  };
  return (
    <View style={styles.stack}>
      <ThemedText type="secondary" themeColor="textSecondary">
        {words.intro}
      </ThemedText>
      <ChipSelect multiple wrap value={subscribed} onChange={setSubscribed} options={OBSERVERS.map((id) => ({ value: id, label: words.observers[id] }))} />
      <Button title={words.publish} icon="campaign" size="small" onPress={publish} />
      <PayloadBox title={words.log} lines={log.length > 0 ? log : ['—']} tone="info" />
    </View>
  );
}

function FactoryDemo({ words }: { words: SoftwareStrings['patterns']['demos']['factory'] }) {
  const [kind, setKind] = useState<FactoryKind>('email');
  const [result, setResult] = useState<string | null>(null);
  const ask = () => {
    tapFeedback();
    const notifier = createNotifier(kind);
    setResult(notifier ? words.result(notifier.type, notifier.send('Hi')) : words.unknown);
  };
  return (
    <View style={styles.stack}>
      <ThemedText type="secondary" themeColor="textSecondary">
        {words.intro}
      </ThemedText>
      <ChipSelect wrap value={kind} onChange={setKind} options={FACTORY_KINDS.map((value) => ({ value, label: words.kinds[value] }))} />
      <Button title={words.create(kind)} icon="build" size="small" onPress={ask} />
      <PayloadBox title="NotifierFactory" lines={[result ?? '—']} tone={result === words.unknown ? 'warn' : 'info'} />
    </View>
  );
}

function SingletonDemo({ words }: { words: SoftwareStrings['patterns']['demos']['singleton'] }) {
  const [state, setState] = useState(SINGLETON_START);
  const [line, setLine] = useState<string>(words.none);
  const call = () => {
    tapFeedback();
    const result = getInstance(state);
    setState(result.state);
    setLine(result.wasCreated ? words.created(result.instance) : words.same(result.instance, result.state.calls));
  };
  const restart = () => {
    setState(SINGLETON_START);
    setLine(words.none);
  };
  return (
    <View style={styles.stack}>
      <ThemedText type="secondary" themeColor="textSecondary">
        {words.intro}
      </ThemedText>
      <View style={styles.row}>
        <Button title={words.call} icon="play_arrow" size="small" onPress={call} />
        <Button title={words.reset} icon="refresh" size="small" variant="ghost" onPress={restart} />
      </View>
      <PayloadBox title="Config" lines={[line, words.blocked]} tone="info" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  note: { gap: Spacing.one, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous' },
});
