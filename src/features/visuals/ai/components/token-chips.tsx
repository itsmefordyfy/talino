import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { visibleToken, type Token } from '../lib/tokenizer';

export type TokenChipsProps = {
  tokens: readonly Token[];
  /** Screen-reader description of one token. */
  describe: (token: Token) => string;
};

/** Tokens as small tiles: the piece (spaces shown as a dot) over its made-up id. Fallback characters get a dashed border, not just another color. */
export function TokenChips({ tokens, describe }: TokenChipsProps) {
  const theme = useTheme();
  const tones = useTones();
  const palette = [tones.violet, tones.indigo, tones.mint, tones.amber];
  return (
    <View style={styles.wrap}>
      {tokens.map((token, index) => {
        const tone = palette[index % palette.length];
        return (
          <View key={index} accessible accessibilityLabel={describe(token)} style={[styles.chip, { backgroundColor: tone.soft, borderColor: token.fallback ? theme.textSecondary : tone.solid, borderStyle: token.fallback ? 'dashed' : 'solid' }]}>
            <ThemedText type="code" style={{ color: tone.ink }}>
              {visibleToken(token.text)}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" tabular>
              {token.id}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one + 2 },
  chip: { alignItems: 'center', minWidth: 36, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
});
