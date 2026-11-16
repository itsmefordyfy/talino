import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { chartMax, COMPLEXITIES, curvePoints, formatOps, heightShare, NOTATION, operations, type Complexity, type YScale } from './big-o';
import { dsaStrings } from './strings';

const MAX_N = 64;
const HEIGHT = 170;
const PAD = 8;
const TONE: Record<Complexity, Tone> = { constant: 'mint', logarithmic: 'indigo', linear: 'violet', linearithmic: 'amber', quadratic: 'red' };
/** Different dash patterns as well as colours, so the curves can be told apart without colour. */
const DASH: Record<Complexity, string | undefined> = { constant: '2,5', logarithmic: '9,4', linear: undefined, linearithmic: '12,3,2,3', quadratic: undefined };

export function BigOVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).bigO;
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [n, setN] = useState(16);
  const [shown, setShown] = useState<Complexity[]>([...COMPLEXITIES]);
  const [scale, setScale] = useState<YScale>('linear');

  const yMax = chartMax(shown, MAX_N);
  const inner = { w: width - 2 * PAD, h: HEIGHT - 2 * PAD };
  const toX = (share: number) => PAD + share * inner.w;
  const toY = (share: number) => PAD + (1 - share) * inner.h;
  const markerX = toX((n - 1) / (MAX_N - 1));
  const ops = COMPLEXITIES.map((complexity) => formatOps(operations(complexity, n)));
  const summary = COMPLEXITIES.map((complexity, index) => `${NOTATION[complexity]} ${ops[index]}`).join(', ');

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={`${t.caption(n, ops)}${scale === 'log' ? ` ${t.captionLog}` : ''}`}
      controls={
        <View style={styles.controls}>
          <NumberAdjust label={t.sizeLabel} value={n} min={1} max={MAX_N} onChange={setN} />
          <ChipSelect label={t.presetsLabel} value={String(n)} onChange={(value) => setN(Number(value))} options={['1', '8', '16', '32', '64'].map((value) => ({ value, label: value }))} />
          <ChipSelect<Complexity> label={t.showLabel} multiple wrap value={shown} onChange={setShown} options={COMPLEXITIES.map((complexity) => ({ value: complexity, label: NOTATION[complexity], tone: TONE[complexity] }))} />
          <ChipSelect label={t.scaleLabel} value={scale} onChange={setScale} options={[{ value: 'linear', label: t.scales.linear }, { value: 'log', label: t.scales.log }]} />
          <ThemedText type="caption" themeColor="textSecondary">{t.simplified}</ThemedText>
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        {shown.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">{t.noneShown}</ThemedText>
        ) : (
          <View accessible accessibilityLabel={`${t.chartLabel}. ${t.chartDescription(n, summary)}`}>
            <Svg width={width} height={HEIGHT}>
              <Line x1={PAD} y1={HEIGHT - PAD} x2={width - PAD} y2={HEIGHT - PAD} stroke={theme.textTertiary} strokeWidth={1.5} />
              <Line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} stroke={theme.textTertiary} strokeWidth={1.5} />
              <Line x1={markerX} y1={PAD} x2={markerX} y2={HEIGHT - PAD} stroke={theme.textSecondary} strokeWidth={1} strokeDasharray="3,3" />
              {COMPLEXITIES.filter((complexity) => shown.includes(complexity)).map((complexity) => (
                <Polyline key={complexity} points={curvePoints(complexity, MAX_N, yMax, scale).map((point) => `${toX(point.x)},${toY(point.y)}`).join(' ')} fill="none" stroke={tones[TONE[complexity]].ink} strokeWidth={complexity === 'quadratic' ? 3.5 : 2.5} strokeDasharray={DASH[complexity]} strokeLinejoin="round" />
              ))}
              {COMPLEXITIES.filter((complexity) => shown.includes(complexity)).map((complexity) => (
                <Circle key={`${complexity}-dot`} cx={markerX} cy={toY(heightShare(complexity, n, yMax, scale))} r={4.5} fill={tones[TONE[complexity]].ink} />
              ))}
            </Svg>
            <View style={styles.axes}>
              <ThemedText type="caption" themeColor="textSecondary">{`↑ ${t.chartAxisY}`}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">{`${t.chartAxisX} →`}</ThemedText>
            </View>
          </View>
        )}
        {COMPLEXITIES.map((complexity, index) => (
          <View key={complexity} style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessible accessibilityLabel={`${t.atN(t.names[complexity], NOTATION[complexity], ops[index] ?? '')}. ${t.explanations[complexity]}`}>
            <View style={styles.rowHead}>
              <Tag text={NOTATION[complexity]} mono tone={TONE[complexity]} outlined />
              <ThemedText type="secondarySemiBold">{t.names[complexity]}</ThemedText>
              <ThemedText type="codeInline" tabular style={styles.ops}>{`${ops[index]} ops`}</ThemedText>
            </View>
            <ThemedText type="secondary" themeColor="textSecondary">{t.explanations[complexity]}</ThemedText>
          </View>
        ))}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two },
  axes: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { gap: Spacing.one, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  rowHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  ops: { marginLeft: 'auto' },
});
