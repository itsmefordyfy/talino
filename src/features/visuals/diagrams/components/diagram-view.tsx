import { useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Fonts, MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { useViewport } from '@/hooks/use-viewport';

import { describeDiagram } from '../describe';
import { layoutDiagram, type LayoutEdge, type LayoutNode } from '../layout';
import { arrivalFrom, markerPoints, pathData, pointsAttr } from '../layout/geometry';
import { DECISION_INSET } from '../layout/layered';
import { diagramStrings } from '../strings';
import type { DiagramSpec } from '../types';

export type DiagramViewProps = {
  spec: DiagramSpec;
  /** Node ids drawn emphasized (a stepper's active stage); the rest are dimmed. */
  highlightNodes?: readonly string[];
  /** Edge (or message) positions drawn emphasized. */
  highlightEdges?: readonly number[];
  /** Controlled selection: a node id, or `#<position>` for a sequence message. */
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  /** Drop the note caption under the diagram (a visual that shows its own explanation). */
  hideNote?: boolean;
  /** Skip the text under the diagram that says the parts can be tapped. */
  hideHint?: boolean;
  /** Inside the full-screen viewer: lay out for this width and draw at this zoom, with no Full screen button of its own. */
  fullScreen?: { width: number; scale: number };
};

/** The zoom steps of the full-screen viewer, on top of filling the screen's width (step 0). */
const ZOOMS = [1, 1.5, 2, 2.5] as const;
const MAX_FILL_INLINE = 1.25;
const MAX_FILL_FULL = 2;

/** The id used for a sequence message in `selected` and `onSelect`. */
export function messageKey(index: number): string {
  return `#${index}`;
}

const GROUP_TONES = ['indigo', 'mint', 'violet', 'amber', 'neutral'] as const;

/**
 * Draws any valid `DiagramSpec`: measures its room, lays it out, and paints it with theme colors.
 * Tapping a part selects it and shows its note under the diagram. A diagram that cannot be made to fit
 * scrolls sideways with a visible hint. Screen readers get the generated description.
 */
export function DiagramView({ spec, highlightNodes, highlightEdges, selected, onSelect, hideNote = false, hideHint = false, fullScreen }: DiagramViewProps) {
  const t = useLocalized(diagramStrings);
  const theme = useTheme();
  const tones = useTones();
  const [measured, setWidth] = useState(0);
  const width = fullScreen?.width ?? measured;
  const [own, setOwn] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const current = selected === undefined ? own : selected;
  const select = (id: string | null) => {
    if (selected === undefined) setOwn(id);
    onSelect?.(id);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next !== measured) setWidth(next);
  };

  const description = `${spec.title}. ${spec.summary} ${describeDiagram(spec, t.describe)}`;
  const notes = noteOf(spec);
  const interactive = onSelect !== undefined || notes.size > 0;

  if (width === 0) return <View onLayout={onLayout} style={styles.measure} />;

  const layout = layoutDiagram(spec, width);
  // Fill the room: a drawing narrower than its panel is enlarged (a little inline, up to double full screen) so there is no dead space
  // beside it and its text is bigger; a drawing that already needs to scroll keeps its size. The full-screen zoom multiplies this.
  const fill = layout.needsScroll ? 1 : Math.max(1, Math.min(fullScreen ? MAX_FILL_FULL : MAX_FILL_INLINE, width / layout.width));
  const scale = fill * (fullScreen?.scale ?? 1);
  const highlightN = new Set(highlightNodes ?? []);
  const highlightE = new Set(highlightEdges ?? []);
  const dim = highlightN.size > 0 || highlightE.size > 0;
  const groups = [...new Set(layout.nodes.flatMap((node) => (node.group ? [node.group] : [])))];
  const toneOf = (group: string | undefined) => (group === undefined ? null : tones[GROUP_TONES[groups.indexOf(group) % GROUP_TONES.length]]);

  const selectedNote = current === null ? null : (notes.get(current) ?? null);

  const inner = (
    <View style={{ width: layout.width, height: layout.height }}>
      <View accessible accessibilityRole="image" accessibilityLabel={description} style={StyleSheet.absoluteFill}>
        <Svg width={layout.width} height={layout.height}>
          <Rect width={layout.width} height={layout.height} rx={Radius.small} fill={theme.codeBackground} />
          {layout.lifelines.map((line) => (
            <Line key={line.id} x1={line.x} y1={line.y1} x2={line.x} y2={line.y2} stroke={theme.border} strokeWidth={1.5} strokeDasharray="4 4" />
          ))}
          {layout.edges.map((edge) => (
            <EdgeShape key={`e${edge.index}`} edge={edge} on={highlightE.has(edge.index)} dimmed={dim && !highlightE.has(edge.index)} selected={current === messageKey(edge.index)} />
          ))}
          {/* Labels after every line, on a solid backing, so a line passing by goes under the words instead of through them. */}
          {layout.edges.map((edge) =>
            edge.label ? <EdgeLabel key={`l${edge.index}`} edge={edge} on={highlightE.has(edge.index) || current === messageKey(edge.index)} dimmed={dim && !highlightE.has(edge.index)} /> : null,
          )}
          {layout.nodes.map((node) => (
            <NodeShape key={node.id} node={node} tone={toneOf(node.group)} on={highlightN.has(node.id)} dimmed={dim && !highlightN.has(node.id)} selected={current === node.id} />
          ))}
        </Svg>
      </View>
      {interactive &&
        layout.nodes.map((node) => <TapTarget key={node.id} node={node} selected={current === node.id} label={t.nodeButton(labelOf(spec, node.id))} onPress={() => select(current === node.id ? null : node.id)} />)}
      {interactive && spec.kind === 'sequence' && layout.edges.map((edge) => <MessageTarget key={`m${edge.index}`} edge={edge} selected={current === messageKey(edge.index)} label={t.messageButton(edge.index + 1, spec.messages[edge.index]?.label ?? '')} onPress={() => select(current === messageKey(edge.index) ? null : messageKey(edge.index))} />)}
    </View>
  );
  // Zoomed (full screen only): the drawing is scaled about its centre inside a box of the scaled size, so taps still land on the right part.
  const drawing =
    scale === 1 ? (
      inner
    ) : (
      <View style={{ width: layout.width * scale, height: layout.height * scale }}>
        {/* The wrapper is the drawing's own size: left to stretch to the scaled box, it scaled about the wrong centre and the left
            of the drawing went off-screen (owner's full-screen screenshot, 2026-11-15). */}
        <View style={{ width: layout.width, height: layout.height, transform: [{ translateX: (layout.width * (scale - 1)) / 2 }, { translateY: (layout.height * (scale - 1)) / 2 }, { scale }] }}>{inner}</View>
      </View>
    );

  if (fullScreen) {
    return (
      <View style={styles.wrap}>
        {drawing}
        {!hideNote && selectedNote !== null && (
          <View accessibilityLiveRegion="polite" style={[styles.note, { backgroundColor: theme.primarySoft }]}>
            <ThemedText type="secondary">{selectedNote}</ThemedText>
          </View>
        )}
      </View>
    );
  }

  return (
    <View onLayout={onLayout} style={styles.wrap}>
      {/* The diagram's panel fills the width, with the drawing centred in it (it used to sit at the left, as wide as the drawing). */}
      <View style={[styles.panel, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>
      {layout.needsScroll ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel={t.scrollHint}>
            {drawing}
          </ScrollView>
          <LinearGradient colors={[`${theme.codeBackground}00`, theme.codeBackground]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.fade} />
          <View style={styles.scrollHint}>
            <Icon name="swipe" size={16} color="textSecondary" />
            <ThemedText type="caption" themeColor="textSecondary">
              {t.scrollHint}
            </ThemedText>
          </View>
        </View>
      ) : (
        drawing
      )}
      </View>
      <View style={styles.toolRow}>
        <Button title={t.expand} icon="open_in_full" size="small" variant="ghost" accessibilityLabel={t.expandLabel(spec.title)} onPress={() => setExpanded(true)} />
      </View>
      {expanded && <FullScreenDiagram spec={spec} highlightNodes={highlightNodes} highlightEdges={highlightEdges} selected={current} onSelect={select} onClose={() => setExpanded(false)} />}
      {!hideNote &&
        (selectedNote !== null ? (
          <View accessibilityLiveRegion="polite" style={[styles.note, { backgroundColor: theme.primarySoft }]}>
            <ThemedText type="secondary">{selectedNote}</ThemedText>
          </View>
        ) : (
          notes.size > 0 &&
          !hideHint && (
            <ThemedText type="caption" themeColor="textSecondary">
              {t.tapHint}
            </ThemedText>
          )
        ))}
    </View>
  );
}

/** The diagram on its own screen: bigger, zoomable (25% steps up to 250%) and scrollable both ways, with its title, summary and notes. */
function FullScreenDiagram({ spec, highlightNodes, highlightEdges, selected, onSelect, onClose }: { spec: DiagramSpec; highlightNodes?: readonly string[]; highlightEdges?: readonly number[]; selected: string | null; onSelect: (id: string | null) => void; onClose: () => void }) {
  const t = useLocalized(diagramStrings);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useViewport();
  const [zoom, setZoom] = useState(0);
  const room = Math.max(280, width - insets.left - insets.right - 2 * Spacing.three);
  const scale = ZOOMS[zoom];
  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <View style={[styles.full, { backgroundColor: theme.background, paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.two }]}>
        <View style={[styles.fullHeader, { paddingLeft: insets.left + Spacing.three, paddingRight: insets.right + Spacing.three }]}>
          <View style={styles.fullTitle}>
            <ThemedText type="cardTitle" accessibilityRole="header" numberOfLines={2}>
              {spec.title}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {t.fullScreenHint}
            </ThemedText>
          </View>
          <Button title={t.close} icon="close" size="small" variant="secondary" onPress={onClose} />
        </View>
        <ScrollView style={styles.fullScroll} contentContainerStyle={{ paddingHorizontal: insets.left + Spacing.three, paddingVertical: Spacing.three }}>
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.fullCanvas}>
            <DiagramView spec={spec} highlightNodes={highlightNodes} highlightEdges={highlightEdges} selected={selected} onSelect={onSelect} fullScreen={{ width: room, scale }} />
          </ScrollView>
          <ThemedText type="body" themeColor="textSecondary" style={styles.fullSummary}>
            {spec.summary}
          </ThemedText>
        </ScrollView>
        <View style={[styles.zoomBar, { paddingLeft: insets.left + Spacing.three, paddingRight: insets.right + Spacing.three }]}>
          <Button title={t.zoomOut} icon="zoom_out" size="small" variant="secondary" disabled={zoom === 0} onPress={() => setZoom(Math.max(0, zoom - 1))} />
          <ThemedText type="secondarySemiBold" tabular accessibilityLiveRegion="polite">
            {zoom === 0 ? t.fitWidth : t.zoomLevel(Math.round(scale * 100))}
          </ThemedText>
          <Button title={t.zoomIn} icon="zoom_in" size="small" variant="secondary" disabled={zoom === ZOOMS.length - 1} onPress={() => setZoom(Math.min(ZOOMS.length - 1, zoom + 1))} />
        </View>
      </View>
    </Modal>
  );
}

