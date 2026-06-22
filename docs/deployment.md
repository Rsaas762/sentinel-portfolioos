# Deployment Guide — Sentinel PortfolioOS

This guide covers running locally, connecting Supabase, enabling the AI assistant,
and deploying to Vercel.

## 0. Prerequisites
- Node.js 18.18+ (tested on Node 22) and npm
- A [Supabase](https://supabase.com) account (free tier is fine) — optional, for the
  live CMS
- An [Anthropic API key](https://console.anthropic.com) — optional, for real AI
  drafts
- A [Vercel](https://vercel.com) account — optional, for hosting

---

## 1. Run locally (zero config)
```bash
npm install
npm run dev      # http://localhost:3000
```
No environment variables are required. The app serves seed data and the admin runs
in read-only demo mode.

---

## 2. Connect Supabase (live database + auth)

### 2.1 Create the project
1. Create a new project in Supabase. Choose a region near your users.
2. Wait for it to finish provisioning.

### 2.2 Create the schema
1. Open **SQL Editor → New query**.
2. Paste the contents of [`database/schema.sql`](../database/schema.sql) and run it.
   This creates all tables, enums, indexes, **RLS policies**, the `updated_at`
   trigger, and the **audit-logging trigger**.
3. (Optional) Run [`database/seed.sql`](../database/seed.sql) to load sample content
   you can then edit from the dashboard.

### 2.3 Verify RLS
In **Authentication → Policies**, confirm every table shows **RLS enabled** with the
expected policies (public read on content, anon insert on `contact_messages`,
authenticated writes elsewhere).

### 2.4 Wire up environment variables
From **Settings → API**, copy the values into `.env.local`:
```bash
cp .env.example .env.local
```
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
IP_HASH_SALT=$(openssl rand -hex 32)   # paste the generated value
```
Restart `npm run dev`. The app now reads from Supabase, and `/admin` requires login.

### 2.5 Create your admin user
1. **Authentication → Users → Add user** — set an email and a strong password
   (and confirm the email if your project requires it).
2. Go to `/admin/login` and sign in.

> The app does not implement public sign-up by design — there is exactly one owner.
> Create the user in the Supabase dashboard.

---

## 3. Enable the AI assistant (optional)
Add to `.env.local`:
```dotenv
ANTHROPIC_API_KEY=sk-ant-...
# ANTHROPIC_MODEL=claude-opus-4-8   # optional override
```
Without this key the assistant still works using deterministic templates. The key is
**server-only** — never prefix it with `NEXT_PUBLIC`.

---

## 4. Deploy to Vercel
1. Push the repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Next.js is auto-detected.
3. Under **Settings → Environment Variables**, add the same variables from
   `.env.example` (Production and Preview as appropriate):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY` (+ optional `ANTHROPIC_MODEL`)
   - `IP_HASH_SALT`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
4. **Deploy.**
5. Add your custom domain under **Settings → Domains** (HTTPS is automatic).

### Notes for serverless hosting
- The default contact rate limiter is **in-memory per instance**. For strict
  limits across instances, switch to a shared store (e.g. Upstash Redis) — see
  `SECURITY.md`.
- `proxy.ts` (Next.js middleware) refreshes the Supabase session and guards
  `/admin`. No extra config needed on Vercel.

---

## 5. Other hosts
Any platform that runs Next.js works (Netlify, Render, a Node server, Docker):
```bash
npm run build
npm run start    # serves the production build on $PORT (default 3000)
```
Provide the same environment variables. Ensure the platform supports Next.js
middleware/proxy for the admin session refresh.

---

## 6. Post-deploy checklist
- [ ] Public pages load; case studies render.
- [ ] `/admin/login` works with your Supabase user.
- [ ] Creating/editing content persists and appears publicly.
- [ ] Contact form stores a message (check **Messages**) with a hashed IP.
- [ ] `npm run build` is clean; `npm audit` reviewed.
- [ ] All sample content replaced with your own.

## Troubleshooting
- **Admin shows "Demo mode" after adding env vars** → restart the dev server / redeploy
  so the new variables are picked up; confirm both `NEXT_PUBLIC_SUPABASE_*` are set.
- **Login fails** → confirm the user exists in Supabase and the email is confirmed.
- **Writes don't persist** → check RLS policies were created and you're signed in.
- **AI always says "Template"** → `ANTHROPIC_API_KEY` is missing or invalid; the app
  intentionally falls back to templates rather than erroring.
