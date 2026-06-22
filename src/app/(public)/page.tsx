import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Terminal,
  Sparkles,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/public/project-card";
import { SKILL_CATEGORY_LABELS } from "@/lib/labels";
import { SKILL_CATEGORIES } from "@/lib/data/types";

export default async function HomePage() {
  const repo = getRepo();
  const [settings, profile, featured, projects, skills, certs, testimonials] =
    await Promise.all([
      repo.getSettings(),
      repo.getProfile(),
      repo.listFeaturedProjects(),
      repo.listProjects(),
      repo.listSkills(),
      repo.listCertifications(),
      repo.listTestimonials(),
    ]);

  const stats = [
    { value: projects.length, label: "Case studies" },
    { value: skills.length, label: "Tracked skills" },
    {
      value: certs.filter((c) => c.status === "earned").length,
      label: "Certifications",
    },
    { value: 6, label: "Skill domains" },
  ];

  const topTestimonial = testimonials[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-24 right-0 -z-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-fade-up">
            {settings.available_for_work ? (
              <Badge variant="success" className="mb-5">
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-success" />
                Available for internships & freelance
              </Badge>
            ) : null}
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {settings.hero_kicker}
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/projects">
                  {settings.hero_cta_label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Security-first
                mindset
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="size-4 text-primary" /> Full-stack delivery
              </span>
            </div>
          </div>

          {/* "Proof" terminal card */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="rounded-xl border bg-card shadow-lg">
              <div className="flex items-center gap-1.5 border-b px-4 py-3">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-warning/70" />
                <span className="size-3 rounded-full bg-success/70" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  sentinel://proof
                </span>
              </div>
              <div className="space-y-3 p-5 font-mono text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary">$</span> whoami
                </p>
                <p className="font-semibold">{profile.full_name}</p>
                <p className="text-muted-foreground">{profile.headline}</p>
                <div className="h-px bg-border" />
                <p className="text-muted-foreground">
                  <span className="text-primary">$</span> ls ./evidence
                </p>
                <ul className="space-y-1.5">
                  {featured.slice(0, 3).map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                      <Link
                        href={`/projects/${p.slug}`}
                        className="truncate hover:text-primary"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-8 text-center">
              <div className="text-3xl font-bold tracking-tight text-primary">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Selected work
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured case studies
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Each project is documented end-to-end: the problem, the build, the
              security trade-offs, and what I learned.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/projects">
              All projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Skills teaser */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Capabilities
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Skills across six domains
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_CATEGORIES.map((cat) => {
              const items = skills.filter((s) => s.category === cat);
              return (
                <div
                  key={cat}
                  className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" />
                    {SKILL_CATEGORY_LABELS[cat]}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {items
                      .slice(0, 4)
                      .map((s) => s.name)
                      .join(" · ")}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/skills">Explore all skills</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {topTestimonial ? (
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Quote className="mx-auto size-8 text-primary/40" />
          <blockquote className="mt-6 text-balance text-xl font-medium leading-relaxed sm:text-2xl">
            “{topTestimonial.quote}”
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {topTestimonial.author}
            </span>{" "}
            — {topTestimonial.role}
          </p>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-10 text-center shadow-sm sm:p-16">
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Let’s turn the next project into proof.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Open to internships, junior security/full-stack roles, and small
              freelance builds.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Contact me</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/cv">View CV</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
