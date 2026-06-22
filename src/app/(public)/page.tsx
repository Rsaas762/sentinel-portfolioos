import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Terminal,
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
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="animate-fade-up">
            {settings.available_for_work ? (
              <Badge variant="success" className="mb-6">
                <span className="mr-1 inline-block size-1.5 rounded-full bg-success" />
                Available for internships &amp; freelance
              </Badge>
            ) : null}
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {settings.hero_kicker}
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
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
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Security-first
                mindset
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="size-4 text-primary" /> Full-stack delivery
              </span>
            </div>
          </div>

          {/* Clean "proof" snapshot card */}
          <div className="animate-fade-up [animation-delay:100ms]">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="border-b px-6 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Proof of work
                </p>
                <p className="mt-2 text-lg font-semibold">{profile.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {profile.headline}
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Featured case studies
                </p>
                <ul className="space-y-2.5">
                  {featured.slice(0, 3).map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="group flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-success" />
                        <span className="truncate font-medium group-hover:text-primary">
                          {p.title}
                        </span>
                        <ArrowRight className="ml-auto size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
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
      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-10 text-center">
              <div className="text-3xl font-semibold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1.5 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Selected work
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured case studies
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Skills teaser */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Capabilities
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Skills across six domains
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_CATEGORIES.map((cat) => {
              const items = skills.filter((s) => s.category === cat);
              return (
                <div
                  key={cat}
                  className="rounded-lg border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <h3 className="text-sm font-semibold">
                    {SKILL_CATEGORY_LABELS[cat]}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {items
                      .slice(0, 4)
                      .map((s) => s.name)
                      .join(" · ")}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/skills">Explore all skills</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {topTestimonial ? (
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Quote className="mx-auto size-7 text-primary/40" />
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
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-xl border bg-muted/40 p-10 text-center sm:p-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let’s turn the next project into proof.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Open to internships, junior security/full-stack roles, and small
            freelance builds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Contact me</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cv">View CV</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
