import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { LessonBlocks } from '@/features/courses';
import { useTheme } from '@/hooks/use-theme';

import { markdownToBlocks } from '../lib/markdown';

export type MessageBubbleProps = { role: 'user' | 'assistant'; text: string };

/** The learner's message on the right in indigo; Tali's on the left, drawn like a lesson card. */
export function MessageBubble({ role, text }: MessageBubbleProps) {
  const theme = useTheme();
  if (role === 'user') {
    return (
      <View style={[styles.user, { backgroundColor: theme.primary }]}>
        <ThemedText type="body" style={{ color: theme.onPrimary }} selectable>
          {text}
        </ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.assistantRow}>
      <Tali size={44} mood="happy" />
      <View style={[styles.assistant, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <LessonBlocks blocks={markdownToBlocks(text)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  user: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderBottomRightRadius: Radius.small,
    borderCurve: 'continuous',
  },
  assistantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  assistant: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
