import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TaliSays } from '@/components/tali-says';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { useLocalized } from '@/hooks/use-strings';

import { builderStrings } from '../builder-strings';

/**
 * While Tali writes: the three real stages (reading your details, writing, checking every line against them) by how long it
 * has been, and what happens to the learner's details. The bar only ever moves forward and never claims to be done.
 */
export function GenerationProgress() {
  const s = useLocalized(builderStrings);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const stage = seconds < 4 ? 0 : seconds < 14 ? 1 : 2;
  return (
    <Screen>
      <Stack.Screen options={{ title: s.create.title }} />
      <TaliSays key={stage} mood={stage === 2 ? 'focused' : 'coding'} text={s.create.working[stage]} size="large" layout="stacked" />
      <ProgressBar fraction={Math.min(0.95, 0.1 + seconds / 30)} accessibilityLabel={s.create.working[stage]} />
      <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
        {s.create.workingNote}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});
