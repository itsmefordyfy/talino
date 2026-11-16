# Talino server setup (owner steps)

The server is Expo Router API routes in `src/app/api/` plus four public pages (`/c/<id>` certificates,
`/p/<slug>` portfolios, `/teacher/<code>?key=` class progress, `/talent?key=` the talent list),
deployed with EAS Hosting. Nothing has been deployed or configured yet.

1. **Supabase:** paste `supabase/migrations/20261113000000_talino.sql` into the SQL Editor of the
   shared Fordytech project (safe to re-run). Tali's chat allowance uses the existing shared
   `ai_chats` functions (CarMind's migration), so nothing else is needed.
2. **Environment (EAS Hosting → production, and `.env` locally; never `EXPO_PUBLIC_`):**
   - `GEMINI_API_KEY` (the owner's key; ask before using it for anything new). Optional `GEMINI_MODELS`.
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY`.
   - `REVIEW_SIGNING_SECRET`: a long random string (signs passed project reviews for certificates).
   - RevenueCat keys and the webhook secret: see `docs/revenuecat.md`.
   - Optional: `AI_GLOBAL_DAILY_LIMIT` (cost guard), `REFERRAL_REWARD_ENTITLEMENT` (default `mini_ai_engineering`).
3. **Deploy:** `npx expo export --platform web` then `npx eas-cli@latest deploy --prod`; set
   `EXPO_PUBLIC_API_ORIGIN` (the deployed https origin) in `.env.production.local` for release builds.
4. **Schools and employers:** create classes and employer keys with the SQL examples at the end of
   the migration file, and send the teacher or employer their link.
5. **Pages linked from Settings:** privacy policy and terms at `talino.fordytechsolutions.com/privacy`
   and `/terms` (placeholders until the marketing site has them).
