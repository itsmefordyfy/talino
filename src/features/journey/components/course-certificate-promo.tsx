import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { journeyStrings } from '../strings';

export type CourseCertificatePromoProps = {
  courseId: string;
  /** Every lesson, quiz and project of the course is done: the certificate can be opened. */
  complete: boolean;
};

/**
 * The end of a course on Home: a regular certificate of completion waits for whoever finishes it (the Roadmap has its own, the AI Expert one,
 * for finishing every level). A dashed "waiting" card until the course is done, then a button that opens it.
 */
export function CourseCertificatePromo({ courseId, complete }: CourseCertificatePromoProps) {
  const text = useLocalized(journeyStrings).course;
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: complete ? theme.primary : theme.border }, !complete && styles.waiting]}>
      <View style={[styles.badge, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
        <Icon name="workspace_premium" size={36} color={complete ? 'primaryText' : 'textTertiary'} />
      </View>
      <ThemedText type="section" style={styles.center} accessibilityRole="header">
        {complete ? text.certificateEarnedTitle : text.certificateTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary" style={styles.center}>
        {complete ? text.certificateEarnedBody : text.certificateBody}
      </ThemedText>
      {complete && <Button title={text.certificateView} icon="workspace_premium" onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId } })} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: 2,
  },
  waiting: {
    borderStyle: 'dashed',
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
});
