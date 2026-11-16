import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Fonts, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { layoutGitGraph, type GitState } from '../lib/git';

const LANE_WIDTH = 26;
const PAD = 14;
const ROW = 36;
const CHIP_ROW = 22;
const GLYPH = 12 * 0.6;

type ChipPlace = { text: string; x: number; y: number; width: number; head: boolean };

export type GitGraphViewProps = { state: GitState; label: string };

/** The commit graph: dots for commits (newest on top), lines to their parents, branch names as labels and HEAD marked. */
export function GitGraphView({ state, label }: GitGraphViewProps) {
  const theme = useTheme();
  const tones = useTones();
  const [width, setWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next !== width) setWidth(next);
  };
  if (width === 0) return <View onLayout={onLayout} style={styles.measure} />;

  const graph = layoutGitGraph(state);
  const palette = [tones.violet, tones.indigo, tones.mint, tones.amber, tones.neutral];
  const toneOf = (lane: number) => palette[lane % palette.length];
  const textX = PAD + graph.lanes * LANE_WIDTH + 6;
  const maxChars = Math.max(8, Math.floor((width - textX - 4) / GLYPH));

  // Row positions: a row with branch labels is taller, because its chips sit on their own lines under the message.
  const chips: ChipPlace[][] = graph.nodes.map((node) => {
    const placed: ChipPlace[] = [];
    let x = textX;
    let line = 0;
    const names = node.labels.map((name) => ({ name, head: state.head.kind === 'branch' && state.head.name === name }));
    if (node.isHead && state.head.kind === 'detached') names.unshift({ name: 'HEAD', head: true });
    for (const item of names) {
      const text = item.head && item.name !== 'HEAD' ? `HEAD → ${item.name}` : item.name;
      const w = Math.ceil(text.length * GLYPH) + 14;
      if (x + w > width - 2 && x > textX) {
        x = textX;
        line += 1;
      }
      placed.push({ text, x, y: line, width: w, head: item.head });
      x += w + 4;
    }
    return placed;
  });
  const rowTop: number[] = [];
  let cursor = PAD;
  graph.nodes.forEach((_, i) => {
    rowTop.push(cursor);
    const lines = chips[i].length === 0 ? 0 : Math.max(...chips[i].map((chip) => chip.y)) + 1;
    cursor += ROW + lines * CHIP_ROW;
  });
  const height = cursor + PAD - 8;
  const centerY = (i: number) => rowTop[i] + 12;
  const rowOf = new Map(graph.nodes.map((node, i) => [node.id, i] as const));
  const laneX = (lane: number) => PAD + lane * LANE_WIDTH + LANE_WIDTH / 2 - 4;

  return (
    <View onLayout={onLayout} accessible accessibilityRole="image" accessibilityLabel={label} style={styles.wrap}>
      <Svg width={width} height={height}>
        <Rect width={width} height={height} rx={Radius.small} fill={theme.codeBackground} />
        {graph.edges.map((edge) => {
          const from = graph.nodes[rowOf.get(edge.from) ?? 0];
          const to = graph.nodes[rowOf.get(edge.to) ?? 0];
          if (!from || !to) return null;
          const x1 = laneX(from.lane);
          const y1 = centerY(from.row);
          const x2 = laneX(to.lane);
          const y2 = centerY(to.row);
          const mid = (y1 + y2) / 2;
          return <Path key={`${edge.from}-${edge.to}`} d={x1 === x2 ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`} fill="none" stroke={toneOf(to.lane).solid} strokeWidth={3} strokeLinecap="round" />;
        })}
        {graph.nodes.map((node, i) => {
          const tone = toneOf(node.lane);
          const cx = laneX(node.lane);
          const cy = centerY(i);
          const message = node.message.length > maxChars - 8 ? `${node.message.slice(0, Math.max(1, maxChars - 9))}…` : node.message;
          return (
            <G key={node.id}>
              {node.isHead && <Circle cx={cx} cy={cy} r={11} fill="none" stroke={theme.primary} strokeWidth={2.5} />}
              <Circle cx={cx} cy={cy} r={7} fill={tone.solid} stroke={theme.codeBackground} strokeWidth={2} />
              {node.parents.length > 1 && <Circle cx={cx} cy={cy} r={3} fill={theme.codeBackground} />}
              <SvgText x={textX} y={cy + 4} fontSize={12} fontFamily={Fonts.mono} fontWeight="600" fill={theme.text}>
                {`${node.id} ${message}`}
              </SvgText>
              {chips[i].map((chip) => (
                <G key={chip.text}>
                  <Rect x={chip.x} y={rowTop[i] + 22 + chip.y * CHIP_ROW} width={chip.width} height={18} rx={9} fill={chip.head ? theme.primary : theme.backgroundSelected} stroke={chip.head ? theme.primary : theme.border} />
                  <SvgText x={chip.x + chip.width / 2} y={rowTop[i] + 35 + chip.y * CHIP_ROW} fontSize={12} fontFamily={Fonts.sans} fontWeight="700" fill={chip.head ? theme.onPrimary : theme.text} textAnchor="middle">
                    {chip.text}
                  </SvgText>
                </G>
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  measure: { alignSelf: 'stretch', height: 1 },
  wrap: { alignSelf: 'stretch' },
});
