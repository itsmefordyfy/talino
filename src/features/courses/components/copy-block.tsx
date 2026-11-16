import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { copyText } from '@/lib/clipboard';

import { courseStrings } from '../strings';

export type CopyBlockProps = {
  kind: 'code' | 'prompt';
  text: string;
  label: string;
  /** The code's language, for syntax colors. */
  language?: string;
};

/** A code sample (the shared `CodeBlock`: JetBrains Mono, syntax colors, Copy) or an AI prompt to copy into another tool. */
export function CopyBlock({ kind, text, label, language }: CopyBlockProps) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  const prompt = kind === 'prompt';
  if (!prompt) return <CodeBlock code={text} language={language} label={label} />;
  return (
    <View style={[styles.block, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
      <View style={styles.header}>
        <Icon name="auto_awesome" size={16} color="primaryText" />
        <ThemedText type="caption" themeColor="primaryText" style={styles.label} numberOfLines={1}>
          {label}
        </ThemedText>
        <Button title={copied ? strings.copied : strings.copy} icon={copied ? 'check' : 'content_copy'} size="small" variant="ghost" onPress={copy} accessibilityLabel={`${strings.copy}: ${label}`} />
      </View>
      <ThemedText type="body" selectable>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
