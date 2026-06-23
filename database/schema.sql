-- ===========================================================================
-- Sentinel PortfolioOS — PostgreSQL schema (Supabase-ready)
-- ---------------------------------------------------------------------------
-- Run this in the Supabase SQL editor (or `psql`) to provision the database.
-- It creates the tables, enums, indexes, Row-Level Security (RLS) policies,
-- an updated_at trigger, and an audit-logging trigger.
--
-- Security model (summary):
--   * Portfolio content (projects, skills, etc.) is publicly readable.
--   * Testimonials are public only when approved = true.
--   * contact_messages: anyone may INSERT (the public form); only
--     authenticated users may read or update them.
--   * Every other write requires an authenticated session.
--   * All content changes are recorded in audit_logs by a database trigger,
--     so the audit trail cannot be bypassed by application code.
-- This schema is a sensible baseline. It does not, by itself, guarantee
-- security — see SECURITY.md for the full threat model and assumptions.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type project_category as enum
    ('cybersecurity','full_stack','frontend','backend','infrastructure','compliance');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('live','in_progress','completed','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_difficulty as enum ('beginner','intermediate','advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type section_kind as enum
    ('problem','solution','tech','features','security','learned','screenshots','future');
exception when duplicate_object then null; end $$;

do $$ begin
  create type skill_category as enum
    ('cybersecurity','frontend','backend','databases','tools','operating_systems');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_status as enum ('new','read','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cert_status as enum ('earned','in_progress','planned');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  headline    text not null default '',
  bio         text not null default '',
  location    text not null default '',
  email       text not null,
  github_url  text,
  linkedin_url text,
  website_url text,
  avatar_url  text,
  updated_at  timestamptz not null default now()
);

create table if not exists projects (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  short_description text not null default '',
  scope             text not null default 'Portfolio project',
  category          project_category not null default 'full_stack',
  status            project_status not null default 'in_progress',
  difficulty        project_difficulty not null default 'intermediate',
  tech_stack        text[] not null default '{}',
  github_url        text,
  demo_url          text,
  cover_image       text,
  featured          boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists project_sections (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  kind        section_kind not null,
  heading     text not null,
  body        text not null default '',
  sort_order  integer not null default 0
);

create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    skill_category not null,
  proficiency smallint not null default 3 check (proficiency between 1 and 5),
  note        text,
  sort_order  integer not null default 0
);

create table if not exists experience (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  organization  text not null,
  location      text,
  start_date    date not null,
  end_date      date,
  summary       text not null default '',
  highlights    text[] not null default '{}',
  sort_order    integer not null default 0
);

create table if not exists certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text not null,
  status         cert_status not null default 'earned',
  issued_on      date,
  credential_url text,
  sort_order     integer not null default 0
);

create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  role        text not null default '',
  quote       text not null,
  source_url  text,
  approved    boolean not null default false,
  sort_order  integer not null default 0
);

create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null default '',
  message     text not null,
  status      message_status not null default 'new',
  ip_hash     text,
  created_at  timestamptz not null default now()
);

-- Single-row settings table (id = true enforces exactly one row).
create table if not exists site_settings (
  id                   boolean primary key default true check (id),
  hero_kicker          text not null default '',
  hero_title           text not null default 'Turn projects into proof.',
  hero_subtitle        text not null default '',
  hero_cta_label       text not null default 'View case studies',
  cv_url               text,
  available_for_work   boolean not null default true,
  ai_assistant_enabled boolean not null default true,
  contact_email        text not null default '',
  updated_at           timestamptz not null default now()
);

create table if not exists audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor       text not null default 'system',
  action      text not null,
  entity      text not null,
  entity_id   text,
  summary     text not null default '',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_projects_sort on projects (sort_order);
create index if not exists idx_projects_featured on projects (featured) where featured;
create index if not exists idx_sections_project on project_sections (project_id, sort_order);
create index if not exists idx_skills_category on skills (category, sort_order);
create index if not exists idx_messages_created on contact_messages (created_at desc);
create index if not exists idx_audit_created on audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated on site_settings;
create trigger trg_settings_updated before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Audit logging trigger
-- Records every content change with the acting user's email (from the JWT),
-- the operation, table, and affected row id. Bypass-proof at the app layer.
-- ---------------------------------------------------------------------------
create or replace function audit_change()
returns trigger language plpgsql security definer as $$
declare
  v_actor text := coalesce(nullif(current_setting('request.jwt.claims', true), '')::json ->> 'email', 'system');
  v_id    text := coalesce((to_jsonb(new) ->> 'id'), (to_jsonb(old) ->> 'id'));
begin
  insert into audit_logs (actor, action, entity, entity_id, summary)
  values (
    v_actor,
    lower(tg_op),
    tg_table_name,
    v_id,
    lower(tg_op) || ' on ' || tg_table_name
  );
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end; $$;

do $$
declare t text;
begin
  foreach t in array array['projects','project_sections','skills','experience',
                           'certifications','testimonials','site_settings','profiles']
  loop
    execute format('drop trigger if exists trg_audit_%1$s on %1$s;', t);
    execute format(
      'create trigger trg_audit_%1$s after insert or update or delete on %1$s
       for each row execute function audit_change();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table profiles         enable row level security;
alter table projects         enable row level security;
alter table project_sections enable row level security;
alter table skills           enable row level security;
alter table experience       enable row level security;
alter table certifications   enable row level security;
alter table testimonials     enable row level security;
alter table contact_messages enable row level security;
alter table site_settings    enable row level security;
alter table audit_logs       enable row level security;

-- Public read for portfolio content -----------------------------------------
create policy "public read profiles"   on profiles         for select using (true);
create policy "public read projects"   on projects         for select using (true);
create policy "public read sections"   on project_sections for select using (true);
create policy "public read skills"     on skills           for select using (true);
create policy "public read experience" on experience       for select using (true);
create policy "public read certs"      on certifications   for select using (true);
create policy "public read settings"   on site_settings    for select using (true);

-- Testimonials: public sees only approved; authenticated sees all -----------
create policy "public read approved testimonials" on testimonials
  for select using (approved = true or auth.role() = 'authenticated');

-- Authenticated full write across content tables ----------------------------
create policy "auth write profiles"   on profiles         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write projects"   on projects         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write sections"   on project_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write skills"     on skills           for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write experience" on experience       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write certs"      on certifications   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write testimonials" on testimonials   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write settings"   on site_settings    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Contact messages: anon INSERT only; authenticated read/update -------------
create policy "anyone can submit message" on contact_messages
  for insert with check (true);
create policy "auth read messages" on contact_messages
  for select using (auth.role() = 'authenticated');
create policy "auth update messages" on contact_messages
  for update using (auth.role() = 'authenticated');

-- Audit logs: authenticated read only (writes happen via the trigger) -------
create policy "auth read audit" on audit_logs
  for select using (auth.role() = 'authenticated');
