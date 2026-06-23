import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  /** "demo" when no Supabase is configured; "supabase" when authenticated. */
  mode: "demo" | "supabase";
  email: string;
  /** True only for a real authenticated Supabase session. */
  authenticated: boolean;
}

/**
 * Resolves the admin session for server components and actions.
 * - Demo mode: returns a clearly-labelled demo identity (no real auth).
 * - Supabase mode: returns the signed-in user, or null if not authenticated.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) {
    return { mode: "demo", email: "demo@sentinel.local", authenticated: false };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return {
    mode: "supabase",
    email: user.email ?? "admin",
    authenticated: true,
  };
}

/** True when admin mutations should be blocked (demo / non-persistent). */
export function isReadOnlyAdmin(session: AdminSession | null): boolean {
  return !session || !session.authenticated;
}
