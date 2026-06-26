import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  MonitorSmartphone,
  Server,
  Network,
  FileCheck,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/social";
import type { Project, ProjectCategory } from "@/lib/data/types";
import { StatusPill } from "@/components/ui/badge";
import { TechChips } from "@/components/public/tech-chips";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  STATUS_BADGE_VARIANT,
} from "@/lib/labels";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<
  ProjectCategory,
  React.ComponentType<{ className?: string }>
> = {
  cybersecurity: ShieldCheck,
  full_stack: Layers,
  frontend: MonitorSmartphone,
  backend: Server,
  infrastructure: Network,
  compliance: FileCheck,
};

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index?: number;
}) {
  const CategoryIcon = CATEGORY_ICON[project.category] ?? Layers;
  const cover = project.screenshots[0];
  const tone = STATUS_BADGE_VARIANT[project.status] as
    | "success"
    | "warning"
    | "default"
    | "muted";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
      )}
    >
      {/* Visual strip — screenshot when present, schematic placeholder otherwise */}
      <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative flex size-full items-center justify-center bg-grid">
            <CategoryIcon className="size-9 text-muted-foreground/35" />
            {typeof index === "number" ? (
              <span className="absolute right-3 top-2 font-display text-5xl leading-none text-foreground/[0.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded bg-background/90 px-2 py-1 shadow-sm backdrop-blur">
            <StatusPill tone={tone}>
              {PROJECT_STATUS_LABELS[project.status]}
            </StatusPill>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="system-label inline-flex items-center gap-1.5 text-muted-foreground">
            <CategoryIcon className="size-3" aria-hidden />
            {PROJECT_CATEGORY_LABELS[project.category]}
          </span>
          <span className="font-mono text-[0.65rem] text-muted-foreground/70">
            {project.scope}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        <TechChips items={project.tech_stack} max={4} className="mt-4" />

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            View case study
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <div className="relative z-10 flex items-center gap-1 text-muted-foreground">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
              >
                <GithubIcon className="size-4" />
              </a>
            ) : null}
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
