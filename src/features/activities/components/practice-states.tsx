import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import type { PracticeProblem } from '@/features/practice/lib/problem';
import { lookOf } from '@/features/practice/lib/problem';
import type { PracticeText } from '@/features/practice/strings';
import { openPaywall } from '@/features/store/lib/open-paywall';
import { activeLocale } from '@/lib/i18n';

export type PracticeProblemNoticeProps = {
  problem: PracticeProblem;
  text: PracticeText;
  /** Asks again (the same words, saved on the phone); the button is hidden for problems another try cannot help. */
  onRetry?: () => void;
  retryLabel?: string;
  disabled?: boolean;
};

/** A calm line for what went wrong, saying the learner's words are safe, with a retry when one can help and Pro when the day's practice ran out. */
export function PracticeProblemNotice({ problem, text, onRetry, retryLabel, disabled = false }: PracticeProblemNoticeProps) {
  const look = lookOf(problem, text, new Date(), activeLocale());
  return (
    <View style={styles.problem}>
      <Notice tone={look.tone} message={look.message} style={styles.stretch} />
      {look.offerPro && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.ui.limitPro}
        </ThemedText>
      )}
      <View style={styles.actions}>
        {look.retryable && onRetry && <Button title={retryLabel ?? text.ui.retry} variant="secondary" size="small" onPress={onRetry} disabled={disabled} />}
        {look.offerPro && <Button title={text.ui.seePro} variant="secondary" size="small" onPress={() => openPaywall('tali')} />}
      </View>
    </View>
  );
}

export type PracticeLoadFailedProps = { text: PracticeText; onRetry: () => void };

/** The practice item's saved data could not be read: nothing is lost, and the learner can ask again. */
export function PracticeLoadFailed({ text, onRetry }: PracticeLoadFailedProps) {
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {text.ui.loadFailedTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.ui.loadFailedBody}
      </ThemedText>
      <Button title={text.ui.retry} variant="secondary" onPress={onRetry} />
    </Card>
  );
}

/** Placeholder shapes while the saved tries load (local reads are quick, so it is brief). */
export function PracticeSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBlock height={140} />
      <SkeletonBlock height={56} />
    </View>
  );
}

/** A yes/no question before something that cannot be undone from the screen. */
export function confirm(title: string, body: string, confirmLabel: string, cancelLabel: string, onConfirm: () => void): void {
  Alert.alert(title, body, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, onPress: onConfirm },
  ]);
}

const styles = StyleSheet.create({
  problem: { gap: Spacing.two, alignItems: 'flex-start' },
  actions: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  card: { gap: Spacing.three },
  stretch: { alignSelf: 'stretch' },
});
