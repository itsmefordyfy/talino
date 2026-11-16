import { StyleSheet, Text } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { nameText } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { parseInlineText } from '../lib/text';

export type RichTextProps = Omit<ThemedTextProps, 'children'> & { text: string };

/** A sentence with `**bold**` and `` `inline code` `` drawn as such. */
export function RichText({ text, ...rest }: RichTextProps) {
  const theme = useTheme();
  const companion = useAppSelector(selectCompanion);
  return (
    <ThemedText {...rest}>
      {parseInlineText(nameText(text, companion)).map((part, index) =>
        part.code ? (
          <Text key={index} style={[styles.code, { backgroundColor: theme.codeBackground, color: theme.codeText }]}>
            {part.text}
          </Text>
        ) : part.bold ? (
          <Text key={index} style={styles.bold}>
            {part.text}
          </Text>
        ) : (
          part.text
        ),
      )}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  code: { fontFamily: Fonts.mono, fontSize: 13.5, fontWeight: 500 },
  bold: { fontWeight: 700 },
});
