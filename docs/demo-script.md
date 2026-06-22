# Demo Script — Sentinel PortfolioOS

A 5–7 minute walkthrough for showing the platform to a recruiter, interviewer, or
client. Works entirely in **demo mode** (no setup). Times are approximate.

## Setup (before the call)
```bash
npm install
npm run dev   # http://localhost:3000
```
Open two tabs: the public site (`/`) and the admin (`/admin`).

---

## 1. The hook (0:00–0:45) — Home
- Open `/`. Read the tagline: **"Turn projects into proof."**
- Point out the **"Available for work"** badge and the **live "proof" terminal**
  listing featured projects.
- Scroll: stats band → featured case studies → six skill domains → testimonial.
- **Talking point:** "This isn't a list of links — it's structured proof of work,
  and I manage all of it from a dashboard."

## 2. A case study (0:45–2:00) — Projects → detail
- Go to **Projects**; use the **category filter** to show it's interactive.
- Open **Sentinel Helpdesk AI**.
- Walk the sections: **Problem → Solution → How it's built → Security
  considerations → What I learned**.
- **Talking point:** "Every project follows this format, so you can see how I think
  about trade-offs — including security — not just what I shipped."

## 3. Depth (2:00–3:00) — Skills, Experience, Certifications, CV
- **Skills:** grouped by six domains with honest 1–5 meters.
- **Experience:** timeline; note the honest framing (labs, coursework, freelance).
- **Certifications:** show earned / in-progress / planned — "I'm transparent about
  what's done and what's in progress."
- **CV:** show the printable page and the **Print / Save as PDF** button.

## 4. The contact flow (3:00–3:30) — Contact
- Submit the form with a real-looking message.
- **Talking point:** "Validated on the client and server, rate-limited, with a
  honeypot, and it stores a hashed IP — not your raw address."
- In demo mode you'll see the "validated but not stored" notice — call that out as
  the zero-config behaviour.

## 5. The admin dashboard (3:30–5:30) — `/admin`
- Note the **Demo mode** banner (changes aren't saved without a database).
- **Dashboard:** stats + recent activity (the audit trail).
- **Projects → edit a project:** show the **sections editor** (add/reorder/remove).
- **Open the AI assistant:** paste a couple of rough notes, choose **"CV bullet
  points"**, click **Generate draft**.
  - **Talking point:** "Without an API key it uses a deterministic fallback; with
    one it uses Claude. Either way it only uses *my* notes — it never invents
    experience — and it's clearly labelled a draft."
- Visit **Messages** to show the inbox, **Settings** to show editable hero copy and
  toggles.

## 6. Close (5:30–6:30)
- **Talking point:** "It runs with zero configuration for this demo, and becomes a
  live CMS the moment I connect Supabase — with Row-Level Security and an audit
  trail enforced at the database. It's built the way I'd build something for you:
  validated, least-privilege, and honest about its limits."

## Optional: go live (if asked)
- Show `database/schema.sql` (RLS + audit trigger) and `.env.example`.
- Mention: add Supabase env vars → real auth + persistence; add `ANTHROPIC_API_KEY`
  → Claude-powered drafts.

## If something breaks
- Everything is demo data, so just refresh. The app degrades gracefully — the AI
  falls back to templates, and missing config never crashes a page.