function labelOf(spec: DiagramSpec, id: string): string {
  switch (spec.kind) {
    case 'flow':
    case 'architecture':
      return spec.nodes.find((node) => node.id === id)?.label ?? id;
    case 'sequence':
      return spec.participants.find((participant) => participant.id === id)?.label ?? id;
    case 'class':
      return spec.classes.find((box) => box.id === id)?.label ?? id;
    case 'er':
      return spec.entities.find((entity) => entity.id === id)?.label ?? id;
  }
}

/** The explanation shown under the diagram for each tappable part, as "Label: note". */
export function noteOf(spec: DiagramSpec): Map<string, string> {
  const notes = new Map<string, string>();
  const add = (id: string, label: string, note: string | undefined) => {
    if (note) notes.set(id, `${label}: ${note}`);
  };
  switch (spec.kind) {
    case 'flow':
    case 'architecture':
      spec.nodes.forEach((node) => add(node.id, node.label, node.note));
      break;
    case 'sequence':
      spec.participants.forEach((participant) => add(participant.id, participant.label, participant.note));
      spec.messages.forEach((message, index) => add(messageKey(index), message.label, message.note));
      break;
    case 'class':
      spec.classes.forEach((box) => add(box.id, box.label, box.note));
      break;
    case 'er':
      spec.entities.forEach((entity) => add(entity.id, entity.label, entity.note));
      break;
  }
  return notes;
}

