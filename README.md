# LoadMaster AI

AI-powered logistics content generator for trucking, freight, and logistics companies. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Features

- **AI Content Generator** — enter a business type/niche and instantly get:
  - A viral Instagram/TikTok caption
  - 10–15 relevant hashtags
  - A brand slogan
  - A 4–6 scene short video script
  - An AI video prompt for Runway / Pika / Luma
- **Dual generation engine** — uses OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is set, and automatically falls back to a built-in smart template engine when it isn't (or if the API call fails), so the app always works.
- **Dark / light mode** with smooth transitions (next-themes)
- **Responsive, animated UI** — Tesla/Stripe-inspired dark gradient design with neon blue accents
- **Dashboard** — generation history, expand/collapse, delete, copy-to-clipboard, download as TXT/PDF, share
- **Auth** — email/password signup & login (see note below)
- **Credit system** — Free plan: 3 generations/day. Pro plan: unlimited.

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- next-themes (dark/light mode)
- lucide-react (icons)
- jsPDF (client-side PDF export)

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Enabling real AI generation (optional)

Copy `.env.example` to `.env.local` and add your OpenAI key:

```bash
cp .env.example .env.local
```

```
OPENAI_API_KEY=sk-...
```

Without a key, `/api/generate` automatically uses the built-in template engine in `lib/generator.ts` — no setup required.

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo in [Vercel](https://vercel.com/new).
3. (Optional) Add the `OPENAI_API_KEY` environment variable in the Vercel project settings.
4. Deploy — no other configuration is required.

You can also deploy directly from the CLI:

```bash
npm i -g vercel
vercel
```

## Important note on auth & data storage

To keep this project a **zero-backend, instantly deployable** app, authentication and generation history currently use `localStorage` on the client (see `lib/auth.tsx`, `lib/storage.ts`, `lib/credits.ts`). This is intentional so the app is fully functional the moment it's deployed, with no database to provision.

For a real production launch with multiple devices, teams, or billing, swap in:

- **Auth**: [NextAuth.js](https://next-auth.js.org/), [Clerk](https://clerk.com/), or [Supabase Auth](https://supabase.com/auth)
- **Database**: Postgres (Supabase/Neon), Prisma ORM
- **Billing**: [Stripe](https://stripe.com/) for the Free/Pro subscription flow

The `useAuth()` hook interface (`login`, `signup`, `logout`, `user`, `upgradeToPro`) is designed as a drop-in so this swap only requires changes inside `lib/auth.tsx`.

## Project structure

```
app/
  page.tsx              Landing page
  pricing/page.tsx       Pricing page
  login/page.tsx         Login page
  signup/page.tsx        Signup page
  dashboard/page.tsx     Protected dashboard (generator + history)
  api/generate/route.ts  Generation API route (OpenAI + fallback)
components/              UI components
lib/
  auth.tsx               Client-side auth context
  credits.ts              Daily free-tier usage limiting
  storage.ts              Generation history persistence
  generator.ts             Fallback smart-template content engine
  openai.ts                OpenAI API integration
  types.ts                 Shared TypeScript types
```

## License

MIT — build on top of this freely for your own SaaS.
