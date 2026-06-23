import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Target,
  Lightbulb,
  Wrench,
  ListChecks,
  ShieldCheck,
  GraduationCap,
  ImageIcon,
  Rocket,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/social";
import { getRepo } from "@/lib/data";
import type { SectionKind } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProseText } from "@/components/prose-text";
import { TechChips } from "@/components/public/tech-chips";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_DIFFICULTY_LABELS,
  PROJECT_STATUS_LABELS,
  STATUS_BADGE_VARIANT,
} from "@/lib/labels";

const SECTION_ICON: Record<
  SectionKind,
  React.ComponentType<{ className?: string }>
> = {
  problem: Target,
  solution: Lightbulb,
  tech: Wrench,
  features: ListChecks,
  security: ShieldCheck,
  learned: GraduationCap,
  screenshots: ImageIcon,
  future: Rocket,
};

export async function generateStaticParams() {
  const projects = await getRepo().listProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getRepo().getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.short_description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getRepo().getProjectBySlug(slug);
  if (!project) notFound();

  const sections = project.sections ?? [];

  const meta = [
    { label: "Scope", value: project.scope },
    { label: "Category", value: PROJECT_CATEGORY_LABELS[project.category] },
    { label: "Status", value: PROJECT_STATUS_LABELS[project.status] },
    { label: "Difficulty", value: PROJECT_DIFFICULTY_LABELS[project.difficulty] },
  ];

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      {/* Header */}
      <header className="mt-6 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{project.scope}</Badge>
          <Badge variant="secondary">
            {PROJECT_CATEGORY_LABELS[project.category]}
          </Badge>
          <Badge variant={STATUS_BADGE_VARIANT[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        {project.github_url || project.demo_url ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo_url ? (
              <Button asChild>
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" /> Live demo
                </a>
              </Button>
            ) : null}
            {project.github_url ? (
              <Button asChild variant="outline">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="size-4" /> View source
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
        {project.demo_url || project.github_url ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Demo and source links are placeholders in this sample data.
          </p>
        ) : null}
      </header>

      {/* At-a-glance meta + tech stack */}
      <section className="mt-8 grid gap-6 rounded-xl border bg-muted/30 p-6 sm:grid-cols-2">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
              <dd className="mt-0.5 font-medium">{m.value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tech stack
          </p>
          <TechChips items={project.tech_stack} className="mt-2" />
        </div>
      </section>

      {/* Case-study sections */}
      <div className="mt-12 space-y-12">
        {sections.map((section) => {
          const Icon = SECTION_ICON[section.kind] ?? Target;
          const isScreens = section.kind === "screenshots";
          return (
            <section key={section.id} className="scroll-mt-20">
              <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
                <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {section.heading}
              </h2>
              <div className="mt-4">
                {isScreens ? (
                  <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {section.body}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground"
                        >
                          <ImageIcon className="size-6 opacity-50" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ProseText text={section.body} />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 rounded-xl border bg-muted/40 p-8 text-center">
        <p className="font-medium">
          Want to talk through this project or something similar?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          I&rsquo;m open to internships, junior roles, and small freelance
          builds.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button asChild size="sm">
            <Link href="/contact">Get in touch</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/projects">More projects</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
