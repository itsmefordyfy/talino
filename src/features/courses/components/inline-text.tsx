import { StyleSheet, Text } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { nameText } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';
import { Fonts } from '@/constants/theme';
import { breakLigatures } from '@/lib/highlight';
import { useTheme } from '@/hooks/use-theme';

import { parseInline, type InlinePart } from '../lib/plain-text';

export type InlineTextProps = Omit<ThemedTextProps, 'children'> & { text: string };

/** Lesson text with **bold**, *emphasis* and `inline code` drawn as such (never with their marks). */
export function InlineText({ text, ...rest }: InlineTextProps) {
  const companion = useAppSelector(selectCompanion);
  return (
    <ThemedText {...rest}>
      <InlineParts parts={parseInline(nameText(text, companion))} />
    </ThemedText>
  );
}

/** Inline parts as nested text: plain runs, **bold**, *emphasis* and `code`. Used inside a Text (the sentence highlight draws these too). */
export function InlineParts({ parts }: { parts: readonly InlinePart[] }) {
  const theme = useTheme();
  return (
    <>
      {parts.map((part, index) =>
        part.code ? (
          <Text key={index} style={[styles.code, part.bold && styles.bold, { backgroundColor: theme.codeBackground, color: theme.codeText }]}>
            {breakLigatures(part.text)}
          </Text>
        ) : part.bold || part.italic ? (
          <Text key={index} style={[part.bold && styles.bold, part.italic && styles.italic]}>
            {part.text}
          </Text>
        ) : (
          part.text
        ),
      )}
    </>
  );
}

const styles = StyleSheet.create({
  code: {
    fontFamily: Fonts.mono,
    fontSize: 13.5,
    fontWeight: 500,
  },
  bold: {
    fontWeight: 700,
  },
  italic: {
    fontStyle: 'italic',
  },
});
