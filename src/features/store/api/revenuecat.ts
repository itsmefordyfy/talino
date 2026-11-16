import Storage from 'expo-sqlite/kv-store';
import { Linking } from 'react-native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE, STORE_REPLACEMENT_MODE, type CustomerInfo as SdkCustomerInfo, type PurchasesEntitlementInfo, type PurchasesOffering as SdkOffering, type PurchasesPackage as SdkPackage } from 'react-native-purchases';

import { reportError } from '@/lib/monitoring';

import { ALL_ACCESS_ENTITLEMENT, OFFERING_ID } from '../lib/catalog';
import { ANDROID_PACKAGE, REVENUECAT_API_KEY, STORE_SUBSCRIPTIONS_URL } from '../lib/keys';
import { deviceStore, playReplacement } from '../lib/plan-change';
import { planKindFor } from '../lib/plans';
import { ManageSubscriptionError, PurchaseCancelledError, PurchasePendingError, type CustomerInfo, type StoreItem, type SubscriptionStore } from '../types';
import type { PurchasesService } from './purchases';

/** RevenueCat behind `PurchasesService`; SDK objects are mapped to the app's types here, at the boundary. */

const CACHE_KEY = 'revenuecat:customer-info:v1';

const STORES: Partial<Record<PurchasesEntitlementInfo['store'], SubscriptionStore>> = {
  APP_STORE: 'app_store',
  MAC_APP_STORE: 'app_store',
  PLAY_STORE: 'play_store',
  PROMOTIONAL: 'promotional',
  TEST_STORE: 'test_store',
};

let configured = false;

function configure(): void {
  if (configured || !REVENUECAT_API_KEY) return;
  try {
    if (__DEV__) void Purchases.setLogLevel(LOG_LEVEL.WARN);
    // No accounts: RevenueCat keeps an anonymous id per install; Restore brings purchases back.
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    configured = true;
  } catch (error) {
    reportError(error, 'purchases', { step: 'configure' });
  }
}

async function toCustomerInfo(info: SdkCustomerInfo): Promise<CustomerInfo> {
  const appUserId = await Purchases.getAppUserID();
  const all = info.entitlements.active[ALL_ACCESS_ENTITLEMENT];
  const customer: CustomerInfo = {
    appUserId,
    entitlements: Object.keys(info.entitlements.active),
    allAccess: all
      ? { productIdentifier: all.productIdentifier, store: STORES[all.store] ?? 'other', expirationDate: all.expirationDate, willRenew: all.willRenew, billingIssue: all.billingIssueDetectedAt !== null, planIdentifier: all.productPlanIdentifier, trial: all.periodType === 'TRIAL' }
      : null,
    managementURL: info.managementURL,
  };
  Storage.setItemAsync(CACHE_KEY, JSON.stringify(customer)).catch(() => {});
  return customer;
}

function readCache(): CustomerInfo | undefined {
  try {
    const raw = Storage.getItemSync(CACHE_KEY);
    if (!raw) return undefined;
    const info = JSON.parse(raw) as CustomerInfo;
    if (typeof info?.appUserId !== 'string' || !Array.isArray(info.entitlements)) return undefined;
    // An expired subscription in the cache doesn't unlock anything until RevenueCat answers.
    if (info.allAccess?.expirationDate && Date.parse(info.allAccess.expirationDate) < Date.now()) {
      return { ...info, allAccess: null, entitlements: [] };
    }
    return info;
  } catch {
    return undefined;
  }
}

const loaded = new Map<string, SdkPackage>();

function toItems(offering: SdkOffering): StoreItem[] {
  const items: StoreItem[] = [];
  for (const pkg of offering.availablePackages) {
    // Only the subscription's plans are for sale; any other product in the offering is skipped.
    const kind = planKindFor(pkg.product.identifier, pkg.packageType);
    if (!kind) continue;
    loaded.set(`${offering.identifier}/${pkg.identifier}`, pkg);
    items.push({
      productId: pkg.product.identifier,
      kind,
      title: pkg.product.title,
      priceString: pkg.product.priceString,
      price: pkg.product.price,
      currencyCode: pkg.product.currencyCode,
      offeringId: offering.identifier,
      packageId: pkg.identifier,
    });
  }
  return items;
}

