# LoadMaster AI

AI-powered logistics content generator for trucking, freight, and logistics companies. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

## Features

- **AI Content Generator** — enter a business type/niche and instantly get:
  - A viral Instagram/TikTok caption
  - 10–15 relevant hashtags
  - A brand slogan
  - A 4–6 scene short video script
  - An AI video prompt for Runway / Pika / Luma
- **Dual generation engine** — uses OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is set, and automatically falls back to a built-in smart template engine when it isn't (or if the API call fails), so the app always works.
- **Real backend (Supabase)** — email/password auth, Postgres database, and Row Level Security so users can only ever read/write their own data.
- **Dashboard** — generation history (stored in the database), expand/collapse, delete, copy-to-clipboard, download as TXT/PDF, share.
- **Credit system** — Free plan: 3 generations/day, enforced server-side. Pro plan: unlimited.
- **Click & Payme webhook handlers** — ready-to-configure endpoints for Uzbekistan's two major payment providers (see below).
- Dark / light mode, responsive, animated UI.

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth) via `@supabase/ssr`
- next-themes (dark/light mode)
- lucide-react (icons)
- jsPDF (client-side PDF export)

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, go to **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates:
   - `profiles` — one row per user (name, email, plan), auto-created on signup
   - `generations` — saved AI generations per user
   - `daily_usage` — tracks free-plan daily generation counts
   - `payments` — Click/Payme transaction records
   - Row Level Security policies so users can only see their own data
   - A trigger that blocks anyone but the service role from changing `plan` (so a user can never upgrade themselves without a real payment)
3. Go to **Settings → API** and copy your Project URL, `anon` key, and `service_role` key.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in at minimum:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

To test the Pro plan before Click/Payme are connected, also set `ALLOW_DEV_UPGRADE=true` locally.

## 3. Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign up, and try generating content.

### Enabling real AI generation (optional)

Add an OpenAI key to `.env.local`:
```
OPENAI_API_KEY=sk-...
```
Without it, `/api/generate` automatically uses the built-in template engine in `lib/generator.ts`.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel project's **Settings → Environment Variables**.
4. Deploy.

## Connecting Click or Payme

Webhook handlers are already built at `app/api/click/route.ts` and `app/api/payme/route.ts`, following each provider's official protocol (Prepare/Complete for Click, JSON-RPC for Payme). To go live:

1. Register as a **YaTT (individual entrepreneur)** or legal entity — both providers require this.
2. Get your merchant credentials from [my.click.uz](https://my.click.uz) or [business.payme.uz](https://business.payme.uz).
3. Add `CLICK_SERVICE_ID` / `CLICK_SECRET_KEY` or `PAYME_MERCHANT_ID` / `PAYME_SECRET_KEY` to your environment variables.
4. Set the webhook URL in each provider's merchant cabinet to `https://yourdomain.com/api/click` or `https://yourdomain.com/api/payme`.
5. Update the "Upgrade to Pro" button (`components/PricingCards.tsx`) to redirect to your Click/Payme checkout URL, passing the logged-in user's Supabase ID as the transaction's `merchant_trans_id` (Click) or `account.user_id` (Payme), so the webhook knows which account to upgrade once payment is confirmed.
6. Once this is live, remove/leave off `ALLOW_DEV_UPGRADE` in production.

## Project structure

```
app/
  page.tsx                 Landing page
  pricing/page.tsx          Pricing page
  login/, signup/           Auth pages
  dashboard/page.tsx        Protected dashboard (generator + history)
  api/generate/route.ts     Generation endpoint (auth + credits + AI/fallback + save)
  api/generations/route.ts  List/delete a user's saved generations
  api/dev-upgrade/route.ts  Guarded test-only Pro upgrade (no real payment)
  api/click/route.ts        Click merchant webhook (Prepare/Complete)
  api/payme/route.ts        Payme merchant webhook (JSON-RPC)
components/                 UI components
lib/
  auth.tsx                  Supabase-backed auth context
  credits.ts                Reads today's free-tier usage for UI display
  storage.ts                Client wrapper around /api/generations
  generator.ts              Fallback smart-template content engine
  openai.ts                 OpenAI API integration
  supabase/client.ts         Browser Supabase client
  supabase/server.ts         Server + admin Supabase clients
  types.ts                   Shared TypeScript types
supabase/schema.sql          Full database schema — run this first
middleware.ts                 Keeps Supabase auth sessions fresh
```

## License

MIT — build on top of this freely for your own SaaS.