type Tone = { ink: string; soft: string; solid: string };

function NodeShape({ node, tone, on, dimmed, selected }: { node: LayoutNode; tone: Tone | null; on: boolean; dimmed: boolean; selected: boolean }) {
  const theme = useTheme();
  const emphasized = on || selected;
  const fill = emphasized ? theme.primarySoft : (tone?.soft ?? theme.backgroundElement);
  const stroke = emphasized ? theme.primary : (tone?.ink ?? theme.border);
  const strokeWidth = emphasized ? 3 : 1.5;
  const { x, y, width: w, height: h } = node;
  const common = { fill, stroke, strokeWidth };
  let shape;
  switch (node.shape) {
    case 'diamond': {
      // A decision: a wide box with pointed ends (see `sizeNode`), so its question reads in one to three lines.
      const inset = Math.min(DECISION_INSET, w / 4);
      shape = <Polygon {...common} points={`${x + inset},${y} ${x + w - inset},${y} ${x + w},${y + h / 2} ${x + w - inset},${y + h} ${x + inset},${y + h} ${x},${y + h / 2}`} />;
      break;
    }
    case 'circle':
      shape = <Ellipse {...common} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} />;
      break;
    case 'database': {
      const cap = 6;
      shape = (
        <G>
          <Path {...common} d={`M${x} ${y + cap} A${w / 2} ${cap} 0 0 1 ${x + w} ${y + cap} L${x + w} ${y + h - cap} A${w / 2} ${cap} 0 0 1 ${x} ${y + h - cap} Z`} />
          <Path fill="none" stroke={stroke} strokeWidth={strokeWidth} d={`M${x} ${y + cap} A${w / 2} ${cap} 0 0 0 ${x + w} ${y + cap}`} />
        </G>
      );
      break;
    }
    case 'card':
      shape = <Rect {...common} x={x} y={y} width={w} height={h} rx={8} />;
      break;
    case 'actor':
      shape = <Rect {...common} x={x} y={y} width={w} height={h} rx={h / 2} />;
      break;
    case 'box':
      shape = <Rect {...common} x={x} y={y} width={w} height={h} rx={5} />;
      break;
    default:
      shape = <Rect {...common} x={x} y={y} width={w} height={h} rx={12} />;
  }
  return (
    <G opacity={dimmed ? 0.6 : 1}>
      {shape}
      {node.lines.map((line, i) => {
        if (line.kind === 'divider') return <Line key={i} x1={x} x2={x + w} y1={y + line.y} y2={y + line.y} stroke={stroke} strokeWidth={1} opacity={0.7} />;
        const isTitle = line.kind === 'title';
        const isKey = line.kind === 'key';
        return (
          <SvgText
            key={i}
            x={x + line.x}
            y={y + line.y + 4.5}
            fontSize={line.kind === 'stereotype' || line.kind === 'member' || isKey ? 12 : 13}
            fontFamily={Fonts.sans}
            fontWeight={isTitle || emphasized || isKey ? '700' : '500'}
            fontStyle={line.kind === 'stereotype' ? 'italic' : 'normal'}
            fill={isKey ? theme.primaryText : line.kind === 'stereotype' ? theme.textSecondary : theme.text}
            textAnchor={line.align === 'center' ? 'middle' : 'start'}>
            {line.text}
          </SvgText>
        );
      })}
    </G>
  );
}

