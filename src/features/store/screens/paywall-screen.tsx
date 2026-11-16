import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';
import { celebrateProAfterClose } from '@/lib/pro-celebration';

import { usesMockStore } from '../api/purchases';
import { useCustomerInfo, useManageSubscription, usePurchase, useRestorePurchases, useStoreItems } from '../api/queries';
import { PaywallHero } from '../components/paywall-hero';
import { PlanComparison } from '../components/plan-comparison';
import { PlanPicker } from '../components/plan-picker';
import { ProFeatureList } from '../components/pro-feature-list';
import { useAccess } from '../hooks/use-access';
import { OFFERING_ID } from '../lib/catalog';
import { leadFeature } from '../lib/paywall-content';
import { paywallReason } from '../lib/paywall-reasons';
import { sortPlans } from '../lib/plans';
import { paywallStrings } from '../paywall-strings';
import { storeStrings } from '../strings';
import { PurchaseCancelledError, PurchasePendingError, StoreUnavailableError } from '../types';

/** Placeholders until the marketing site has these pages (an owner step in CLAUDE.md); the same two as Settings. */
const LEGAL = { privacy: 'https://talino.fordytechsolutions.com/privacy', terms: 'https://talino.fordytechsolutions.com/terms' };

/**
 * The app's own paywall, laid out as Ulamin's "See plans" screen (owner, 2026-11-16): the hero with the coach, the plans (yearly chosen to
 * begin with), Free next to Pro, what Free keeps, and what Pro adds (the reason it was opened for first); pinned below, one Continue button
 * with the renewal terms, Terms and Privacy beside the offer (App Store 3.1.2) and Restore. It is the only paywall: every way in
 * (`openPaywall`) opens this screen, and RevenueCat's own Paywall is not used (owner, 2026-11-15).
 */
export function PaywallScreen() {
  const strings = useLocalized(storeStrings);
  const extra = useLocalized(paywallStrings);
  const common = useStrings();
  const { reason: reasonParam } = useLocalSearchParams<{ reason?: string }>();
  const reason = paywallReason(reasonParam);
  const headline = strings.headlines[reason];
  const items = useStoreItems(OFFERING_ID);
  const customer = useCustomerInfo();
  const online = useIsOnline();
  const access = useAccess();
  const purchase = usePurchase();
  const restore = useRestorePurchases();
  const manage = useManageSubscription();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'success' | 'warning' | 'info'; text: string } | null>(null);

  const plans = sortPlans(items.data ?? []);
  // Yearly is first once sorted, so it is what is chosen until the learner picks another.
  const selected = plans.find((plan) => plan.productId === selectedId) ?? plans[0] ?? null;
  const unavailable = items.error instanceof StoreUnavailableError;
  const busy = purchase.isPending || restore.isPending;

  const subscribe = async () => {
    if (!selected) return;
    setMessage(null);
    try {
      const info = await purchase.mutateAsync(selected);
      successFeedback();
      router.back();
      // Only once the purchase has come back with the entitlement; the paywall closes first, then Tali celebrates.
      if (info.allAccess) celebrateProAfterClose();
    } catch (error) {
      if (error instanceof PurchaseCancelledError) return;
      if (error instanceof PurchasePendingError) setMessage({ tone: 'info', text: strings.pending });
      else {
        reportError(error, 'purchases', { step: 'subscribe' });
        setMessage({ tone: 'warning', text: strings.failed });
      }
    }
  };

  const doRestore = async () => {
    setMessage(null);
    try {
      const info = await restore.mutateAsync();
      setMessage(info.entitlements.length > 0 ? { tone: 'success', text: strings.restored } : { tone: 'info', text: strings.nothingToRestore });
    } catch (error) {
      setMessage({ tone: 'warning', text: error instanceof StoreUnavailableError ? strings.unavailable : strings.loadError });
    }
  };

  const footer = (
    <View style={styles.footer}>
      {selected && !access.allAccess && (
        <>
          <Button title={strings.continue} loading={purchase.isPending} disabled={restore.isPending} onPress={() => void subscribe()} />
          <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
            {strings.renewal(selected.priceString, strings.periods[selected.kind])}
          </ThemedText>
        </>
      )}
      <View style={styles.legal}>
        <Button title={strings.terms} variant="ghost" size="small" onPress={() => void WebBrowser.openBrowserAsync(LEGAL.terms)} />
        <Button title={strings.privacy} variant="ghost" size="small" onPress={() => void WebBrowser.openBrowserAsync(LEGAL.privacy)} />
      </View>
      {!unavailable && (
        <Pressable accessibilityRole="button" hitSlop={14} disabled={busy} onPress={() => void doRestore()} style={styles.restore}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.link}>
            {restore.isPending ? '…' : strings.restore}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );

  return (
    <Screen footer={footer}>
      <PaywallHero eyebrow={strings.title} title={headline.title} subtitle={headline.subtitle} />
      {usesMockStore && <Notice tone="info" message={strings.simulated} />}
      {message && <Notice tone={message.tone} message={message.text} />}

      {access.allAccess && customer.data ? (
        <View style={styles.stack}>
          <Notice tone="success" message={strings.subscribed} />
          <Button title={strings.manage} variant="secondary" loading={manage.isPending} onPress={() => manage.mutate(customer.data!, { onError: () => setMessage({ tone: 'warning', text: strings.plan.openStoreFailed(strings.plan.stores.other) }) })} />
        </View>
      ) : items.isPending && !online ? (
        <OfflineNotice feature={strings.priceList} meanwhile={strings.priceListMeanwhile} />
      ) : items.isPending ? (
        <View style={styles.stack}>
          <SkeletonBlock height={72} />
          <SkeletonBlock height={72} />
        </View>
      ) : unavailable ? (
        <Card>
          <ThemedText type="cardTitle">{strings.unavailable}</ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.cardText}>
            {strings.unavailableBody}
          </ThemedText>
        </Card>
      ) : items.isError || plans.length === 0 ? (
        <View style={styles.stack}>
          {!online ? <OfflineNotice feature={strings.priceList} meanwhile={strings.priceListMeanwhile} /> : <Notice tone="warning" message={strings.loadError} />}
          <Button title={common.common.tryAgain} variant="secondary" onPress={() => void items.refetch()} />
        </View>
      ) : (
        <View style={styles.plans}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow} accessibilityRole="header">
            {strings.choosePlan}
          </ThemedText>
          <PlanPicker items={plans} selectedId={selected?.productId ?? null} onSelect={setSelectedId} showEquivalent />
        </View>
      )}

      <PlanComparison isPro={access.allAccess} />
      <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
        {extra.freeNote}
      </ThemedText>
      <ProFeatureList lead={leadFeature(reason)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  stack: {
    gap: Spacing.three,
  },
  // The plans under their small caps title, as Ulamin's.
  plans: {
    gap: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.two,
  },
  cardText: {
    marginTop: Spacing.one,
  },
  footer: {
    gap: Spacing.two,
  },
  legal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  restore: {
    alignSelf: 'center',
    paddingVertical: Spacing.one,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
