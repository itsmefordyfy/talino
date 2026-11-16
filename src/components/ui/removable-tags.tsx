import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon } from './icon';

export type RemovableTag = {
  label: string;
  /** False for a tag that can't be taken away here (one that comes from somewhere else): no cross is drawn. */
  removable?: boolean;
};

export type RemovableTagsProps = {
  tags: readonly RemovableTag[];
  onRemove: (label: string) => void;
  /** Read aloud for a tag's cross ("Remove React"). */
  removeLabel: (label: string) => string;
};

/** A wrapped row of tags (skills, tools) with a cross on each one that can be removed. Content, so solid tonal chips. */
export function RemovableTags({ tags, onRemove, removeLabel }: RemovableTagsProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {tags.map((tag) => {
        const removable = tag.removable !== false;
        const chip = (
          <View style={[styles.chip, { backgroundColor: theme.primarySoft, borderColor: theme.border }, removable && styles.withCross]}>
            <ThemedText type="secondary" themeColor="primaryText" style={styles.label} numberOfLines={1}>
              {tag.label}
            </ThemedText>
            {removable && <Icon name="close" size={16} color="primary" />}
          </View>
        );
        return removable ? (
          <Pressable key={tag.label} accessibilityRole="button" accessibilityLabel={removeLabel(tag.label)} hitSlop={Spacing.one} onPress={() => onRemove(tag.label)}>
            {chip}
          </Pressable>
        ) : (
          <View key={tag.label} accessibilityLabel={tag.label}>
            {chip}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    minHeight: MinTouchSize - Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    maxWidth: '100%',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three - Spacing.one,
    paddingVertical: Spacing.one,
  },
  withCross: {
    paddingRight: Spacing.two,
  },
  label: {
    flexShrink: 1,
    fontWeight: '600',
  },
});
