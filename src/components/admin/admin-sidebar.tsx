"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ADMIN_NAV } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  email,
  mode,
}: {
  email: string;
  mode: "demo" | "supabase";
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
    <nav className="flex flex-1 flex-col gap-0.5 p-3">
      {ADMIN_NAV.map(({ href, label, Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t p-3">
      <Link
        href="/"
        className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="size-4" /> View public site
      </Link>
      <div className="rounded-md bg-muted/50 px-3 py-2">
        <p className="truncate text-xs font-medium">{email}</p>
        <p className="text-[11px] text-muted-foreground">
          {mode === "demo" ? "Demo session" : "Signed in"}
        </p>
      </div>
      <div className="mt-2">
        <SignOutButton mode={mode} />
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
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col border-b bg-card md:hidden">
          {nav}
          {footer}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="border-b p-4">
          <Link href="/admin">
            <Logo size="md" />
          </Link>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