function toAppError(error: unknown): unknown {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
  if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return new PurchaseCancelledError();
  if (code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) return new PurchasePendingError();
  reportError(error, 'purchases', { code: String(code ?? 'unknown') });
  return error;
}

async function getCustomerInfo(): Promise<CustomerInfo> {
  configure();
  return toCustomerInfo(await Purchases.getCustomerInfo());
}

export const revenueCatPurchases: PurchasesService = {
  configure,
  getCachedCustomerInfo: readCache,
  getCustomerInfo,

  async refreshCustomerInfo() {
    configure();
    await Purchases.invalidateCustomerInfoCache();
    return getCustomerInfo();
  },

  async getStoreItems(offeringId = OFFERING_ID) {
    configure();
    const offerings = await Purchases.getOfferings();
    const offering = offerings.all[offeringId] ?? offerings.all[OFFERING_ID] ?? offerings.current;
    return offering ? toItems(offering) : [];
  },

  async purchase(item, { replacing } = {}) {
    configure();
    const pkg = loaded.get(`${item.offeringId}/${item.packageId}`);
    if (!pkg) throw new Error(`Package "${item.packageId}" isn't in a loaded offering.`);
    // Google Play needs the plan being replaced, or the new one runs beside it (two charges); the App Store switches plans within the
    // subscription group by itself.
    const replacement = playReplacement(item, replacing ?? null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        pkg,
        null,
        replacement
          ? { oldProductIdentifier: replacement.oldProductIdentifier, replacementMode: replacement.mode === 'DEFERRED' ? STORE_REPLACEMENT_MODE.DEFERRED : STORE_REPLACEMENT_MODE.WITH_TIME_PRORATION }
          : null,
      );
      return await toCustomerInfo(customerInfo);
    } catch (error) {
      throw toAppError(error);
    }
  },

  async restorePurchases() {
    configure();
    try {
      return await toCustomerInfo(await Purchases.restorePurchases());
    } catch (error) {
      throw toAppError(error);
    }
  },

  /**
   * The store's own page, opened directly (Pawfetti's rule: RevenueCat's Customer Center is not used for managing). iPhone: Apple's
   * manage-subscriptions sheet (StoreKit), else the App Store's page. Android: Google Play's page for this subscription (RevenueCat's
   * management URL), else Play's subscriptions page.
   */
  async manageSubscription(info) {
    configure();
    const plan = info.allAccess;
    if (!plan || plan.store === 'test_store') throw new ManageSubscriptionError('none');
    if (plan.store === 'promotional') throw new ManageSubscriptionError('granted');
    if (plan.store !== deviceStore()) throw new ManageSubscriptionError('other_store');
    if (process.env.EXPO_OS === 'ios') {
      try {
        await Purchases.showManageSubscriptions();
        return;
      } catch (error) {
        reportError(error, 'purchases', { step: 'manage' });
      }
    }
    const sku = plan.productIdentifier.split(':')[0];
    const url = info.managementURL ?? (process.env.EXPO_OS === 'android' ? `${STORE_SUBSCRIPTIONS_URL.android}?sku=${encodeURIComponent(sku)}&package=${encodeURIComponent(ANDROID_PACKAGE)}` : STORE_SUBSCRIPTIONS_URL.ios);
    try {
      // Store pages open in the store app, not an in-app browser.
      await Linking.openURL(url);
    } catch (error) {
      reportError(error, 'purchases', { step: 'open_store_subscriptions' });
      throw new ManageSubscriptionError('failed');
    }
  },

  addCustomerInfoListener(listener) {
    configure();
    const onUpdate = (info: SdkCustomerInfo) => {
      void toCustomerInfo(info).then(listener);
    };
    Purchases.addCustomerInfoUpdateListener(onUpdate);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(onUpdate);
    };
  },
};
