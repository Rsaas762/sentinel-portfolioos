-- ===========================================================================
-- Sentinel PortfolioOS — seed data
-- ---------------------------------------------------------------------------
-- Run AFTER schema.sql. Safe to re-run: it clears the content tables first.
-- The content mirrors the demo fixtures used in zero-config mode and is
-- honest, portfolio-safe sample data for a cybersecurity/full-stack student.
-- Replace the placeholder links and personal details with your own.
-- ===========================================================================

-- Audit triggers fire on these inserts; clear logs too so the seed is clean.
truncate table project_sections, projects, skills, experience,
  certifications, testimonials, contact_messages, audit_logs restart identity cascade;
delete from profiles;
delete from site_settings;

-- ---------------------------------------------------------------------------
-- Profile & settings
-- ---------------------------------------------------------------------------
insert into profiles (full_name, headline, bio, location, email, github_url, linkedin_url, website_url)
values (
  'Alex Rivera',
  'Cybersecurity & Full-Stack Engineer (Student)',
  'I''m a final-year computing student focused on the overlap between secure systems and well-built software. I learn by building: hardened labs, security tooling, and full-stack apps that I document as real case studies. I care about honest engineering — shipping things that work, understanding the trade-offs, and being clear about what I do and don''t yet know.',
  'Remote · Europe',
  'alex.rivera@example.com',
  'https://github.com/your-handle',
  'https://www.linkedin.com/in/your-handle',
  'https://your-domain.example.com'
);

