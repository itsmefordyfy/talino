import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import type { CoursePath, PathNode } from '../lib/course-path';
import { layoutJourney, type LayoutItem } from '../lib/layout';
import { neuralMesh } from '../lib/neural';
import { LEVEL_TONE } from '../lib/level-tones';
import { levelZones } from '../lib/zones';
import { tilesFor, type TileWindow } from '../lib/tiles';
import type { TaliLine } from '../lib/tali-lines';
import type { JourneyDefinition, JourneyState } from '../lib/types';
import { CertificatePromo } from './certificate-promo';
import { DestinationCard } from './destination-card';
import { CourseNode } from './course-node';
import { NeuralLayer } from './neural-layer';
import { StageBanner, type StageTense } from './stage-banner';
import { TaliGuide } from './tali-guide';

export type JourneyMapProps = {
  definition: JourneyDefinition;
  state: JourneyState;
  /** The journey as courses: the nodes the map draws. */
  path: CoursePath;
  /** Finished stages fold away to their banner; these are the ones the learner opened again. */
  opened: ReadonlySet<string>;
  onToggleStage: (stageId: string) => void;
  /** A course was tapped: its lessons open on Home. */
  onOpenCourse: (node: PathNode) => void;
  guide: TaliLine;
  coachName: string;
  onAskTali: () => void;
  /** Told where the current node's row sits (from the top of the map), so the screen can scroll to it. */
  onCurrentY: (y: number | null) => void;
  onWidth?: (width: number) => void;
  /** Which tiles of the neural layer are near the screen; the screen feeds it its scroll position. */
  tileWindow: TileWindow;
};

/**
 * The journey as a neural network: a banner for each level, the courses as neurons swinging left and right and wired by synapses, Tali above the learner's
 * current step, and the destination at the end. Everything is positioned from `layoutJourney` (pure and tested), so the road behind
 * the nodes always meets their centres.
 */
export function JourneyMap({ definition, state, path, opened, onToggleStage, onOpenCourse, guide, coachName, onAskTali, onCurrentY, onWidth, tileWindow }: JourneyMapProps) {
  const [width, setWidth] = useState(0);
  // Finished levels, and levels before the learner's starting level that they haven't touched, fold to their banner.
  const nodesOf = (stageIndex: number) => path.nodes.filter((node) => node.stageIndex === stageIndex);
  const skippedLevel = (stage: JourneyState['stages'][number]) => !stage.complete && stage.index < state.start.index && nodesOf(stage.index).every((node) => node.status === 'skipped');
  const folds = (stage: JourneyState['stages'][number]) => stage.complete || skippedLevel(stage);
  const currentIndex = path.current?.index ?? null;
  const layout = layoutJourney(
    state.stages.map((stage) => ({ nodeCount: nodesOf(stage.index).length, collapsed: folds(stage) && !opened.has(stage.id) })),
    width,
    currentIndex,
  );
  const currentItem = layout.items.find((item): item is Extract<LayoutItem, { kind: 'node' }> => item.kind === 'node' && item.nodeIndex === currentIndex);
  const currentY = currentItem ? currentItem.y : null;
  // The background field keeps clear of the milestones so the real neurons stand out.
  const zones = levelZones(layout, state.stages.map((stage) => stage.def.level));
  const mesh = neuralMesh(width, layout.height, { avoid: layout.points.map((point) => ({ x: point.x, y: point.y, radius: 62 })) });
  useEffect(() => {
    onCurrentY(currentY);
  }, [currentY, onCurrentY]);
  const tileCount = tilesFor(layout.height).length;
  useEffect(() => {
    tileWindow.setCount(tileCount);
  }, [tileWindow, tileCount]);

  return (
    <View>
      <View
        style={{ height: width > 0 ? layout.height : 0 }}
        onLayout={(event) => {
          const next = Math.floor(event.nativeEvent.layout.width);
          if (next !== width) {
            setWidth(next);
            onWidth?.(next);
          }
        }}>
        {width > 0 && (
          <>
            <NeuralLayer layout={layout} nodes={path.nodes} links={path.links} mesh={mesh} zones={zones} bleed={Spacing.three} window={tileWindow} />
            {layout.items.map((item) => {
              if (item.kind === 'stage') {
                const stage = state.stages[item.stageIndex]!;
                const tense: StageTense = stage.complete ? 'done' : skippedLevel(stage) ? 'skipped' : state.currentStage?.id === stage.id ? 'current' : 'ahead';
                const folded = folds(stage) && !opened.has(stage.id);
                return (
                  <View key={`stage-${stage.id}`} style={[styles.row, { top: item.y, height: item.height }]}>
                    <StageBanner
                      stage={stage}
                      progress={path.stages[stage.index]!}
                      stageCount={state.stages.length}
                      tense={tense}
                      isStart={stage.index === state.start.index && state.start.reason !== 'default'}
                      open={!folded}
                      onToggle={folds(stage) ? () => onToggleStage(stage.id) : null}
                      top={0}
                      height={item.height}
                    />
                  </View>
                );
              }
              const node = path.nodes[item.nodeIndex]!;
              return (
                <View key={node.key}>
                  {item.guideHeight > 0 && <TaliGuide line={guide} coachName={coachName} top={item.y + 4} onAsk={onAskTali} />}
                  <CourseNode node={node} tone={LEVEL_TONE[state.stages[node.stageIndex]!.def.level].tone} x={item.x} top={item.y + item.guideHeight} onOpen={onOpenCourse} />
                </View>
              );
            })}
          </>
        )}
      </View>
      {/* The AI Expert certificate: Talino's highest, for finishing every level. It comes first (owner, 2026-11-18), so the road runs down into it. */}
      {width > 0 && (
        <View>
          <CertificatePromo state={state} />
        </View>
      )}
      {/* The destination is part of the page, not drawn on the map: its text can be any length. It closes the page, below the certificate. */}
      {width > 0 && (
        <View style={styles.destination}>
          <DestinationCard destination={definition.destination} reached={state.complete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  destination: {
    marginTop: Spacing.four,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

