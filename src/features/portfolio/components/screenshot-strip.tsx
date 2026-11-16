import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { MAX_PROJECT_IMAGES } from '../lib/projects';

export type ScreenshotStripProps = {
  /** Base64 JPEGs, the first is the cover. */
  images: readonly string[];
  onAdd: () => void;
  onOpen: (index: number) => void;
  busy?: boolean;
  labels: { add: string; adding: string; cover: string; shot: (n: number) => string };
};

/**
 * The project's screenshots as 16:10 thumbnails (the shape the public page uses), and one full-width button to add more,
 * with no card behind them: the picture row and the button sit straight on the page.
 */
export function ScreenshotStrip({ images, onAdd, onOpen, busy = false, labels }: ScreenshotStripProps) {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {images.map((image, index) => (
            <Pressable key={`${index}-${image.slice(-24)}`} accessibilityRole="button" accessibilityLabel={labels.shot(index + 1)} onPress={() => onOpen(index)} style={[styles.thumb, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
              <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} contentFit="cover" contentPosition="top" accessibilityIgnoresInvertColors />
              {index === 0 && (
                <View style={styles.cover}>
                  <ThemedText type="caption" style={styles.coverText}>
                    {labels.cover}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
      {images.length < MAX_PROJECT_IMAGES && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={labels.add}
          disabled={busy}
          onPress={() => {
            tapFeedback();
            onAdd();
          }}
          style={[styles.add, { borderColor: theme.primary, backgroundColor: theme.primarySoft, opacity: busy ? 0.6 : 1 }]}>
          <Icon name="add_photo_alternate" size={24} color="primary" />
          <ThemedText type="bodySemiBold" themeColor="primaryText">
            {busy ? labels.adding : labels.add}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.two,
  },
  thumb: {
    width: 176,
    aspectRatio: 16 / 10,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  cover: {
    position: 'absolute',
    left: Spacing.two,
    top: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  coverText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  add: {
    minHeight: MinTouchSize + Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
  },
});