insert into site_settings (id, hero_kicker, hero_title, hero_subtitle, hero_cta_label, available_for_work, ai_assistant_enabled, contact_email)
values (
  true,
  'Cybersecurity · Full-Stack',
  'Turn projects into proof.',
  'I''m Alex — a cybersecurity and full-stack student. This is my portfolio operating system: polished case studies, verifiable skills, and the labs behind them.',
  'View case studies',
  true, true,
  'alex.rivera@example.com'
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
insert into projects (slug, title, short_description, category, status, difficulty, tech_stack, github_url, demo_url, featured, sort_order, created_at, updated_at) values
('sentinel-helpdesk-ai','Sentinel Helpdesk AI','An AI-assisted internal helpdesk that triages IT tickets, drafts replies, and keeps a human approver in the loop.','full_stack','live','advanced',
  array['Next.js','TypeScript','PostgreSQL','Supabase','Anthropic API','Tailwind CSS','Zod'],
  'https://github.com/your-handle/sentinel-helpdesk-ai','https://sentinel-helpdesk-ai.example.com',true,1,'2025-11-02','2026-02-18'),
('sentinel-webguard','Sentinel WebGuard','A self-hosted web app scanner that checks security headers, TLS configuration, and common misconfigurations, then explains each finding.','cybersecurity','in_progress','advanced',
  array['Node.js','TypeScript','Next.js','PostgreSQL','Docker','OWASP ZAP'],
  'https://github.com/your-handle/sentinel-webguard','https://sentinel-webguard.example.com',true,2,'2026-01-12','2026-05-30'),
('linux-sysadmin-lab','Linux System Administration Lab','A hardened, reproducible Linux server lab with automated provisioning, monitoring, and documented baseline hardening.','infrastructure','completed','intermediate',
  array['Linux','Ubuntu Server','Bash','Ansible','nftables','systemd','Prometheus'],
  'https://github.com/your-handle/linux-sysadmin-lab',null,false,3,'2025-09-15','2025-12-01'),
('gdpr-compliance-toolkit','GDPR Compliance Toolkit','A practical toolkit and reference app that maps a small web product to core GDPR obligations, with data-flow mapping and a request workflow.','compliance','completed','intermediate',
  array['Next.js','TypeScript','PostgreSQL','Markdown','Zod'],
  'https://github.com/your-handle/gdpr-compliance-toolkit','https://gdpr-toolkit.example.com',false,4,'2025-10-20','2026-01-08'),
('network-security-lab','Network Security Lab','A segmented home-lab network with a firewall, IDS, and VPN, used to practise monitoring, detection, and incident triage safely.','cybersecurity','completed','advanced',
  array['pfSense','Suricata','WireGuard','VLANs','Wireshark','Linux'],
  'https://github.com/your-handle/network-security-lab',null,false,5,'2025-08-10','2025-11-20'),
('nextjs-analytics-dashboard','React / Next.js Analytics Dashboard','A responsive, accessible analytics dashboard with charts, filtering, and role-aware views, built to practise production-grade frontend patterns.','frontend','live','intermediate',
  array['Next.js','React','TypeScript','Tailwind CSS','Recharts','Supabase'],
  'https://github.com/your-handle/nextjs-analytics-dashboard','https://nextjs-dashboard.example.com',true,6,'2025-12-05','2026-03-22');

-- ---------------------------------------------------------------------------
-- Project sections (linked by slug)
-- ---------------------------------------------------------------------------
insert into project_sections (project_id, kind, heading, body, sort_order)
select id, v.kind::section_kind, v.heading, v.body, v.sort_order
from projects p
join (values
  -- Helpdesk AI
  ('sentinel-helpdesk-ai','problem','Problem','Small IT teams spend a large share of their day on repetitive first-line tickets. I wanted to see whether an LLM could speed up triage without removing human judgement or leaking sensitive data.',1),
  ('sentinel-helpdesk-ai','solution','Solution','Every inbound message is classified by category and urgency, then the model drafts a suggested reply grounded in a small internal knowledge base. Nothing is sent automatically: an agent reviews, edits, and approves each draft. A fallback template engine keeps the queue usable when the AI provider is unavailable.',2),
  ('sentinel-helpdesk-ai','tech','How it''s built','Next.js App Router with server actions for all writes, PostgreSQL via Supabase for storage and RLS, and the Anthropic API for classification and drafting. Inputs are validated with Zod on the client and the server.',3),
  ('sentinel-helpdesk-ai','security','Security considerations','The model only receives the ticket text plus a curated knowledge snippet — never the full database. API keys live in server-only env vars. RLS restricts rows to authenticated staff. AI output is treated as an untrusted draft and rendered as plain text, never raw HTML.',4),
  ('sentinel-helpdesk-ai','learned','What I learned','Designing the human-in-the-loop boundary was the hard part, not the model call. I learned to make the safe default the easy path and to thread Zod validation through server actions so the database never trusts client input.',5),
  ('sentinel-helpdesk-ai','screenshots','Screenshots','Screenshots coming soon — ticket queue, draft-review panel, and audit timeline.',6),
  -- WebGuard
  ('sentinel-webguard','problem','Problem','Auditing my own side projects I kept finding the same low-hanging issues: missing security headers, weak CSPs, and default TLS settings. I wanted a tool that not only flags issues but teaches why they matter.',1),
  ('sentinel-webguard','solution','Solution','WebGuard runs read-only, non-intrusive checks against a target you own: security headers, cookie flags, TLS configuration, and common misconfigurations. Each finding includes a severity, a plain-language explanation, and a remediation snippet, with history over time.',2),
  ('sentinel-webguard','tech','How it''s built','A TypeScript scanning engine normalises results into a typed findings model; a Next.js dashboard renders reports. Scans run in Docker for reproducibility, with an optional OWASP ZAP baseline pass.',3),
  ('sentinel-webguard','security','Security considerations','Scoped to passive, non-destructive checks; the user confirms ownership before scanning. It is a learning and self-audit tool, not an attack tool, and makes no claim that a site is "secure". The engine has no write access to scanned systems.',4),
  ('sentinel-webguard','learned','What I learned','How much nuance sits behind "just add the header" — for example how a strict CSP interacts with real apps. Writing remediation copy forced me to understand each control rather than copy a checklist.',5),
  ('sentinel-webguard','screenshots','Screenshots','Screenshots coming soon — scan report, severity breakdown, and remediation detail.',6),
  -- Linux lab
  ('linux-sysadmin-lab','problem','Problem','I wanted real, repeatable practice administering Linux servers — a lab I could tear down and rebuild from scratch, with hardening applied consistently rather than ad hoc.',1),
  ('linux-sysadmin-lab','solution','Solution','An Ansible-provisioned lab of Ubuntu Server VMs (bastion, web, database). Playbooks apply a documented baseline: SSH key-only auth, least-privilege sudo, default-deny nftables, automatic updates, and Prometheus monitoring. Everything rebuilds with one command.',2),
  ('linux-sysadmin-lab','tech','How it''s built','Ansible roles for provisioning and configuration; Bash for bootstrap and teardown; nftables with an explicit allow-list; systemd unit hardening; Prometheus with node_exporter.',3),
  ('linux-sysadmin-lab','security','Security considerations','The baseline follows widely-published hardening guidance, with each control documented and auditable. It is a learning lab — a sensible baseline, not a guarantee — and I note where production would need more (central logging, secrets management, IDS).',4),
  ('linux-sysadmin-lab','learned','What I learned','Idempotency changed how I think about config: a playbook you can run twice safely beats a clever one-liner. I learned to adapt hardening guides critically and document the reasoning.',5),
  ('linux-sysadmin-lab','screenshots','Screenshots','Screenshots coming soon — Ansible run output, firewall ruleset, and Prometheus dashboard.',6),
  -- GDPR
  ('gdpr-compliance-toolkit','problem','Problem','Privacy regulation feels abstract until you apply it to a real product. As coursework I translated GDPR principles into concrete, engineer-facing tasks for a small SaaS-style app.',1),
  ('gdpr-compliance-toolkit','solution','Solution','A data-flow map plus a reference app implementing the mechanics: a consent record, a data-subject access request workflow, an export-my-data endpoint, and a documented retention policy — each linked to the principle it serves.',2),
  ('gdpr-compliance-toolkit','tech','How it''s built','A Next.js app stores consent and request records in PostgreSQL. Exports are generated server-side and validated with Zod. The written analysis lives as version-controlled Markdown.',3),
  ('gdpr-compliance-toolkit','security','Security & privacy considerations','Privacy by design drove the data model: collect the minimum, record the lawful basis, make erasure first-class. Access requests are authenticated and logged. This is an educational reference, not legal advice — documented explicitly.',4),
  ('gdpr-compliance-toolkit','learned','What I learned','Compliance is mostly good engineering discipline made explicit: know your data, minimise it, be able to delete it. Mapping features to principles gave me vocabulary for talking to non-engineers about privacy.',5),
  ('gdpr-compliance-toolkit','screenshots','Screenshots','Screenshots coming soon — data-flow map, DSAR workflow, and data-export view.',6),
  -- Netsec lab
  ('network-security-lab','problem','Problem','Reading about network security only goes so far. I wanted a safe, isolated environment to segment a network, generate realistic traffic, and see detection rules fire — without touching production systems.',1),
  ('network-security-lab','solution','Solution','A segmented lab with VLANs (trusted, IoT, lab) behind a pfSense firewall. Suricata runs as an IDS, WireGuard provides remote access, and intentionally vulnerable VMs generate traffic. I practised reading alerts and pivoting into packet captures.',2),
  ('network-security-lab','tech','How it''s built','pfSense for routing, firewalling, and VLAN segmentation; Suricata with community plus custom rules; WireGuard for secure management; Wireshark and tcpdump for packet analysis — all inside the isolated lab.',3),
  ('network-security-lab','security','Security considerations','Isolation was the first design goal: vulnerable VMs cannot reach the internet or my home network. All testing targets machines I own inside the lab, with segmentation and firewall rules documented.',4),
  ('network-security-lab','learned','What I learned','Detection is only useful if you can interpret it. I learned to move from an IDS alert to the underlying packets and form a hypothesis, and how much tuning real detection needs.',5),
  ('network-security-lab','screenshots','Screenshots','Screenshots coming soon — network topology, Suricata alerts, and a Wireshark walkthrough.',6),
  -- Dashboard
  ('nextjs-analytics-dashboard','problem','Problem','I wanted to move beyond tutorial UIs and build a dashboard with the concerns real products have: loading and empty states, accessible components, responsive layout, and role-aware views.',1),
  ('nextjs-analytics-dashboard','solution','Solution','A metrics dashboard with filterable charts, a sortable data table, and a settings area. Data is fetched on the server where possible, with skeletons for loading and clear empty states. Components are keyboard-navigable and labelled.',2),
  ('nextjs-analytics-dashboard','tech','How it''s built','Next.js App Router with React Server Components, Recharts for visualisation, Tailwind CSS for the design system, and Supabase for auth and storage. State is URL-driven so views are shareable.',3),
  ('nextjs-analytics-dashboard','security','Security considerations','Role-aware views are enforced on the server, not just hidden in the UI, and data access goes through RLS. Inputs are validated with Zod and no untrusted HTML is rendered.',4),
  ('nextjs-analytics-dashboard','learned','What I learned','Accessibility and good states are most of what separates a demo from a product. Building them from the start was far easier than retrofitting, and I got comfortable deciding server vs. client.',5),
  ('nextjs-analytics-dashboard','screenshots','Screenshots','Screenshots coming soon — overview with charts, filtered table view, and mobile layout.',6)
) as v(slug, kind, heading, body, sort_order) on v.slug = p.slug;

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------
insert into skills (name, category, proficiency, note, sort_order) values
('Web app security (OWASP Top 10)','cybersecurity',4,'Headers, injection, auth flaws',1),
('Network security & segmentation','cybersecurity',4,'Firewalls, VLANs, IDS',2),
('Threat modelling','cybersecurity',3,'STRIDE, data-flow diagrams',3),
('Incident triage & log analysis','cybersecurity',3,null,4),
('Cryptography fundamentals','cybersecurity',3,'TLS, hashing, key handling',5),
('React','frontend',4,'Hooks, server components',1),
('Next.js (App Router)','frontend',4,null,2),
('TypeScript','frontend',4,null,3),
('Tailwind CSS','frontend',4,null,4),
('Accessibility (WCAG basics)','frontend',3,'Keyboard, ARIA, contrast',5),
('Node.js','backend',4,null,1),
('REST API design','backend',3,null,2),
('Server-side validation (Zod)','backend',4,null,3),
('Authentication & sessions','backend',3,'OAuth, JWT, cookies',4),
('PostgreSQL','databases',4,'Schema design, indexes',1),
('Row-Level Security','databases',3,'Supabase / Postgres RLS',2),
('SQL & query optimisation','databases',3,null,3),
('Git & GitHub','tools',4,null,1),
('Docker','tools',3,null,2),
('Ansible','tools',3,null,3),
('Wireshark','tools',3,null,4),
('Burp Suite (basics)','tools',2,null,5),
('Linux (Ubuntu/Debian)','operating_systems',4,'Admin & hardening',1),
('Windows administration','operating_systems',3,null,2),
('Bash scripting','operating_systems',3,null,3);

-- ---------------------------------------------------------------------------
-- Experience
-- ---------------------------------------------------------------------------
insert into experience (role, organization, location, start_date, end_date, summary, highlights, sort_order) values
('BSc Computing (Cybersecurity pathway)','University coursework & self-directed labs','Europe','2023-09-01',null,
 'Final-year student combining formal coursework with a steady stream of self-built labs and projects, each documented as a case study.',
 array['Modules in network security, secure software development, databases, and operating systems','Built and documented six portfolio projects','Maintain a reproducible home lab for hands-on security practice'],1),
('Freelance web projects (small clients)','Self-employed','Remote','2024-06-01',null,
 'Occasional freelance work building small marketing sites and internal tools, with an emphasis on accessible, maintainable code.',
 array['Delivered responsive sites with Next.js and Tailwind CSS','Set up basic CI, environment hygiene, and documentation','Practised translating non-technical requirements into clear scope'],2),
('Volunteer IT support','Local community organisation','On-site','2023-02-01','2024-05-01',
 'Helped a small non-profit keep its devices and accounts running smoothly, which sparked my interest in helpdesk automation.',
 array['Triaged everyday IT issues for non-technical staff','Wrote short how-to guides to reduce repeat questions','Inspired the Sentinel Helpdesk AI project'],3);

-- ---------------------------------------------------------------------------
-- Certifications
-- ---------------------------------------------------------------------------
insert into certifications (name, issuer, status, issued_on, credential_url, sort_order) values
('CompTIA Security+','CompTIA','in_progress',null,null,1),
('CompTIA Network+','CompTIA','earned','2025-04-01','https://www.credly.com/users/your-handle',2),
('Google Cybersecurity Certificate','Google / Coursera','earned','2024-11-01','https://www.coursera.org/account/accomplishments',3),
('TryHackMe — SOC Level 1 path','TryHackMe','in_progress',null,null,4),
('OSCP','OffSec','planned',null,null,5);

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
insert into testimonials (author, role, quote, approved, sort_order) values
('J. Okafor','Module lecturer, Secure Software Development','Alex consistently went beyond the brief — the GDPR coursework was one of the clearest mappings from principle to implementation I saw in the cohort.',true,1),
('M. Lindqvist','Small-business owner (freelance client)','Reliable and easy to work with. Alex explained the trade-offs in plain language and handed over something I could actually maintain.',true,2),
('Peer review, study group','Fellow student','The home lab write-ups are genuinely useful — I used the hardening notes as a checklist for my own setup.',true,3);
