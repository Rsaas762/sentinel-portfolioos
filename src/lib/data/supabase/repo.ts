import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { SEED_PROFILE, SEED_SETTINGS } from "@/lib/data/seed/content";

/**
 * Supabase-backed provider. Used when Supabase env vars are present.
 *
 * Public reads use a plain anon client (no cookies) so they are safe during
 * static generation (`generateStaticParams`, sitemap) and at request time —
 * RLS public-select policies make this safe. Only admin-only reads (messages,
 * audit logs) use the cookie-bound session client, since they require an
 * authenticated session and run in request scope.
 */
let anonSingleton: SupabaseClient | null = null;
function anon(): SupabaseClient {
  if (!anonSingleton) {
    anonSingleton = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonSingleton;
}

export class SupabaseRepo implements PortfolioRepo {
  private session() {
    return createSupabaseServerClient();
  }

  async getProfile(): Promise<Profile> {
    const { data } = await anon()
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();
    return (data as Profile | null) ?? SEED_PROFILE;
  }

  async getSettings(): Promise<SiteSettings> {
    const { data } = await anon()
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    return (data as SiteSettings | null) ?? SEED_SETTINGS;
  }

  async listProjects(): Promise<Project[]> {
    const { data } = await anon()
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Project[] | null) ?? [];
  }

  async listFeaturedProjects(): Promise<Project[]> {
    const { data } = await anon()
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true });
    return (data as Project[] | null) ?? [];
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return this.projectWithSections("slug", slug);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectWithSections("id", id);
  }

  private async projectWithSections(
    column: "slug" | "id",
    value: string,
  ): Promise<Project | null> {
    const client = anon();
    const { data: project } = await client
      .from("projects")
      .select("*")
      .eq(column, value)
      .maybeSingle();
    if (!project) return null;

    const { data: sections } = await client
      .from("project_sections")
      .select("*")
      .eq("project_id", (project as Project).id)
      .order("sort_order", { ascending: true });

    return { ...(project as Project), sections: sections ?? [] };
  }

  async listSkills(): Promise<Skill[]> {
    const { data } = await anon()
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Skill[] | null) ?? [];
  }

  async listExperience(): Promise<Experience[]> {
    const { data } = await anon()
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Experience[] | null) ?? [];
  }

  async listCertifications(): Promise<Certification[]> {
    const { data } = await anon()
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Certification[] | null) ?? [];
  }

  async listTestimonials(): Promise<Testimonial[]> {
    // RLS returns approved-only for anon, all for authenticated.
    const { data } = await anon()
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("sort_order", { ascending: true });
    return (data as Testimonial[] | null) ?? [];
  }

  async listMessages(): Promise<ContactMessage[]> {
    const supabase = await this.session();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as ContactMessage[] | null) ?? [];
  }

  async listAuditLogs(limit = 20): Promise<AuditLog[]> {
    const supabase = await this.session();
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
    // Public insert under the anon-insert RLS policy. We intentionally do NOT
    // read the row back — anon has no SELECT policy on contact_messages, so a
    // returning-select would fail RLS. The caller only needs success/failure.
    const { error } = await anon()
      .from("contact_messages")
      .insert({ ...input, status: "new" });

    if (error) {
      return { ok: false as const, error: error.message };
    }
    return {
      ok: true as const,
      data: {
        id: "",
        ...input,
        status: "new",
        created_at: new Date().toISOString(),
      } as ContactMessage,
    };
  }
}
