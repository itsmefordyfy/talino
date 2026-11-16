/** What the store tells the app about the learner's purchases, mapped from RevenueCat at the boundary. */
export type CustomerInfo = {
  appUserId: string;
  /** Every active entitlement id (`course_developer`, `mini_python_ai`, `all_access`…). */
  entitlements: string[];
  /** The All-Access subscription, when there is one (for the plan screen). */
  allAccess: SubscriptionInfo | null;
  managementURL: string | null;
};

export type SubscriptionStore = 'app_store' | 'play_store' | 'promotional' | 'test_store' | 'other';

export type SubscriptionInfo = {
  productIdentifier: string;
  store: SubscriptionStore;
  expirationDate: string | null;
  willRenew: boolean;
  billingIssue: boolean;
  /** Google Play's base plan inside the subscription (`yearly`), when the plans share one product. */
  planIdentifier?: string | null;
  /** In the free trial period. */
  trial?: boolean;
};

/** The plans of the one subscription, Talino Pro. */
export type PlanKind = 'weekly' | 'monthly' | 'yearly';

/** A plan the learner can subscribe to, with the store's live price. */
export type StoreItem = {
  /** The store product id. */
  productId: string;
  kind: PlanKind;
  title: string;
  priceString: string;
  /** Price in the store's currency, for comparing (the bundle's saving). */
  price: number;
  currencyCode: string;
  /** Where to find it again when buying. */
  offeringId: string;
  packageId: string;
};

export class PurchaseCancelledError extends Error {
  constructor() {
    super('Purchase cancelled');
    this.name = 'PurchaseCancelledError';
  }
}

export class PurchasePendingError extends Error {
  constructor() {
    super('Purchase pending approval');
    this.name = 'PurchasePendingError';
  }
}

/** Why the store's own subscription page couldn't be opened from this phone. */
export type ManageSubscriptionReason = 'none' | 'granted' | 'other_store' | 'failed';

export class ManageSubscriptionError extends Error {
  readonly reason: ManageSubscriptionReason;
  constructor(reason: ManageSubscriptionReason) {
    super(`Can’t open the store’s subscription page (${reason})`);
    this.name = 'ManageSubscriptionError';
    this.reason = reason;
  }
}

export class StoreUnavailableError extends Error {
  constructor() {
    super('This build has no store key, so it can’t sell or restore courses.');
    this.name = 'StoreUnavailableError';
  }
}
