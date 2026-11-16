import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { onboardingStrings } from '../strings';

/** For someone who started before personalized onboarding existed (no learning profile yet): an invitation, never a requirement. */
export function SetUpProfileCard() {
  const strings = useLocalized(onboardingStrings);
  return (
    <Card>
      <View style={styles.row}>
        <Tali size={96} tight mood="explaining" />
        <View style={styles.text}>
          <ThemedText type="cardTitle">{strings.setUpProfile}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.setUpProfileBody}
          </ThemedText>
        </View>
      </View>
      <Button title={strings.startOnboarding} icon="tune" variant="secondary" onPress={() => router.push('/learning-profile')} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
