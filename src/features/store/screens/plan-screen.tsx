import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';

import { useChangePlan, useCustomerInfo, useManageSubscription, useRestorePurchases, useStoreItems } from '../api/queries';
import { PlanPicker } from '../components/plan-picker';
import { useAccess } from '../hooks/use-access';
import { OFFERING_ID } from '../lib/catalog';
import { describePlan, formatPlanDate } from '../lib/describe-plan';
import { openPaywall } from '../lib/open-paywall';
import { changeNoteKind, isCurrentPlan, isManagedHere, manageWhere, planChangeTiming } from '../lib/plan-change';
import { sortPlans } from '../lib/plans';
import { storeStrings } from '../strings';
import { PurchaseCancelledError, PurchasePendingError, StoreUnavailableError, type StoreItem, type SubscriptionInfo } from '../types';

type Message = { tone: 'success' | 'warning' | 'info'; text: string };

/**
 * The subscriber's plan, as Pawfetti's and CarMind's Plan screens (Settings → Manage): its status (renews, trial, cancelled with Pro
 * until the period ends, a payment problem), the other plans to switch to and when a switch starts, and the store's own page to
 * cancel. Everything shown comes from RevenueCat's entitlement; a change goes through the store and the plan here updates from what it
 * reports. Free never sees the switching: it is sent to the paywall. A plan from the other platform's store, or granted, is only described.
 */
