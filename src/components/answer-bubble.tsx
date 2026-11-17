import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AnswerBubbleProps = { text: string };

/** The learner's own message on the right in the brand colour (the mock interview and the practice role-plays). */
export function AnswerBubble({ text }: AnswerBubbleProps) {
  const theme = useTheme();
  return (
    <View style={[styles.answer, { backgroundColor: theme.primary }]}>
      <ThemedText type="body" style={{ color: theme.onPrimary }} selectable>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  answer: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderBottomRightRadius: Radius.small,
    borderCurve: 'continuous',
  },
});
