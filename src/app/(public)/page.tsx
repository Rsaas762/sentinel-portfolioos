import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Terminal,
  CheckCircle2,
  Quote,
  Target,
  Lock,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/public/project-card";
import { TechChips } from "@/components/public/tech-chips";
import { SKILL_CATEGORY_LABELS } from "@/lib/labels";
import { SKILL_CATEGORIES } from "@/lib/data/types";
import { SEED_LANGUAGES } from "@/lib/data/seed/content";

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

  // Flagship project (full, with sections) for the closer-look preview.
  const flagship = featured[0]
    ? await repo.getProjectBySlug(featured[0].slug)
    : null;
  const flagshipProblem = flagship?.sections?.find((s) => s.kind === "problem");
  const flagshipSecurity = flagship?.sections?.find(
    (s) => s.kind === "security",
  );

  const earnedCerts = certs.filter((c) => c.status === "earned").length;
  const stats = [
    { value: projects.length, label: "Case studies" },
    { value: skills.length, label: "Tracked skills" },
    earnedCerts > 0
      ? { value: earnedCerts, label: "Certifications" }
      : { value: SEED_LANGUAGES.length, label: "Languages" },
    { value: 6, label: "Skill domains" },
  ];

  const cyberTags = skills
    .filter((s) => s.category === "cybersecurity")
    .slice(0, 4)
    .map((s) => s.name);
  const fullStackTags = skills
    .filter((s) => ["frontend", "backend", "databases"].includes(s.category))
    .slice(0, 6)
    .map((s) => s.name);

  const topTestimonial = testimonials[0];

  return (
    <div>
      {/* ── Hero: who I am + what I build ───────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-28">
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
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          {/* Clean "proof of work" snapshot card */}
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

      {/* ── Stats: quick credibility ────────────────────────────────── */}
      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-8 text-center sm:py-10">
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

      {/* ── Focus: cybersecurity + full-stack direction ─────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            My direction
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cybersecurity and full-stack, built together
          </h2>
          <p className="mt-3 text-muted-foreground">
            I&rsquo;m heading into security-focused engineering, and I treat
            building and breaking as one discipline: ship things well, then learn
            how they fail.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 sm:p-8">
            <span className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Cybersecurity</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Understanding how systems break and how to defend them — web app
              security, network segmentation and detection, and threat modelling
              — practised in isolated labs I can rebuild from scratch.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cyberTags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 sm:p-8">
            <span className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Layers className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Full-stack development</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Building complete, accessible web apps end to end with Next.js,
              TypeScript, and PostgreSQL — with real validation, authentication,
              and data modelling, not just a polished front end.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {fullStackTags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
          <Lock className="mr-1.5 inline size-3.5 text-primary" />
          The overlap is the point — I bring a security mindset into everything I
          build.
        </p>
      </section>

      {/* ── Featured projects: strongest work ───────────────────────── */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Selected work
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Featured case studies
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Each project is documented end to end: the problem, the build,
                the security trade-offs, and what I learned.
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
        </div>
      </section>

      {/* ── Case study preview: a closer look ───────────────────────── */}
      {flagship ? (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              A closer look
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How I document a project
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5 sm:px-8">
              <Badge variant="secondary" className="mb-3">
                Featured case study
              </Badge>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {flagship.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {flagship.short_description}
              </p>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-card p-6 sm:p-8">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-primary" /> The problem
                </h4>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {flagshipProblem?.body ?? flagship.short_description}
                </p>
              </div>
              <div className="bg-card p-6 sm:p-8">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-primary" /> Security
                  considerations
                </h4>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {flagshipSecurity?.body ??
                    "Each project documents its security trade-offs honestly."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t px-6 py-5 sm:px-8">
              <TechChips items={flagship.tech_stack} max={5} />
              <Button asChild>
                <Link href={`/projects/${flagship.slug}`}>
                  Read the full case study
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Skills snapshot ─────────────────────────────────────────── */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
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

      {/* ── Credibility: why the work is trustworthy ────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Why it&rsquo;s credible
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Honest work, documented properly
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: FileText,
              title: "Case studies, not links",
              body: "Every project explains the problem, the build, and the trade-offs — so you can see how I think, not just what I shipped.",
            },
            {
              Icon: BadgeCheck,
              title: "Honest scoping",
              body: "Work is labelled as labs, coursework, or freelance, with limitations noted. No inflated titles or invented experience.",
            },
            {
              Icon: ShieldCheck,
              title: "Security in every build",
              body: "Input validation, least privilege, and documented decisions — including in this site, which I'm happy to walk through.",
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-lg border bg-card p-6">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        {topTestimonial ? (
          <figure className="mx-auto mt-12 max-w-3xl rounded-xl border bg-muted/40 p-8 text-center sm:p-10">
            <Quote className="mx-auto size-6 text-primary/40" />
            <blockquote className="mt-4 text-balance text-lg font-medium leading-relaxed sm:text-xl">
              &ldquo;{topTestimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {topTestimonial.author}
              </span>{" "}
              — {topTestimonial.role}
            </figcaption>
          </figure>
        ) : null}
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="rounded-xl border bg-muted/40 p-10 text-center sm:p-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let&rsquo;s turn the next project into proof.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Open to internships, junior security/full-stack roles, and small
            freelance builds. I usually reply within a day or two.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
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
