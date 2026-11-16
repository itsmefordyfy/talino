# Subscription, paywall and Settings plan card (design)

Owner's brief, 2026-11-15: "the app should be subscription based, we have monthly and weekly. The yearly would be 1,999
and weekly would be 199 in peso, create a paywall and put paywall card on the settings similar in CarMind", then "remove
pricing on each course". Approval: "continue working on the paywall and subscription" (after the plan was laid out in chat).

## Intent

Talino stops selling per course. One subscription, **Talino Pro**, unlocks every course, project review, certificate and
résumé tool. Free keeps the starter course ("AI Basics for Tech") and Tali/Tala's free daily chats. The reason: a single
price is easier to understand and to sell than 11 courses, a bundle and All-Access, and weekly gives a low first step.

## Goals

- Three auto-renewing plans in one subscription group: **weekly ₱199, monthly ₱449, yearly ₱1,999**. Monthly is a call of
  mine (the owner gave no number; ₱449 was the earlier All-Access price). Yearly is shown as "Best value" with its saving.
- A **paywall** screen (modal), modelled on CarMind's: hero, plan picker, one Continue button, Free vs Pro, terms and privacy
  links, Restore. Opened from every place that used to open the Store, with the reason that led there.
- A **plan card on Settings**, like CarMind's `UpgradeCard`: for Free a gradient upgrade card ("Upgrade to Talino Pro") that opens the
  paywall; for a subscriber a card showing the plan and renewal, with Manage.
- **No price on any course**: course cards and the course screen show a lock and "Pro", never an amount; no per-course or bundle products.

## Non-goals and anti-goals

- No server change: the server already reads one `all_access` entitlement, so the three subscriptions all unlock it.
- No free trial copy in the app text (CarMind's card leads with a trial only when the store offering carries one; the same here, automatically).
- Not a rewrite of the access checks (about 35 files call `owns()` / `ownsCourse`): keep their shape, change what they mean.
- Never lock what a learner already earned: certificates, saved progress and chats stay readable if a subscription lapses.
- Nothing is sold in TestFlight build 1: it has no RevenueCat key. The paywall must say plans are unavailable, never crash or fake a price.

## Constraints

- RevenueCat stays the store boundary; screens talk to `PurchasesService`, never the SDK. The simulated store (development) must offer
  the same three plans so the paywall can be seen without a key.
- Entitlement id stays `all_access`. Per-course entitlements (`course_*`, `mini_*`) **stay in the code**, because the server still grants
  them without a purchase (a teacher's class codes in `classes+api`, referral rewards) and the certificate check reads them; `ownsCourse`
  is unchanged. What is retired is *selling* them: the products `talino_course_*`, `talino_mini_*`, `talino_bundle_launch3` leave the
  catalog, the store screen and the simulated store. Product ids for the new plans: `talino_pro_weekly`, `talino_pro_monthly`,
  `talino_pro_yearly` (the old `talino_all_access_*` ids were never created in a store, so nothing to migrate).
- Tokens only for colour and spacing; strings in `strings.ts` (English and Filipino); iPhone look on both platforms.
- Terms of Use and Privacy Policy links beside the offer (App Store 3.1.2).

## Approaches considered

1. **Keep the Store screen and rewrite it as a plans screen** (recommended against). Least new files, but a "store" frame fits
   a catalog of courses, not a paywall, and it would keep the `/store` route and its meaning.
2. **New `features/subscription`-style paywall inside the existing `features/store`** (chosen). Keep the purchases backend, queries and
   mock (they already work), replace the catalog and the UI: a `Paywall` screen, `PlanPicker`, `PlanCard` for Settings, and
   `openPaywall(reason)`. The `/store` route is replaced by `/paywall`.
3. **Port CarMind's subscription feature wholesale.** CarMind's has Pro-feature gating, a plan-change flow, a celebration and a code
   redeemer built for a different product; most of it would be dead code here.

## Decisions (as taken)

- Access rule: unchanged. Free = starter course only (plus any course a teacher's class or a referral granted). Any active `all_access` =
  every course. `useAccess().owns(courseId)` keeps its signature.
- Tali's free allowance stays what the server says (2 new chats per rolling 24 hours); the limit card's button opens the paywall.
- Paywall reasons: `courses` (a locked course), `tali` (chat limit), `resume`, `backup`, `default`. Each leads with its own headline.
- Locked course card: lock icon and "Pro" label where the price was. Course screen: "Unlock with Pro" button opening the paywall.
- Settings: the card sits first, above Preferences. Subscribers see "Talino Pro · Weekly/Monthly/Yearly · Renews <date>" and a Manage button.
  The existing Restore and Manage rows stay lower.
- Plan pills: yearly "Best value" plus "Save N%" against paying monthly for a year; weekly has no tag.

## Left to the builder

Exact copy beyond what is above, icons, spacing, animation, and file layout inside `features/store`. Add unit tests for the
pure parts (plan ordering, savings, access rule) and update `docs/revenuecat.md` and `CLAUDE.md` in the same change.
