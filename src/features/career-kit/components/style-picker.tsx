import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { KitStyle } from '../content';
import { KitPreview } from './kit-preview';

export type StylePickerProps = {
  styles: readonly KitStyle[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** The looks of a template as small drawn pages to choose from; the chosen one is outlined and named in the primary colour. */
export function StylePicker({ styles: looks, selectedId, onSelect }: StylePickerProps) {
  const theme = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={rows.row} accessibilityRole="radiogroup">
      {looks.map((look) => {
        const selected = look.id === selectedId;
        return (
          <Pressable
            key={look.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={look.name}
            onPress={() => {
              tapFeedback();
              onSelect(look.id);
            }}
            style={({ pressed }) => [rows.item, pressed && rows.pressed]}>
            <View style={[rows.thumb, { backgroundColor: theme.backgroundSelected, borderColor: selected ? theme.primary : 'transparent' }]}>
              <KitPreview layout={look.layout} accent={look.accent} compact />
            </View>
            <ThemedText type={selected ? 'secondarySemiBold' : 'secondary'} themeColor={selected ? 'primaryText' : 'textSecondary'} numberOfLines={1} style={rows.name}>
              {look.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const rows = StyleSheet.create({
  row: { gap: Spacing.three },
  item: { width: 120, gap: Spacing.two },
  pressed: { opacity: 0.8 },
  thumb: { padding: Spacing.two, borderRadius: Radius.large, borderCurve: 'continuous', borderWidth: 2 },
  name: { textAlign: 'center' },
});
