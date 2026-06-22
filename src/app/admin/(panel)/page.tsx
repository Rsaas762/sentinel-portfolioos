import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  Award,
  Inbox,
  ArrowRight,
  Activity,
  Plus,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { PageTitle } from "@/components/admin/page-title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const repo = getRepo();
  const [projects, skills, certs, messages, audit] = await Promise.all([
    repo.listProjects(),
    repo.listSkills(),
    repo.listCertifications(),
    repo.listMessages(),
    repo.listAuditLogs(8),
  ]);

  const newMessages = messages.filter((m) => m.status === "new").length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      Icon: FolderKanban,
      href: "/admin/projects",
    },
    { label: "Skills", value: skills.length, Icon: Sparkles, href: "/admin/skills" },
    {
      label: "Certifications",
      value: certs.length,
      Icon: Award,
      href: "/admin/certifications",
    },
    {
      label: "New messages",
      value: newMessages,
      Icon: Inbox,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Dashboard"
        description="An overview of your portfolio content and recent activity."
      >
        <Button asChild size="sm">
          <Link href="/admin/projects/new">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </PageTitle>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href }) => (
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
            <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent activity */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="size-4 text-primary" /> Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {audit.length === 0 ? (
              <li className="text-sm text-muted-foreground">No activity yet.</li>
            ) : (
              audit.map((log) => (
                <li
                  key={log.id}
                  className="flex items-start justify-between gap-3 border-b pb-3 text-sm last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate">{log.summary}</p>
                    <p className="text-xs text-muted-foreground">{log.actor}</p>
                  </div>
                  <Badge variant="muted" className="shrink-0 font-mono">
                    {log.action}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Quick links */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-sm font-semibold">Manage</h2>
          <div className="mt-4 grid gap-2">
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
