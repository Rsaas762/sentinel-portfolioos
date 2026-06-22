/**
 * Domain types for Sentinel PortfolioOS.
 * These mirror the Postgres schema in `database/schema.sql` and are the single
 * source of truth consumed by both data providers (demo + supabase).
 */

export const PROJECT_CATEGORIES = [
  "cybersecurity",
  "full_stack",
  "frontend",
  "backend",
  "infrastructure",
  "compliance",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = [
  "live",
  "in_progress",
  "completed",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type ProjectDifficulty = (typeof PROJECT_DIFFICULTIES)[number];

export const SECTION_KINDS = [
  "problem",
  "solution",
  "tech",
  "security",
  "learned",
  "screenshots",
] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

export const SKILL_CATEGORIES = [
  "cybersecurity",
  "frontend",
  "backend",
  "databases",
  "tools",
  "operating_systems",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const MESSAGE_STATUSES = ["new", "read", "archived"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export const CERT_STATUSES = [
  "earned",
  "in_progress",
  "planned",
] as const;
export type CertStatus = (typeof CERT_STATUSES)[number];

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  avatar_url: string | null;
}

export interface ProjectSection {
  id: string;
  project_id: string;
  kind: SectionKind;
  heading: string;
  body: string;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  cover_image: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  /** Joined sections, ordered by sort_order. Present on detail reads. */
  sections?: ProjectSection[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-5
  note: string | null;
  sort_order: number;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string | null; // null = present
  summary: string;
  highlights: string[];
  sort_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: CertStatus;
  issued_on: string | null;
  credential_url: string | null;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  source_url: string | null;
  approved: boolean;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  ip_hash: string | null;
  created_at: string;
}

export interface SiteSettings {
  hero_kicker: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_label: string;
  cv_url: string | null;
  available_for_work: boolean;
  ai_assistant_enabled: boolean;
  contact_email: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string;
  created_at: string;
}

/** Result wrapper for mutations — lets the demo provider signal non-persistence. */
export type MutationResult<T = unknown> =
  | { ok: true; data: T; demo?: boolean }
  | { ok: false; error: string; demo?: boolean };

/** Read surface shared by both providers. */
export interface PortfolioRepo {
  getProfile(): Promise<Profile>;
  getSettings(): Promise<SiteSettings>;
  listProjects(): Promise<Project[]>;
  listFeaturedProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  listSkills(): Promise<Skill[]>;
  listExperience(): Promise<Experience[]>;
  listCertifications(): Promise<Certification[]>;
  listTestimonials(): Promise<Testimonial[]>;
  listMessages(): Promise<ContactMessage[]>;
  listAuditLogs(limit?: number): Promise<AuditLog[]>;
  createMessage(input: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ip_hash: string | null;
  }): Promise<MutationResult<ContactMessage>>;
}
