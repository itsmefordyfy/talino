import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { IconButton } from '@/components/ui/icon-button';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Arrow, CodeListing, NumberAdjust, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { ClassBox } from './class-box';
import { buildPolymorphismSteps, defaultItems, FAMILIES, MAX_ITEMS, type Family, type Item } from './polymorphism';
import { oopStrings } from './strings';

export function PolymorphismVisual({ compact }: VisualProps) {
  const t = useLocalized(oopStrings).polymorphism;
  const theme = useTheme();
  const tones = useTones();
  const [family, setFamily] = useState<Family>(FAMILIES[0]!);
  const [items, setItems] = useState<Item[]>(() => defaultItems(FAMILIES[0]!));
  const [kindId, setKindId] = useState(FAMILIES[0]!.kinds[0]!.id);
  const kind = family.kinds.find((entry) => entry.id === kindId) ?? family.kinds[0]!;
  const [params, setParams] = useState<number[]>(kind.params.map((param) => param.initial));
  const [nextKey, setNextKey] = useState(10);

  const steps = buildPolymorphismSteps(family, items, t);
  const stepper = useStepper(steps, { intervalMs: 1200 });
  const step = stepper.step;

  const chooseFamily = (id: string) => {
    const next = FAMILIES.find((entry) => entry.id === id);
    if (!next) return;
    setFamily(next);
    setItems(defaultItems(next));
    setKindId(next.kinds[0]!.id);
    setParams(next.kinds[0]!.params.map((param) => param.initial));
  };
  const chooseKind = (id: string) => {
    const next = family.kinds.find((entry) => entry.id === id);
    if (!next) return;
    setKindId(id);
    setParams(next.params.map((param) => param.initial));
  };
  const add = () => {
    if (items.length >= MAX_ITEMS) return;
    setItems([...items, { key: nextKey, kind: kind.id, params }]);
    setNextKey(nextKey + 1);
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.familyLabel} value={family.id} onChange={chooseFamily} options={FAMILIES.map((entry) => ({ value: entry.id, label: t.familyNames[entry.id] }))} />
          <ChipSelect label={t.addLabel} wrap value={kind.id} onChange={chooseKind} options={family.kinds.map((entry) => ({ value: entry.id, label: entry.id }))} />
          {kind.params.length > 0 ? (
            <View style={styles.adjusts}>
              {kind.params.map((param, index) => (
                <NumberAdjust key={param.name} label={t.paramLabel(param.name)} value={params[index] ?? param.initial} min={param.min} max={param.max} onChange={(value) => setParams(params.map((current, position) => (position === index ? value : current)))} />
              ))}
            </View>
          ) : null}
          <Button title={items.length >= MAX_ITEMS ? t.full(MAX_ITEMS) : t.add} icon="add" size="small" disabled={items.length >= MAX_ITEMS} onPress={add} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <ClassBox name={family.base} stereotype={t.baseStereotype} methods={[{ text: family.method }]} dashed />
        <View style={styles.kids}>
          {family.kinds.map((entry) => (
            <View key={entry.id} style={styles.kid}>
              <Arrow direction="up" label={t.extends} />
              <ClassBox name={entry.id} tone="violet" methods={[{ text: family.method, tag: t.overridesTag, highlight: step.index !== null && items[step.index]?.kind === entry.id }]} provider={step.index !== null && items[step.index]?.kind === entry.id} />
            </View>
          ))}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.baseNote}</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">{t.codeLabel}</ThemedText>
        <View style={[styles.code, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <CodeListing lines={t.loopCode(family.method).split('\n')} active={step.index === null ? [] : [2]} />
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.listLabel}</ThemedText>
        <View style={styles.items}>
          {items.map((item, index) => {
            const on = step.index === index;
            const result = step.results[index];
            return (
              <View key={item.key} style={[styles.item, { backgroundColor: on ? tones.mint.soft : theme.backgroundElement, borderColor: on ? tones.mint.ink : theme.border }, on && styles.itemOn]}>
                <View style={styles.itemText}>
                  <ThemedText type="secondarySemiBold">{`${index + 1}. ${item.kind}${item.params.length > 0 ? ` (${item.params.join(', ')})` : ''}`}</ThemedText>
                  {result ? <Tag text={`${family.method} → ${result.result}`} mono tone="mint" outlined={on} /> : null}
                </View>
                <IconButton icon="close" accessibilityLabel={t.remove(index + 1, item.kind)} onPress={() => setItems(items.filter((entry) => entry.key !== item.key))} />
              </View>
            );
          })}
        </View>
        {step.total !== null && step.results.length > 0 ? <Tag text={`${t.totalLabel}: ${step.total}`} mono tone="indigo" outlined /> : null}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  stage: { gap: Spacing.two },
  kids: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, alignItems: 'flex-start' },
  kid: { flexGrow: 1, flexBasis: 90, alignItems: 'stretch' },
  code: { padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  items: { gap: Spacing.one },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, paddingLeft: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  itemOn: { borderWidth: 2.5 },
  itemText: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
});
