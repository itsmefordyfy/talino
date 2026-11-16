import { useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { PayloadBox } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { findItem, ITEMS, nearest } from '../lib/embeddings';
import { aiStrings } from '../strings';

const MIN_SIZE = 264;
const MAX_SIZE = 340;
const MARGIN = 24;

/** A hand-placed 2-D map of words and phrases; pick one and its nearest neighbors by real cosine similarity are listed and ringed. */
export function EmbeddingsVisual({ compact }: VisualProps) {
  const s = useLocalized(aiStrings).embeddings;
  const theme = useTheme();
  const tones = useTones();
  const [pickedId, setPickedId] = useState('cat');
  const [width, setWidth] = useState(0);
  const query = findItem(pickedId);
  const neighbors = nearest(query, ITEMS, 3);
  const size = Math.max(MIN_SIZE, Math.min(width || MIN_SIZE, MAX_SIZE));
  const half = size / 2;
  const scale = half - MARGIN;
  const px = (x: number) => half + x * scale;
  const py = (y: number) => half - y * scale;
  const groupTone = { animals: tones.violet, fruit: tones.amber, vehicles: tones.indigo, tech: tones.mint } as const;
  const onLayout = (event: LayoutChangeEvent) => setWidth(Math.floor(event.nativeEvent.layout.width));
  const [first, second, third] = neighbors;

  const chart = (
    <View accessible accessibilityRole="image" accessibilityLabel={`${s.chartLabel(query.label)} ${s.neighborsTitle(query.label)}: ${neighbors.map((n) => n.item.label).join(', ')}.`}>
      <Svg width={size} height={size}>
        <Rect width={size} height={size} rx={Radius.small} fill={theme.codeBackground} />
        <Line x1={half} y1={MARGIN / 2} x2={half} y2={size - MARGIN / 2} stroke={theme.border} strokeWidth={1} />
        <Line x1={MARGIN / 2} y1={half} x2={size - MARGIN / 2} y2={half} stroke={theme.border} strokeWidth={1} />
        <Line x1={half} y1={half} x2={px(query.x)} y2={py(query.y)} stroke={theme.primary} strokeWidth={2.5} />
        {ITEMS.map((item) => {
          const near = neighbors.some((n) => n.item.id === item.id);
          const on = item.id === query.id;
          const tone = groupTone[item.group];
          return (
            <G key={item.id}>
              {(on || near) && <Circle cx={px(item.x)} cy={py(item.y)} r={9} fill="none" stroke={on ? theme.primary : theme.statusOk} strokeWidth={2.5} strokeDasharray={on ? undefined : '3 2'} />}
              <Circle cx={px(item.x)} cy={py(item.y)} r={5} fill={tone.solid} />
              <SvgText x={px(item.x) + 7} y={py(item.y) + 4} fontSize={12} fontFamily={Fonts.sans} fontWeight={on || near ? '700' : '500'} fill={on ? theme.primaryText : theme.text}>
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={s.caption(query.label, first.item.label, second.item.label, third.item.label)}
      controls={<ChipSelect label={s.pickLabel} wrap value={pickedId} onChange={setPickedId} options={ITEMS.map((item) => ({ value: item.id, label: item.label }))} />}>
      <View onLayout={onLayout} style={styles.stack}>
        {width > 0 && width < MIN_SIZE ? <ScrollView horizontal>{chart}</ScrollView> : chart}
        <ThemedText type="caption" themeColor="textSecondary">
          {s.axisNote}
        </ThemedText>
        <PayloadBox title={s.neighborsTitle(query.label)} lines={neighbors.map((n, i) => `${i + 1}. ${n.item.label} · ${s.similarity(n.similarity)}`)} tone="ok" />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.note}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
});
