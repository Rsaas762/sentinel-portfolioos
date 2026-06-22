import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Target,
  Lightbulb,
  Wrench,
  ShieldCheck,
  GraduationCap,
  ImageIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/social";
import { getRepo } from "@/lib/data";
import type { SectionKind } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProseText } from "@/components/prose-text";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_DIFFICULTY_LABELS,
  PROJECT_STATUS_LABELS,
  STATUS_BADGE_VARIANT,
} from "@/lib/labels";

const SECTION_ICON: Record<SectionKind, React.ComponentType<{ className?: string }>> = {
  problem: Target,
  solution: Lightbulb,
  tech: Wrench,
  security: ShieldCheck,
  learned: GraduationCap,
  screenshots: ImageIcon,
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      {/* Header */}
      <header className="mt-6 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {PROJECT_CATEGORY_LABELS[project.category]}
          </Badge>
          <Badge variant={STATUS_BADGE_VARIANT[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
          <Badge variant="outline">
            {PROJECT_DIFFICULTY_LABELS[project.difficulty]}
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {project.short_description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

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

      {/* Sections */}
      <div className="mt-10 space-y-12">
        {sections.map((section) => {
          const Icon = SECTION_ICON[section.kind];
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
      <div className="mt-16 rounded-xl border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Want to talk through this project or something similar?
        </p>
        <Button asChild className="mt-3" size="sm">
          <Link href="/contact">Get in touch</Link>
        </Button>
      </div>
    </article>
  );
}
