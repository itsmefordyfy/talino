import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { COMPANION_IDS, COMPANIONS, type CompanionId } from '@/features/companion/lib/companions';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type InterviewerPickerProps = { value: CompanionId; onChange: (value: CompanionId) => void; label: string };

/** Tali or Tala as this interview's interviewer: two solid cards with the coach's face (a content choice, so solid, not glass). */
export function InterviewerPicker({ value, onChange, label }: InterviewerPickerProps) {
  const theme = useTheme();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {COMPANION_IDS.map((id) => {
        const selected = id === value;
        return (
          <Pressable
            key={id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={COMPANIONS[id].name}
            onPress={() => {
              tapFeedback();
              onChange(id);
            }}
            style={[styles.card, { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border, borderWidth: selected ? 2 : StyleSheet.hairlineWidth }]}>
            <Tali size={72} mood="explaining" companion={id} />
            <View style={styles.name}>
              <ThemedText type="bodySemiBold">{COMPANIONS[id].name}</ThemedText>
              {selected && <Icon name="check_circle" size={18} color="primary" />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  card: {
    flex: 1,
    minHeight: MinTouchSize,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
