import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { discoverStrings } from '../strings';

/** The AI-Assisted Development path's two helpers: the placement check ("Where should I start?") and the AI tools guide. */
export function AiPathCard() {
  const strings = useLocalized(discoverStrings);
  return (
    <Card>
      <View style={styles.row}>
        <IconTile icon="smart_toy" tone="sky" />
        <View style={styles.text}>
          <ThemedText type="cardTitle">{strings.aiPathTitle}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.aiPathBody}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title={strings.aiPathCheck} icon="quiz" variant="secondary" size="small" onPress={() => router.push('/ai-path-check')} />
        <Button title={strings.aiToolsGuide} icon="compare_arrows" variant="ghost" size="small" onPress={() => router.push('/ai-tools')} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
