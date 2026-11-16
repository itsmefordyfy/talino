import { Image } from 'expo-image';
import { StyleSheet, type StyleProp, type ImageStyle } from 'react-native';

export type AppLogoProps = {
  size?: number;
  /** A thin ring, for a logo placed on the brand gradient (it is the same colours). */
  ringColor?: string;
  style?: StyleProp<ImageStyle>;
};

/** iOS's icon corner, as a share of its side. */
const CORNER = 0.2237;

/** The Talino app icon, drawn as an app icon (rounded square), for places that show the app itself rather than the coach. */
export function AppLogo({ size = 64, ringColor, style }: AppLogoProps) {
  return (
    <Image
      source={require('@/assets/images/icon.png')}
      accessible={false}
      contentFit="cover"
      style={[{ width: size, height: size, borderRadius: size * CORNER }, ringColor ? { borderWidth: StyleSheet.hairlineWidth * 3, borderColor: ringColor } : null, styles.logo, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    borderCurve: 'continuous',
  },
});
