# Security

Sentinel PortfolioOS is built by and for people who care about security, so the
codebase tries to model good habits. This document explains the security design,
its assumptions, and — honestly — its limitations.

> **No guarantees.** Nothing here makes the application "fully secure". Security is
> an ongoing trade-off. This document describes a sensible baseline and the
> reasoning behind it, not a warranty.

## Reporting a vulnerability

If you find a security issue in this project, please open a private report (or
email the maintainer) with steps to reproduce. Please do not open a public issue
for anything exploitable until it has been addressed.

## Trust model

- **Public visitors** can read published portfolio content and submit the contact
  form. Nothing else.
- **The owner** authenticates via Supabase Auth and manages content through the
  admin dashboard.
- **Demo mode** (no Supabase configured) exposes the admin UI **read-only** with
  sample data; mutations are short-circuited and never persist. There is no
  backdoor: demo mode only activates when Supabase env vars are genuinely absent.

## Controls

### 1. Input validation (defence in depth)
All user input is validated with **Zod**. The same schemas run on the client (for
fast feedback) and again on the **server** inside API routes and Server Actions.
The server never trusts client-side validation. See `src/lib/validation/`.

### 2. Authentication & authorization
- Admin authentication uses **Supabase Auth** (email + password).
- `src/proxy.ts` refreshes the session and redirects unauthenticated `/admin`
  requests to the login page.
- The admin panel layout independently re-checks the session (defence in depth).
- Server Actions call `requireWrite()` before any mutation; if the session isn't
  authenticated, the write is refused.

### 3. Row-Level Security (RLS)
Authorization is also enforced **at the database**, so it holds even if app code
has a bug. From `database/schema.sql`:

- Portfolio tables (`projects`, `skills`, …): public `SELECT`, authenticated writes.
- `testimonials`: public sees only `approved = true`.
- `contact_messages`: anonymous `INSERT` only; reading/updating requires auth.
- `audit_logs`: authenticated `SELECT` only; rows are written by a trigger.

### 4. Audit logging
A database trigger (`audit_change()`) writes an `audit_logs` row for every
insert/update/delete on content tables, capturing the acting user's email from the
JWT. Because it lives in the database, it can't be skipped by application code.

### 5. Safe rendering (no XSS via content)
Stored content is rendered through `ProseText`, which emits **escaped React text
nodes** — paragraphs and simple bullet lists — never raw HTML. The project does
not pass untrusted data to `dangerouslySetInnerHTML`.

> **One audited exception:** `src/app/layout.tsx` injects a tiny **constant**
> theme-bootstrap script (to prevent a flash of the wrong theme) via
> `dangerouslySetInnerHTML`. It contains a hard-coded string with **no user or
> request data**, which is the standard, safe pattern used by theming libraries.
> No other code uses `dangerouslySetInnerHTML`.

### 6. Contact form: spam & abuse mitigation
The public endpoint (`src/app/api/contact/route.ts`) layers several defences:

- **Honeypot field** — a hidden `website` field; if filled, the request is
  silently accepted (HTTP 200) but never stored, so bots don't learn they were
  caught.
- **Rate limiting** — a sliding-window limiter (`src/lib/rate-limit.ts`) caps
  submissions per client (default 5/min).
- **Server-side validation** — length and format limits via Zod.
- **IP hashing** — the client IP is salted and **SHA-256 hashed** before storage
  (`hashIp`). Raw IP addresses are never persisted (data minimisation).

> **Known limitation:** the rate limiter is **in-memory and per-instance**. On
> serverless/multi-instance hosting (e.g. Vercel) each instance keeps its own
> counter, so the global limit is looser than the configured value. For stronger
> guarantees, back the limiter with a shared store such as **Upstash Redis**, and
> consider adding a CAPTCHA (e.g. Cloudflare Turnstile) for higher-traffic sites.

### 7. Secrets & environment hygiene
- Only `NEXT_PUBLIC_*` variables are exposed to the browser.
- `ANTHROPIC_API_KEY`, `IP_HASH_SALT`, and the Supabase service path are read
  **only in server code**.
- `.env.local` is git-ignored; `.env.example` documents every variable.
- The Supabase **anon** key is intended to be public; it is safe only because RLS
  restricts what it can do. Do **not** ship the service-role key to the client.

### 8. AI safety & honesty
The AI assistant (`src/lib/ai/`) is constrained by guardrails
(`guardrails.ts`) that forbid inventing experience, skills, metrics, or
guaranteed-security claims. Outputs are always labelled **drafts** for human
review. The model only receives the notes the user types — no database content.

## Assumptions & out-of-scope (be honest)

- This is a **single-owner** portfolio app; it is not hardened for multi-tenant
  use.
- Email delivery for contact messages is **not** implemented (messages are stored
  in the database). Add an email provider before relying on notifications.
- There is no image-upload pipeline; screenshots are placeholders.
- Dependency and platform security (Supabase, Vercel, npm packages) are assumed to
  be maintained and patched by you. Run `npm audit` regularly.
- A production deployment handling sensitive data would warrant additional controls
  (centralised logging, monitoring, CAPTCHA, WAF, and a security review).

## Security checklist for going live

- [ ] Run `database/schema.sql` and confirm RLS is **enabled** on every table.
- [ ] Create a strong admin password; consider enabling Supabase MFA.
- [ ] Set a unique `IP_HASH_SALT`.
- [ ] Keep `ANTHROPIC_API_KEY` server-side only.
- [ ] Replace all sample content with your own honest information.
- [ ] Run `npm audit` and address advisories.
- [ ] Consider a shared-store rate limiter + CAPTCHA if you expect traffic.
