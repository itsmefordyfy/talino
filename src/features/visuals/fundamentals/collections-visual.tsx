import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { applyArrayOp, applyObjectOp, MAX_ITEMS, type ArrayOp, type ObjectOp, type Property } from './collections';
import { NumberAdjust, Tag } from './parts';
import { fundamentalsStrings } from './strings';

const START_ITEMS = ['"apple"', '"pear"', '"plum"'];
const START_PROPS: Property[] = [{ key: 'name', value: '"Ana"' }, { key: 'age', value: '25' }];

type Mode = 'array' | 'object';

export function CollectionsVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).collections;
  const theme = useTheme();
  const tones = useTones();
  const [mode, setMode] = useState<Mode>('array');
  const [items, setItems] = useState(START_ITEMS);
  const [properties, setProperties] = useState(START_PROPS);
  const [marked, setMarked] = useState<readonly number[]>([]);
  const [markedKey, setMarkedKey] = useState<string | null>(null);
  const [value, setValue] = useState('fig');
  const [key, setKey] = useState('city');
  const [index, setIndex] = useState(1);
  const [second, setSecond] = useState(0);
  const [caption, setCaption] = useState(t.intro);
  const [failed, setFailed] = useState(false);

  const runArray = (op: ArrayOp) => {
    const outcome = applyArrayOp(items, op, t);
    setItems(outcome.items);
    setMarked(outcome.marked);
    setCaption(outcome.caption);
    setFailed(!outcome.ok);
  };
  const runObject = (op: ObjectOp) => {
    const outcome = applyObjectOp(properties, op, t);
    setProperties(outcome.properties);
    setMarkedKey(outcome.marked);
    setCaption(outcome.caption);
    setFailed(!outcome.ok);
  };
  const switchMode = (next: Mode) => {
    setMode(next);
    setCaption(next === 'array' ? t.intro : t.introObject);
    setFailed(false);
  };
  const reset = () => {
    setItems(START_ITEMS);
    setProperties(START_PROPS);
    setMarked([]);
    setMarkedKey(null);
    setCaption(mode === 'array' ? t.intro : t.introObject);
    setFailed(false);
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          <SegmentedControl accessibilityLabel={t.modeLabel} value={mode} onChange={switchMode} options={[{ value: 'array', label: t.modes.array }, { value: 'object', label: t.modes.object }]} />
          {mode === 'array' ? (
            <>
              <TextField label={t.valueLabel} value={value} onChangeText={setValue} autoCapitalize="none" autoCorrect={false} />
              <View style={styles.adjusts}>
                <NumberAdjust label={t.indexLabel} value={index} min={0} max={MAX_ITEMS} onChange={setIndex} />
                <NumberAdjust label={t.secondIndexLabel} value={second} min={0} max={MAX_ITEMS} onChange={setSecond} />
              </View>
              <View style={styles.buttons}>
                <Button size="small" title={t.buttons.push} icon="add" onPress={() => runArray({ kind: 'push', value })} />
                <Button size="small" variant="secondary" title={t.buttons.insert} onPress={() => runArray({ kind: 'insert', index, value })} />
                <Button size="small" variant="secondary" title={t.buttons.removeAt} onPress={() => runArray({ kind: 'removeAt', index })} />
                <Button size="small" variant="secondary" title={t.buttons.pop} onPress={() => runArray({ kind: 'pop' })} />
                <Button size="small" variant="secondary" title={t.buttons.swap} icon="swap_horiz" onPress={() => runArray({ kind: 'swap', i: index, j: second })} />
                <Button size="small" variant="secondary" title={t.buttons.reverse} onPress={() => runArray({ kind: 'reverse' })} />
                <Button size="small" variant="outline" title={t.buttons.read} onPress={() => runArray({ kind: 'read', index })} />
                <Button size="small" variant="ghost" title={t.buttons.reset} icon="refresh" onPress={reset} />
              </View>
            </>
          ) : (
            <>
              <TextField label={t.keyLabel} value={key} onChangeText={setKey} autoCapitalize="none" autoCorrect={false} />
              <TextField label={t.valueLabel} value={value} onChangeText={setValue} autoCapitalize="none" autoCorrect={false} />
              <View style={styles.buttons}>
                <Button size="small" title={t.buttons.set} icon="add" onPress={() => runObject({ kind: 'set', key, value })} />
                <Button size="small" variant="secondary" title={t.buttons.delete} onPress={() => runObject({ kind: 'delete', key })} />
                <Button size="small" variant="outline" title={t.buttons.readKey} onPress={() => runObject({ kind: 'read', key })} />
                <Button size="small" variant="ghost" title={t.buttons.reset} icon="refresh" onPress={reset} />
              </View>
            </>
          )}
        </View>
      }>
      {mode === 'array' ? (
        <View style={styles.stage}>
          <ThemedText type="codeInline" themeColor={failed ? 'danger' : 'textSecondary'} tabular>
            {t.length(items.length)}
          </ThemedText>
          {items.length === 0 ? (
            <ThemedText type="secondary" themeColor="textSecondary">{t.emptyArrayHint}</ThemedText>
          ) : (
            <View style={styles.cells}>
              {items.map((item, position) => {
                const on = marked.includes(position);
                return (
                  <View key={`${position}-${item}`} accessible accessibilityLabel={`${t.indexWord} ${position}: ${item}`} style={styles.cellWrap}>
                    <View style={[styles.cell, { backgroundColor: on ? tones.violet.soft : theme.backgroundElement, borderColor: on ? tones.violet.ink : theme.border }, on && styles.cellOn]}>
                      <ThemedText type="codeInline" numberOfLines={1}>{item}</ThemedText>
                    </View>
                    <ThemedText type="caption" themeColor={on ? 'primary' : 'textSecondary'} tabular>{position}</ThemedText>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.stage}>
          <ThemedText type="codeInline" themeColor="textSecondary">{'person = {'}</ThemedText>
          {properties.length === 0 ? <ThemedText type="secondary" themeColor="textSecondary">{t.emptyObjectHint}</ThemedText> : null}
          {properties.map((property) => (
            <View key={property.key} accessible accessibilityLabel={`${property.key}: ${property.value}`} style={styles.prop}>
              <Tag text={property.key} mono tone={markedKey === property.key ? 'violet' : 'indigo'} outlined={markedKey === property.key} />
              <ThemedText type="codeInline">:</ThemedText>
              <Tag text={property.value} mono tone="mint" outlined={markedKey === property.key} />
            </View>
          ))}
          <ThemedText type="codeInline" themeColor="textSecondary">{'}'}</ThemedText>
        </View>
      )}
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  cellWrap: { alignItems: 'center', gap: 2 },
  cell: { minWidth: 54, maxWidth: 110, alignItems: 'center', paddingHorizontal: Spacing.two, paddingVertical: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  cellOn: { borderWidth: 2 },
  prop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingLeft: Spacing.three },
});
