# RevenueCat setup for Talino

Talino is **subscription-only** (the owner's decision, 2026-11-15, replacing the 2026-11-13 per-course sale). One subscription,
**Talino Pro**, opens every course, project review, certificate and the résumé tools. The app reads only the **entitlement**
`talino_pro`, so prices and plans can change in the dashboard without a release.

## Products (App Store Connect and Google Play Console)

One subscription group ("Talino Pro"); the owner has set up weekly and yearly in RevenueCat (a monthly plan is optional: the app
shows whichever plans the offering holds).

| Plan | Product id (RevenueCat Test Store) | Package | PH price |
|---|---|---|---|
| Yearly | `yearly` | `$rc_annual` | ₱1,999 |
| Weekly | `weekly` | `$rc_weekly` | ₱199 |
| Monthly (optional) | `monthly` | `$rc_monthly` | ₱449 (my call, not the owner's) |

The app reads the plan from the product id (`weekly`, `talino_pro_yearly`, a Google Play `…:base` suffix) and falls back to
RevenueCat's package type (`lib/plans.ts`, `planKindFor`), so the store product ids may be anything that says the period.
Yearly shows "Best value" and "Save N%" against twelve monthly payments, or 52 weekly ones when there is no monthly plan.

## Entitlement (RevenueCat → Product catalog → Entitlements)

`talino_pro`: attach every plan above. The simulated store and the server use the same id (`ALL_ACCESS_ENTITLEMENT` in
`features/store/lib/catalog.ts`, kept under its old constant name). **Per-course entitlements are no longer sold but still exist:**
the server grants them without a purchase for a teacher's class codes (`course_developer`, `mini_python_ai`, `course_ai_dev_intro`…)
and referral rewards, and the certificate check reads them, so `ownsCourse` accepts a course entitlement or `talino_pro`.
Create those entitlements in the dashboard only if you use classes or referrals.

## Offerings

- `default` (make it current): one package per plan (`$rc_annual`, `$rc_weekly`, optionally `$rc_monthly`).
- `referral` (optional): the same packages with discounted products for a learner who entered a friend's invite code. The app's own
  paywall reads it; RevenueCat's Paywall is skipped for a referred learner so they see it.

## Paywall and managing the subscription

The app uses **its own screens**, not RevenueCat's (`react-native-purchases-ui` is no longer imported anywhere; the package can be removed
with `npm uninstall` and a native rebuild when the owner wants). Everything goes through `openPaywall(reason)`
(`features/store/lib/open-paywall.ts`) to the app's `/paywall`. Settings leads with a plan card (`PlanCard`): the upgrade card on Free, and for
a subscriber the plan and **Manage**, which opens the **Plan screen** (`/subscription`, `features/store/screens/plan-screen.tsx`, as Pawfetti's
and CarMind's): the status from the entitlement, the other plans of the offering to switch to and when the switch starts, and a button to the
store's own subscription page to cancel. Switching goes through `purchasePackage`: Google Play gets the old subscription and a replacement mode
(a longer plan now with the time left credited, a shorter one at the next renewal; `lib/plan-change.ts`), and the App Store switches within the
subscription group by itself, so **put the weekly, monthly and yearly products in one subscription group in App Store Connect** and rank them
(yearly highest) so an upgrade is immediate and a downgrade waits for the renewal.

## Keys

- App: `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (`appl_…`), `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (`goog_…`),
  `EXPO_PUBLIC_REVENUECAT_TEST_KEY` (`test_…`, development only: it lives in `.env.development.local`, which a release build never
  loads, and a release ignores a `test_` key on purpose). Without any key a development build uses the simulated store (Settings →
  Developer can grant or remove purchases). **A TestFlight or App Store build needs the `appl_…` key**; until it is in `.env.production.local`
  that build shows "Plans aren't available in this build yet" and sells nothing.
- Server (EAS Hosting env, never `EXPO_PUBLIC_`): `REVENUECAT_SECRET_KEY` + `REVENUECAT_PROJECT_ID`
  (V2, "Customer information: Read only") to check purchases; `REVENUECAT_ENTITLEMENT_KEYS` maps V2's
  `entl…` ids to the lookup keys (`entlabc=talino_pro,entldef=course_developer,…`);
  `REVENUECAT_V1_SECRET_KEY` (a V1 key with write access) to grant class seats and referral rewards.
- Webhook: Integrations → Webhooks → `https://<server>/api/revenuecat-webhook`, Authorization header
  value = `REVENUECAT_WEBHOOK_AUTH`.
