import { StyleSheet, Text } from 'react-native';

import { Typography, type ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { highlight, type TokenKind } from '@/lib/highlight';

export const TOKEN_COLOR: Record<TokenKind, keyof ThemeColors> = {
  keyword: 'codeKeyword',
  string: 'codeString',
  number: 'codeNumber',
  comment: 'codeComment',
  function: 'codeFunction',
  punctuation: 'codePunctuation',
  plain: 'codeText',
};

/** The one font setup every code layer shares: identical metrics are what keep the editor's layers aligned. */
export const CODE_FONT_SCALE_CAP = 1.3;

export type CodeLineProps = {
  code: string;
  language: string;
};

/** One highlighted line (or run of text) of code, no wrapping. */
export function CodeLine({ code, language }: CodeLineProps) {
  const theme = useTheme();
  const tokens = highlight(code, language);
  return (
    <Text style={[styles.text, { color: theme.codeText }]} maxFontSizeMultiplier={CODE_FONT_SCALE_CAP}>
      {tokens.map((token, index) => (
        <Text key={index} style={{ color: theme[TOKEN_COLOR[token.kind]] }}>
          {token.text}
        </Text>
      ))}
      {code === '' ? ' ' : ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { ...Typography.code, includeFontPadding: false },
});
