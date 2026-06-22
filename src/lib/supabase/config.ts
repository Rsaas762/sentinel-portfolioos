/**
 * Central place to read Supabase configuration. When these are absent the app
 * runs in zero-config demo mode (seed data + non-persistent admin).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when both public Supabase env vars are present and non-empty. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
