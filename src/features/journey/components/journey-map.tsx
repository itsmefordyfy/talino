import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { layoutJourney, type LayoutItem } from '../lib/layout';
import { neuralMesh } from '../lib/neural';
import { tilesFor, type TileWindow } from '../lib/tiles';
import type { TaliLine } from '../lib/tali-lines';
import type { JourneyDefinition, JourneyState, MilestoneState } from '../lib/types';
import { CertificatePromo } from './certificate-promo';
import { DestinationCard } from './destination-card';
import { MilestoneNode } from './milestone-node';
import { NeuralLayer } from './neural-layer';
import { StageBanner, type StageTense } from './stage-banner';
import { TaliGuide } from './tali-guide';

export type JourneyMapProps = {
  definition: JourneyDefinition;
  state: JourneyState;
  /** Finished stages fold away to their banner; these are the ones the learner opened again. */
  opened: ReadonlySet<string>;
  onToggleStage: (stageId: string) => void;
  onOpenMilestone: (milestone: MilestoneState) => void;
  guide: TaliLine;
  coachName: string;
  onAskTali: () => void;
  /** Told where the current node's row sits (from the top of the map), so the screen can scroll to it. */
  onCurrentY: (y: number | null) => void;
  onWidth?: (width: number) => void;
  /** False while Home is out of sight: the signal on the current synapse stops. */
  active: boolean;
  /** Which tiles of the neural layer are near the screen; the screen feeds it its scroll position. */
  tileWindow: TileWindow;
  /** Changes when the learner's place changes, so the signal runs again. */
  signalKey: string;
};

/**
 * The journey as a neural network: a banner for each level, the milestones as neurons swinging left and right and wired by synapses, Tali above the learner's
 * current step, and the destination at the end. Everything is positioned from `layoutJourney` (pure and tested), so the road behind
 * the nodes always meets their centres.
 */
export function JourneyMap({ definition, state, opened, onToggleStage, onOpenMilestone, guide, coachName, onAskTali, onCurrentY, onWidth, active, tileWindow, signalKey }: JourneyMapProps) {
  const [width, setWidth] = useState(0);
  // Finished levels, and levels before the learner's starting level that they haven't touched, fold to their banner.
  const skippedLevel = (stage: JourneyState['stages'][number]) => !stage.complete && stage.index < state.start.index && stage.milestones.every((milestone) => milestone.status === 'skipped' || milestone.status === 'soon');
  const folds = (stage: JourneyState['stages'][number]) => stage.complete || skippedLevel(stage);
  const currentIndex = state.current?.index ?? null;
  const layout = layoutJourney(
    state.stages.map((stage) => ({ milestoneCount: stage.milestones.length, collapsed: folds(stage) && !opened.has(stage.id) })),
    width,
    currentIndex,
  );
  const currentItem = layout.items.find((item): item is Extract<LayoutItem, { kind: 'node' }> => item.kind === 'node' && item.milestoneIndex === currentIndex);
  const currentY = currentItem ? currentItem.y : null;
  // The background field keeps clear of the milestones so the real neurons stand out.
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
            <NeuralLayer layout={layout} milestones={state.milestones} mesh={mesh} bleed={Spacing.three} window={tileWindow} active={active} signalKey={signalKey} />
            {layout.items.map((item) => {
              if (item.kind === 'stage') {
                const stage = state.stages[item.stageIndex]!;
                const tense: StageTense = stage.complete ? 'done' : skippedLevel(stage) ? 'skipped' : state.currentStage?.id === stage.id ? 'current' : 'ahead';
                const folded = folds(stage) && !opened.has(stage.id);
                return (
                  <View key={`stage-${stage.id}`} style={[styles.row, { top: item.y, height: item.height }]}>
                    <StageBanner
                      stage={stage}
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
              const milestone = state.milestones[item.milestoneIndex]!;
              return (
                <View key={milestone.id}>
                  {item.guideHeight > 0 && <TaliGuide line={guide} coachName={coachName} top={item.y + 4} onAsk={onAskTali} />}
                  <MilestoneNode milestone={milestone} x={item.x} top={item.y + item.guideHeight} onPress={onOpenMilestone} />
                </View>
              );
            })}
          </>
        )}
      </View>
      {/* The destination is part of the page, not drawn on the map: its text can be any length and the road runs down into it. */}
      {width > 0 && <DestinationCard destination={definition.destination} reached={state.complete} />}
      {/* The AI Expert certificate: Talino's highest, for finishing every level. */}
      {width > 0 && (
        <View style={styles.certificate}>
          <CertificatePromo state={state} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  certificate: {
    marginTop: Spacing.four,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

