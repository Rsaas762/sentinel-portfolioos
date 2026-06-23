"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ADMIN_NAV_GROUPS } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  email,
  mode,
  badges = {},
}: {
  email: string;
  mode: "demo" | "supabase";
  /** Optional count badges keyed by nav href, e.g. unread messages. */
  badges?: Record<string, number>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the mobile nav on navigation without an effect (adjust on render).
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
      {ADMIN_NAV_GROUPS.map((group, gi) => (
        <div key={group.label ?? `g${gi}`} className="flex flex-col gap-0.5">
          {group.label ? (
            <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              {group.label}
            </p>
          ) : null}
          {group.items.map(({ href, label, Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            const badge = badges[href];
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
                {badge ? (
                  <span
                    className={cn(
                      "ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="space-y-2 border-t p-3">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ExternalLink className="size-4" /> View public site
      </Link>
      <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold uppercase text-primary">
          {email.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{email}</p>
          <p className="text-[11px] text-muted-foreground">
            {mode === "demo" ? "Demo session" : "Signed in"}
          </p>
        </div>
      </div>
      <SignOutButton mode={mode} />
    </div>
  );

  const header = (
    <div className="flex items-center justify-between gap-2 border-b p-4">
      <Link href="/admin" aria-label="Admin dashboard">
        <Logo size="md" />
      </Link>
      <div className="flex items-center gap-1">
        {mode === "demo" ? (
          <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
            Demo
          </span>
        ) : null}
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b px-4 py-3 md:hidden">
        <Link href="/admin">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="flex flex-col border-b bg-card md:hidden">
          {nav}
          {footer}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-card md:flex">
        {header}
        {nav}
        {footer}
      </aside>
    </>
  );
}
