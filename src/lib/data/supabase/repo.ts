import "server-only";
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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SEED_PROFILE, SEED_SETTINGS } from "@/lib/data/seed/content";

/**
 * Supabase-backed provider. Used when Supabase env vars are present.
 * Reads use the anon key under RLS; writes are performed via server actions
 * with an authenticated session.
 */
export class SupabaseRepo implements PortfolioRepo {
  private async client() {
    return createSupabaseServerClient();
  }

  async getProfile(): Promise<Profile> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();
    return (data as Profile | null) ?? SEED_PROFILE;
  }

  async getSettings(): Promise<SiteSettings> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    return (data as SiteSettings | null) ?? SEED_SETTINGS;
  }

  async listProjects(): Promise<Project[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Project[] | null) ?? [];
  }

  async listFeaturedProjects(): Promise<Project[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true });
    return (data as Project[] | null) ?? [];
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = await this.client();
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!project) return null;

    const { data: sections } = await supabase
      .from("project_sections")
      .select("*")
      .eq("project_id", (project as Project).id)
      .order("sort_order", { ascending: true });

    return { ...(project as Project), sections: sections ?? [] };
  }

  async getProjectById(id: string): Promise<Project | null> {
    const supabase = await this.client();
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!project) return null;

    const { data: sections } = await supabase
      .from("project_sections")
      .select("*")
      .eq("project_id", (project as Project).id)
      .order("sort_order", { ascending: true });

    return { ...(project as Project), sections: sections ?? [] };
  }

  async listSkills(): Promise<Skill[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Skill[] | null) ?? [];
  }

  async listExperience(): Promise<Experience[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Experience[] | null) ?? [];
  }

  async listCertifications(): Promise<Certification[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Certification[] | null) ?? [];
  }

  async listTestimonials(): Promise<Testimonial[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("sort_order", { ascending: true });
    return (data as Testimonial[] | null) ?? [];
  }

  async listMessages(): Promise<ContactMessage[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as ContactMessage[] | null) ?? [];
  }

  async listAuditLogs(limit = 20): Promise<AuditLog[]> {
    const supabase = await this.client();
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as AuditLog[] | null) ?? [];
  }

  async createMessage(input: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ip_hash: string | null;
  }) {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({ ...input, status: "new" })
      .select("*")
      .single();

    if (error) {
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const, data: data as ContactMessage };
  }
}
