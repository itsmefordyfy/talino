import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { BrandGradient, HeroInk, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { KIT_KINDS, templatesOfKind, type KitKind, type KitTemplate } from '../content';
import { kitStrings } from '../strings';
import { KitPreview } from '../components/kit-preview';

type Filter = KitKind | 'all';

/** The career kit: templates for the documents a tech career needs, as Word and PowerPoint files to download, each in a few looks. */
export function CareerKitScreen() {
  const strings = useLocalized(kitStrings);
  const [filter, setFilter] = useState<Filter>('all');
  const shown = templatesOfKind(filter);
  const options = [{ value: 'all' as const, label: strings.kinds.all }, ...KIT_KINDS.map((kind) => ({ value: kind, label: strings.kinds[kind] }))];
  return (
    <Screen>
      <View style={styles.hero}>
        <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.heroText}>
          <ThemedText type="caption" style={[styles.eyebrow, { color: HeroInk.muted }]}>
            {strings.eyebrow}
          </ThemedText>
          <ThemedText type="title" style={{ color: HeroInk.text }} accessibilityRole="header">
            {strings.kitTitle}
          </ThemedText>
          <ThemedText type="body" style={{ color: HeroInk.muted }}>
            {strings.intro}
          </ThemedText>
          <View style={styles.pills}>
            <HeroPill icon="palette" label={strings.pills.look} />
            <HeroPill icon="content_copy" label={strings.pills.copy} />
          </View>
        </View>
        <View style={styles.tali}>
          <Tali size={96} mood="confident" tight />
        </View>
      </View>

      <ChipSelect<Filter> options={options} value={filter} onChange={setFilter} />

      <Section title={filter === 'all' ? strings.kinds.all : strings.kinds[filter]} actionLabel={strings.count(shown.length)}>
        <View style={styles.list}>
          {shown.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </View>
      </Section>
      <ThemedText type="caption" themeColor="textTertiary" style={styles.more}>
        {strings.more}
      </ThemedText>
    </Screen>
  );
}

function HeroPill({ icon, label }: { icon: 'palette' | 'content_copy'; label: string }) {
  return (
    <View style={styles.pill}>
      <Icon name={icon} size={16} tint={HeroInk.text} />
      <ThemedText type="caption" style={{ color: HeroInk.text }}>
        {label}
      </ThemedText>
    </View>
  );
}

function TemplateCard({ template }: { template: KitTemplate }) {
  const strings = useLocalized(kitStrings);
  const text = strings.templates[template.id];
  return (
    <Card onPress={() => router.push({ pathname: '/career-kit/[id]', params: { id: template.id } } as unknown as Href)} accessibilityLabel={`${text.title}. ${text.description}. ${strings.looks(template.styles.length)}, ${strings.formats[template.format]}`}>
      <View style={styles.looks}>
        {template.styles.map((look) => (
          <View key={look.id} style={styles.look}>
            <KitPreview layout={look.layout} accent={look.accent} compact />
          </View>
        ))}
      </View>
      <View style={styles.cardText}>
        <ThemedText type="cardTitle">{text.title}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.description}
        </ThemedText>
        <ThemedText type="caption" themeColor="primaryText">
          {`${strings.looks(template.styles.length)} · ${strings.formats[template.format]}`}
        </ThemedText>
      </View>
      <Button title={strings.pickLook} icon="palette" onPress={() => router.push({ pathname: '/career-kit/[id]', params: { id: template.id } } as unknown as Href)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    overflow: 'hidden',
    padding: Spacing.four,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  heroText: { flex: 1, gap: Spacing.two },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 1 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  pill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 2, borderRadius: Radius.chip, backgroundColor: HeroInk.glass },
  tali: { alignSelf: 'flex-end' },
  list: { gap: Spacing.three },
  looks: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  look: { flex: 1 },
  cardText: { gap: Spacing.one, marginBottom: Spacing.three },
  more: { textAlign: 'center' },
});
