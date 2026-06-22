import type { Metadata } from "next";
import {
  ShieldCheck,
  Layout,
  Server,
  Database,
  Wrench,
  MonitorCog,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/data/types";
import { SKILL_CATEGORY_LABELS } from "@/lib/labels";
import { PageHeader } from "@/components/public/page-header";
import { Proficiency } from "@/components/public/proficiency";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Skills across cybersecurity, frontend, backend, databases, tools, and operating systems — with honest proficiency levels.",
};

const CATEGORY_ICON: Record<
  SkillCategory,
  React.ComponentType<{ className?: string }>
> = {
  cybersecurity: ShieldCheck,
  frontend: Layout,
  backend: Server,
  databases: Database,
  tools: Wrench,
  operating_systems: MonitorCog,
};

export default async function SkillsPage() {
  const skills = await getRepo().listSkills();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="Capabilities"
        title="Skills"
        description="Grouped by domain, with self-assessed proficiency. I keep these honest — a high bar means hands-on, repeated use, not a single tutorial."
        className="mb-12"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {SKILL_CATEGORIES.map((cat) => {
          const items = skills.filter((s) => s.category === cat);
          if (items.length === 0) return null;
          const Icon = CATEGORY_ICON[cat];
          return (
            <section
              key={cat}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="mb-5 flex items-center gap-2.5 text-lg font-semibold">
                <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                {SKILL_CATEGORY_LABELS[cat]}
              </h2>
              <ul className="space-y-3.5">
                {items.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {skill.name}
                      </p>
                      {skill.note ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {skill.note}
                        </p>
                      ) : null}
                    </div>
                    <Proficiency level={skill.proficiency} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Proficiency is a personal estimate on a 1–5 scale and reflects practical
        experience, not formal certification unless noted.
      </p>
    </div>
  );
}
