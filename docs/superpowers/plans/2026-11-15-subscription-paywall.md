# Subscription, paywall and Settings plan card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Talino's per-course store with one three-plan subscription (weekly ₱199, monthly ₱449, yearly ₱1,999), a paywall screen, and a plan card on Settings, with no price on any course.

**Architecture:** Keep `features/store`'s backend (`PurchasesService`, RevenueCat adapter, simulated store, queries, `useAccess`) and change what it sells: three subscription products that all unlock the existing `all_access` entitlement. Replace `StoreScreen` with a `PaywallScreen` at `/paywall` opened through one helper, `openPaywall(reason)`; add `PlanCard` for Settings; strip price from course UI.

**Tech Stack:** Expo Router, React Query, RevenueCat (`react-native-purchases` 10.16.0), Jest (`jest-expo`), TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-11-15-subscription-paywall-design.md`

## Global Constraints

- Plans and prices: weekly ₱199, monthly ₱449, yearly ₱1,999; product ids `talino_pro_weekly`, `talino_pro_monthly`, `talino_pro_yearly`; entitlement `all_access` (unchanged).
- `ownsCourse`, `courseEntitlement`, `ALL_ACCESS_ENTITLEMENT` and the server routes are not changed (class and referral grants use them).
- No course, mini-course or bundle product is sold or priced anywhere in the app.
- Tokens only (colours, spacing from `constants/theme.ts`; `BrandGradient` for the Settings card); every string in `strings.ts` with `en` and `fil`; touch targets at least 44 pt; Pressables set `accessibilityRole`.
- Terms of Use and Privacy Policy links beside the offer; Restore on the paywall.
- Release builds without a store key show "plans unavailable" (existing `StoreUnavailableError` path), never a fake price.

## Review Focus

- A release build with no RevenueCat key opens the paywall: shows the unavailable card with Terms/Privacy, no crash, no price. (Task 3 test)
- Offering holds only some of the three plans (dashboard half set up): the picker shows what exists, still selects one. (Task 1 test)
- Monthly missing: no "Save N%" tag, nothing divides by zero. (Task 1 test)
- A subscriber whose plan lapses: courses lock again but nothing saved is removed (unchanged access code; verified by `access.test.ts`).
- Weekly subscriber is shown "Weekly", not "Monthly" (label from product id). (Task 1 test)

---

### Task 1: Plan catalog and pure helpers

**Files:**
- Modify: `src/features/store/lib/catalog.ts`, `src/features/store/types.ts`
- Create: `src/features/store/lib/plans.ts`, `src/features/store/lib/plans.test.ts`

**Interfaces:**
- Produces (`catalog.ts`): `PRODUCT_IDS = { weekly: 'talino_pro_weekly', monthly: 'talino_pro_monthly', yearly: 'talino_pro_yearly' }`; `MOCK_PRICES_PHP = { weekly: 199, monthly: 449, yearly: 1999 }`. Removed: `LAUNCH_BUNDLE_COURSES`, `courseProductId`, `courseIdForProduct`, the old `PRODUCT_IDS` keys.
- Produces (`types.ts`): `export type PlanKind = 'weekly' | 'monthly' | 'yearly'`; `StoreItem.kind: PlanKind`; `StoreItem.courseId` removed.
- Produces (`plans.ts`): `planKindFor(productId: string, packageType?: string): PlanKind | null`; `sortPlans(items: StoreItem[]): StoreItem[]` (yearly, monthly, weekly); `savingPercent(item: StoreItem, items: StoreItem[]): number | null` (yearly vs 12 × monthly, monthly vs 4 × weekly... only yearly gets a tag; null otherwise or when monthly missing or result ≤ 0); `planLabel(kind: PlanKind): string` is **not** here (strings own labels).

- [ ] **Step 1: Write the failing tests** in `plans.test.ts`: `planKindFor('talino_pro_weekly')` is `'weekly'`; `planKindFor('talino_pro_yearly:base')` is `'yearly'` (suffix after `:` ignored); `planKindFor('x', 'ANNUAL')` is `'yearly'`, `'MONTHLY'` → `'monthly'`, `'WEEKLY'` → `'weekly'`; unknown → `null`. `sortPlans` puts `[weekly, monthly, yearly]` in order `[yearly, monthly, weekly]` and works with a subset. `savingPercent(yearly₱1999, [monthly₱449, yearly])` is `63` (1 − 1999/5388); it is `null` for weekly and monthly items and `null` when no monthly is in the list.
- [ ] **Step 2: Run** `npx jest src/features/store/lib/plans.test.ts` — expect FAIL (module missing).
- [ ] **Step 3: Implement** `plans.ts`, edit `catalog.ts` and `types.ts` as in Interfaces (leave `courseEntitlement`, `ALL_ACCESS_ENTITLEMENT`, `OFFERING_ID`, `REFERRAL_OFFERING_ID` as they are).
- [ ] **Step 4: Run** the test — expect PASS. (`tsc` will fail until Task 2 and 3 fix users; that is expected here.)
- [ ] **Step 5: Commit** `feat(store): three-plan catalog and plan helpers`.

### Task 2: Purchases backend sells the three plans

**Files:**
- Modify: `src/features/store/api/revenuecat.ts`, `src/features/store/api/mock.ts`, `src/features/store/index.ts`

**Interfaces:**
- Consumes: `planKindFor`, `PRODUCT_IDS`, `MOCK_PRICES_PHP`, `PlanKind` (Task 1).
- Produces: `PurchasesService.getStoreItems()` returns only plan items (`kind` set from `planKindFor(pkg.product.identifier, pkg.packageType)`; packages that map to `null` are skipped). The simulated store returns weekly/monthly/yearly with ₱ prices, its `purchase` grants `all_access` for 7 days, 1 month or 12 months and remembers the bought `productId` so `customerInfo().allAccess.productIdentifier` is the real plan. `index.ts` stops exporting removed names and exports `planKindFor`, `sortPlans`, `savingPercent`, `type PlanKind`.

- [ ] **Step 1: Implement** the changes above. The mock's confirm sheet says "Simulated purchase: <title> for <price>"; its item titles are "Talino Pro weekly/monthly/yearly".
- [ ] **Step 2: Run** `npx tsc --noEmit` — remaining errors must only be in UI files still using removed names (fixed in Tasks 3 and 5).
- [ ] **Step 3: Commit** `feat(store): sell weekly, monthly and yearly subscriptions`.

### Task 3: Paywall screen, entry helper and route

**Files:**
- Create: `src/features/store/components/plan-option.tsx`, `plan-picker.tsx`, `src/features/store/screens/paywall-screen.tsx`, `src/features/store/lib/open-paywall.ts`, `src/app/paywall.tsx`
- Modify: `src/features/store/strings.ts` (replace the course-store copy with paywall copy, `en` and `fil`), `src/features/store/index.ts`, `src/app/_layout.tsx` (register `paywall` as a modal like other sheets), every `router.push('/store')` caller (`discover/components/home-view.tsx`, `resume/screens/{tailor,import,create,document}-screen.tsx`, `resume/components/assistant-panel.tsx`, `coach/screens/coach-screen.tsx` (two), `me/screens/me-tab.tsx`, `backup/components/manual-backups-section.tsx`)
- Delete: `src/features/store/screens/store-screen.tsx`, `src/app/store.tsx`

**Interfaces:**
- Produces: `type PaywallReason = 'default' | 'courses' | 'tali' | 'resume' | 'backup'`; `openPaywall(reason?: PaywallReason): void` (pushes `/paywall?reason=…`); `PaywallScreen` (reads `reason`); `PlanPicker({ items: StoreItem[]; selectedId: string | null; onSelect(id: string): void })`; `PlanOption({ title, price, detail?, tag?, selected, onPress })` (radio; yearly shows tag "Best value" plus "Save N%").
- Behaviour: plans from `useStoreItems(OFFERING_ID or REFERRAL_OFFERING_ID)`, sorted by `sortPlans`, yearly preselected; Continue buys the selected plan (`usePurchase`), success haptic then close; cancelled is silent; pending and failed show a `Notice`; Restore via `useRestorePurchases`; already subscribed shows "You have Talino Pro" with Manage; unavailable (`StoreUnavailableError`) and offline use the existing `Notice` / `OfflineNotice`; Terms and Privacy links open the same URLs Settings uses; hero is `Tali` plus a headline per reason; benefits list (every course, project reviews and certificates, résumé tools, Tali fair use, new courses) and a Free vs Pro line.

- [ ] **Step 1: Write the failing test** `paywall-screen.test.tsx` (React Native Testing Library if the project already uses it for screens, else a pure test of `openPaywall` and the reason → headline mapping): `openPaywall('tali')` calls `router.push` with pathname `/paywall` and `reason: 'tali'`; every `PaywallReason` has a headline in both languages.
- [ ] **Step 2: Run** it — expect FAIL.
- [ ] **Step 3: Implement** the components, screen, helper, route and string changes; switch each caller to `openPaywall(<reason>)` (`courses` for course locks and the Me row, `tali` for the two chat buttons, `resume` for résumé locks, `backup` for backups, `default` for the Home all-access row).
- [ ] **Step 4: Delete** the store screen and route; run `npx tsc --noEmit`, `npm run lint`, `npx jest` — expect no errors from this task's files.
- [ ] **Step 5: Commit** `feat(store): paywall screen replaces the course store`.

### Task 4: Settings plan card

**Files:**
- Create: `src/features/store/components/plan-card.tsx`
- Modify: `src/features/settings/screens/settings-screen.tsx` (card first, above Preferences), `src/features/store/strings.ts`, `src/features/store/index.ts`

**Interfaces:**
- Consumes: `useAccess`, `useCustomerInfo`, `useManageSubscription`, `openPaywall`, `BrandGradient`, `HeroInk`.
- Produces: `PlanCard()` (no props). Free (or no plan known): gradient card, Tali's icon art not required (use `Tali size={56} mood="happy"` if it reads on the gradient, else the app icon asset), title "Upgrade to Talino Pro", subtitle "Every course, project review and certificate, plus résumé tools.", button "See plans" → `openPaywall('default')`. Subscriber: a card (not gradient) "Talino Pro", line "<Weekly|Monthly|Yearly> · Renews <date>" (or "Cancelled, Pro until <date>" when `willRenew` is false, "Payment problem" when `billingIssue`), button "Manage plan" → `useManageSubscription`. The old Settings "manage" row is removed (the card replaces it); Restore row stays.

- [ ] **Step 1: Write the failing test** `plan-card-text.test.ts` for the pure line builder `describePlan(info: SubscriptionInfo, labels, formatDate)`: weekly renewing → "Weekly · Renews …"; `willRenew: false` → "Cancelled, Pro until …"; `billingIssue` → "Payment problem" wins over the others; plan label comes from `planKindFor(info.productIdentifier)`.
- [ ] **Step 2: Run** — expect FAIL. **Step 3: Implement** `describePlan` in `lib/plans.ts`'s sibling `lib/describe-plan.ts` and `PlanCard`; wire into Settings. **Step 4: Run** tsc, lint, jest — PASS.
- [ ] **Step 5: Commit** `feat(settings): Talino Pro plan card`.

### Task 5: Remove course pricing

**Files:**
- Modify: `src/features/courses/components/course-card.tsx`, `src/features/courses/screens/course-screen.tsx`, `src/features/discover/hooks/use-course-offers.ts`, `src/features/discover/components/home-view.tsx`, `src/features/discover/components/results-view.tsx`, `src/features/courses/strings.ts` (and the discover strings), and their tests

**Interfaces:**
- `CourseCardProps.priceString` is removed. The card's status badge: `Free` for the starter, `Included` is **not** shown for owned courses (nothing changes visually for them); a course the learner does not own shows a lock icon with the label "Pro". `CourseOffer = { owned: boolean; progress: CourseProgress | null }` (no `priceString`, no `useStoreItems` call in `useCourseOffers`). Course screen: a non-owner sees "Unlock with Pro" (`lock_open`) → `openPaywall('courses')`; `buy` and `buyNoPrice` strings are removed.

- [ ] **Step 1: Update the failing tests first** (any course-card or discover test that expects a price now expects the "Pro" label; add one asserting that no `₱` appears in a locked card).
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement**. **Step 4: Run** `npx tsc --noEmit`, `npm run lint`, `npx jest` — all green.
- [ ] **Step 5: Commit** `feat(courses): no price on courses, Pro lock instead`.

### Task 6: Docs, simulator check, release notes

**Files:**
- Modify: `docs/revenuecat.md` (products: the three plans in one subscription group, entitlement `all_access` attached to all three, offering `default` with packages `$rc_weekly`, `$rc_monthly`, `$rc_annual`; remove the course, mini-course and bundle product tables; note that per-course entitlements are still granted by classes and referrals), `CLAUDE.md` (the Store and Selling bullets), `docs/BUILD_AND_RELEASE.md` only if it mentions the old store.

- [ ] **Step 1: Edit** the docs. **Step 2: Run** `npm run check` (lint, typecheck, tests) — all pass.
- [ ] **Step 3: Look at it** on the iPhone simulator in the dev build with the simulated store: open `/paywall` (through Metro's debugger router) and the Settings card; record what was seen and not seen in `CLAUDE.md` (no taps are possible in the simulator).
- [ ] **Step 4: Commit** `docs: subscription plans, paywall and plan card`.
