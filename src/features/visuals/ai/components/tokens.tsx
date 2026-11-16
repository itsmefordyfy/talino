import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { MAX_INPUT_CHARS, tokenize } from '../lib/tokenizer';
import { aiStrings, type AiStrings } from '../strings';
import { TokenChips } from './token-chips';

type ExampleKey = keyof AiStrings['tokens']['examples'];

/** A toy tokenizer the learner types into. Clearly an illustration: the vocabulary is tiny and made up. */
export function TokensVisual({ compact }: VisualProps) {
  const s = useLocalized(aiStrings).tokens;
  const [text, setText] = useState<string>(s.examples.unbelievable);
  const tokens = tokenize(text);
  const chars = Array.from(text).length;
  const examples = Object.keys(s.examples) as ExampleKey[];

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={tokens.length > 0 ? s.caption(tokens.length) : s.captionEmpty}
      controls={
        <View style={styles.stack}>
          <TextField label={s.fieldLabel} placeholder={s.placeholder} value={text} onChangeText={setText} maxLength={MAX_INPUT_CHARS} autoCorrect={false} autoCapitalize="none" />
          <ChipSelect wrap value={examples.find((key) => s.examples[key] === text) ?? null} onChange={(key) => setText(s.examples[key])} options={examples.map((key) => ({ value: key, label: s.examples[key] }))} />
        </View>
      }>
      <View style={styles.stack}>
        {tokens.length > 0 ? (
          <>
            <ThemedText type="secondarySemiBold" tabular>
              {s.stats(chars, tokens.length)}
            </ThemedText>
            <TokenChips tokens={tokens} describe={(token) => s.tokenLabel(token.text, token.id)} />
            <ThemedText type="caption" themeColor="textSecondary">
              {tokens.some((token) => token.text.includes(' ')) ? `${s.spaceNote} ` : ''}
              {tokens.some((token) => token.fallback) ? s.legendFallback : ''}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="secondary" themeColor="textSecondary">
            {s.empty}
          </ThemedText>
        )}
        <ThemedText type="caption" themeColor="textSecondary">
          {s.note}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
});
