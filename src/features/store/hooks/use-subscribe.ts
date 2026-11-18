import { useState } from 'react';

import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';

import { useCustomerInfo, usePurchase, useRestorePurchases, useStoreItems } from '../api/queries';
import { OFFERING_ID } from '../lib/catalog';
import { sortPlans } from '../lib/plans';
import { storeStrings } from '../strings';
import { PurchaseCancelledError, PurchasePendingError, StoreUnavailableError, type CustomerInfo } from '../types';
import { useAccess } from './use-access';

export type SubscribeMessage = { tone: 'success' | 'warning' | 'info'; text: string };

/**
 * Choosing a plan, buying it and restoring, shared by the paywall screen and the paywall step of onboarding so a purchase behaves
 * the same wherever it starts. `onPurchased` runs only once the store has answered with a purchase (a cancelled sheet is silent);
 * what happens next (closing a sheet, moving to the next step) is the caller's.
 */
export function useSubscribe({ onPurchased }: { onPurchased: (info: CustomerInfo) => void }) {
  const strings = useLocalized(storeStrings);
  const items = useStoreItems(OFFERING_ID);
  const customer = useCustomerInfo();
  const online = useIsOnline();
  const access = useAccess();
  const purchase = usePurchase();
  const restore = useRestorePurchases();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<SubscribeMessage | null>(null);

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
      onPurchased(info);
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

  return { items, customer, online, access, purchase, restore, plans, selected, select: setSelectedId, unavailable, busy, message, setMessage, subscribe, doRestore };
}
