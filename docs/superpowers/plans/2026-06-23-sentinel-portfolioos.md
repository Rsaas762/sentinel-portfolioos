# Sentinel PortfolioOS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan phase-by-phase. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality portfolio platform (public site + admin CMS) for a cybersecurity/full-stack student, runnable with zero config and upgradeable to Supabase.

**Architecture:** Next.js App Router + TS + Tailwind. A repository layer (`lib/data`) selects a Supabase or demo-seed provider based on env. Mutations are Server Actions guarded by Zod + session + audit logging. AI helper uses Claude when keyed, deterministic templates otherwise.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, Lucide, Zod, @supabase/supabase-js + @supabase/ssr, Vitest.

## Global Constraints

- Brand name exactly: **Sentinel PortfolioOS**; tagline exactly: **Turn projects into proof.**
- Must `npm run lint`, `npm run typecheck`, `npm run build` clean before "done".
- Zero-config: app must build & run with NO env vars (demo mode).
- No `dangerouslySetInnerHTML` anywhere. Markdown rendered via safe renderer.
- Only `NEXT_PUBLIC_*` env reaches the client. Service-role key server-only.
- All mutations re-validate server-side with the same Zod schema.
- Honest wording: never claim "guaranteed secure"; AI output labeled "draft".
- Vercel-compatible (no Node-only filesystem writes at runtime).

---

## File structure

```
src/
  app/
    (public)/               # public layout (navbar + footer)
      page.tsx              # home
      projects/page.tsx
      projects/[slug]/page.tsx
      skills/page.tsx
      about/page.tsx
      experience/page.tsx
      certifications/page.tsx
      contact/page.tsx
      cv/page.tsx
    admin/
      layout.tsx            # sidebar shell + auth guard
      login/page.tsx
      page.tsx              # dashboard
      projects/...          # list + edit
      skills/page.tsx
      experience/page.tsx
      certifications/page.tsx
      testimonials/page.tsx
      messages/page.tsx
      settings/page.tsx
    api/contact/route.ts    # contact submit (rate-limit + honeypot)
    icon.tsx                # favicon (SVG)
    layout.tsx, globals.css
  components/
    brand/                  # LogoMark, Logo
    ui/                     # button, card, input, textarea, badge, etc.
    public/                 # hero, project-card, skill-grid, timeline, etc.
    admin/                  # sidebar, data-table, entity forms, ai-assistant
  lib/
    data/                   # repository interface + provider selector
      index.ts, types.ts
      seed/                 # typed fixtures
      supabase/             # supabase-backed repo
      demo/                 # seed-backed repo
    supabase/               # server/client/middleware clients
    validation/             # zod schemas
    ai/                     # generateCaseStudy + guardrails + fallback
    actions/                # server actions (per entity)
    utils.ts, markdown.ts, rate-limit.ts
  middleware.ts             # admin route guard + supabase session refresh
database/ schema.sql, seed.sql
docs/ ...
```

---

## Phase 1 — Inspect & plan
- [x] Folder inspected (empty), toolchain verified (Node 22, npm 10, git 2.50).
- [x] Design spec + this plan committed.

## Phase 2 — Next.js project setup

**Deliverable:** Scaffolded Next.js app that builds, with deps, scripts, Tailwind theme, base layout/fonts, UI primitives, and `cn` util.

- [ ] Scaffold with `create-next-app` (TS, Tailwind, app router, src dir, eslint, import alias `@/*`).
- [ ] Add deps: `zod @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge class-variance-authority`; dev: `vitest @vitejs/plugin-react vite-tsconfig-paths`.
- [ ] Add scripts: `typecheck` (`tsc --noEmit`), `test` (`vitest run`).
- [ ] Configure Tailwind brand tokens (slate/navy + cyan/emerald accent), dark mode, fonts (Inter + JetBrains Mono).
- [ ] Build UI primitives: `button card input textarea label badge select separator skeleton` (cva variants).
- [ ] Add `lib/utils.ts` (`cn`), root `layout.tsx` with metadata + theme.
- [ ] **Gate:** `npm run typecheck` + `npm run build` clean. Commit.

