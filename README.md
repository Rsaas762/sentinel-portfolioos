# Sentinel PortfolioOS

> **Turn projects into proof.**
> A portfolio operating system for cybersecurity and full-stack engineers — a polished public portfolio backed by a private admin dashboard.

Sentinel PortfolioOS is not a single-page portfolio template. It's a small
*platform*: a public site that presents your work as structured **case studies**,
and an authenticated **admin dashboard** where you manage every piece of content
(projects, skills, experience, certifications, testimonials, messages, settings)
without touching code.

It runs with **zero configuration** out of the box — `npm install && npm run dev`
gives you a complete, realistic demo. Add Supabase credentials and it becomes a
live CMS; add an Anthropic API key and the AI writing assistant uses Claude.

---

## Table of contents

- [Overview](#overview)
- [Who it's for](#who-its-for)
- [The problem it solves](#the-problem-it-solves)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Screenshots](#screenshots)
- [Quick start (local development)](#quick-start-local-development)
- [Environment variables](#environment-variables)
- [Database setup (Supabase)](#database-setup-supabase)
- [Deployment](#deployment)
- [Security & privacy](#security--privacy)
- [The AI case-study assistant](#the-ai-case-study-assistant)
- [Project structure](#project-structure)
- [Roadmap](#roadmap)
- [CV-ready project description](#cv-ready-project-description)
- [License & honesty note](#license--honesty-note)

---

## Overview

| | |
|---|---|
| **Public site** | Home, Projects, Project case study, Skills, About, Experience, Certifications, Contact, CV |
| **Admin dashboard** | Login, Dashboard, Projects (+ sections + AI), Skills, Experience, Certifications, Testimonials, Messages, Settings |
| **Data** | 10 Postgres tables with Row-Level Security and an audit trail |
| **Modes** | Zero-config **demo** (seed data) → **live CMS** when Supabase is connected |

## Who it's for

- **Students** entering cybersecurity and/or full-stack development who want a
  credible, recruiter-ready presence.
- **Freelancers** who need to present client-ready work and take enquiries.
- Anyone who wants a portfolio they can **update through a dashboard**, not by
  editing code and redeploying.

## The problem it solves

Most student portfolios are a flat list of repo links. They don't tell a story,
they're awkward to keep current, and they rarely show the *security thinking* that
employers in this field look for. Sentinel PortfolioOS fixes that:

- Every project is a **case study** — problem, solution, how it's built, security
  considerations, and what you learned.
- Content is managed in an **admin dashboard**, so updating it takes minutes.
- The whole thing is built with **honest, security-first engineering** you can talk
  about in an interview.

## Features

- **Strong public homepage** — hero, live "proof" terminal, stats, featured work,
  skills overview, testimonial, and CTAs.
- **Case-study project pages** — structured sections with safe rendering, tech
  stack, status/category/difficulty, GitHub + live-demo links, screenshot
  placeholders.
- **Filterable projects grid** by category.
- **Skills by domain** — cybersecurity, frontend, backend, databases, tools,
  operating systems — with honest 1–5 proficiency meters.
- **Experience timeline**, **certifications** (earned / in-progress / planned),
  **About** with a CV-ready summary, and a **printable CV** page.
- **Validated contact form** — client + server Zod validation, honeypot,
  rate limiting, IP hashing, stored to the database.
- **Admin dashboard** — stats, recent activity, and full create/edit/delete for
  every content type, including a sections editor for case studies.
- **AI case-study assistant** — rewrites raw notes into a professional summary,
  recruiter-friendly description, technical explanation, security considerations,
  or CV bullets — with strict honesty guardrails and a no-API fallback.
- **Light/dark themes**, responsive layout, accessible components, SEO metadata.
- **Reusable inline-SVG logo system** (`LogoMark`, `Logo`) and SVG favicon.

## Tech stack

- **Framework:** Next.js 16 (App Router, Server Actions, RSC) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, shadcn-style UI primitives, Lucide icons
- **Validation:** Zod (shared client + server schemas)
- **Auth & DB:** Supabase (Postgres + Auth + Row-Level Security)
- **AI:** Anthropic Claude (`@anthropic-ai/sdk`) with a deterministic fallback
- **Testing:** Vitest
- **Deployment:** Vercel-compatible

## Screenshots

> _Add real screenshots here once deployed._

| Home | Case study | Admin dashboard |
|---|---|---|
| _`docs/screenshots/home.png`_ | _`docs/screenshots/case-study.png`_ | _`docs/screenshots/admin.png`_ |

| Skills | Project editor + AI | Contact |
|---|---|---|
| _`docs/screenshots/skills.png`_ | _`docs/screenshots/editor.png`_ | _`docs/screenshots/contact.png`_ |

## Quick start (local development)

**Prerequisites:** Node.js 18.18+ (tested on Node 22) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (no configuration needed — demo mode)
npm run dev
# → http://localhost:3000  (public site)
# → http://localhost:3000/admin  (admin, demo mode — changes aren't saved)
```

That's it for a demo. Useful scripts:

```bash
npm run dev         # start the dev server
npm run build       # production build
npm run start       # run the production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest unit tests
```

## Environment variables

All variables are **optional** — see [`.env.example`](.env.example) for the full,
commented list. Copy it to `.env.local` and fill in what you need.

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | For live CMS | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live CMS | Supabase anon key (public, RLS-protected). |
| `ANTHROPIC_API_KEY` | For real AI | Enables Claude-written drafts; **server-only**. |
| `ANTHROPIC_MODEL` | Optional | Model id (default `claude-opus-4-8`). |
| `IP_HASH_SALT` | Recommended | Salt for hashing contact-form IPs. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Absolute base URL for metadata/OG. |

**Env hygiene:** only `NEXT_PUBLIC_*` values are exposed to the browser. The
Anthropic key and IP salt are read only in server code. Never commit `.env.local`.

## Database setup (Supabase)

The app runs on seed data until you connect Supabase. To go live:

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`database/schema.sql`](database/schema.sql) — it creates
   all tables, enums, indexes, **Row-Level Security policies**, an `updated_at`
   trigger, and an **audit-logging trigger**.
3. (Optional) run [`database/seed.sql`](database/seed.sql) to load the sample
   content, then edit it from the admin dashboard.
4. Copy **Settings → API** values into `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Create your admin user under **Authentication → Users** (add a user with a
   password). Sign in at `/admin/login`.

Full walkthrough: [`docs/deployment.md`](docs/deployment.md).

## Deployment

Deploys cleanly to **Vercel**:

1. Push this repo to GitHub.
2. Import it into Vercel (framework auto-detected as Next.js).
3. Add the environment variables from `.env.example`.
4. Deploy.

Details and alternatives: [`docs/deployment.md`](docs/deployment.md).

## Security & privacy

Sentinel PortfolioOS is **security-conscious** and **privacy-aware** — designed
with security basics in mind and a **GDPR-conscious foundation**, while staying
honest about its limits (see [`SECURITY.md`](SECURITY.md) for the full model). It
is a sensible baseline, **not** a guarantee of being "fully secure" or GDPR
compliant. Highlights:

- **Validation everywhere** — shared Zod schemas run on the client *and* are
  re-validated on the server; the database never trusts client input.
- **Supabase Auth + Row-Level Security** — public read on portfolio content,
  anon insert-only on contact messages, authenticated-only writes elsewhere,
  enforced at the database.
- **Audit logging** — a database trigger records every content change with the
  acting user's email; it can't be bypassed by application code.
- **Safe rendering** — stored content is rendered as escaped React text, never as
  raw HTML. There is **no** untrusted `dangerouslySetInnerHTML`.
- **Contact-form hardening** — honeypot field, in-memory rate limiting (with a
  documented per-instance limitation), and SHA-256 IP hashing (raw IPs are never
  stored).
- **Env hygiene** — secrets are server-only; only `NEXT_PUBLIC_*` reaches the
  client, and secret-touching modules import `server-only` so the build fails if
  one leaks into a client bundle.
- **Privacy-aware** — data minimisation (only what the contact form collects), no
  analytics or tracking, and honest framing rather than a compliance claim.
- **Honest wording** — the app never claims to be "fully secure" or GDPR
  compliant. Security and privacy are trade-offs, and the docs say so.

## The AI case-study assistant

In the project editor, paste raw notes and generate a draft of one of:
**professional summary**, **recruiter-friendly description**, **technical
explanation**, **security considerations**, or **CV bullet points**.

- With `ANTHROPIC_API_KEY` set → uses **Claude** with a guardrail system prompt.
- Without a key → uses a **deterministic template generator** (always available).

**Guardrails (both modes):** suggestions are **drafts only**; they use *only* the
information in your notes; they never invent experience, employers, metrics, or
skills; and they never claim guaranteed security. The UI labels every output as a
draft to review before publishing.

## Project structure

```
src/
  app/
    (public)/        # public site (home, projects, skills, about, …)
    admin/           # login + (panel) dashboard and managers
    api/             # contact + ai routes
  components/
    brand/  ui/  public/  admin/  icons/
  lib/
    data/            # repository interface + demo & supabase providers + seed
    supabase/        # server/client/proxy clients + config
    validation/      # zod schemas
    ai/              # generateCaseStudy + guardrails + fallback
    actions/         # server actions
database/            # schema.sql + seed.sql
docs/                # product brief, demo script, strategy, CV, deployment
```

## Roadmap

See [`ROADMAP.md`](ROADMAP.md). Near-term: image uploads for screenshots, email
delivery for contact messages, and shared-store rate limiting.

## CV-ready project description

> **Sentinel PortfolioOS — full-stack portfolio platform (Next.js, TypeScript, Supabase).**
> Designed and built a portfolio platform with a public, case-study-driven site and
> an authenticated admin CMS. Implemented a provider-based data layer that runs on
> seed data with zero configuration and upgrades to Supabase Postgres with
> Row-Level Security and audit-logging triggers. Validated all input with shared
> Zod schemas on the client and server, added a hardened contact pipeline
> (honeypot, rate limiting, IP hashing), and built an AI writing assistant
> (Anthropic Claude) with honesty guardrails and a deterministic fallback. Shipped
> with TypeScript strict mode, Vitest tests, and a green lint/typecheck/build.

## Honesty note

This portfolio is populated with **Mohamed Elhalabi's real** profile, skills,
experience, and projects (Sentinel Helpdesk AI, Sentinel WebGuard, Sentinel
PortfolioOS, and Networking & Infrastructure Labs). Project source/demo links are
intentionally left blank until each one is published, and certifications are
empty until real, verifiable credentials are earned — nothing here is invented.

Released under the MIT License — see headers / add a `LICENSE` file as needed.
