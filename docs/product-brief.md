# Product Brief — Sentinel PortfolioOS

**One-liner:** A portfolio operating system that turns a cybersecurity/full-stack
student's projects into recruiter-ready proof, managed through a private dashboard.

**Tagline:** Turn projects into proof.

## Problem

Early-career engineers — especially in cybersecurity — struggle to *demonstrate*
ability. A list of GitHub links doesn't show how you think, what trade-offs you
made, or that you understand security. And static portfolios are painful to keep
current, so they go stale.

## Audience

- **Primary:** students and bootcamp grads targeting internships and junior roles
  in cybersecurity and full-stack development.
- **Secondary:** freelancers presenting client-ready work and taking enquiries.
- **Viewers:** recruiters, internship supervisors, small-business clients,
  lecturers, and technical interviewers.

## Value proposition

1. **Proof, not links.** Each project is a structured case study: problem →
   solution → how it's built → security considerations → what I learned.
2. **Managed, not hard-coded.** A real admin dashboard means updates take minutes.
3. **Security-first, honestly.** The product itself models good engineering
   (validation, RLS, audit logging) and never overclaims.
4. **Zero-friction demo.** Runs instantly on seed data; upgrades to a live CMS with
   Supabase.

## Goals

- Make a student look credible and serious in under 10 seconds on the homepage.
- Let the owner add or edit a case study in a few minutes.
- Give interviewers concrete, honest material to discuss.

## Non-goals (MVP)

- Multi-user/team accounts, payments, analytics, i18n, image pipelines, email
  delivery. (See `ROADMAP.md`.)

## Success criteria

- A recruiter can grasp the person's strengths and see two strong case studies
  without scrolling far.
- The owner can manage all content without editing code.
- `lint`, `typecheck`, `test`, and `build` all pass; the UI looks production-grade
  in light and dark themes.

## Key design decisions

- **Hybrid data layer** behind a repository interface: a demo (seed) provider and a
  Supabase provider, selected by environment. This delivers the zero-config demo
  *and* a production path without code changes.
- **Server Actions + Zod** for all writes, with database-level RLS and audit
  triggers as defence in depth.
- **AI as a drafting aid**, never an author: strict honesty guardrails and a
  no-API fallback.

## Brand

Modern, clean, professional, cybersecurity-inspired but bright-leaning — a deep
slate/navy base with a signal-cyan accent and an emerald "proof" spark. Mono
accents add a subtle security-tooling texture without feeling juvenile.
