import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppLogo } from '@/components/brand/app-logo';
import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BrandGradient, HeroInk, MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { useCustomerInfo } from '../api/queries';
import { useAccess } from '../hooks/use-access';
import { describePlan, formatPlanDate } from '../lib/describe-plan';
import { openPaywall } from '../lib/open-paywall';
import { storeStrings } from '../strings';

/**
 * Settings' plan card, as CarMind's: a gradient upgrade card that opens the paywall for someone on Free, and for a subscriber a calm
 * card with the plan, when it renews and Manage (the app's own Plan screen, `/subscription`).
 */
export function PlanCard() {
  const strings = useLocalized(storeStrings);
  const access = useAccess();
  const customer = useCustomerInfo();

  if (access.allAccess && customer.data) {
    const info = customer.data.allAccess;
    // A grant with no subscription behind it (a class or a promotion) has nothing to renew or manage.
    const line = info ? describePlan(info, { plans: strings.plans, renews: strings.card.renews, cancelled: strings.card.cancelled, paymentProblem: strings.card.paymentProblem }, formatPlanDate) : null;
    return (
      <Card>
        <View style={styles.row}>
          <View style={styles.text}>
            <ThemedText type="cardTitle">{strings.card.proTitle}</ThemedText>
            {line ? (
              <ThemedText type="secondary" themeColor="textSecondary">
                {line}
              </ThemedText>
            ) : null}
          </View>
          <Tali size={56} mood="proud" tight />
        </View>
        {/* Manage opens the Plan screen (status, switching plans, the store's page to cancel), as Pawfetti's and CarMind's do. */}
        {info && <Button title={strings.card.managePlan} variant="secondary" style={styles.manage} onPress={() => router.push('/subscription')} />}
      </Card>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${strings.card.upgradeTitle}. ${strings.card.seePlans}`}
      onPress={() => {
        tapFeedback();
        void openPaywall('default');
      }}
      style={({ pressed }) => [styles.upgrade, pressed && styles.pressed]}>
      <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.row}>
        <View style={styles.text}>
          <ThemedText type="section" style={styles.ink}>
            {strings.card.upgradeTitle}
          </ThemedText>
          <ThemedText type="secondary" style={styles.muted}>
            {strings.card.upgradeBody}
          </ThemedText>
        </View>
        {/* The app itself, not the coach (owner, 2026-11-16: "show the app logo instead of mascot"). */}
        <AppLogo size={64} ringColor={HeroInk.glass} />
      </View>
      <View style={styles.cta}>
        <ThemedText type="cardTitle" style={styles.ctaText}>
          {strings.card.seePlans}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  upgrade: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(83, 109, 254, 0.28)',
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.one,
  },
  manage: {
    marginTop: Spacing.three,
  },
  cta: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: MinTouchSize,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.button,
    borderCurve: 'continuous',
    backgroundColor: HeroInk.text,
  },
  ctaText: {
    color: HeroInk.onLight,
  },
  ink: {
    color: HeroInk.text,
  },
  muted: {
    color: HeroInk.muted,
  },
});
