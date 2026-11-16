import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { IconTileSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { BOARD_LOGOS } from '../logos';

export type BoardLogoProps = {
  boardId: string;
  size?: number;
};

/** A job board's own mark on a white rounded tile with a hairline edge (decorative: the card's title already names the board). */
export function BoardLogo({ boardId, size = IconTileSize }: BoardLogoProps) {
  const theme = useTheme();
  return (
    <View style={[styles.tile, { width: size, height: size, borderColor: theme.border }]}>
      <Image source={BOARD_LOGOS[boardId]} style={styles.image} contentFit="cover" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    // A fixed white, like the logos themselves: a brand mark is drawn for white, in light and dark.
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
