import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/social";
import type { Project } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { TechChips } from "@/components/public/tech-chips";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  STATUS_BADGE_VARIANT,
} from "@/lib/labels";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="secondary">
          {PROJECT_CATEGORY_LABELS[project.category]}
        </Badge>
        <Badge variant={STATUS_BADGE_VARIANT[project.status]}>
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold tracking-tight">
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {project.scope}
      </p>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {project.short_description}
      </p>

      <TechChips items={project.tech_stack} max={5} className="mt-4" />

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Case study
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <div className="relative z-10 flex items-center gap-1.5 text-muted-foreground">
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="inline-flex size-8 items-center justify-center rounded-md hover:text-foreground"
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
              className="inline-flex size-8 items-center justify-center rounded-md hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
