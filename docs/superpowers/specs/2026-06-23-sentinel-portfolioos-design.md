# Sentinel PortfolioOS — Design Document

**Date:** 2026-06-23
**Status:** Approved (data/auth = Hybrid; scope = Full platform)
**Tagline:** Turn projects into proof.

## 1. Purpose

A portfolio *platform* (not a static site) for a cybersecurity / full-stack student who
wants to (a) get hired and (b) present freelance-ready work. It has a polished public
portfolio and a private admin dashboard for managing all content.

The differentiator vs. a generic portfolio template: project pages are structured
**case studies** (problem → solution → security considerations → what I learned), and
the owner manages everything through an authenticated CMS rather than editing code.

## 2. Audience

Recruiters, internship supervisors, small-business clients, teachers, and technical
interviewers. The bar: looks like a serious product, not a template.

## 3. Key architectural decisions

### 3.1 Hybrid data layer (zero-config demo → real Supabase)

All content is read through a repository interface in `lib/data/`. Two providers sit
behind it, selected at runtime:

- **Supabase provider** — active when `NEXT_PUBLIC_SUPABASE_URL` and keys are set. Real
  Postgres + Row Level Security + Supabase Auth.
- **Demo provider** — active when those env vars are absent. Serves typed seed fixtures
  (`lib/data/seed/*`) covering the six demo projects, skills, experience, certs,
  testimonials, and settings.

Consequence: `npm run dev` / `npm run build` work with **zero configuration** and the
site looks complete. Adding Supabase env vars upgrades it to a live CMS with no code
changes. This is the "fallback mode" requirement applied to the whole platform.

### 3.2 Admin auth

- **Supabase configured:** real Supabase Auth (email + password). Admin routes are
  gated by middleware that checks the session; RLS enforces row access at the DB.
- **Not configured (demo mode):** admin is reachable via a clearly-labeled
  **read-only demo mode**. A banner states "Demo mode — changes are not saved." Mutations
  return a friendly toast and do not persist. No fake secrets, no backdoor in production:
  demo mode only activates when Supabase env vars are genuinely absent.

### 3.3 Mutations via Server Actions + Zod

Every create/edit/delete is a Next.js Server Action. Each action: (1) re-validates input
with the shared Zod schema server-side, (2) checks the session, (3) performs the write,
(4) records an `audit_logs` row. Client forms use the same Zod schema for instant
feedback. No mutation trusts client input.

### 3.4 AI case-study assistant with fallback

`lib/ai/` exposes `generateCaseStudy(notes, kind)` where `kind` ∈ {professional summary,
recruiter description, technical explanation, security considerations, CV bullets}.

- **`ANTHROPIC_API_KEY` set:** calls Claude (`claude-opus-4-8` default, configurable) with
  a system prompt enforcing honesty guardrails.
- **No key:** deterministic, template-based generator transforms the raw notes into
  structured prose. Always available, never blocks the UI.

**Honesty guardrails (both modes):** outputs are drafts only; never invent experience,
metrics, employers, or skills not present in the input; no guaranteed-security claims;
wording stays portfolio-safe. These rules live in `lib/ai/guardrails.ts` and are surfaced
in the UI ("AI draft — review before publishing").

## 4. Data model (Postgres)

Tables: `profiles`, `projects`, `project_sections`, `skills`, `experience`,
`certifications`, `testimonials`, `contact_messages`, `site_settings`, `audit_logs`.

- `projects` — title, slug, short_description, category, status, difficulty, tech_stack
  (text[]), github_url, demo_url, cover_image, featured, sort_order, timestamps.
- `project_sections` — FK→projects, kind (enum: problem, solution, tech, security,
  learned, screenshots), heading, body (markdown-as-plain-text, rendered safely),
  sort_order. Drives the case-study layout.
- `skills` — name, category (enum: cybersecurity, frontend, backend, databases, tools,
  operating_systems), proficiency (1-5), sort_order.
- `experience` — role, organization, start/end, summary, highlights (text[]), location.
- `certifications` — name, issuer, issued_on, credential_url, status.
- `testimonials` — author, role, quote, source_url, approved (bool).
- `contact_messages` — name, email, subject, message, status (new/read/archived),
  ip_hash, created_at. **Public insert only**; reads require auth (RLS).
- `site_settings` — single-row key/value for hero text, social links, CV URL, AI on/off.
- `audit_logs` — actor, action, entity, entity_id, diff (jsonb), created_at.

RLS: public `SELECT` on published portfolio tables; `contact_messages` allows anon
`INSERT` only; all writes elsewhere require `auth.role() = 'authenticated'`. SQL lives in
`database/schema.sql`; demo content in `database/seed.sql` (and mirrored as TS fixtures).

## 5. Pages

**Public:** Home (hero + featured projects + skills teaser + CTA), Projects (filterable
grid), Project detail/case study, Skills (grouped by category), About, Experience
(timeline), Certifications, Contact (validated form), CV (preview + download).

**Admin:** Login, Dashboard (stats + recent activity), Manage Projects (+ sections + AI
helper), Skills, Experience, Certifications, Testimonials, Contact messages (inbox), Site
settings.

## 6. Brand & UI

Cybersecurity-inspired but professional and bright-leaning: deep slate/navy + a signal
accent (cyan/emerald), generous whitespace, mono accents for "security" texture, subtle
grid/shield motifs. shadcn/ui primitives + Lucide icons + Tailwind. Light and dark themes.

**Logo system** (`components/brand/`): `LogoMark` (shield enclosing a document/card with a
spark), `Logo` (mark + "Sentinel PortfolioOS"), sizes `sm|md|lg`, inline SVG, used in
navbar, admin sidebar, login, and favicon (SVG).

## 7. Security summary

Zod everywhere (client + server), Server-Action validation, Supabase Auth + RLS, audit
logging, no `dangerouslySetInnerHTML` (markdown rendered through a safe renderer/escaped),
env hygiene (only `NEXT_PUBLIC_*` reaches the client), contact-form rate-limit + honeypot
+ IP-hash design, documented spam mitigations, `SECURITY.md`. Honest wording throughout —
no "guaranteed secure" claims.

## 8. Deliverables (files)

Code: full Next.js app. Docs: `README.md`, `SECURITY.md`, `ROADMAP.md`, `.env.example`,
`database/schema.sql`, `database/seed.sql`, `docs/product-brief.md`,
`docs/demo-script.md`, `docs/portfolio-strategy.md`, `docs/cv-description.md`,
`docs/deployment.md`.

## 9. Quality gate

`npm run lint`, `npm run typecheck`, `npm run build` all green before "done". Vercel-
compatible. Demo data realistic for a cyber/full-stack student.

## 10. Non-goals (YAGNI for this build)

Multi-user/teams, real email delivery (contact stored in DB; SMTP is a documented
extension), image upload pipeline (screenshot placeholders), analytics, i18n, payments.