function EdgeShape({ edge, on, dimmed, selected }: { edge: LayoutEdge; on: boolean; dimmed: boolean; selected: boolean }) {
  const theme = useTheme();
  const emphasized = on || selected;
  const color = emphasized ? theme.primary : theme.textSecondary;
  const width = emphasized ? 3 : 1.6;
  const head = (marker: LayoutEdge['markerEnd'], atEnd: boolean) => {
    if (marker === 'none') return null;
    const tip = atEnd ? edge.points[edge.points.length - 1] : edge.points[0];
    const from = arrivalFrom(edge.points, edge.curve, atEnd);
    const parts = markerPoints(marker, tip, from);
    if (!parts) return null;
    return <Polygon key={atEnd ? 'end' : 'start'} points={pointsAttr(parts.points)} fill={parts.filled ? color : theme.codeBackground} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />;
  };
  return (
    <G opacity={dimmed ? 0.5 : 1}>
      <Path d={pathData(edge.points, edge.curve)} fill="none" stroke={color} strokeWidth={width} strokeDasharray={edge.dashed ? '6 4' : undefined} strokeLinejoin="round" strokeLinecap="round" />
      {head(edge.markerStart, false)}
      {head(edge.markerEnd, true)}
      {edge.startText && (
        <SvgText x={edge.startText.x} y={edge.startText.y + 4} fontSize={12} fontFamily={Fonts.sans} fontWeight="700" fill={theme.primaryText} textAnchor="middle">
          {edge.startText.text}
        </SvgText>
      )}
      {edge.endText && (
        <SvgText x={edge.endText.x} y={edge.endText.y + 4} fontSize={12} fontFamily={Fonts.sans} fontWeight="700" fill={theme.primaryText} textAnchor="middle">
          {edge.endText.text}
        </SvgText>
      )}
    </G>
  );
}

