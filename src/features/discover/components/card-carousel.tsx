import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useViewport } from '@/hooks/use-viewport';

/** A tile's width: most of a phone's width so the next card peeks in, capped on a wide window. */
export function useTileWidth(): number {
  const { width } = useViewport();
  return Math.round(Math.min(300, Math.max(240, width * 0.72)));
}

export type CardCarouselProps = {
  children: ReactNode;
  /** The width of one tile, so the list snaps card by card. */
  tileWidth: number;
  /** What the list is, for screen readers. */
  accessibilityLabel?: string;
  /** Space the list bleeds past its container on each side (so tiles scroll to the container's edge, not stop at its padding). */
  bleed?: number;
};

/** The widest a lone card grows, so it doesn't stretch across a tablet or the open Duo. */
const SINGLE_TILE_MAX_WIDTH = 520;

/** A sideways list of tiles, one card per swipe. It bleeds to the edges of its container so the next tile peeks in. A lone tile has nothing to peek or scroll, so it fills the width instead of leaving dead space on the right. */
export function CardCarousel({ children, tileWidth, accessibilityLabel, bleed = 0 }: CardCarouselProps) {
  const tiles = Children.toArray(children);
  const only = tiles.length === 1 ? tiles[0] : null;
  if (isValidElement(only)) {
    // The tile's own fixed width (`style={{ width }}`) is replaced by the full width.
    const tile = only as ReactElement<{ style?: StyleProp<ViewStyle> }>;
    return (
      <View accessibilityLabel={accessibilityLabel} style={styles.single}>
        {cloneElement(tile, { style: styles.singleTile })}
      </View>
    );
  }
  return (
    <ScrollView
      horizontal
      accessibilityLabel={accessibilityLabel}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={tileWidth + Spacing.three}
      snapToAlignment="start"
      style={bleed > 0 ? { marginHorizontal: -bleed } : undefined}
      contentContainerStyle={[styles.row, { paddingHorizontal: bleed }]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  single: {
    paddingBottom: Spacing.two,
  },
  singleTile: {
    alignSelf: 'stretch',
    maxWidth: SINGLE_TILE_MAX_WIDTH,
  },
  row: {
    gap: Spacing.three,
    // The cards' shadow sits below them: room so it is not cut off by the list's edge.
    paddingBottom: Spacing.two,
  },
});
