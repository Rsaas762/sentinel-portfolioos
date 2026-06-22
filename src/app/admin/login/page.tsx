import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Admin access
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Sign in to your dashboard
          </h1>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {configured ? (
            <Suspense fallback={<div className="h-48" />}>
              <LoginForm />
            </Suspense>
          ) : (
            <div className="text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </span>
              <h2 className="mt-4 font-semibold">Demo mode</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No database is configured, so authentication is disabled. You can
                explore the full admin dashboard with sample data — changes
                won’t be saved.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href="/admin">
                  Enter dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Add Supabase credentials to enable real sign-in and a live CMS.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to the public site
          </Link>
        </p>
      </div>
    </div>
  );
}
