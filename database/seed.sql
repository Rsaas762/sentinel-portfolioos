-- ===========================================================================
-- Sentinel PortfolioOS — seed data (Mohamed Elhalabi)
-- ---------------------------------------------------------------------------
-- Run AFTER schema.sql. Safe to re-run: it clears the content tables first.
-- This mirrors the zero-config demo data and contains honest, real content.
-- Source/demo links are intentionally blank until each project is published.
-- ===========================================================================

truncate table project_sections, projects, skills, experience,
  certifications, testimonials, contact_messages, audit_logs restart identity cascade;
delete from profiles;
delete from site_settings;

-- ---------------------------------------------------------------------------
-- Profile & settings
-- ---------------------------------------------------------------------------
insert into profiles (full_name, headline, bio, location, email, github_url, linkedin_url, website_url)
values (
  'Mohamed Elhalabi',
  'Network, Infrastructure & Cybersecurity Graduate',
  'I''m a newly graduated engineer from Jönköping University with a BSc in Network, Infrastructure and Cybersecurity. I''m tech-focused and service-oriented, with hands-on experience troubleshooting technical problems and supporting users directly at a high tempo — structured, and comfortable juggling several tickets at once without losing quality. I''m based in Jönköping, Sweden, fluent in Swedish, English and Arabic, and motivated to keep growing in IT, infrastructure and cybersecurity. I learn by building, so I ship and document real projects.',
  'Jönköping, Sweden',
  'mohammadhalabi777@gmail.com',
  'https://github.com/Rsaas762',
  'https://www.linkedin.com/in/mohamed-elhalabi-04296a205',
  'https://sentinel-portfolioos.vercel.app'
);

