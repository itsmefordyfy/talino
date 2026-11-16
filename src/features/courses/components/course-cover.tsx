import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { Tali } from '@/components/brand/tali';
import { CoverInk, CoverPalettes, Radius, Spacing } from '@/constants/theme';

import { coverFor } from '../lib/covers';
import { CoverSceneArt, SCENE_BOX } from './cover-scenes';

/** Every pose is a square whose drawing stops this far above its bottom edge (12 of 310 px). */
const POSE_BOTTOM_GAP = 12 / 310;

export type CourseCoverProps = {
  course: { id: string; kind: string };
  height: number;
  /** Which corners are rounded: the top two on a card, none inside the course page's hero. */
  corners?: 'top' | 'none';
  /** Leave the gradient off when the cover sits on a gradient of its own (the course page's hero). */
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A course's cover art (owner's request 2026-11-14): its gradient, a scene of what the course is about,
 * and Tali in the pose that fits, standing on the bottom edge. Decorative: screen readers skip it, since
 * the card or page around it names the course.
 */
export function CourseCover({ course, height, corners = 'top', transparent = false, style }: CourseCoverProps) {
  const art = coverFor(course);
  const sceneHeight = Math.round(height * 0.8);
  const sceneWidth = Math.round((sceneHeight * SCENE_BOX.width) / SCENE_BOX.height);
  const poseSize = Math.round(height * 1.16);
  const content = (
    <>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="cover-dots" width={16} height={16} patternUnits="userSpaceOnUse">
            <Circle cx={2} cy={2} r={1.3} fill={CoverInk.dot} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#cover-dots)" />
        <Circle cx="86%" cy="42%" r={height * 0.58} fill={CoverInk.glow} />
      </Svg>
      <View style={[styles.scene, { top: Math.round((height - sceneHeight) / 2) }]}>
        <CoverSceneArt scene={art.scene} width={sceneWidth} height={sceneHeight} />
      </View>
      <View style={[styles.pose, { bottom: -Math.round(poseSize * POSE_BOTTOM_GAP) }]}>
        <Tali size={poseSize} mood={art.pose} />
      </View>
    </>
  );
  const shape = [styles.cover, { height }, corners === 'top' && styles.topCorners, style];
  if (transparent) {
    return (
      <View style={shape} accessible={false} importantForAccessibility="no-hide-descendants">
        {content}
      </View>
    );
  }
  return (
    <LinearGradient colors={CoverPalettes[art.palette]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={shape} accessible={false} importantForAccessibility="no-hide-descendants">
      {content}
    </LinearGradient>
  );
}

/** The cover's gradient, for a surface that continues it (the course page's hero under its cover). */
export function coverColors(course: { id: string; kind: string }) {
  return CoverPalettes[coverFor(course).palette];
}

const styles = StyleSheet.create({
  cover: {
    overflow: 'hidden',
  },
  topCorners: {
    // One hairline inside the card's own corner, so the card's border shows around the cover.
    borderTopLeftRadius: Radius.card - 1,
    borderTopRightRadius: Radius.card - 1,
    borderCurve: 'continuous',
  },
  scene: {
    position: 'absolute',
    left: Spacing.three,
  },
  pose: {
    position: 'absolute',
    right: -Spacing.one,
  },
});
