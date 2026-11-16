import { NativeModules } from 'react-native';

import { REVENUECAT_API_KEY } from '../lib/keys';
import { ManageSubscriptionError, StoreUnavailableError, type CustomerInfo, type StoreItem, type SubscriptionInfo } from '../types';
import { revenueCatPurchases } from './revenuecat';

/**
 * The purchases backend. Screens talk to this interface, never to the SDK, so the simulated store
 * (development) and RevenueCat are interchangeable.
 */
export type PurchasesService = {
  configure(): void;
  /** Last known purchases, read synchronously so the first frame never shows a course locked by mistake. */
  getCachedCustomerInfo(): CustomerInfo | undefined;
  getCustomerInfo(): Promise<CustomerInfo>;
  refreshCustomerInfo(): Promise<CustomerInfo>;
  /** Everything for sale, from `offeringId` when the dashboard has it, else the default offering. */
  getStoreItems(offeringId?: string): Promise<StoreItem[]>;
  /**
   * Buys a plan, or switches to it from the plan `replacing` (Google Play replaces the old one; the App Store switches within the
   * subscription group by itself). Rejects with `PurchaseCancelledError` / `PurchasePendingError`.
   */
  purchase(item: StoreItem, options?: { replacing?: SubscriptionInfo | null }): Promise<CustomerInfo>;
  restorePurchases(): Promise<CustomerInfo>;
  /**
   * The store's own subscription page for this plan, where it is cancelled or its payment fixed. Rejects with `ManageSubscriptionError`
   * when there is nothing to manage in this phone's store or it couldn't be opened. Never changes the plan itself.
   */
  manageSubscription(info: CustomerInfo): Promise<void>;
  addCustomerInfoListener(listener: (info: CustomerInfo) => void): () => void;
};

const hasNativePurchases = !!NativeModules.RNPurchases;

/** The simulated store, development builds only (required behind `__DEV__`, so release bundles never contain it). */
export const mockStore: (PurchasesService & { debug: { reset(): CustomerInfo; grantAllAccess(): CustomerInfo } }) | null = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('./mock') as typeof import('./mock')).mockPurchases
  : null;

const NO_CUSTOMER: CustomerInfo = { appUserId: '', entitlements: [], allAccess: null, managementURL: null };

/** A release build without a store key: only the free course, and the store's "can't load" state. */
const unavailablePurchases: PurchasesService = {
  configure() {},
  getCachedCustomerInfo: () => undefined,
  getCustomerInfo: async () => NO_CUSTOMER,
  refreshCustomerInfo: async () => NO_CUSTOMER,
  getStoreItems: () => Promise.reject(new StoreUnavailableError()),
  purchase: () => Promise.reject(new StoreUnavailableError()),
  restorePurchases: () => Promise.reject(new StoreUnavailableError()),
  manageSubscription: () => Promise.reject(new ManageSubscriptionError('none')),
  addCustomerInfoListener: () => () => {},
};

export const usesRevenueCat = process.env.EXPO_OS !== 'web' && !!REVENUECAT_API_KEY && hasNativePurchases;

export const usesMockStore = !usesRevenueCat && mockStore !== null;

export const purchases: PurchasesService = usesRevenueCat ? revenueCatPurchases : (mockStore ?? unavailablePurchases);
