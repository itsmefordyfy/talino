import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { copyText } from '@/lib/clipboard';
import { breakLigatures, highlight, languageKey, type TokenKind } from '@/lib/highlight';

export type CodeBlockProps = {
  code: string;
  /** The code fence's label ("typescript", "python", "bash"…); unknown or missing means plain text. */
  language?: string | null;
  /** Shown top left; defaults to the language name. */
  label?: string;
  /** False for code the reader is only meant to read (a quiz question): no Copy button. */
  copyable?: boolean;
};

const COLOR_OF: Record<TokenKind, keyof ThemeColors> = {
  keyword: 'codeKeyword',
  string: 'codeString',
  number: 'codeNumber',
  comment: 'codeComment',
  function: 'codeFunction',
  punctuation: 'codePunctuation',
  plain: 'codeText',
};

/**
 * A code sample in JetBrains Mono on a quiet slate panel (its own colors in light and dark), with
 * syntax colors where the language is known and a Copy action. Long lines scroll sideways, so code is
 * never wrapped into something that no longer runs.
 */
export function CodeBlock({ code, language, label, copyable = true }: CodeBlockProps) {
  const theme = useTheme();
  const { common } = useStrings();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    }
  };

  const tokens = highlight(code, language);
  const name = label ?? (languageKey(language) ? (language as string) : (language ?? ''));

  return (
    <View style={[styles.block, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>
      <View style={styles.header}>
        <ThemedText type="caption" style={[styles.label, { color: theme.codeComment }]} numberOfLines={1}>
          {name}
        </ThemedText>
        {copyable && <Button title={copied ? common.copied : common.copy} icon={copied ? 'check' : 'content_copy'} size="small" variant="ghost" onPress={copy} accessibilityLabel={`${common.copy}: ${name || 'code'}`} />}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ThemedText type="code" selectable style={{ color: theme.codeText }}>
          {tokens.map((token, index) => (
            <ThemedText key={index} type="code" style={{ color: theme[COLOR_OF[token.kind]] }}>
              {breakLigatures(token.text)}
            </ThemedText>
          ))}
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 36,
  },
  label: {
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scroll: {
    paddingRight: Spacing.three,
  },
});
