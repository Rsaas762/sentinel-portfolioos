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
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProseText } from "@/components/prose-text";
import { TechChips } from "@/components/public/tech-chips";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_DIFFICULTY_LABELS,
  PROJECT_STATUS_LABELS,
  SECTION_KIND_LABELS,
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
  const tone = STATUS_BADGE_VARIANT[project.status] as
    | "success"
    | "warning"
    | "default"
    | "muted";

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
        className="system-label inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> back to projects
      </Link>

      {/* Header */}
      <header className="mt-6 border-b pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatusPill tone={tone}>
            {PROJECT_STATUS_LABELS[project.status]}
          </StatusPill>
          <span className="system-label text-muted-foreground">
            {PROJECT_CATEGORY_LABELS[project.category]}
          </span>
          <span className="font-mono text-xs text-muted-foreground/70">
            {project.scope}
          </span>
        </div>

        <h1 className="font-display mt-5 text-balance text-4xl leading-[1.05] sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
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
      </header>

      {/* Spec sheet */}
      <section className="mt-8 overflow-hidden rounded-xl border bg-card">
        <div className="grid gap-px bg-border sm:grid-cols-2">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 bg-card p-6">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="system-label text-muted-foreground/70">
                  {m.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="bg-card p-6">
            <p className="system-label text-muted-foreground/70">Tech stack</p>
            <TechChips items={project.tech_stack} className="mt-3" />
          </div>
        </div>
      </section>

      {/* Case-study sections — numbered editorial breakdown */}
      <div className="mt-14 space-y-14">
        {sections.map((section, i) => {
          const Icon = SECTION_ICON[section.kind] ?? Target;
          const isScreens = section.kind === "screenshots";
          return (
            <section key={section.id} className="scroll-mt-20">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="system-label inline-flex items-center gap-1.5 text-muted-foreground/70">
                    <Icon className="size-3 text-primary" aria-hidden />
                    {SECTION_KIND_LABELS[section.kind]}
                  </p>
                  <h2 className="font-display mt-2 text-2xl leading-tight sm:text-[1.7rem]">
                    {section.heading}
                  </h2>
                </div>
              </div>

              <div className="mt-5 pl-0 sm:pl-9">
                {isScreens ? (
                  <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {section.body}
                    </p>
                    {project.screenshots.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {project.screenshots.map((src, n) => (
                          <figure
                            key={src}
                            className="overflow-hidden rounded-lg border bg-card shadow-sm"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`${project.title} screenshot ${n + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full"
                            />
                          </figure>
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[0, 1].map((n) => (
                          <div
                            key={n}
                            className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-grid text-muted-foreground"
                          >
                            <span className="system-label flex flex-col items-center gap-2 text-muted-foreground/50">
                              <ImageIcon className="size-6" />
                              capture pending
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
      <div className="mt-16 overflow-hidden rounded-xl border border-navy-border bg-navy p-8 text-center text-navy-foreground">
        <p className="font-display text-xl">
          Want to talk through this project or something similar?
        </p>
        <p className="mt-2 text-sm text-navy-muted">
          I&rsquo;m open to internships, junior roles, and small freelance
          builds.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild size="sm">
            <Link href="/contact">Get in touch</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-navy-border bg-transparent text-navy-foreground hover:border-primary/50 hover:bg-white/[0.04] hover:text-navy-foreground"
          >
            <Link href="/projects">More projects</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
