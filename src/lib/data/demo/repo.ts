import type {
  AuditLog,
  Certification,
  ContactMessage,
  Experience,
  PortfolioRepo,
  Profile,
  Project,
  SiteSettings,
  Skill,
  Testimonial,
} from "@/lib/data/types";
import { SEED_PROJECTS } from "@/lib/data/seed/projects";
import {
  SEED_CERTIFICATIONS,
  SEED_EXPERIENCE,
  SEED_PROFILE,
  SEED_SETTINGS,
  SEED_SKILLS,
  SEED_TESTIMONIALS,
} from "@/lib/data/seed/content";

const DEMO_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Dana Whitfield",
    email: "dana@example.com",
    subject: "Internship enquiry",
    message:
      "Hi Alex — we're recruiting a junior security analyst intern for the autumn. Your WebGuard project caught my eye. Could we set up a short call?",
    status: "new",
    ip_hash: null,
    created_at: "2026-06-19T09:12:00.000Z",
  },
  {
    id: "msg-2",
    name: "Tomas Berg",
    email: "tomas@example.com",
    subject: "Freelance: small business site",
    message:
      "Looking for a clean, fast site for my workshop. Saw your dashboard project — is this the kind of thing you take on?",
    status: "read",
    ip_hash: null,
    created_at: "2026-06-14T15:40:00.000Z",
  },
];

const DEMO_AUDIT: AuditLog[] = [
  {
    id: "aud-1",
    actor: "alex.rivera@example.com",
    action: "update",
    entity: "project",
    entity_id: "prj-webguard",
    summary: "Updated case study: Sentinel WebGuard",
    created_at: "2026-06-18T11:02:00.000Z",
  },
  {
    id: "aud-2",
    actor: "alex.rivera@example.com",
    action: "create",
    entity: "certification",
    entity_id: "cert-4",
    summary: "Added certification: TryHackMe — SOC Level 1 path",
    created_at: "2026-06-10T08:25:00.000Z",
  },
  {
    id: "aud-3",
    actor: "alex.rivera@example.com",
    action: "update",
    entity: "settings",
    entity_id: null,
    summary: "Toggled “available for work” on",
    created_at: "2026-06-01T19:45:00.000Z",
  },
];

/** Demo provider: serves seed fixtures; writes are intentionally non-persistent. */
export class DemoRepo implements PortfolioRepo {
  async getProfile(): Promise<Profile> {
    return SEED_PROFILE;
  }

  async getSettings(): Promise<SiteSettings> {
    return SEED_SETTINGS;
  }

  async listProjects(): Promise<Project[]> {
    return [...SEED_PROJECTS].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listFeaturedProjects(): Promise<Project[]> {
    return (await this.listProjects()).filter((p) => p.featured);
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  async listSkills(): Promise<Skill[]> {
    return [...SEED_SKILLS];
  }

  async listExperience(): Promise<Experience[]> {
    return [...SEED_EXPERIENCE].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listCertifications(): Promise<Certification[]> {
    return [...SEED_CERTIFICATIONS].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listTestimonials(): Promise<Testimonial[]> {
    return [...SEED_TESTIMONIALS].filter((t) => t.approved);
  }

  async listMessages(): Promise<ContactMessage[]> {
    return [...DEMO_MESSAGES];
  }

  async listAuditLogs(limit = 20): Promise<AuditLog[]> {
    return [...DEMO_AUDIT].slice(0, limit);
  }

  async createMessage(input: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ip_hash: string | null;
  }) {
    // Demo mode: acknowledge without persisting.
    const data: ContactMessage = {
      id: `demo-${Date.now()}`,
      ...input,
      status: "new",
      created_at: new Date().toISOString(),
    };
    return { ok: true as const, data, demo: true };
  }
}
