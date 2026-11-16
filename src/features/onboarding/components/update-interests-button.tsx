import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { useLocalized } from '@/hooks/use-strings';

import { updateInterestsStrings } from '../update-interests-strings';

/**
 * One way into Settings → Learning profile from the Discover picks, so changing an interest is one tap away. Saving there refreshes every
 * recommendation at once and touches no progress, purchase or finished course.
 */
export function UpdateInterestsButton() {
  const strings = useLocalized(updateInterestsStrings);
  return <Button title={strings.update} accessibilityLabel={strings.updateA11y} icon="tune" variant="ghost" size="small" onPress={() => router.push('/learning-profile')} style={styles.button} />;
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
  },
});
