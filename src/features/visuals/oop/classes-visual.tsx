import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import { Arrow } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { ClassBox } from './class-box';
import { callMethod, CLASS_SPECS, constructorCall, createInstance, type ObjectInstance } from './classes';
import { oopStrings } from './strings';

export function ClassesVisual({ compact }: VisualProps) {
  const t = useLocalized(oopStrings).classes;
  const theme = useTheme();
  const tones = useTones();
  const [specIndex, setSpecIndex] = useState(0);
  const spec = CLASS_SPECS[specIndex] ?? CLASS_SPECS[0]!;
  const [raw, setRaw] = useState<Record<string, string>>(() => Object.fromEntries(spec.fields.map((field) => [field.name, field.initial])));
  const [instances, setInstances] = useState<ObjectInstance[]>([]);
  const [caption, setCaption] = useState(t.intro);
  const [errorField, setErrorField] = useState<string | null>(null);

  const choose = (id: string) => {
    const index = CLASS_SPECS.findIndex((entry) => entry.id === id);
    const next = CLASS_SPECS[index];
    if (!next) return;
    setSpecIndex(index);
    setRaw(Object.fromEntries(next.fields.map((field) => [field.name, field.initial])));
    setInstances([]);
    setCaption(t.intro);
    setErrorField(null);
  };

  const create = () => {
    const result = createInstance(spec, raw, instances);
    if (!result.ok) {
      setErrorField(result.field || null);
      setCaption(result.reason === 'full' ? t.badField.full(4) : t.badField[result.reason](result.field));
      return;
    }
    setErrorField(null);
    setInstances([...instances, result.instance]);
    setCaption(t.created(constructorCall(spec, result.instance.values), result.instance.id, spec.name));
  };

  const call = (id: string, method: string) => {
    const outcome = callMethod(spec, instances, id, method, t);
    const changed = outcome.instances.some((instance, index) => instance !== instances[index]);
    setInstances(outcome.instances);
    setCaption(t.called(id, method, outcome.result, changed));
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.classLabel} value={spec.id} onChange={choose} options={CLASS_SPECS.map((entry) => ({ value: entry.id, label: t.classNames[entry.id] }))} />
          {spec.fields.map((field) => (
            <TextField key={`${spec.id}-${field.name}`} label={t.fieldLabel(field.name)} value={raw[field.name] ?? ''} autoCapitalize="none" autoCorrect={false} keyboardType={field.kind === 'number' ? 'numbers-and-punctuation' : 'default'} onChangeText={(text) => setRaw({ ...raw, [field.name]: text })} error={errorField === field.name ? caption : null} />
          ))}
          <View style={styles.buttons}>
            <Button title={t.create} icon="add" onPress={create} />
            <Button title={t.reset} variant="ghost" disabled={instances.length === 0} onPress={() => { setInstances([]); setCaption(t.intro); }} />
          </View>
        </View>
      }>
      <View style={styles.stage}>
        <ThemedText type="caption" themeColor="textSecondary">{t.blueprintLabel}</ThemedText>
        <ClassBox name={spec.name} fields={spec.fields.map((field) => ({ text: `${field.name}: ${field.kind === 'text' ? 'string' : 'number'}` }))} methods={spec.methods.map((method) => ({ text: method.name }))} />
        {spec.id === 'car' ? (
          <>
            <Arrow label={t.has} />
            <ClassBox name="Engine" tone="violet" fields={[{ text: 'horsepower: number' }]} methods={[{ text: 'start()' }]} />
            <ThemedText type="caption" themeColor="textSecondary">{t.engineNote}</ThemedText>
          </>
        ) : null}
        <Arrow direction="down" label={t.instanceOf} />
        <ThemedText type="caption" themeColor="textSecondary">{t.objectsLabel}</ThemedText>
        {instances.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">{t.noObjects}</ThemedText>
        ) : (
          <View style={styles.objects}>
            {instances.map((instance) => (
              <View key={instance.id} style={[styles.object, { backgroundColor: theme.backgroundElement, borderColor: tones.mint.ink }]}>
                <ThemedText type="secondarySemiBold" style={{ color: tones.mint.ink }}>{`${instance.id} : ${spec.name}`}</ThemedText>
                {spec.fields.map((field) => (
                  <ThemedText key={field.name} type="code" accessibilityLabel={t.fieldValueLabel(instance.id, field.name, String(instance.values[field.name]))}>{`${field.name} = ${field.kind === 'text' ? `"${instance.values[field.name]}"` : instance.values[field.name]}`}</ThemedText>
                ))}
                <View style={styles.methodButtons}>
                  {spec.methods.map((method) => (
                    <Button key={method.name} size="small" variant="secondary" title={method.name} accessibilityLabel={t.callMethodLabel(method.name, instance.id)} onPress={() => call(instance.id, method.name)} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two, alignItems: 'stretch' },
  objects: { gap: Spacing.two },
  object: { gap: 2, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  methodButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, paddingTop: Spacing.one },
});
