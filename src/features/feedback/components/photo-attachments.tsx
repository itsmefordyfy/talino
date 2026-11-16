import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DashedButton } from '@/components/ui/dashed-button';
import { Icon } from '@/components/ui/icon';
import { HeroInk, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { feedbackStrings } from '../strings';

export type PhotoAttachmentsProps = {
  uris: readonly string[];
  /** The most photos allowed; Add is replaced by a note once it is reached. */
  max: number;
  onAdd: () => void;
  onRemove: (uri: string) => void;
};

const THUMB = 76;

/** Photos going out with the feedback: a row of thumbnails, each removable, and a button to add more. */
export function PhotoAttachments({ uris, max, onAdd, onRemove }: PhotoAttachmentsProps) {
  const f = useLocalized(feedbackStrings);
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {uris.length > 0 && (
        <View style={styles.grid}>
          {uris.map((uri, index) => (
            <View key={uri} style={[styles.thumb, { backgroundColor: theme.backgroundSelected }]}>
              <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel={f.photoLabel(index + 1)} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={f.removePhoto(index + 1)}
                // The visible mark is small; the slop keeps the tap target at 44 pt.
                hitSlop={12}
                onPress={() => onRemove(uri)}
                style={[styles.remove, { backgroundColor: theme.overlay }]}>
                <Icon name="close" size={11} tint={HeroInk.text} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {uris.length < max ? (
        <DashedButton title={uris.length === 0 ? f.addPhotos : f.addMorePhotos(uris.length, max)} icon="add_photo_alternate" onPress={onAdd} />
      ) : (
        <ThemedText type="caption" themeColor="textTertiary">
          {f.maxPhotos(max)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  thumb: { width: THUMB, height: THUMB, borderRadius: Radius.small, borderCurve: 'continuous', overflow: 'hidden' },
  remove: { position: 'absolute', top: Spacing.one, right: Spacing.one, width: 22, height: 22, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
});
