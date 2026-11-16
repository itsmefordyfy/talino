import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ProfileAvatarProps = {
  /** The learner's name, for the initials shown while there is no picture. */
  name: string;
  /** The picture as base64 JPEG text, or null for the initials. */
  photo: string | null;
  size?: number;
};

/** The learner's round profile picture, or their initials on the brand's soft violet when they haven't added one. Decorative: the name is read beside it. */
export function ProfileAvatar({ name, photo, size = 52 }: ProfileAvatarProps) {
  const theme = useTheme();
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('') || '·';
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: theme.primarySoft }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {photo ? (
        <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} contentFit="cover" />
      ) : (
        <ThemedText type={size >= 80 ? 'title' : 'section'} themeColor="primaryText">
          {initials}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
