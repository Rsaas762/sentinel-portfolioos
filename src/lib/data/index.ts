import type { PortfolioRepo } from "@/lib/data/types";
import { DemoRepo } from "@/lib/data/demo/repo";
import { SupabaseRepo } from "@/lib/data/supabase/repo";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Returns the active repository. Supabase when configured, otherwise the
 * zero-config demo provider. This is the seam that lets the entire app run
 * with or without a database.
 */
export function getRepo(): PortfolioRepo {
  return isSupabaseConfigured() ? new SupabaseRepo() : new DemoRepo();
}

/** True when the app is running on seed data (no Supabase configured). */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export type { PortfolioRepo };