insert into site_settings (id, hero_kicker, hero_title, hero_subtitle, hero_cta_label, available_for_work, ai_assistant_enabled, contact_email)
values (
  true,
  'Network · Infrastructure · Cybersecurity',
  'Turn projects into proof.',
  'I''m Mohamed — a Network, Infrastructure & Cybersecurity graduate from Jönköping University. I learn by building: secure web apps, IT-support tooling, and networking labs, each documented as an honest case study.',
  'View my projects',
  true, true,
  'mohammadhalabi777@gmail.com'
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
insert into projects (slug, title, short_description, scope, category, status, difficulty, tech_stack, screenshots, github_url, demo_url, featured, sort_order, created_at, updated_at) values
('svenljunga-bilcenter','Svenljunga Bilcenter — Dealership Website','A professional, conversion-focused marketing website for a Swedish car dealership — built as a real freelance project and now live.','Freelance client project','frontend','live','intermediate',
  array['React','Vite','TypeScript','Tailwind CSS','Vercel'],
  array['/screenshots/svenljunga-bilcenter/home-desktop.jpg','/screenshots/svenljunga-bilcenter/services-desktop.jpg','/screenshots/svenljunga-bilcenter/home-mobile.jpg'],
  null,'https://svenljunga-bilcenter.vercel.app/',true,0,'2026-04-10','2026-06-22'),
('sentinel-core','Sentinel Core — AI Command Center','A personal, multi-model AI command center for security work: one chat that auto-routes between Claude and GPT, a Forge that generates copy-ready artifacts, and an agentic Cyber Range operator.','Personal project','cybersecurity','live','advanced',
  array['TypeScript','Node.js','Anthropic Claude API','OpenAI API','Railway'],
  array['/screenshots/sentinel-core/landing.jpg','/screenshots/sentinel-core/command-center.jpg'],
  null,'https://sentinel-core-production.up.railway.app/',true,1,'2026-05-20','2026-06-26'),
('sentinel-helpdesk-ai','Sentinel Helpdesk AI','A secure, AI-assisted support-ticket platform for small businesses: capture every message, summarise it, and draft a reply the owner approves.','Portfolio project (MVP)','full_stack','live','advanced',
  array['Next.js','TypeScript','Tailwind CSS','Supabase','PostgreSQL','Zod','Resend','Anthropic / OpenAI'],
  array['/screenshots/sentinel-helpdesk-ai/dashboard.png','/screenshots/sentinel-helpdesk-ai/tickets-list.png','/screenshots/sentinel-helpdesk-ai/ticket-detail.png','/screenshots/sentinel-helpdesk-ai/reply-composer.png'],
  null,null,true,2,'2025-11-02','2026-06-10'),
('sentinel-webguard','Sentinel WebGuard','A safe, passive website trust, security-header, email-DNS and GDPR-readiness checkup that turns public signals into a 0–100 score with plain-language fixes.','Portfolio project (MVP)','cybersecurity','in_progress','advanced',
  array['Next.js','TypeScript','Tailwind CSS','Node.js','Zod'],
  array[]::text[],
  null,null,true,3,'2026-01-12','2026-06-12'),
('sentinel-portfolioos','Sentinel PortfolioOS','The portfolio platform you''re reading now — a public case-study site plus a private admin CMS, built to run with zero config and upgrade to a live database.','Portfolio project (this site)','full_stack','live','advanced',
  array['Next.js','TypeScript','Tailwind CSS','Supabase','PostgreSQL','Zod','Anthropic API'],
  array[]::text[],
  'https://github.com/Rsaas762/sentinel-portfolioos','https://sentinel-portfolioos.vercel.app',true,4,'2026-03-01','2026-06-20'),
('networking-infrastructure-labs','Networking & Infrastructure Labs','University coursework designing, configuring and troubleshooting networks and IT infrastructure with Cisco Packet Tracer and virtualised Windows/Linux hosts.','University coursework','infrastructure','completed','intermediate',
  array['Cisco Packet Tracer','Cisco IOS','VLANs','Routing & Switching','Windows Server','Linux','VirtualBox'],
  array[]::text[],
  null,null,false,5,'2024-02-01','2025-12-01');

-- ---------------------------------------------------------------------------
-- Project sections (linked by slug)
-- ---------------------------------------------------------------------------
insert into project_sections (project_id, kind, heading, body, sort_order)
select id, v.kind::section_kind, v.heading, v.body, v.sort_order
from projects p
join (values
  -- Svenljunga Bilcenter (live client project)
  ('svenljunga-bilcenter','problem','Problem','Svenljunga Bilcenter, a local Swedish car dealership, needed a professional website that builds trust and turns visitors into leads — instead of relying only on a marketplace listing. The brief was to present their services clearly, make it easy to sell or value a car, and look credible to buyers.',1),
  ('svenljunga-bilcenter','solution','Solution','A clean, fast, Swedish-language marketing site built around the dealership''s promise — "Din trygga bilaffär" (your trustworthy car deal). It leads with a strong hero, lays out the services clearly, makes "sell / value your car" the primary call to action, links the current stock from their Blocket store, and keeps contact details one tap away.',2),
  ('svenljunga-bilcenter','tech','How it''s built','Built with React, Vite and TypeScript, styled with Tailwind CSS, and deployed on Vercel. The site is fully responsive and fast-loading, with clear semantic structure for SEO.',3),
  ('svenljunga-bilcenter','features','Key features',E'- A bold hero with a clear value proposition and primary calls to action\n- Services overview: car sales, we-buy-your-car, free valuation, trade-in & pickup, financing, warranty and reconditioning\n- A "sell / value your car" flow as the main conversion path\n- Current inventory linked from the dealership''s Blocket store\n- Trust signals: finance and warranty partners, plus opening hours\n- Contact details (phone, email, address) and privacy & terms pages\n- A mobile-first, responsive layout',4),
  ('svenljunga-bilcenter','security','Privacy & trust','As a marketing site it collects minimal personal data and ships with privacy-policy and terms pages, in line with Swedish/EU (GDPR-conscious) expectations. Enquiries go through clearly-labelled channels rather than over-collecting data — a privacy-aware build appropriate to a small local business.',5),
  ('svenljunga-bilcenter','learned','What I learned','This was a real client project, about to be handed over to the dealership owner. The biggest lesson was translating a non-technical owner''s goals — look trustworthy, get more valuations and calls — into concrete design and copy decisions, and keeping the site simple enough for the business to rely on.',6),
  ('svenljunga-bilcenter','screenshots','Screenshots','From the live site — the desktop home, the services section, and the mobile layout.',7),
  ('svenljunga-bilcenter','future','Future improvements',E'- Live inventory on the site itself (instead of linking out to Blocket)\n- An online valuation/booking form that emails the dealership\n- A financing calculator\n- Individual car detail pages with photos and specifications',8),
  -- Sentinel Core (AI command center)
  ('sentinel-core','problem','Problem','Security and engineering work means constantly switching tools: one model is better at reasoning about a config, another is faster at generating code, and routine tasks (audit this nginx file, draft a GDPR DPIA, parse these logs) get retyped from scratch every time. I wanted a single workspace that picks the right model for each request, turns common security tasks into one click, and keeps everything in one calm, fast interface I actually trust.',1),
  ('sentinel-core','solution','Solution','Sentinel Core is a personal AI command center. A single chat auto-routes each message to the best available model — Claude for security and reasoning, GPT for fast code generation — and shows the routing decision so it''s never a black box. "Forge" turns a plain-English request into a complete, copy-ready artifact (a script, config, component, or checklist) that nothing writes to disk — I review and apply it myself. A "Cyber Range" gives an agentic operator an objective to investigate inside an isolated sandbox. It runs five models side by side and ships as a polished, single-purpose tool.',2),
  ('sentinel-core','tech','How it''s built','A TypeScript web app with a Node.js backend that proxies the Anthropic and OpenAI APIs so keys never reach the browser. The router scores each request and selects a model; the UI streams responses and surfaces the live model roster and routing log. It''s deployed on Railway as a production service, gated behind an access token.',3),
  ('sentinel-core','features','Key features',E'- Multi-model chat across five models (Claude Opus 4.8, Sonnet 4.6, Haiku 4.5, and two GPT models)\n- Automatic routing — Claude for security & reasoning, GPT for fast code-gen — with a transparent decision log\n- Forge: generates complete, copy-ready artifacts (Python, Bash, nginx, YAML, TypeScript, components, configs, checklists) that are never written to disk\n- Cyber Range: an agentic operator that investigates an objective inside an isolated sandbox, with an alert and event timeline\n- Quick-start security tasks (audit an nginx config, VLAN/Cisco lab, TLS handshake, GDPR DPIA, log parsing)\n- Conversation history kept locally on the device only',4),
  ('sentinel-core','security','Security considerations','Because it''s a tool that talks to powerful models, I designed it to fail safe. API keys stay server-side and are never exposed to the client; access is gated behind a token. Forge deliberately writes nothing to disk — every artifact is reviewed and applied by me, so the model can''t silently change my system. The agentic operator is scoped to an isolated range rather than my real machine. History is stored locally, not in a shared database. These are honest, sensible boundaries for a personal tool — not a hardened, audited production security product.',5),
  ('sentinel-core','learned','What I learned','Orchestrating several model providers behind one interface taught me a lot about prompt routing, streaming, and graceful fallback when a provider is slow or unavailable. The hardest and most valuable part was the safety design: deciding what an AI tool should and shouldn''t be allowed to touch, and making "review before apply" the default rather than an afterthought.',6),
  ('sentinel-core','screenshots','Screenshots','The launch screen, and the command center — the model roster, auto-routing chat, and quick-start security tasks.',7),
  ('sentinel-core','future','Future improvements',E'- Saved, named workspaces and exportable transcripts\n- A pluggable tool/function layer for the Cyber Range operator\n- Cost and latency awareness in the router, not just capability\n- Optional team mode with shared (encrypted) history\n- More built-in security task templates',8),
  -- Helpdesk AI
  ('sentinel-helpdesk-ai','problem','Problem','Small businesses lose time and customers because messages are scattered across email, web forms, Instagram and phone notes — answered late, forgotten, or handled without a clear status. I wanted a single place that captures every message as a tracked ticket so nothing slips through the cracks.',1),
  ('sentinel-helpdesk-ai','solution','Solution','Sentinel captures each message as a ticket, uses AI to summarise the problem and assign a priority, category and sentiment, and drafts a professional reply the owner reviews and approves before it is sent. A clear status workflow keeps everything moving. It runs in a demo mode with no keys required, and uses real providers when configured.',2),
  ('sentinel-helpdesk-ai','tech','How it''s built','Next.js App Router with TypeScript and Tailwind CSS, Supabase (Postgres + Auth), and Zod validation on the client and server. Email goes through Resend with a mock fallback, and an AI provider abstraction can use Anthropic Claude, OpenAI, or a mock — so the app is fully demo-able with zero setup.',3),
  ('sentinel-helpdesk-ai','features','Key features',E'- Per-business support form with Zod validation and rate limiting\n- Public ticket lookup by reference code\n- Admin dashboard: new today, open, urgent, solved this week\n- Ticket detail with a conversation timeline and internal notes\n- AI summary, category and sentiment, plus an editable suggested reply (draft only)\n- Status workflow and knowledge snippets fed to the AI as context\n- Business settings with role checks and an audit log of admin actions',4),
  ('sentinel-helpdesk-ai','security','Security considerations','Inputs are validated with Zod on the client and re-checked on the server, and the support form is rate limited. AI output is always treated as a draft the human approves — never sent automatically. Admin areas are role-checked, important actions are written to an audit log, and API keys stay server-side. It is a security-conscious MVP, not a guarantee.',5),
  ('sentinel-helpdesk-ai','learned','What I learned','Building the human-in-the-loop approval flow taught me to make the safe path the default. The provider abstraction (real AI/email or mocks) made the app demo-able with zero setup, which I now treat as a feature rather than an afterthought.',6),
  ('sentinel-helpdesk-ai','screenshots','Screenshots','From the live demo workspace — dashboard, ticket list, ticket detail, and the reply composer.',7),
  ('sentinel-helpdesk-ai','future','Future improvements',E'- Direct email and Instagram message ingestion\n- Per-business analytics on response and resolution time\n- Saved reply templates\n- Multi-language replies (useful for Swedish + English support)\n- Tighter role-based access for agents vs. owners',8),
  -- WebGuard
  ('sentinel-webguard','problem','Problem','Small businesses rarely know whether their website looks trustworthy and is configured sensibly. Existing tools are intimidating, "scary-marketing" driven, or behave like attack tools. I wanted a helpful, ethical checkup that explains business impact first and never overclaims.',1),
  ('sentinel-webguard','solution','Solution','WebGuard scans a site using only public, passive signals — no attacking, logins, or port scanning — and turns them into a 0–100 score with plain-language fixes a non-technical owner can act on. Every finding includes the evidence, a clear explanation, and one recommended fix.',2),
  ('sentinel-webguard','tech','How it''s built','A TypeScript scanning engine with a transparent, weighted scoring model sits behind a Next.js + Tailwind dashboard. The core logic is unit-tested (58 passing tests) and the project is written in strict TypeScript.',3),
  ('sentinel-webguard','features','What it checks',E'- HTTPS & TLS — reachability, HTTP→HTTPS redirect, certificate validity\n- Security headers — HSTS, CSP, X-Content-Type-Options, clickjacking, Referrer- and Permissions-Policy\n- DNS & email trust — SPF, DMARC, MX (DKIM noted as a manual check)\n- Cookie safety — Secure / HttpOnly / SameSite attributes only (never values)\n- GDPR & trust signals — privacy policy, cookie notice, security.txt, contact info\n- SEO & professionalism basics, rolled into a prioritised 0–100 report',4),
  ('sentinel-webguard','security','Why it''s safe & ethical','This is deliberately not a penetration-testing tool — it won''t exploit, brute force, fuzz, scan ports, log in, or crawl aggressively. The scanner is hardened against SSRF: only http/https, rejects private/reserved IPs (including decimal/hex/octal encodings), resolves DNS and blocks private addresses (DNS-rebinding defence), and re-validates every redirect hop, with strict timeouts and a response-size cap. It never claims a site is "secure".',5),
  ('sentinel-webguard','learned','What I learned','Writing the SSRF defences and the per-hop redirect re-validation made me understand a whole class of server-side request risks properly. Encoding the "passive-only" boundary as an explicit rule kept the tool honest and ethical.',6),
  ('sentinel-webguard','screenshots','Screenshots','Screenshots coming soon — the scored report and the per-finding detail with evidence and a recommended fix.',7),
  ('sentinel-webguard','future','Future improvements',E'- Authenticated checks (only with the owner''s explicit consent)\n- Scheduled re-scans with diffing to highlight regressions\n- PDF/CSV export to hand a clear report to a client\n- A dedicated CSP analyzer and mixed-content checks\n- A lead-capture flow for offering paid cleanup work',8),
  -- PortfolioOS
  ('sentinel-portfolioos','problem','Problem','Most student portfolios are a flat list of repository links. They don''t show how you think, they''re awkward to keep current, and they rarely surface the security reasoning employers in this field look for. I wanted a portfolio that presents work as structured case studies and is managed through a dashboard, not by editing code.',1),
  ('sentinel-portfolioos','solution','Solution','A platform with a polished public site and an authenticated admin CMS. A repository layer serves built-in seed data with zero configuration and switches to Supabase when credentials are present, so it demos instantly and becomes a real CMS later — with no code changes.',2),
  ('sentinel-portfolioos','tech','How it''s built','Next.js App Router with Server Actions, TypeScript in strict mode, and Tailwind CSS. Supabase provides Postgres, Auth, and Row-Level Security. Zod schemas are shared client/server, with an optional Anthropic writing assistant that has a deterministic fallback.',3),
  ('sentinel-portfolioos','features','Key features',E'- A public case-study site (home, projects, skills, about, experience, certifications, contact, CV)\n- A private admin dashboard with full create/edit/delete\n- A hybrid data layer: zero-config demo data that upgrades to a live Supabase CMS\n- An AI case-study assistant with honesty guardrails and a no-API fallback\n- A contact form with client + server validation, a honeypot, rate limiting, and hashed IPs\n- Light/dark themes and database audit logging',4),
  ('sentinel-portfolioos','security','Security considerations','Shared Zod validation runs on the client and is re-checked on the server. Supabase Auth with Row-Level Security enforces access at the database, an audit-logging trigger records every change, and stored content is rendered as escaped text. Secret-touching modules import server-only so the build fails if one leaks into a client bundle. A security-conscious baseline documented honestly — not a guarantee.',5),
  ('sentinel-portfolioos','learned','What I learned','Designing the demo-to-Supabase seam taught me to think in interfaces rather than implementations. Threading Zod through Server Actions made "never trust the client" concrete. Writing the security documentation forced me to genuinely understand each control instead of copying a checklist.',6),
  ('sentinel-portfolioos','screenshots','Screenshots','You''re looking at it — dedicated screenshots of the homepage, a case study, and the admin dashboard are coming soon.',7),
  ('sentinel-portfolioos','future','Future improvements',E'- Screenshot uploads via Supabase Storage with alt text\n- Email notifications for new contact messages\n- Shared-store rate limiting (Upstash Redis) plus a CAPTCHA\n- Project search and tag filtering\n- Server-generated PDF export of the CV',8),
  -- Networking labs
  ('networking-infrastructure-labs','problem','Problem','My degree is built around networks and infrastructure, and I wanted repeatable, hands-on practice rather than just theory — designing, configuring and troubleshooting networks I could rebuild from scratch.',1),
  ('networking-infrastructure-labs','solution','Solution','Across my coursework I designed and configured networks in Cisco Packet Tracer and on virtual machines: VLANs and segmentation, routing and switching, wireless, and basic services — then practised troubleshooting when things broke. I also administered Windows and Linux hosts in virtualised labs.',2),
  ('networking-infrastructure-labs','tech','How it''s built','Cisco Packet Tracer and Cisco IOS for network design and configuration; VLANs, routing & switching, and wireless; Windows Server and Linux administration; and virtualization with VirtualBox for isolated, rebuildable labs.',3),
  ('networking-infrastructure-labs','features','What I practised',E'- VLAN segmentation and inter-VLAN routing\n- Routing and switching configuration\n- Wireless setup and basic network services\n- Windows and Linux host administration\n- Structured troubleshooting of broken topologies\n- Documented lab notes I can rebuild from',4),
  ('networking-infrastructure-labs','security','Security considerations','Network segmentation and least-privilege access were recurring themes — keeping zones separated and understanding where trust boundaries sit. Everything ran in isolated labs I own; nothing touched production or third-party systems.',5),
  ('networking-infrastructure-labs','learned','What I learned','Troubleshooting taught me to work methodically from symptom to cause instead of guessing. Segmentation became a practical control I can reason about, not just a diagram on a slide.',6),
  ('networking-infrastructure-labs','screenshots','Screenshots','Screenshots coming soon — a sample Packet Tracer topology and lab notes.',7),
  ('networking-infrastructure-labs','future','Future improvements',E'- Rebuild key labs as clean, documented, repeatable configs\n- Add monitoring to the lab hosts\n- Map each lab to the security controls and hardening baselines it demonstrates',8)
) as v(slug, kind, heading, body, sort_order) on v.slug = p.slug;

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------
insert into skills (name, category, proficiency, note, sort_order) values
('Cyber & information security','cybersecurity',4,'Degree focus',1),
('Network security & segmentation','cybersecurity',4,'VLANs, zoning, firewalls',2),
('Secure-by-design web apps','cybersecurity',3,'SSRF defence, headers, validation',3),
('Security headers & TLS basics','cybersecurity',3,'HSTS, CSP, cookies',4),
('Phishing & social-engineering awareness','cybersecurity',3,null,5),
('Next.js (App Router)','frontend',4,'Built 3 real apps',1),
('React','frontend',4,null,2),
('TypeScript','frontend',4,null,3),
('Tailwind CSS','frontend',4,null,4),
('Supabase (Auth + Postgres)','backend',4,null,1),
('Server-side validation (Zod)','backend',4,'Client + server',2),
('Node.js','backend',3,null,3),
('Python (scripting)','backend',3,'Automation',4),
('REST / Server Actions','backend',3,null,5),
('PostgreSQL','databases',3,'Schema design',1),
('Row-Level Security','databases',3,'Supabase / Postgres RLS',2),
('SQL','databases',3,null,3),
('Cisco Packet Tracer','tools',4,'Network design & labs',1),
('Routing & switching (Cisco)','tools',3,'WAN, VLANs, wireless',2),
('Troubleshooting & technical support','tools',4,'Ticket handling',3),
('Virtualization (VirtualBox/Parallels)','tools',3,null,4),
('Git & GitHub','tools',3,null,5),
('Windows administration','operating_systems',4,null,1),
('Linux (Ubuntu/Debian)','operating_systems',3,null,2),
('Bash / shell scripting','operating_systems',3,null,3),
('Cloud services & virtualization','operating_systems',3,null,4);

-- ---------------------------------------------------------------------------
-- Experience (real — work + education)
-- ---------------------------------------------------------------------------
insert into experience (role, organization, location, start_date, end_date, summary, highlights, sort_order) values
('Retail Associate — Checkout & Online Orders','Stora Coop','Sweden','2025-08-01',null,
 'Customer-facing retail role combining checkout service with accurate online order fulfilment.',
 array['Help customers daily with a service-minded, professional approach','Pick online customer orders with a focus on accuracy, structure and on-time delivery','Comfortable with high-tempo customer contact and resolving questions on the spot'],1),
('IT Technician / Technical Support','O-Ringen (one of Sweden''s largest sporting events)','Jönköping, Sweden','2025-07-01','2025-08-01',
 'Provided fast, hands-on technical support to staff during a large-scale event, keeping systems and networks running.',
 array['Installed, troubleshot and maintained IT equipment so networks, computers and systems stayed stable throughout the event','Worked at a high tempo on many parallel tickets, prioritising solutions around each user''s needs','Gave direct, on-site support to staff under real time pressure'],2),
('BSc — Network, Infrastructure & Cybersecurity','School of Engineering, Jönköping University','Jönköping, Sweden','2023-09-01','2026-06-01',
 'Bachelor''s degree focused on the design, operation and security of IT infrastructure and networks.',
 array['Network technology, systems administration, cybersecurity and troubleshooting of complex IT environments','Hands-on labs with Cisco Packet Tracer, virtualization, and Linux/Windows administration','Built and documented several projects applying these skills'],3),
('Teknikprogrammet (Technology Programme)','Tranemo Gymnasieskola','Tranemo, Sweden','2020-08-01','2023-06-01',
 'Upper-secondary technology programme — a foundation in mathematics, programming and technology.',
 array[]::text[],4);

-- ---------------------------------------------------------------------------
-- Certifications & testimonials: intentionally empty (none on the CV yet).
-- Add real, verifiable entries from the admin dashboard as you earn them.
-- ---------------------------------------------------------------------------
