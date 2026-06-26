-- ===========================================================================
-- Add "Sentinel Core — AI Command Center" to a live Supabase database.
-- ---------------------------------------------------------------------------
-- The deployed site reads projects from Supabase, so adding it to the seed
-- files only affects demo mode. Run this once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run) to make Sentinel Core
-- appear on the live site. Safe to re-run: it removes any existing copy first.
-- ===========================================================================
begin;

-- Remove any previous copy (sections cascade via FK on delete).
delete from projects where slug = 'sentinel-core';

-- Insert the project (placed at sort_order 1, right after the live client work).
insert into projects
  (slug, title, short_description, scope, category, status, difficulty,
   tech_stack, screenshots, github_url, demo_url, featured, sort_order,
   created_at, updated_at)
values
  ('sentinel-core',
   'Sentinel Core — AI Command Center',
   'A personal, multi-model AI command center for security work: one chat that auto-routes between Claude and GPT, a Forge that generates copy-ready artifacts, and an agentic Cyber Range operator.',
   'Personal project', 'cybersecurity', 'live', 'advanced',
   array['TypeScript','Node.js','Anthropic Claude API','OpenAI API','Railway'],
   array['/screenshots/sentinel-core/command-center.jpg','/screenshots/sentinel-core/landing.jpg'],
   null, 'https://sentinel-core-production.up.railway.app/', true, 1,
   '2026-05-20', '2026-06-26');

-- Shift the other projects down so Sentinel Core sits at #2.
update projects set sort_order = 2 where slug = 'sentinel-helpdesk-ai';
update projects set sort_order = 3 where slug = 'sentinel-webguard';
update projects set sort_order = 4 where slug = 'sentinel-portfolioos';
update projects set sort_order = 5 where slug = 'networking-infrastructure-labs';

-- Case-study sections.
insert into project_sections (project_id, kind, heading, body, sort_order)
select id, v.kind::section_kind, v.heading, v.body, v.sort_order
from projects p
join (values
  ('sentinel-core','problem','Problem','Security and engineering work means constantly switching tools: one model is better at reasoning about a config, another is faster at generating code, and routine tasks (audit this nginx file, draft a GDPR DPIA, parse these logs) get retyped from scratch every time. I wanted a single workspace that picks the right model for each request, turns common security tasks into one click, and keeps everything in one calm, fast interface I actually trust.',1),
  ('sentinel-core','solution','Solution','Sentinel Core is a personal AI command center. A single chat auto-routes each message to the best available model — Claude for security and reasoning, GPT for fast code generation — and shows the routing decision so it''s never a black box. "Forge" turns a plain-English request into a complete, copy-ready artifact (a script, config, component, or checklist) that nothing writes to disk — I review and apply it myself. A "Cyber Range" gives an agentic operator an objective to investigate inside an isolated sandbox. It runs five models side by side and ships as a polished, single-purpose tool.',2),
  ('sentinel-core','tech','How it''s built','A TypeScript web app with a Node.js backend that proxies the Anthropic and OpenAI APIs so keys never reach the browser. The router scores each request and selects a model; the UI streams responses and surfaces the live model roster and routing log. It''s deployed on Railway as a production service, gated behind an access token.',3),
  ('sentinel-core','features','Key features',E'- Multi-model chat across five models (Claude Opus 4.8, Sonnet 4.6, Haiku 4.5, and two GPT models)\n- Automatic routing — Claude for security & reasoning, GPT for fast code-gen — with a transparent decision log\n- Forge: generates complete, copy-ready artifacts (Python, Bash, nginx, YAML, TypeScript, components, configs, checklists) that are never written to disk\n- Cyber Range: an agentic operator that investigates an objective inside an isolated sandbox, with an alert and event timeline\n- Quick-start security tasks (audit an nginx config, VLAN/Cisco lab, TLS handshake, GDPR DPIA, log parsing)\n- Conversation history kept locally on the device only',4),
  ('sentinel-core','security','Security considerations','Because it''s a tool that talks to powerful models, I designed it to fail safe. API keys stay server-side and are never exposed to the client; access is gated behind a token. Forge deliberately writes nothing to disk — every artifact is reviewed and applied by me, so the model can''t silently change my system. The agentic operator is scoped to an isolated range rather than my real machine. History is stored locally, not in a shared database. These are honest, sensible boundaries for a personal tool — not a hardened, audited production security product.',5),
  ('sentinel-core','learned','What I learned','Orchestrating several model providers behind one interface taught me a lot about prompt routing, streaming, and graceful fallback when a provider is slow or unavailable. The hardest and most valuable part was the safety design: deciding what an AI tool should and shouldn''t be allowed to touch, and making "review before apply" the default rather than an afterthought.',6),
  ('sentinel-core','screenshots','Screenshots','The command center — the model roster, auto-routing chat, and quick-start security tasks — and the launch screen.',7),
  ('sentinel-core','future','Future improvements',E'- Saved, named workspaces and exportable transcripts\n- A pluggable tool/function layer for the Cyber Range operator\n- Cost and latency awareness in the router, not just capability\n- Optional team mode with shared (encrypted) history\n- More built-in security task templates',8)
) as v(slug, kind, heading, body, sort_order) on v.slug = p.slug;

commit;
