import Storage from 'expo-sqlite/kv-store';
import { Alert } from 'react-native';

import { newId } from '@/lib/id';
import { formatMoney } from '@/lib/money';

import { ALL_ACCESS_ENTITLEMENT, MOCK_PRICES_PHP, OFFERING_ID, PRODUCT_IDS } from '../lib/catalog';
import { PurchaseCancelledError, type CustomerInfo, type StoreItem } from '../types';
import type { PurchasesService } from './purchases';

/**
 * Stand-in for RevenueCat in development builds with no key or native module: a cancellable
 * purchase sheet, restore, and the plans' prices. Nothing is charged; every sheet says so. Release
 * bundles never contain this file (purchases.ts requires it behind `__DEV__`).
 */

const STORAGE_KEY = 'mock-purchases:v1';
const LATENCY_MS = 500;

type MockState = { appUserId: string; entitlements: string[]; allAccessUntil: string | null; productId?: string; renews?: boolean };

function item(kind: StoreItem['kind'], title: string): StoreItem {
  const pesos = MOCK_PRICES_PHP[kind];
  const productId = PRODUCT_IDS[kind];
  return { productId, kind, title, price: pesos, priceString: formatMoney(pesos * 100, 'PHP'), currencyCode: 'PHP', offeringId: OFFERING_ID, packageId: productId };
}

/** The two plans set up in RevenueCat (weekly and yearly); a monthly plan appears in the real store only when the dashboard offers one. */
function items(): StoreItem[] {
  return [item('yearly', 'Talino Pro yearly'), item('weekly', 'Talino Pro weekly')];
}

function loadState(): MockState {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockState;
  } catch {
    // Corrupt simulated state: start over.
  }
  return { appUserId: `$RCAnonymousID:${newId().replace(/-/g, '')}`, entitlements: [], allAccessUntil: null };
}

let loaded: MockState | null = null;
const state = (): MockState => (loaded ??= loadState());
const listeners = new Set<(info: CustomerInfo) => void>();

function save(next: MockState): CustomerInfo {
  loaded = next;
  Storage.setItemAsync(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  const info = customerInfo();
  listeners.forEach((listener) => listener(info));
  return info;
}

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

function customerInfo(): CustomerInfo {
  const current = state();
  const subscribed = current.allAccessUntil !== null && Date.parse(current.allAccessUntil) > Date.now();
  return {
    appUserId: current.appUserId,
    entitlements: [...new Set([...current.entitlements, ...(subscribed ? [ALL_ACCESS_ENTITLEMENT] : [])])],
    allAccess: subscribed ? { productIdentifier: current.productId ?? PRODUCT_IDS.yearly, store: 'test_store', expirationDate: current.allAccessUntil, willRenew: current.renews !== false, billingIssue: false } : null,
    managementURL: null,
  };
}

function confirm(title: string, message: string, action = 'Subscribe'): Promise<boolean> {
  if (process.env.EXPO_OS === 'web') return Promise.resolve(true);
  return new Promise((resolve) => {
    Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel', onPress: () => resolve(false) }, { text: action, onPress: () => resolve(true) }], { cancelable: true, onDismiss: () => resolve(false) });
  });
}

function grantFor(entry: StoreItem, current: MockState): MockState {
  const until = new Date();
  if (entry.kind === 'weekly') until.setDate(until.getDate() + 7);
  else until.setMonth(until.getMonth() + (entry.kind === 'yearly' ? 12 : 1));
  return { ...current, allAccessUntil: until.toISOString(), productId: entry.productId, renews: true };
}

export const mockPurchases: PurchasesService & { debug: { reset(): CustomerInfo; grantAllAccess(): CustomerInfo } } = {
  configure() {},
  getCachedCustomerInfo: () => customerInfo(),
  async getCustomerInfo() {
    await delay();
    return customerInfo();
  },
  async refreshCustomerInfo() {
    return mockPurchases.getCustomerInfo();
  },
  async getStoreItems() {
    await delay();
    return items();
  },
  async purchase(entry, { replacing } = {}) {
    // A plan change starts now in the simulated store, whichever way it goes (a real store may wait for the renewal).
    const ok = await confirm(replacing ? 'Simulated plan change' : 'Simulated purchase', `${entry.title} for ${entry.priceString}. This development build uses a simulated store: nothing is charged.`, replacing ? 'Switch' : 'Subscribe');
    if (!ok) throw new PurchaseCancelledError();
    await delay();
    return save(grantFor(entry, state()));
  },
  async restorePurchases() {
    await delay();
    return customerInfo();
  },
  async manageSubscription() {
    // Stands in for the store's page: cancel, or turn renewal back on.
    const current = state();
    const renewing = current.renews !== false;
    const ok = await confirm(
      'Simulated store',
      renewing ? 'Cancel the subscription? Pro stays until the end of the period, then it won’t renew. A real build opens the store’s own page here.' : 'Turn renewal back on? A real build opens the store’s own page here.',
      renewing ? 'Cancel subscription' : 'Keep Pro',
    );
    if (!ok) return;
    await delay();
    save({ ...current, renews: !renewing });
  },
  addCustomerInfoListener(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  debug: {
    reset: () => save({ ...state(), entitlements: [], allAccessUntil: null, productId: undefined, renews: undefined }),
    grantAllAccess: () => {
      const until = new Date();
      until.setFullYear(until.getFullYear() + 1);
      return save({ ...state(), allAccessUntil: until.toISOString(), productId: PRODUCT_IDS.yearly, renews: true });
    },
  },
};
