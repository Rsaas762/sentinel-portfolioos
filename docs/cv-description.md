# CV / Résumé Descriptions — Sentinel PortfolioOS

Copy-paste-ready ways to describe this project on your CV, LinkedIn, and in
interviews. Adapt the wording to be true for *you* — describe the parts you
actually built and understand.

## One-line (CV project header)
**Sentinel PortfolioOS** — a full-stack portfolio platform (Next.js, TypeScript,
Supabase) with a public case-study site and an authenticated, security-conscious
admin CMS.

## Short (2–3 lines)
Built a portfolio platform pairing a public, case-study-driven site with an
authenticated admin dashboard. Implemented a provider-based data layer that runs on
seed data with zero configuration and upgrades to Supabase Postgres with Row-Level
Security and audit logging. Validated all input with shared Zod schemas on the
client and server.

## Full paragraph (portfolio / LinkedIn)
Designed and built **Sentinel PortfolioOS**, a portfolio operating system for
cybersecurity and full-stack engineers. The public site presents work as structured
case studies (problem, solution, architecture, security considerations, learnings),
while an authenticated admin dashboard manages all content. Engineered a
repository-based data layer with two interchangeable providers — a zero-config demo
(seed data) and Supabase Postgres — selected at runtime, so the app builds and demos
without any setup and becomes a live CMS once credentials are added. Enforced
security in depth: shared Zod validation on client and server, Supabase Auth with
Row-Level Security, a database audit-logging trigger, a hardened contact pipeline
(honeypot, rate limiting, SHA-256 IP hashing), and safe escaped rendering with no
untrusted HTML. Added an AI writing assistant (Anthropic Claude) that drafts
case-study copy under strict honesty guardrails, with a deterministic fallback when
no API key is present. Shipped in TypeScript strict mode with Vitest tests and a
clean lint/typecheck/build.

## CV bullet points (pick 3–5)
- Built a full-stack portfolio platform with **Next.js (App Router), TypeScript,
  Tailwind CSS, and Supabase**, deployed Vercel-ready.
- Designed a **provider-based data layer** enabling a zero-config demo that upgrades
  to a Supabase-backed CMS with no code changes.
- Implemented **defence-in-depth security**: shared **Zod** validation on client and
  server, **Supabase Auth + Row-Level Security**, and a database **audit-logging
  trigger**.
- Hardened a public contact pipeline with a **honeypot, rate limiting, and SHA-256
  IP hashing** (no raw IPs stored).
- Built an **AI case-study assistant** (Anthropic Claude) with honesty guardrails
  and a deterministic no-API fallback.
- Maintained quality with **TypeScript strict mode, Vitest unit tests**, and a green
  **lint / typecheck / build**.

## Skills this project demonstrates
Full-stack web development · TypeScript · React Server Components · REST/Server
Actions · PostgreSQL schema design · Row-Level Security · authentication ·
input validation · secure coding · API integration · LLM application design ·
accessibility · testing · technical writing.

## Interview talking points
- **Architecture:** why a repository interface with swappable providers, and how it
  enabled zero-config demos plus a real database path.
- **Security:** how validation, RLS, and audit logging form layers; why you store a
  hashed IP rather than the raw one; and what you would add for production.
- **AI safety:** how the guardrails prevent fabricated experience and why outputs are
  treated as drafts.
- **Honesty:** how you scoped claims and labelled in-progress work — a values signal,
  not just a feature.
