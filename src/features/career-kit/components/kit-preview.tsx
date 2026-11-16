import { StyleSheet, View } from 'react-native';

import { KitSwatches, Radius, type KitSwatch } from '@/constants/theme';

import type { KitLayout } from '../content';

export type KitPreviewProps = {
  layout: KitLayout;
  accent: KitSwatch;
  /** Smaller pages draw fewer, thinner lines. */
  compact?: boolean;
};

/**
 * A page drawn in views, so the learner sees how a look is laid out (a sidebar, a header band, a hero, three cards…) before opening it:
 * it shows the arrangement and colour, never the template's real words or photos. Decorative: the look's name beside it says what it is.
 */
export function KitPreview({ layout, accent, compact = false }: KitPreviewProps) {
  const color = KitSwatches[accent];
  const line = (width: `${number}%`, tone: string = KitSwatches.line, height = compact ? 3 : 5) => <View style={{ width, height, borderRadius: height, backgroundColor: tone }} />;
  const lines = (widths: readonly number[]) => (
    <View style={styles.lines}>
      {widths.map((width, index) => (
        <View key={index}>{line(`${width}%`)}</View>
      ))}
    </View>
  );
  const dot = (size: number, tone: string = color) => <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tone }} />;
  const unit = compact ? 0.7 : 1;

  let content;
  switch (layout) {
    case 'sidebar':
      content = (
        <View style={styles.row}>
          <View style={[styles.sidebar, { backgroundColor: color }]}>
            {dot(18 * unit, KitSwatches.paper)}
            {line('70%', KitSwatches.paper)}
            {line('50%', KitSwatches.line)}
          </View>
          <View style={[styles.body, { gap: 6 * unit }]}>
            {line('45%', color, compact ? 4 : 6)}
            {lines([95, 88, 92, 60])}
            {line('38%', color, compact ? 4 : 6)}
            {lines([90, 70])}
          </View>
        </View>
      );
      break;
    case 'header':
      content = (
        <View style={styles.fill}>
          <View style={[styles.band, { backgroundColor: color }]}>
            {line('46%', KitSwatches.paper, compact ? 5 : 8)}
            {line('28%', KitSwatches.line)}
          </View>
          <View style={[styles.body, { gap: 6 * unit }]}>
            {lines([92, 84, 96, 58])}
            {line('34%', color, compact ? 4 : 6)}
            {lines([88, 64])}
          </View>
        </View>
      );
      break;
    case 'minimal':
      content = (
        <View style={[styles.body, { gap: 7 * unit }]}>
          <View style={styles.rowBetween}>
            <View style={{ gap: 4 * unit, width: '55%' }}>
              {line('90%', KitSwatches.ink, compact ? 5 : 8)}
              {line('55%')}
            </View>
            {dot(20 * unit)}
          </View>
          <View style={[styles.rule, { backgroundColor: KitSwatches.line }]} />
          {lines([94, 82, 90, 52])}
          {line('30%', color, compact ? 4 : 6)}
          {lines([86, 70])}
        </View>
      );
      break;
    case 'hero':
      content = (
        <View style={styles.fill}>
          <View style={[styles.hero, { backgroundColor: color }]}>
            {line('64%', KitSwatches.paper, compact ? 7 : 11)}
            {line('48%', KitSwatches.paper, compact ? 7 : 11)}
            <View style={[styles.pill, { backgroundColor: KitSwatches.paper }]} />
          </View>
          <View style={[styles.body, { gap: 6 * unit }]}>{lines([80, 62])}</View>
        </View>
      );
      break;
    case 'cards':
      content = (
        <View style={[styles.body, { gap: 8 * unit }]}>
          {line('42%', KitSwatches.ink, compact ? 5 : 8)}
          <View style={styles.cards}>
            {[0, 1, 2].map((index) => (
              <View key={index} style={[styles.card, { backgroundColor: index === 1 ? color : KitSwatches.paper, borderColor: index === 1 ? color : KitSwatches.line }]}>
                {line('60%', index === 1 ? KitSwatches.paper : color, compact ? 4 : 6)}
                {line('80%', index === 1 ? KitSwatches.line : KitSwatches.line)}
                {line('70%', index === 1 ? KitSwatches.line : KitSwatches.line)}
              </View>
            ))}
          </View>
        </View>
      );
      break;
    default:
      content = (
        <View style={styles.row}>
          <View style={[styles.body, { gap: 6 * unit, flex: 1 }]}>
            {line('70%', color, compact ? 5 : 8)}
            {lines([95, 88, 92, 70])}
          </View>
          <View style={[styles.image, { backgroundColor: color }]}>
            {dot(26 * unit, KitSwatches.paper)}
            {line('60%', KitSwatches.paper)}
          </View>
        </View>
      );
  }

  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.page, { backgroundColor: KitSwatches.paper }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    aspectRatio: 1.35,
    borderRadius: Radius.small,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
  },
  fill: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sidebar: { width: '32%', padding: 8, gap: 6, alignItems: 'flex-start' },
  body: { flex: 1, padding: 10 },
  band: { padding: 10, gap: 5 },
  hero: { height: '62%', padding: 12, gap: 6, justifyContent: 'center' },
  pill: { width: '24%', height: 8, borderRadius: 4, marginTop: 4 },
  lines: { gap: 4 },
  rule: { height: StyleSheet.hairlineWidth * 2 },
  cards: { flexDirection: 'row', gap: 6, flex: 1 },
  card: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 6, gap: 4 },
  image: { width: '40%', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 8, borderRadius: 8 },
});
