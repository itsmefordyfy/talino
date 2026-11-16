import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { TypingDots } from '@/components/ui/typing-dots';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThinkingBubbleProps = { label: string };

/** While Tali (or Tala) is answering: the coach's face and a reply bubble holding three moving dots, the same shape the answer will take. */
export function ThinkingBubble({ label }: ThinkingBubbleProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Tali size={44} mood="thinking" />
      <View style={[styles.bubble, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <TypingDots label={label} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  bubble: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