function EdgeLabel({ edge, on, dimmed }: { edge: LayoutEdge; on: boolean; dimmed: boolean }) {
  const theme = useTheme();
  const label = edge.label;
  if (!label) return null;
  return (
    <G opacity={dimmed ? 0.5 : 1}>
      <Rect x={label.x - label.width / 2} y={label.y - label.height / 2} width={label.width} height={label.height} rx={6} fill={theme.codeBackground} stroke={on ? theme.primary : theme.codeBorder} strokeWidth={1} />
      {label.lines.map((line, i) => (
        <SvgText key={i} x={label.x} y={label.y - label.height / 2 + 13 + i * 15} fontSize={12} fontFamily={Fonts.sans} fontWeight={on ? '700' : '600'} fill={on ? theme.text : theme.textSecondary} textAnchor="middle">
          {line}
        </SvgText>
      ))}
    </G>
  );
}

function TapTarget({ node, selected, label, onPress }: { node: LayoutNode; selected: boolean; label: string; onPress: () => void }) {
  const extraW = Math.max(0, MinTouchSize - node.width) / 2;
  const extraH = Math.max(0, MinTouchSize - node.height) / 2;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{ position: 'absolute', left: Math.max(0, node.x - extraW), top: Math.max(0, node.y - extraH), width: node.width + extraW * 2, height: node.height + extraH * 2 }}
    />
  );
}

function MessageTarget({ edge, selected, label, onPress }: { edge: LayoutEdge; selected: boolean; label: string; onPress: () => void }) {
  const xs = edge.points.map((point) => point.x);
  const left = Math.min(...xs);
  const right = Math.max(...xs) + (edge.points.length > 2 ? 4 : 0);
  const arrowY = edge.points[0].y;
  const top = (edge.label ? edge.label.y - edge.label.height / 2 : arrowY - 22);
  const height = Math.max(MinTouchSize, arrowY - top + 8);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{ position: 'absolute', left: Math.max(0, left + 14), top: arrowY + 8 - height, width: Math.max(MinTouchSize, right - left - 28), height }}
    />
  );
}

const styles = StyleSheet.create({
  measure: { alignSelf: 'stretch', height: 1 },
  wrap: { alignSelf: 'stretch', gap: Spacing.two },
  panel: { alignSelf: 'stretch', alignItems: 'center', borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth, paddingTop: Spacing.two, paddingBottom: Spacing.two },
  toolRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  full: { flex: 1 },
  fullHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingBottom: Spacing.two },
  fullTitle: { flex: 1, gap: 2 },
  fullScroll: { flex: 1 },
  fullCanvas: { flexGrow: 1, justifyContent: 'center' },
  fullSummary: { marginTop: Spacing.three },
  zoomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.two },
  note: { padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous' },
  fade: { position: 'absolute', right: 0, top: 0, bottom: 24, width: 28, pointerEvents: 'none' },
  scrollHint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingTop: Spacing.one },
});
