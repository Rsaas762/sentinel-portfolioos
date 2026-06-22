"use client";

import * as React from "react";
import type { Project, ProjectCategory } from "@/lib/data/types";
import { ProjectCard } from "@/components/public/project-card";
import { PROJECT_CATEGORY_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const categories = React.useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return (Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]).filter(
      (c) => present.has(c),
    );
  }, [projects]);

  const [active, setActive] = React.useState<ProjectCategory | "all">("all");

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <FilterChip
          label={`All (${projects.length})`}
          active={active === "all"}
          onClick={() => setActive("all")}
        />
        {categories.map((c) => (
          <FilterChip
            key={c}
            label={PROJECT_CATEGORY_LABELS[c]}
            active={active === c}
            onClick={() => setActive(c)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
