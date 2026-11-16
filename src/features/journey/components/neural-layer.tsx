import { useEffect, useSyncExternalStore, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { curveBetween, type MapLayout } from '../lib/layout';
import { arcBetween, crossLinks, curvePoints, nearestPoints, type Mesh } from '../lib/neural';
import { spansTile, tilesFor, type Tile, type TileWindow } from '../lib/tiles';
import type { MilestoneState } from '../lib/types';

/** Points sampled along the signal's synapse; the dot moves between them. */
const SIGNAL_STEPS = 48;
const DOT = 12;
const GLOW = 30;
/**
 * How many times the signal runs, then rests. A never-ending 60 fps animation kept the whole screen recompositing (measured
 * 2026-11-16: about 27% CPU idle on Home on its own, competing with every scroll); three runs show where the learner is, then stop.
 */
const SIGNAL_RUNS = 3;
/** How long the signal takes to cross one synapse on its way from the first course. */
const SIGNAL_MS_PER_SYNAPSE = 1200;
/** The furthest back (in milestones) a cross synapse is drawn; a longer one would be a line through everything. */
const MAX_LINK_SPAN = 4;
/** One soft glow every this many points down the map, alternating sides: the "engine" depth behind the network. */
const CLOUD_EVERY = 520;

export type NeuralLayerProps = {
  layout: MapLayout;
  milestones: readonly MilestoneState[];
  mesh: Mesh;
  /** How far the field reaches past the map on each side (the page's padding), so the glows run to the screen's edge. */
  bleed: number;
  /** Which tiles are near the screen (updated by the screen as it scrolls, only when the range changes). */
  window: TileWindow;
  /** False while Home is out of sight: the signal stops. */
  active: boolean;
  /** Changes when the learner's place changes: the signal runs again. */
  signalKey: string;
};

type Point = { x: number; y: number };
type Element = { top: number; bottom: number; node: ReactElement };

/** A synapse has been passed when the learner has finished the course of the milestone it leaves (a skipped one was never done: grey). */
const passed = (milestone: MilestoneState | undefined) => !!milestone && milestone.status !== 'skipped' && (milestone.status === 'done' || milestone.learned);

/**
 * The map's neural network: the field of faint neurons with its glows, the halos of lit milestones, their dendrites, the synapses
 * between milestones (primary where the learner has been, grey ahead) and one signal travelling into the current step.
 *
 * Drawn as tiles, and only the tiles near the screen are mounted: one canvas the height of the whole journey cost a full-height
 * bitmap and was redrawn whole on every animation frame (79% CPU and 1.3 GB idle on Home, 2026-11-16). The signal has its own
 * small canvas, so each frame redraws a few hundred points, not the map. Decorative: hidden from screen readers, takes no touches.
 */
export function NeuralLayer({ layout, milestones, mesh, bleed, window, active, signalKey }: NeuralLayerProps) {
  const theme = useTheme();
  const dark = theme.background === Colors.dark.background;
  const range = useSyncExternalStore(window.subscribe, window.get);
  const tiles = tilesFor(layout.height).filter((tile) => tile.index >= range.first && tile.index <= range.last);
  const elements = buildElements(layout, milestones, mesh, theme, dark);
  const signal = signalPath(layout, milestones);
  const signalTop = signal ? Math.min(...signal.points.map((point) => point.y)) : 0;
  const signalBottom = signal ? Math.max(...signal.points.map((point) => point.y)) : 0;
  const signalVisible = signal !== null && tiles.some((tile) => spansTile(signalTop, signalBottom, tile, 0));
  const fullWidth = layout.width + bleed * 2;

  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
      {tiles.map((tile) => (
        <View key={tile.index} style={[styles.tile, { top: tile.top, left: -bleed, width: fullWidth, height: tile.height }]}>
          <Svg width={fullWidth} height={tile.height} viewBox={`${-bleed} ${tile.top} ${fullWidth} ${tile.height}`}>
            <Gradients theme={theme} dark={dark} />
            {elements.filter((element) => spansTile(element.top, element.bottom, tile)).map((element) => element.node)}
          </Svg>
        </View>
      ))}
      {signal && signalVisible && <Signal points={signal.points} synapses={signal.synapses} colour={theme.primary} active={active} runKey={signalKey} />}
    </View>
  );
}