## Phase 3 — Database schema, seed, data layer

**Deliverable:** SQL schema with RLS + audit triggers, seed SQL, TS types, seed fixtures, repository interface and provider selector with a passing unit test.

- [ ] `database/schema.sql`: all 10 tables, enums, indexes, RLS policies, `audit_logs` trigger function, `updated_at` trigger.
- [ ] `database/seed.sql`: profile, 6 projects + sections, skills (all 6 categories), experience, certifications, testimonials, site_settings.
- [ ] `lib/data/types.ts`: TS interfaces mirroring tables.
- [ ] `lib/data/seed/*.ts`: typed fixtures (mirror seed.sql) — six projects with full case studies.
- [ ] `lib/data/demo/repo.ts`: read methods over fixtures; writes are no-ops returning a "demo mode" marker.
- [ ] `lib/data/supabase/repo.ts`: read/write via supabase clients.
- [ ] `lib/data/index.ts`: `getRepo()` selects provider by `isSupabaseConfigured()`.
- [ ] **Test (Vitest):** `getRepo()` returns demo provider when env unset; demo `listProjects()` returns 6; `getProject(slug)` returns sections.
- [ ] **Gate:** `npm test` + `typecheck`. Commit.

## Phase 4 — Logo & brand system

**Deliverable:** `LogoMark`, `Logo` (sm/md/lg), favicon, theme toggle.

- [ ] `components/brand/logo-mark.tsx` — inline SVG shield + card + spark, currentColor + accent.
- [ ] `components/brand/logo.tsx` — mark + wordmark, size prop.
- [ ] `app/icon.tsx` — SVG favicon from the mark.
- [ ] `components/theme-toggle.tsx` + theme provider (class strategy, no flash).
- [ ] **Gate:** typecheck/build. Commit.

## Phase 5 — Public site

**Deliverable:** All 9 public pages, polished, reading from the repository, responsive, light/dark.

- [ ] Public `layout.tsx`: navbar (Logo + nav + theme toggle) + footer.
- [ ] Home: hero (name, tagline, CTAs, security motif), featured projects, skills teaser, CTA band.
- [ ] Projects: filter by category/status, `ProjectCard` (tech badges, status, category, links).
- [ ] Project detail `[slug]`: case-study layout from `project_sections` (problem/solution/tech/security/learned/screenshots), GitHub + demo links, safe markdown.
- [ ] Skills: grouped by 6 categories with proficiency meters.
- [ ] About: bio, focus areas, values, CV-ready summary block.
- [ ] Experience: vertical timeline with highlights.
- [ ] Certifications: cards with issuer/status/credential link.
- [ ] Contact: validated form (client Zod) posting to `/api/contact`, success/error states, honeypot field.
- [ ] CV: structured preview (summary, skills, experience, certs, projects) + "Download/Print" (print stylesheet) + optional external CV link from settings.
- [ ] Shared SEO metadata per page; `not-found` + `loading` states.
- [ ] **Gate:** typecheck/build. Manual nav check. Commit.

## Phase 6 — Contact pipeline & security plumbing

**Deliverable:** Contact API with server Zod validation, honeypot, in-memory rate-limit, IP hashing, persistence via repo; documented spam strategy.

- [ ] `lib/validation/contact.ts` Zod schema (shared).
- [ ] `lib/rate-limit.ts` — sliding-window in-memory limiter (documented as per-instance; Redis/Upstash noted for prod).
- [ ] `app/api/contact/route.ts` — validate, honeypot reject, rate-limit, hash IP (sha256 + salt), `repo.createMessage()`; demo mode returns success without persistence.
- [ ] **Test:** schema rejects bad email / too-long message; honeypot path returns 200 without insert.
- [ ] **Gate:** test/typecheck/build. Commit.

## Phase 7 — Admin auth & dashboard shell

