# Roadmap

Sentinel PortfolioOS ships as a focused MVP: a complete public site plus a working
admin CMS that runs with zero config and upgrades to Supabase. This roadmap lists
honest next steps, grouped by priority. Nothing here is promised on a date — it's a
plan, not a guarantee.

## Now (shipped in this version)
- ✅ Public site: home, projects, case studies, skills, about, experience,
  certifications, contact, CV.
- ✅ Admin: login, dashboard, full CRUD for projects (with sections), skills,
  experience, certifications, testimonials, messages, settings.
- ✅ Hybrid data layer: zero-config demo → Supabase live CMS.
- ✅ Zod validation (client + server), RLS schema, audit-logging trigger.
- ✅ Contact pipeline with honeypot, rate limiting, IP hashing.
- ✅ AI case-study assistant (Claude + deterministic fallback) with guardrails.
- ✅ Logo system, light/dark themes, Vitest tests, green lint/typecheck/build.

## Next (high value, low risk)
- **Screenshot uploads** — replace placeholders with Supabase Storage image upload
  and rendering, including alt text for accessibility.
- **Email notifications** — send contact submissions via a provider (Resend /
  Postmark) in addition to storing them.
- **Shared-store rate limiting** — move the limiter to Upstash Redis so limits hold
  across serverless instances; add Cloudflare Turnstile to the contact form.
- **Inline "use draft" wiring** — let the AI assistant write directly into a section
  body field, not just copy-to-clipboard.

## Later (nice to have)
- **Project tags & search** — free-text search and tag filtering on the projects
  page.
- **Analytics** — privacy-friendly view counts per case study (e.g. Plausible).
- **Theme presets** — a few accent palettes selectable from settings.
- **MDX case studies** — optional richer formatting with a vetted, sanitised
  renderer.
- **PDF CV export** — server-generated PDF in addition to the print view.
- **i18n** — multi-language content.

## Considered but intentionally deferred (YAGNI)
- Multi-user / team accounts — this is a single-owner product.
- A drag-and-drop page builder — overkill for structured case studies.
- A custom auth system — Supabase Auth is sufficient and safer.

## Quality goals (ongoing)
- Keep `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` green.
- Maintain accessibility (keyboard nav, labels, contrast).
- Keep `SECURITY.md` accurate as controls change.