function Gradients({ theme, dark }: { theme: ReturnType<typeof useTheme>; dark: boolean }) {
  return (
    <Defs>
      <RadialGradient id="engine-violet" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor={theme.primary} stopOpacity={dark ? 0.32 : 0.14} />
        <Stop offset="1" stopColor={theme.primary} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="engine-indigo" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor={theme.secondary} stopOpacity={dark ? 0.28 : 0.12} />
        <Stop offset="1" stopColor={theme.secondary} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="engine-spark" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor={theme.secondary} stopOpacity={dark ? 0.7 : 0.45} />
        <Stop offset="1" stopColor={theme.secondary} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="halo-done" cx="50%" cy="50%" r="50%">
        <Stop offset="0.35" stopColor={theme.success} stopOpacity={0.45} />
        <Stop offset="1" stopColor={theme.success} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="halo-now" cx="50%" cy="50%" r="50%">
        <Stop offset="0.35" stopColor={theme.primary} stopOpacity={0.55} />
        <Stop offset="1" stopColor={theme.primary} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="halo-open" cx="50%" cy="50%" r="50%">
        <Stop offset="0.35" stopColor={theme.primary} stopOpacity={0.22} />
        <Stop offset="1" stopColor={theme.primary} stopOpacity={0} />
      </RadialGradient>
    </Defs>
  );
}