**Deliverable:** Supabase server/client/middleware clients, admin layout with sidebar + auth guard, login page, demo-mode banner, dashboard with stats.

- [ ] `lib/supabase/{server,client,middleware}.ts` using `@supabase/ssr`.
- [ ] `middleware.ts` — refresh session; redirect unauthenticated `/admin/*` (except `/admin/login`) to login when Supabase configured; allow demo mode through with banner.
- [ ] `app/admin/layout.tsx` — sidebar (Logo + nav + sign out), `DemoModeBanner`.
- [ ] `app/admin/login/page.tsx` — email/password (Supabase), or demo notice.
- [ ] `app/admin/page.tsx` — counts (projects/skills/messages/certs), recent audit activity, quick links.
- [ ] **Gate:** typecheck/build. Commit.

## Phase 8 — Admin CRUD

**Deliverable:** Working create/edit/delete across entities via Server Actions (Zod + session + audit), with data tables and forms. Demo mode shows non-persistent toast.

- [ ] `lib/validation/*` Zod schemas for project, skill, experience, certification, testimonial, settings.
- [ ] `lib/actions/*` Server Actions per entity: auth check → Zod parse → repo write → audit log → `revalidatePath`.
- [ ] `components/admin/data-table.tsx` generic table; entity forms with inline validation.
- [ ] Pages: projects (list + create/edit incl. sections editor), skills, experience, certifications, testimonials, messages (inbox: read/archive), settings.
- [ ] **Test:** each Zod schema accepts a valid sample and rejects a known-bad one.
- [ ] **Gate:** test/typecheck/build. Commit.

## Phase 9 — AI case-study assistant

**Deliverable:** `generateCaseStudy` with Claude + deterministic fallback, guardrails, wired into the project editor with a "draft" disclaimer.

- [ ] `lib/ai/guardrails.ts` — system prompt + honesty rules, exported.
- [ ] `lib/ai/fallback.ts` — deterministic templates for the 5 output kinds from raw notes.
- [ ] `lib/ai/index.ts` — `generateCaseStudy(notes, kind)`: use Claude if `ANTHROPIC_API_KEY`, else fallback; never throw to UI.
- [ ] `app/api/ai/route.ts` — server endpoint (auth-guarded) calling the above.
- [ ] `components/admin/ai-assistant.tsx` — notes in, kind selector, generate, copy-to-field, "AI draft — review before publishing" banner.
- [ ] **Test:** fallback returns non-empty structured text for each kind; output contains no invented tokens beyond input (basic guardrail assertion); selector defaults correctly.
- [ ] **Gate:** test/typecheck/build. Commit.

## Phase 10 — Docs & security artifacts

**Deliverable:** All required docs and `.env.example`.

- [ ] `README.md` (all required sections incl. CV-ready description), `SECURITY.md`, `ROADMAP.md`, `.env.example`.
- [ ] `docs/product-brief.md`, `docs/demo-script.md`, `docs/portfolio-strategy.md`, `docs/cv-description.md`, `docs/deployment.md`.
- [ ] **Gate:** links/paths sane. Commit.

## Phase 11 — Polish

- [ ] Accessibility pass (labels, focus rings, alt text, color contrast), empty/loading/error states, mobile nav, micro-interactions, consistent spacing, OG metadata.
- [ ] **Gate:** typecheck/build. Commit.

## Phase 12 — Quality gate & fixes
- [ ] `npm run lint` → fix all. `npm run typecheck` → fix all. `npm test` → green. `npm run build` → success.
- [ ] Commit.

## Phase 13 — Final report
- [ ] Provide: what was built, how to run, env vars, Supabase setup, demo flow, known limitations, next improvements.

---

## Self-review notes
- Spec coverage: all 9 public + 9 admin pages, 10 tables, RLS, audit, AI+fallback, logo, contact, docs mapped to phases 2–10. ✓
- No-placeholder: phases name concrete files; code written during execution. ✓
- Type consistency: repository interface defined once in `lib/data/types.ts` and consumed by both providers + actions. ✓
