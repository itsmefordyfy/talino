import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useViewport } from '@/hooks/use-viewport';

/** Enough pieces to read as a shower, few enough to stay light. */
const PIECES = 40;
const FALL_MS = 2600;
/** Pieces start over this spread, so they arrive as a shower rather than a wall. */
const STAGGER_MS = 900;

type Piece = { x: number; size: number; color: string; delay: number; drift: number; spin: number; round: boolean };

function makePieces(width: number, colors: string[]): Piece[] {
  return Array.from({ length: PIECES }, (_, index) => ({
    x: Math.random() * width,
    size: 6 + Math.random() * 6,
    color: colors[index % colors.length],
    delay: Math.random() * STAGGER_MS,
    drift: (Math.random() - 0.5) * 80,
    spin: (Math.random() - 0.5) * 720,
    round: index % 3 === 0,
  }));
}

export type ConfettiFallProps = {
  /** How far the pieces fall: the height of the area they're drawn over. */
  height: number;
};

/**
 * Confetti in Talino's palette falling once from the top of the screen (a finished course, a new badge), then gone. Doesn't take touches. Not drawn at all with Reduce Motion on.
 */
export function ConfettiFall({ height }: ConfettiFallProps) {
  const reduceMotion = useReducedMotion();
  const theme = useTheme();
  const { width } = useViewport();
  // Made once, so a re-render never reshuffles pieces mid-fall.
  const [pieces] = useState(() => makePieces(width, [theme.primary, Palette.violet, Palette.indigo, Palette.mint, Palette.amber]));
  if (reduceMotion) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {pieces.map((piece, index) => (
        <FallingPiece key={index} piece={piece} distance={height} />
      ))}
    </View>
  );
}

function FallingPiece({ piece, distance }: { piece: Piece; distance: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(piece.delay, withTiming(1, { duration: FALL_MS, easing: Easing.in(Easing.quad) }));
  }, [piece.delay, progress]);
  const style = useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0 : 1 - Math.max(0, progress.value - 0.85) / 0.15,
    transform: [{ translateY: -20 + progress.value * (distance + 40) }, { translateX: progress.value * piece.drift }, { rotate: `${progress.value * piece.spin}deg` }],
  }));
  return <Animated.View style={[styles.piece, { left: piece.x, width: piece.size, height: piece.round ? piece.size : piece.size * 0.5, borderRadius: piece.round ? piece.size / 2 : 1, backgroundColor: piece.color }, style]} />;
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
});
