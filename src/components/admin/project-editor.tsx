"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  Field,
  CheckboxField,
  FormBanner,
  SubmitButton,
} from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiAssistant } from "@/components/admin/ai-assistant";
import { saveProject } from "@/lib/actions";
import { IDLE } from "@/lib/actions/result";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  PROJECT_DIFFICULTIES,
  SECTION_KINDS,
  type Project,
  type SectionKind,
} from "@/lib/data/types";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_DIFFICULTY_LABELS,
  SECTION_KIND_LABELS,
} from "@/lib/labels";

interface SectionDraft {
  key: string;
  kind: SectionKind;
  heading: string;
  body: string;
}

const DEFAULT_HEADINGS: Record<SectionKind, string> = {
  problem: "Problem",
  solution: "Solution",
  tech: "How it's built",
  features: "Key features",
  security: "Security considerations",
  learned: "What I learned",
  screenshots: "Screenshots",
  future: "Future improvements",
};

function initialSections(project: Project | null): SectionDraft[] {
  if (project?.sections && project.sections.length > 0) {
    return project.sections.map((s, i) => ({
      key: `${s.id}-${i}`,
      kind: s.kind,
      heading: s.heading,
      body: s.body,
    }));
  }
  return SECTION_KINDS.map((kind, i) => ({
    key: `new-${kind}-${i}`,
    kind,
    heading: DEFAULT_HEADINGS[kind],
    body: "",
  }));
}

export function ProjectEditor({
  project,
  readOnly,
}: {
  project: Project | null;
  readOnly: boolean;
}) {
  const router = useRouter();
  const action = saveProject.bind(null, project?.id ?? null);
  const [state, formAction] = useActionState(action, IDLE);
  const e = state.fieldErrors ?? {};

  const [sections, setSections] = React.useState<SectionDraft[]>(() =>
    initialSections(project),
  );

  React.useEffect(() => {
    if (state.status === "ok") {
      router.push("/admin/projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const sectionsPayload = sections.map((s, i) => ({
    kind: s.kind,
    heading: s.heading,
    body: s.body,
    sort_order: i + 1,
  }));

  function updateSection(key: string, patch: Partial<SectionDraft>) {
    setSections((cur) =>
      cur.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  }
  function addSection() {
    setSections((cur) => [
      ...cur,
      {
        key: `new-${Date.now()}`,
        kind: "problem",
        heading: "",
        body: "",
      },
    ]);
  }
  function removeSection(key: string) {
    setSections((cur) => cur.filter((s) => s.key !== key));
  }
  function move(key: string, dir: -1 | 1) {
    setSections((cur) => {
      const i = cur.findIndex((s) => s.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <form action={formAction} className="space-y-6">
        <FormBanner status={state.status} message={state.message} />

        {/* Core fields */}
        <section className="space-y-4 rounded-lg border bg-card p-6">
          <h2 className="text-sm font-semibold">Details</h2>
          <Field label="Title" htmlFor="title" error={e.title}>
            <Input id="title" name="title" defaultValue={project?.title ?? ""} />
          </Field>
          <Field
            label="Slug"
            htmlFor="slug"
            hint="Lowercase, dashes. Used in the URL."
            error={e.slug}
          >
            <Input id="slug" name="slug" defaultValue={project?.slug ?? ""} />
          </Field>
          <Field
            label="Short description"
            htmlFor="short_description"
            error={e.short_description}
          >
            <Textarea
              id="short_description"
              name="short_description"
              rows={2}
              defaultValue={project?.short_description ?? ""}
            />
          </Field>

          <Field
            label="Scope"
            htmlFor="scope"
            hint="Honest framing, e.g. “Portfolio project”, “Student lab”, “Coursework”, “MVP”."
            error={e.scope}
          >
            <Input
              id="scope"
              name="scope"
              defaultValue={project?.scope ?? ""}
              placeholder="Portfolio project"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category" htmlFor="category" error={e.category}>
              <Select
                id="category"
                name="category"
                defaultValue={project?.category ?? "full_stack"}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {PROJECT_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status" htmlFor="status" error={e.status}>
              <Select
                id="status"
                name="status"
                defaultValue={project?.status ?? "in_progress"}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Difficulty" htmlFor="difficulty" error={e.difficulty}>
              <Select
                id="difficulty"
                name="difficulty"
                defaultValue={project?.difficulty ?? "intermediate"}
              >
                {PROJECT_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {PROJECT_DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label="Tech stack"
            htmlFor="tech_stack"
            hint="Comma-separated, e.g. Next.js, TypeScript, PostgreSQL"
            error={e.tech_stack}
          >
            <Input
              id="tech_stack"
              name="tech_stack"
              defaultValue={(project?.tech_stack ?? []).join(", ")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="GitHub URL"
              htmlFor="github_url"
              optional
              error={e.github_url}
            >
              <Input
                id="github_url"
                name="github_url"
                defaultValue={project?.github_url ?? ""}
                placeholder="https://github.com/…"
              />
            </Field>
            <Field
              label="Live demo URL"
              htmlFor="demo_url"
              optional
              error={e.demo_url}
            >
              <Input
                id="demo_url"
                name="demo_url"
                defaultValue={project?.demo_url ?? ""}
                placeholder="https://…"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <Field label="Sort order" htmlFor="sort_order" error={e.sort_order}>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={project?.sort_order ?? 0}
              />
            </Field>
            <div className="pb-2.5">
              <CheckboxField
                name="featured"
                label="Feature on homepage"
                defaultChecked={project?.featured ?? false}
              />
            </div>
          </div>
        </section>

        {/* Sections editor */}
        <section className="space-y-4 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Case-study sections</h2>
            <Button type="button" size="sm" variant="outline" onClick={addSection}>
              <Plus className="size-4" /> Add section
            </Button>
          </div>

          {sections.map((s, i) => (
            <div key={s.key} className="space-y-3 rounded-md border p-4">
              <div className="flex items-center gap-2">
                <Select
                  aria-label="Section kind"
                  value={s.kind}
                  onChange={(ev) =>
                    updateSection(s.key, {
                      kind: ev.target.value as SectionKind,
                    })
                  }
                  className="max-w-44"
                >
                  {SECTION_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {SECTION_KIND_LABELS[k]}
                    </option>
                  ))}
                </Select>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => move(s.key, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move down"
                    disabled={i === sections.length - 1}
                    onClick={() => move(s.key, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove section"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeSection(s.key)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <Input
                aria-label="Section heading"
                placeholder="Heading"
                value={s.heading}
                onChange={(ev) =>
                  updateSection(s.key, { heading: ev.target.value })
                }
              />
              <Textarea
                aria-label="Section body"
                placeholder="Body…"
                rows={4}
                value={s.body}
                onChange={(ev) =>
                  updateSection(s.key, { body: ev.target.value })
                }
              />
            </div>
          ))}

          <input
            type="hidden"
            name="sections"
            value={JSON.stringify(sectionsPayload)}
          />
          <p className="text-xs text-muted-foreground">
            Empty sections are skipped on save. Drafts from the assistant can be
            pasted into any section body.
          </p>
        </section>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/projects")}
          >
            Cancel
          </Button>
          {readOnly ? (
            <Button type="submit">Try save (demo)</Button>
          ) : (
            <SubmitButton>
              {project ? "Save changes" : "Create project"}
            </SubmitButton>
          )}
        </div>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <AiAssistant />
      </div>
    </div>
  );
}