/** Every drawable piece of the network with its vertical extent, in paint order, so each tile draws only what reaches into it. */
function buildElements(layout: MapLayout, milestones: readonly MilestoneState[], mesh: Mesh, theme: ReturnType<typeof useTheme>, dark: boolean): Element[] {
  const out: Element[] = [];
  const width = layout.width;
  const height = layout.height;
  const lit = theme.primary;
  const grey = theme.border;

  // The engine's glows.
  const cloudRadius = Math.max(150, width * 0.55);
  for (let k = 0; k < Math.max(1, Math.floor(height / CLOUD_EVERY)); k += 1) {
    const x = k % 2 === 0 ? width * 0.18 : width * 0.82;
    const y = 220 + k * CLOUD_EVERY;
    out.push({ top: y - cloudRadius, bottom: y + cloudRadius, node: <Circle key={`cloud-${k}`} cx={x} cy={y} r={cloudRadius} fill={k % 3 === 1 ? 'url(#engine-indigo)' : 'url(#engine-violet)'} /> });
  }

  // The field of neurons.
  const lineOpacity = dark ? 0.22 : 0.13;
  const dotOpacity = dark ? 0.45 : 0.3;
  for (const [a, b] of mesh.edges) {
    const from = mesh.points[a]!;
    const to = mesh.points[b]!;
    out.push({ top: Math.min(from.y, to.y), bottom: Math.max(from.y, to.y), node: <Line key={`e-${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={theme.primary} strokeOpacity={lineOpacity} strokeWidth={1} /> });
  }
  mesh.points.forEach((point, index) => {
    out.push({
      top: point.y - 12,
      bottom: point.y + 12,
      node: point.bright ? (
        <G key={`p-${index}`}>
          <Circle cx={point.x} cy={point.y} r={point.r * 4} fill="url(#engine-spark)" />
          <Circle cx={point.x} cy={point.y} r={point.r + 0.6} fill={theme.secondary} fillOpacity={dark ? 0.9 : 0.6} />
        </G>
      ) : (
        <Circle key={`p-${index}`} cx={point.x} cy={point.y} r={point.r} fill={theme.primary} fillOpacity={dotOpacity} />
      ),
    });
  });

  // Halos on lit milestones.
  for (const point of layout.points) {
    const status = milestones[point.milestoneIndex]?.status;
    const halo = status === 'done' ? 'halo-done' : status === 'current' ? 'halo-now' : status === 'available' ? 'halo-open' : null;
    const r = status === 'current' ? 104 : 78;
    if (halo) out.push({ top: point.y - r, bottom: point.y + r, node: <Circle key={`halo-${point.milestoneIndex}`} cx={point.x} cy={point.y} r={r} fill={`url(#${halo})`} /> });
  }

  // Dendrites into the field: primary from a milestone the learner has passed, grey otherwise.
  for (const point of layout.points) {
    const on = passed(milestones[point.milestoneIndex]);
    for (const index of nearestPoints(mesh, point, 3, 170)) {
      const target = mesh.points[index]!;
      out.push({ top: Math.min(point.y, target.y), bottom: Math.max(point.y, target.y), node: <Line key={`d-${point.milestoneIndex}-${index}`} x1={point.x} y1={point.y} x2={target.x} y2={target.y} stroke={on ? lit : grey} strokeOpacity={on ? 0.45 : 0.6} strokeWidth={1.4} /> });
    }
  }

  // Cross synapses to a nearby prerequisite: the same rule, primary once passed, grey before.
  const pointOf = new Map(layout.points.map((point) => [point.milestoneIndex, point]));
  for (const [a, b] of crossLinks(milestones.map((milestone) => ({ id: milestone.id, requires: milestone.def.requires })))) {
    if (b - a > MAX_LINK_SPAN) continue;
    const from = pointOf.get(a);
    const to = pointOf.get(b);
    if (!from || !to) continue;
    const on = passed(milestones[a]);
    out.push({ top: Math.min(from.y, to.y), bottom: Math.max(from.y, to.y), node: <Path key={`link-${a}-${b}`} d={arcBetween(from, to, 70, width)} stroke={on ? lit : grey} strokeWidth={2.5} strokeLinecap="round" fill="none" /> });
  }

  // The main synapses: one consistent line, primary where the learner has been, grey ahead (a soft glow under the passed ones).
  for (const axon of axons(layout, milestones)) {
    const top = Math.min(axon.from.y, axon.to.y);
    const bottom = Math.max(axon.from.y, axon.to.y);
    if (axon.on) out.push({ top, bottom, node: <Path key={`glow-${axon.key}`} d={axon.d} stroke={lit} strokeOpacity={0.2} strokeWidth={14} strokeLinecap="round" fill="none" /> });
    out.push({ top, bottom, node: <Path key={`axon-${axon.key}`} d={axon.d} stroke={axon.on ? lit : grey} strokeWidth={4} strokeLinecap="round" fill="none" /> });
  }
  return out;
}

function axons(layout: MapLayout, milestones: readonly MilestoneState[]) {
  const list = layout.points.slice(1).map((to, i) => {
    const from = layout.points[i]!;
    return { key: `${from.milestoneIndex}-${to.milestoneIndex}`, from, to: { x: to.x, y: to.y, index: to.milestoneIndex }, d: curveBetween(from, to), on: passed(milestones[from.milestoneIndex]) };
  });
  const last = layout.points[layout.points.length - 1];
  if (last) {
    const end = { x: layout.width / 2, y: layout.height };
    list.push({ key: 'end', from: last, to: { ...end, index: -1 }, d: curveBetween(last, end), on: passed(milestones[last.milestoneIndex]) });
  }
  return list;
}

/**
 * The road the signal runs along: from the very first course, through every synapse, into the learner's current milestone (owner,
 * 2026-11-16: "the neuron like animation should start from the very first course"). None while the learner is still on the first
 * course (Meet AI, or the first course of the level they started at): it appears once they have moved on (owner, the same day: "only
 * if on the next stage or after Meet AI course"). Returns the points sampled along the whole road, and how many synapses it crosses.
 */
function signalPath(layout: MapLayout, milestones: readonly MilestoneState[]): { points: Point[]; synapses: number } | null {
  const current = milestones.findIndex((milestone) => milestone.status === 'current');
  if (current < 0) return null;
  const at = layout.points.findIndex((point) => point.milestoneIndex === current);
  if (at <= 0) return null;
  const points: Point[] = [];
  for (let i = 1; i <= at; i += 1) {
    const segment = curvePoints(layout.points[i - 1]!, layout.points[i]!, SIGNAL_STEPS);
    // Each synapse starts where the last ended: drop the repeated joint.
    points.push(...(i === 1 ? segment : segment.slice(1)));
  }
  return { points, synapses: at };
}

/**
 * A bright dot running from the first course to the current one a few times (`SIGNAL_RUNS`), then resting. It runs again when Home comes back into view or
 * the learner's place changes. A plain view moved along points sampled from the curve, so nothing is redrawn; its glow is a soft
 * circle, not a blurred shadow. Absent with reduced motion, while Home is out of sight, or when the synapse isn't near the screen.
 */
function Signal({ points, synapses, colour, active, runKey }: { points: Point[]; synapses: number; colour: string; active: boolean; runKey: string }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const running = active && !reduceMotion;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  // The same pace on every synapse (about 1.2 s each), so a long road from the first course doesn't rush; at least the old 2.4 s.
  const duration = Math.max(2400, synapses * SIGNAL_MS_PER_SYNAPSE);
  useEffect(() => {
    if (!running) {
      cancelAnimation(progress);
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }), SIGNAL_RUNS, false);
    return () => cancelAnimation(progress);
  }, [running, progress, runKey, duration]);
  const style = useAnimatedStyle(() => {
    const at = progress.value * (xs.length - 1);
    const i = Math.min(xs.length - 2, Math.floor(at));
    const f = at - i;
    return {
      // Hidden at both ends of a run, and once it rests at the end.
      opacity: progress.value < 0.04 || progress.value > 0.96 ? 0 : 1,
      transform: [{ translateX: xs[i]! + (xs[i + 1]! - xs[i]!) * f - GLOW / 2 }, { translateY: ys[i]! + (ys[i + 1]! - ys[i]!) * f - GLOW / 2 }],
    };
  });
  if (!running) return null;
  return (
    <Animated.View style={[styles.signal, style]}>
      <View style={[styles.glow, { backgroundColor: colour }]} />
      <View style={[styles.dot, { borderColor: colour }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  signal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GLOW,
    height: GLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
    opacity: 0.3,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  tile: {
    position: 'absolute',
    overflow: 'hidden',
  },
});

export type { Tile };

