import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  Award,
  Inbox,
  ArrowRight,
  Activity,
  Plus,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { getAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";

export default async function AdminDashboard() {
  const repo = getRepo();
  const [session, projects, skills, certs, messages, audit] = await Promise.all(
    [
      getAdminSession(),
      repo.listProjects(),
      repo.listSkills(),
      repo.listCertifications(),
      repo.listMessages(),
      repo.listAuditLogs(8),
    ],
  );

  const newMessages = messages.filter((m) => m.status === "new").length;
  const featured = projects.filter((p) => p.featured).length;
  const name = session?.email?.split("@")[0] ?? "there";

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      hint: `${featured} featured`,
      Icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Skills",
      value: skills.length,
      hint: "6 domains",
      Icon: Sparkles,
      href: "/admin/skills",
    },
    {
      label: "Certifications",
      value: certs.length,
      hint: `${certs.filter((c) => c.status === "earned").length} earned`,
      Icon: Award,
      href: "/admin/certifications",
    },
    {
      label: "Messages",
      value: messages.length,
      hint: newMessages > 0 ? `${newMessages} new` : "all read",
      Icon: Inbox,
      href: "/admin/messages",
    },
  ];

  const actionTone: Record<string, string> = {
    create: "success",
    update: "default",
    delete: "warning",
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your portfolio content and keep your case studies current.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              <ExternalLink className="size-4" /> View site
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/projects/new">
              <Plus className="size-4" /> New project
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, hint, Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent activity */}
        <section className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-primary" /> Recent activity
            </h2>
            <span className="text-xs text-muted-foreground">Audit log</span>
          </div>
          {audit.length === 0 ? (
            <EmptyState
              Icon={Activity}
              title="No activity yet"
              description="Content changes you make will be recorded here."
            />
          ) : (
            <ul className="divide-y">
              {audit.map((log) => (
                <li
                  key={log.id}
                  className="flex items-start justify-between gap-3 px-6 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">{log.summary}</p>
                    <p className="text-xs text-muted-foreground">{log.actor}</p>
                  </div>
                  <Badge
                    variant={
                      (actionTone[log.action] ?? "muted") as
                        | "success"
                        | "default"
                        | "warning"
                        | "muted"
                    }
                    className="shrink-0 font-mono"
                  >
                    {log.action}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick manage */}
        <section className="rounded-lg border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Pencil className="size-4 text-primary" /> Manage
            </h2>
          </div>
          <div className="grid gap-2 p-4">
            {[
              { href: "/admin/projects", label: "Projects & case studies" },
              { href: "/admin/skills", label: "Skills" },
              { href: "/admin/experience", label: "Experience" },
              { href: "/admin/testimonials", label: "Testimonials" },
              { href: "/admin/messages", label: "Contact messages" },
              { href: "/admin/settings", label: "Site settings" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {l.label}
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
