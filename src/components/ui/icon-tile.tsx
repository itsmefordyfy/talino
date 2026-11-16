import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { FeatureTones, IconSize, IconTileSize, type Feature, type Tone } from '@/constants/theme';
import { useTones } from '@/hooks/use-tones';

import { Icon, type IconName } from './icon';

/** Any icon, the drawn baby bottle included (`Icon` draws it). */
export type TileIconName = IconName;

export type IconTileProps = {
  icon: TileIconName;
  /** The feature it stands for: its accent from `FeatureTones` (feeding peach, sleep lavender…). */
  feature?: Feature;
  /** Or a tone directly. */
  tone?: Tone;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * A feature's icon on its soft circle, in its ink: the one way an activity shows its color, so
 * feeding reads peach and sleep lavender in every list, card and chart legend.
 */
export function IconTile({ icon, feature, tone, size = IconTileSize, style }: IconTileProps) {
  const tones = useTones();
  const colors = tones[tone ?? (feature ? FeatureTones[feature] : 'indigo')];
  const glyph = size >= IconTileSize + 8 ? IconSize.tile : size >= IconTileSize ? IconSize.large : IconSize.medium;
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.soft }, style]}>
      <Icon name={icon} size={glyph} tint={colors.ink} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
