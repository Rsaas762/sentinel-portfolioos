"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Trash2, Star, ExternalLink, FolderKanban, Plus } from "lucide-react";
import type { Project } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteRow } from "@/lib/actions";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  STATUS_BADGE_VARIANT,
} from "@/lib/labels";

export function ProjectsTable({
  projects,
  readOnly,
}: {
  projects: Project[];
  readOnly: boolean;
}) {
  if (projects.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border bg-card">
        <EmptyState
          Icon={FolderKanban}
          title="No projects yet"
          description="Create your first case study to showcase your work."
          action={
            <Button asChild size="sm">
              <Link href="/admin/projects/new">
                <Plus className="size-4" /> New project
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-4 py-2.5 text-sm text-muted-foreground">
        {projects.length} project{projects.length === 1 ? "" : "s"}
      </div>
      <ul className="divide-y">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="truncate font-medium hover:text-primary"
                >
                  {p.title}
                </Link>
                {p.featured ? (
                  <Star className="size-3.5 shrink-0 fill-primary text-primary" />
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="muted">
                  {PROJECT_CATEGORY_LABELS[p.category]}
                </Badge>
                <Badge variant={STATUS_BADGE_VARIANT[p.status]}>
                  {PROJECT_STATUS_LABELS[p.status]}
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">
                  /{p.slug}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button asChild variant="ghost" size="icon" aria-label="View live">
                <Link href={`/projects/${p.slug}`} target="_blank">
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Edit">
                <Link href={`/admin/projects/${p.id}`}>
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <DeleteProjectButton id={p.id} readOnly={readOnly} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeleteProjectButton({
  id,
  readOnly,
}: {
  id: string;
  readOnly: boolean;
}) {
  const [confirm, setConfirm] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  if (confirm) {
    return (
      <span className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteRow("projects", id);
              setConfirm(false);
            })
          }
        >
          {readOnly ? "Demo" : "Delete"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Delete project"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirm(true)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
