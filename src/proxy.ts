import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  // In demo mode (no Supabase) there is no session to manage and the admin
  // is intentionally reachable read-only — let everything through.
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and images, so the Supabase
     * session cookie stays fresh and /admin is guarded.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
