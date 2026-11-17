import { useSyncExternalStore, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Colors, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { curveBetween, type MapLayout } from '../lib/layout';
import type { CoursePath, PathNode } from '../lib/course-path';
import { arcBetween, fieldStrength, nearestPoints, type Mesh } from '../lib/neural';
import { spansTile, tilesFor, type Tile, type TileWindow } from '../lib/tiles';
import type { LevelZone } from '../lib/zones';

/** The furthest back (in courses) a cross synapse is drawn; a longer one would be a line through everything. */
const MAX_LINK_SPAN = 4;
/** One soft glow every this many points down the map, alternating sides, in the tone of the level it sits in: the depth behind the network. */
const CLOUD_EVERY = 520;
/** The network is at full strength within NEAR of the road and eases to FLOOR of it by FAR, so the road is what stands out. */
const FIELD_FADE = { near: 190, far: 380, floor: 0.35 } as const;
/** The tones a level can have (`LevelTones`), each with its own wash, glow and halos. */
const ZONE_TONES = ['mint', 'blue', 'violet', 'amber'] as const satisfies readonly Tone[];

export type NeuralLayerProps = {
  layout: MapLayout;
  nodes: readonly PathNode[];
  /** Prerequisites that reach back past the node before (pairs of node indexes). */
  links: CoursePath['links'];
  mesh: Mesh;
  /** The levels as stretches of the map, each washed in its own tone behind its banner. */
  zones: readonly LevelZone[];
  /** How far the field reaches past the map on each side (the page's padding), so the glows run to the screen's edge. */
  bleed: number;
  /** Which tiles are near the screen (updated by the screen as it scrolls, only when the range changes). */
  window: TileWindow;
};

type Element = { top: number; bottom: number; node: ReactElement };

/** A synapse has been passed when the learner has finished the course it leaves (a skipped one was never done: grey). */
const passed = (node: PathNode | undefined) => !!node && node.status === 'completed';

/**
 * The map's neural network: the field of faint neurons with its glows, the halos of lit milestones, their dendrites, the synapses
 * between milestones, all primary.
 *
 * Drawn as tiles, and only the tiles near the screen are mounted: one canvas the height of the whole journey cost a full-height
 * bitmap and was redrawn whole on every animation frame (79% CPU and 1.3 GB idle on Home, 2026-11-16). The signal has its own
 * small canvas, so each frame redraws a few hundred points, not the map. Decorative: hidden from screen readers, takes no touches.
 */
export function NeuralLayer({ layout, nodes, links, mesh, zones, bleed, window }: NeuralLayerProps) {
  const theme = useTheme();
  const tones = useTones();
  const dark = theme.background === Colors.dark.background;
  const range = useSyncExternalStore(window.subscribe, window.get);
  const tiles = tilesFor(layout.height).filter((tile) => tile.index >= range.first && tile.index <= range.last);
  const elements = buildElements(layout, nodes, links, mesh, zones, tones, bleed, theme, dark);
  const fullWidth = layout.width + bleed * 2;

  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
      {tiles.map((tile) => (
        <View key={tile.index} style={[styles.tile, { top: tile.top, left: -bleed, width: fullWidth, height: tile.height }]}>
          <Svg width={fullWidth} height={tile.height} viewBox={`${-bleed} ${tile.top} ${fullWidth} ${tile.height}`}>
            <Gradients theme={theme} tones={tones} dark={dark} />
            {elements.filter((element) => spansTile(element.top, element.bottom, tile)).map((element) => element.node)}
          </Svg>
        </View>
      ))}
    </View>
  );
}

