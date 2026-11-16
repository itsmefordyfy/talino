import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import type { CustomerInfo, StoreItem, SubscriptionInfo } from '../types';
import { mockStore, purchases, usesMockStore } from './purchases';

export const storeKeys = {
  customerInfo: ['store', 'customer-info'] as const,
  change: ['store', 'customer-info-change'] as const,
  items: (offeringId: string) => ['store', 'items', offeringId] as const,
};

const STALE_MS = 5 * 60 * 1000;

/**
 * Purchases are server state owned by the store and RevenueCat: cached for the first frame, checked
 * again at once, marked `meta.server` so local writes don't refetch them.
 */
export function useCustomerInfo() {
  return useQuery({
    queryKey: storeKeys.customerInfo,
    queryFn: () => purchases.getCustomerInfo(),
    initialData: () => purchases.getCachedCustomerInfo(),
    initialDataUpdatedAt: 0,
    staleTime: STALE_MS,
    retry: 2,
    networkMode: 'online',
    meta: { server: true },
  });
}

/** Applies what the SDK pushes (renewals, refunds, promotional grants) and re-checks on return to the app. */
export function useCustomerInfoUpdates() {
  const queryClient = useQueryClient();
  useEffect(() => purchases.addCustomerInfoListener((info) => queryClient.setQueryData(storeKeys.customerInfo, info)), [queryClient]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      // The store's sheet makes the app inactive mid-purchase; the purchase's own result wins.
      if (queryClient.isMutating({ mutationKey: storeKeys.change }) > 0) return;
      void queryClient.invalidateQueries({ queryKey: storeKeys.customerInfo });
    });
    return () => subscription.remove();
  }, [queryClient]);
}

export function useStoreItems(offeringId: string, enabled = true) {
  return useQuery({ queryKey: storeKeys.items(offeringId), queryFn: () => purchases.getStoreItems(offeringId), enabled, retry: 2, networkMode: 'online', staleTime: STALE_MS, meta: { server: true } });
}

function useCustomerInfoMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<CustomerInfo>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: storeKeys.change,
    mutationFn,
    networkMode: 'online',
    onSuccess: async (info) => {
      await queryClient.cancelQueries({ queryKey: storeKeys.customerInfo });
      queryClient.setQueryData(storeKeys.customerInfo, info);
    },
  });
}

export function usePurchase() {
  return useCustomerInfoMutation((item: StoreItem) => purchases.purchase(item));
}

/** Switches the subscriber to another plan; Google Play replaces the current one (`playReplacement`). The answer lands in the customer-info query, so Settings and the Plan screen update together. */
export function useChangePlan() {
  return useCustomerInfoMutation(({ item, replacing }: { item: StoreItem; replacing: SubscriptionInfo }) => purchases.purchase(item, { replacing }));
}

export function useRestorePurchases() {
  return useCustomerInfoMutation<void>(() => purchases.restorePurchases());
}

/** After a class code or a referral reward: RevenueCat granted something on the server. */
export function useRefreshCustomerInfo() {
  return useCustomerInfoMutation<void>(() => purchases.refreshCustomerInfo());
}

export function useManageSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (info: CustomerInfo) => purchases.manageSubscription(info),
    onSuccess: async () => {
      try {
        queryClient.setQueryData(storeKeys.customerInfo, await purchases.refreshCustomerInfo());
      } catch {
        // Offline: the check on return to the app catches it.
      }
    },
  });
}

/** Development-only controls for the simulated store (Settings → Developer). */
export function useMockStoreControls() {
  const queryClient = useQueryClient();
  const apply = (change: (store: NonNullable<typeof mockStore>) => CustomerInfo) => {
    if (usesMockStore && mockStore) queryClient.setQueryData(storeKeys.customerInfo, change(mockStore));
  };
  return { usesMockStore, reset: () => apply((store) => store.debug.reset()), grantAllAccess: () => apply((store) => store.debug.grantAllAccess()) };
}