export function PlanScreen() {
  const strings = useLocalized(storeStrings);
  const common = useStrings();
  const online = useIsOnline();
  const access = useAccess();
  const customer = useCustomerInfo();
  const info = customer.data?.allAccess ?? null;
  const subscribed = access.allAccess;
  const manage = useManageSubscription();
  const changePlan = useChangePlan();
  const restore = useRestorePurchases();
  const items = useStoreItems(OFFERING_ID, subscribed && !!info && isManagedHere(info));
  const [targetId, setTargetId] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  // Restore lives here and on the paywall, not in Settings (owner, 2026-11-16).
  const doRestore = async () => {
    setMessage(null);
    try {
      const restored = await restore.mutateAsync();
      setMessage(restored.entitlements.length > 0 ? { tone: 'success', text: strings.restored } : { tone: 'info', text: strings.nothingToRestore });
    } catch (error) {
      setMessage({ tone: 'warning', text: error instanceof StoreUnavailableError ? strings.unavailable : strings.loadError });
    }
  };
  const restoreButton = <Button title={strings.restore} icon="restore" variant="ghost" loading={restore.isPending} disabled={restore.isPending} onPress={() => void doRestore()} />;

  if (!access.known) {
    return (
      <Screen>
        <SkeletonBlock height={96} />
        <SkeletonBlock height={72} />
      </Screen>
    );
  }

  if (!subscribed || !customer.data) {
    return (
      <Screen>
        {message && <Notice tone={message.tone} message={message.text} />}
        <Card style={styles.free}>
          <Tali size={120} mood="confident" tight />
          <ThemedText type="section" style={styles.center} accessibilityRole="header">
            {strings.plan.freeTitle}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {strings.plan.freeBody}
          </ThemedText>
          <Button title={strings.card.seePlans} onPress={() => openPaywall('default')} />
        </Card>
        {restoreButton}
      </Screen>
    );
  }

  const storeName = (plan: SubscriptionInfo) => strings.plan.stores[plan.store === 'app_store' || plan.store === 'play_store' ? plan.store : 'other'];
  const managedHere = !!info && isManagedHere(info);
  const periodEnd = info?.expirationDate ? formatPlanDate(info.expirationDate) : null;
  const line = info ? describePlan(info, { plans: strings.plans, renews: strings.card.renews, cancelled: strings.card.cancelled, paymentProblem: strings.card.paymentProblem }, formatPlanDate) : null;

  const plans = sortPlans(items.data ?? []);
  const current = info ? (plans.find((plan) => isCurrentPlan(plan, info)) ?? null) : null;
  const others = plans.filter((plan) => plan !== current);
  // The plan to switch to: the one tapped, else the best value the subscriber isn't on (the list is best value first).
  const target = others.find((plan) => plan.productId === targetId) ?? others[0] ?? null;

  const openStore = () => {
    setMessage(null);
    manage.mutate(customer.data, { onError: () => setMessage({ tone: 'warning', text: strings.plan.openStoreFailed(info ? storeName(info) : strings.plan.stores.other) }) });
  };

  const switchTo = async (plan: StoreItem) => {
    if (!info) return;
    setMessage(null);
    try {
      const after = await changePlan.mutateAsync({ item: plan, replacing: info });
      successFeedback();
      setTargetId(null);
      const name = strings.plans[plan.kind];
      const end = after.allAccess?.expirationDate ? formatPlanDate(after.allAccess.expirationDate) : null;
      setMessage({ tone: 'success', text: planChangeTiming(plan, after.allAccess) === 'now' ? strings.plan.switchedNow(name) : strings.plan.switchedAtRenewal(name, end) });
    } catch (error) {
      if (error instanceof PurchaseCancelledError) return;
      if (error instanceof PurchasePendingError) setMessage({ tone: 'info', text: strings.pending });
      else {
        reportError(error, 'purchases', { step: 'change_plan' });
        setMessage({ tone: 'warning', text: strings.failed });
      }
    }
  };

  const note = (plan: StoreItem, from: SubscriptionInfo) => {
    const kind = changeNoteKind(plan, from);
    return kind === 'app_store' ? strings.plan.noteAppStore(periodEnd) : kind === 'now' ? strings.plan.noteNow : strings.plan.noteAtRenewal(periodEnd);
  };

  const footer = managedHere && info ? <Button title={strings.manage} variant="secondary" loading={manage.isPending} onPress={openStore} /> : undefined;

  return (
    <Screen footer={footer}>
      {message && <Notice tone={message.tone} message={message.text} />}

      <Card>
        <View style={styles.status}>
          <View style={styles.statusText}>
            <ThemedText type="cardTitle">{strings.plan.statusTitle}</ThemedText>
            {line ? (
              <ThemedText type="secondary" themeColor="textSecondary">
                {line}
              </ThemedText>
            ) : null}
          </View>
          <Tali size={56} mood="proud" tight />
        </View>
      </Card>

      {managedHere && info?.billingIssue && (
        <Notice tone="danger">
          <ThemedText type="cardTitle">{strings.plan.billingTitle}</ThemedText>
          <ThemedText type="secondary">{strings.plan.billingMessage(storeName(info))}</ThemedText>
          <Button title={strings.plan.billingAction} variant="secondary" size="small" loading={manage.isPending} onPress={openStore} />
        </Notice>
      )}
      {managedHere && info && !info.willRenew && !info.billingIssue && (
        <Notice tone="warning">
          <ThemedText type="cardTitle">{info.trial ? strings.plan.cancelledTrialTitle : strings.plan.cancelledTitle}</ThemedText>
          <ThemedText type="secondary">{info.trial ? strings.plan.cancelledTrialMessage(periodEnd, storeName(info)) : strings.plan.cancelledMessage(periodEnd, storeName(info))}</ThemedText>
          <Button title={strings.plan.keepPro} variant="secondary" size="small" loading={manage.isPending} onPress={openStore} />
        </Notice>
      )}

      {managedHere && info ? (
        items.isPending && !online ? (
          <OfflineNotice feature={strings.priceList} meanwhile={strings.priceListMeanwhile} />
        ) : items.isPending ? (
          <View style={styles.stack}>
            <SkeletonBlock height={72} />
            <SkeletonBlock height={72} />
          </View>
        ) : items.isError ? (
          <View style={styles.stack}>
            {!online ? <OfflineNotice feature={strings.priceList} meanwhile={strings.priceListMeanwhile} /> : <Notice tone="warning" message={strings.loadError} />}
            <Button title={common.common.tryAgain} variant="secondary" onPress={() => void items.refetch()} />
          </View>
        ) : (
          others.length > 0 && (
            <Section title={strings.plan.changeTitle}>
              <PlanPicker items={plans} currentId={current?.productId ?? null} selectedId={target?.productId ?? null} onSelect={setTargetId} />
              {target && (
                <View style={styles.change}>
                  <Button title={strings.plan.switchTo(strings.plans[target.kind])} loading={changePlan.isPending} onPress={() => void switchTo(target)} />
                  <ThemedText type="caption" themeColor="textTertiary">
                    {note(target, info)}
                  </ThemedText>
                </View>
              )}
            </Section>
          )
        )
      ) : (
        <Card>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.plan.managedElsewhere[info ? manageWhere(info) : 'granted']}
          </ThemedText>
        </Card>
      )}

      <Card>
        <ThemedText type="section" accessibilityRole="header">
          {strings.benefitsTitle}
        </ThemedText>
        <View style={styles.benefits}>
          {strings.benefits.map((text) => (
            <View key={text} style={styles.benefit}>
              <Icon name="check_circle" size={20} color="primary" filled />
              <ThemedText type="body" style={styles.flex}>
                {text}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>
      {restoreButton}
    </Screen>
  );
}

const styles = StyleSheet.create({
  free: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  statusText: {
    flex: 1,
    gap: Spacing.one,
  },
  stack: {
    gap: Spacing.three,
  },
  change: {
    gap: Spacing.two,
  },
  benefits: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