function Gradients({ theme, tones, dark }: { theme: ReturnType<typeof useTheme>; tones: ReturnType<typeof useTones>; dark: boolean }) {
  // A level's wash: nothing at its top edge, strongest just under its banner, easing out over the rest of the level (a long level
  // keeps a little tint to its end), so two levels meet without a seam.
  const base = dark ? 0.26 : 0.17;
  return (
    <Defs>
      {ZONE_TONES.map((tone) => {
        // Gold reads heavier than the cool tones at the same strength, so it gets a little less.
        const peak = tone === 'amber' ? base * 0.8 : base;
        return (
          <LinearGradient key={`zone-${tone}`} id={`zone-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={tones[tone].solid} stopOpacity={0} />
            <Stop offset="0.04" stopColor={tones[tone].solid} stopOpacity={peak} />
            <Stop offset="0.55" stopColor={tones[tone].solid} stopOpacity={peak * 0.5} />
            <Stop offset="1" stopColor={tones[tone].solid} stopOpacity={0} />
          </LinearGradient>
        );
      })}
      {ZONE_TONES.map((tone) => (
        <RadialGradient key={`cloud-${tone}`} id={`cloud-${tone}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={tones[tone].solid} stopOpacity={dark ? 0.34 : 0.17} />
          <Stop offset="1" stopColor={tones[tone].solid} stopOpacity={0} />
        </RadialGradient>
      ))}
      <RadialGradient id="engine-spark" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor={theme.secondary} stopOpacity={dark ? 0.7 : 0.45} />
        <Stop offset="1" stopColor={theme.secondary} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="halo-done" cx="50%" cy="50%" r="50%">
        <Stop offset="0.35" stopColor={theme.success} stopOpacity={0.45} />
        <Stop offset="1" stopColor={theme.success} stopOpacity={0} />
      </RadialGradient>
      {ZONE_TONES.map((tone) => (
        <RadialGradient key={`halo-now-${tone}`} id={`halo-now-${tone}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0.35" stopColor={tones[tone].solid} stopOpacity={0.55} />
          <Stop offset="1" stopColor={tones[tone].solid} stopOpacity={0} />
        </RadialGradient>
      ))}
      {ZONE_TONES.map((tone) => (
        <RadialGradient key={`halo-open-${tone}`} id={`halo-open-${tone}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0.35" stopColor={tones[tone].solid} stopOpacity={0.24} />
          <Stop offset="1" stopColor={tones[tone].solid} stopOpacity={0} />
        </RadialGradient>
      ))}
    </Defs>
  );
}

/** Every drawable piece of the network with its vertical extent, in paint order, so each tile draws only what reaches into it. */
function buildElements(layout: MapLayout, nodes: readonly PathNode[], links: CoursePath['links'], mesh: Mesh, zones: readonly LevelZone[], tones: ReturnType<typeof useTones>, bleed: number, theme: ReturnType<typeof useTheme>, dark: boolean): Element[] {
  const out: Element[] = [];
  const width = layout.width;
  const height = layout.height;
  const lit = theme.primary;

  // Each level's wash, behind everything: the page itself takes the level's tone, so where the learner is on the map is felt, not only read.
  zones.forEach((zone, index) => {
    if (zone.bottom <= zone.top) return;
    out.push({ top: zone.top, bottom: zone.bottom, node: <Rect key={`zone-${index}`} x={-bleed} y={zone.top} width={width + bleed * 2} height={zone.bottom - zone.top} fill={`url(#zone-${zone.tone})`} /> });
  });

  // Soft glows for depth, each in the tone of the level it sits in.
  const toneAt = (y: number): Tone => zones.find((zone) => y >= zone.top && y < zone.bottom)?.tone ?? 'violet';
  const cloudRadius = Math.max(150, width * 0.55);
  for (let k = 0; k < Math.max(1, Math.floor(height / CLOUD_EVERY)); k += 1) {
    const x = k % 2 === 0 ? width * 0.18 : width * 0.82;
    const y = 220 + k * CLOUD_EVERY;
    out.push({ top: y - cloudRadius, bottom: y + cloudRadius, node: <Circle key={`cloud-${k}`} cx={x} cy={y} r={cloudRadius} fill={`url(#cloud-${toneAt(y)})`} /> });
  }

  // The field of neurons: brightest around the road, calm toward its edges.
  const anchors = layout.points;
  const strength = (x: number, y: number) => fieldStrength({ x, y }, anchors, FIELD_FADE);
  const lineOpacity = dark ? 0.24 : 0.15;
  const dotOpacity = dark ? 0.5 : 0.34;
  for (const [a, b] of mesh.edges) {
    const from = mesh.points[a]!;
    const to = mesh.points[b]!;
    out.push({ top: Math.min(from.y, to.y), bottom: Math.max(from.y, to.y), node: <Line key={`e-${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={theme.primary} strokeOpacity={lineOpacity * strength((from.x + to.x) / 2, (from.y + to.y) / 2)} strokeWidth={1} /> });
  }
  mesh.points.forEach((point, index) => {
    const near = strength(point.x, point.y);
    out.push({
      top: point.y - 12,
      bottom: point.y + 12,
      node: point.bright ? (
        <G key={`p-${index}`} opacity={0.55 + 0.45 * near}>
          <Circle cx={point.x} cy={point.y} r={point.r * 4} fill="url(#engine-spark)" />
          <Circle cx={point.x} cy={point.y} r={point.r + 0.6} fill={theme.secondary} fillOpacity={dark ? 0.9 : 0.6} />
        </G>
      ) : (
        <Circle key={`p-${index}`} cx={point.x} cy={point.y} r={point.r} fill={theme.primary} fillOpacity={dotOpacity * near} />
      ),
    });
  });

  // Halos on lit courses.
  for (const point of layout.points) {
    const status = nodes[point.nodeIndex]?.status;
    const level = toneAt(point.y);
    const halo = status === 'completed' ? 'halo-done' : status === 'current' ? `halo-now-${level}` : status === 'available' || status === 'in-progress' ? `halo-open-${level}` : null;
    const r = status === 'current' ? 104 : 78;
    if (halo) out.push({ top: point.y - r, bottom: point.y + r, node: <Circle key={`halo-${point.nodeIndex}`} cx={point.x} cy={point.y} r={r} fill={`url(#${halo})`} /> });
  }

  // Dendrites into the field: every line on the map is primary (owner, 2026-11-17), whether the learner has been there or not.
  for (const point of layout.points) {
    for (const index of nearestPoints(mesh, point, 3, 170)) {
      const target = mesh.points[index]!;
      out.push({ top: Math.min(point.y, target.y), bottom: Math.max(point.y, target.y), node: <Line key={`d-${point.nodeIndex}-${index}`} x1={point.x} y1={point.y} x2={target.x} y2={target.y} stroke={lit} strokeOpacity={0.45} strokeWidth={1.4} /> });
    }
  }

  // Cross synapses to a nearby prerequisite.
  const pointOf = new Map(layout.points.map((point) => [point.nodeIndex, point]));
  for (const [a, b] of links) {
    if (b - a > MAX_LINK_SPAN) continue;
    const from = pointOf.get(a);
    const to = pointOf.get(b);
    if (!from || !to) continue;
    out.push({ top: Math.min(from.y, to.y), bottom: Math.max(from.y, to.y), node: <Path key={`link-${a}-${b}`} d={arcBetween(from, to, 70, width)} stroke={lit} strokeWidth={2.5} strokeLinecap="round" fill="none" /> });
  }

  // The main synapses: one consistent primary line (a soft glow under the passed ones shows how far the learner has come).
  for (const axon of axons(layout, nodes)) {
    const top = Math.min(axon.from.y, axon.to.y);
    const bottom = Math.max(axon.from.y, axon.to.y);
    if (axon.on) out.push({ top, bottom, node: <Path key={`glow-${axon.key}`} d={axon.d} stroke={lit} strokeOpacity={0.2} strokeWidth={14} strokeLinecap="round" fill="none" /> });
    out.push({ top, bottom, node: <Path key={`axon-${axon.key}`} d={axon.d} stroke={lit} strokeWidth={4} strokeLinecap="round" fill="none" /> });
  }
  return out;
}

function axons(layout: MapLayout, nodes: readonly PathNode[]) {
  const list = layout.points.slice(1).map((to, i) => {
    const from = layout.points[i]!;
    return { key: `${from.nodeIndex}-${to.nodeIndex}`, from, to: { x: to.x, y: to.y, index: to.nodeIndex }, d: curveBetween(from, to), on: passed(nodes[from.nodeIndex]) };
  });
  const last = layout.points[layout.points.length - 1];
  if (last) {
    const end = { x: layout.width / 2, y: layout.height };
    list.push({ key: 'end', from: last, to: { ...end, index: -1 }, d: curveBetween(last, end), on: passed(nodes[last.nodeIndex]) });
  }
  return list;
}

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    overflow: 'hidden',
  },
});

export type { Tile };

