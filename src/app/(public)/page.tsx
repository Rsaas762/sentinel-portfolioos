import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Target,
  Lock,
  FileText,
  BadgeCheck,
  Terminal,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/badge";
import { ProjectCard } from "@/components/public/project-card";
import { TechChips } from "@/components/public/tech-chips";
import { SKILL_CATEGORY_LABELS, STATUS_BADGE_VARIANT } from "@/lib/labels";
import { SKILL_CATEGORIES } from "@/lib/data/types";
import { SEED_LANGUAGES } from "@/lib/data/seed/content";

const FOCUS_AREAS = [
  "Cybersecurity",
  "Full-stack",
  "Networking",
  "Linux / Windows",
];

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

  const flagship = featured[0]
    ? await repo.getProjectBySlug(featured[0].slug)
    : null;
  const flagshipProblem = flagship?.sections?.find((s) => s.kind === "problem");
  const flagshipSecurity = flagship?.sections?.find(
    (s) => s.kind === "security",
  );

  const earnedCerts = certs.filter((c) => c.status === "earned").length;
  const metrics = [
    { value: projects.length, label: "case studies" },
    { value: skills.length, label: "tracked skills" },
    {
      value: earnedCerts > 0 ? earnedCerts : SEED_LANGUAGES.length,
      label: earnedCerts > 0 ? "certifications" : "languages",
    },
    { value: 6, label: "skill domains" },
  ];

  const cyberTags = skills
    .filter((s) => s.category === "cybersecurity")
    .slice(0, 5)
    .map((s) => s.name);
  const fullStackTags = skills
    .filter((s) => ["frontend", "backend", "databases"].includes(s.category))
    .slice(0, 6)
    .map((s) => s.name);

  const topTestimonial = testimonials[0];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid grid-fade opacity-70"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
          <div className="reveal min-w-0">
            <p
              className="system-label inline-flex items-center gap-2 text-primary"
              style={{ ["--i" as string]: 0 }}
            >
              <span aria-hidden className="text-muted-foreground/60">
                {"//"}
              </span>
              {settings.hero_kicker}
            </p>
            <h1
              className="font-display mt-5 text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
              style={{ ["--i" as string]: 1 }}
            >
              {settings.hero_title}
            </h1>
            <p
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ ["--i" as string]: 2 }}
            >
              {settings.hero_subtitle}
            </p>
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              style={{ ["--i" as string]: 3 }}
            >
              <Button asChild size="lg" variant="navy">
                <Link href="/projects">
                  {settings.hero_cta_label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
            <div
              className="mt-9 flex flex-wrap gap-x-5 gap-y-2"
              style={{ ["--i" as string]: 4 }}
            >
              {FOCUS_AREAS.map((f) => (
                <span
                  key={f}
                  className="system-label inline-flex items-center gap-1.5 text-muted-foreground"
                >
                  <span className="size-1 rounded-full bg-primary" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal dossier — the navy "proof of work" panel */}
          <div className="min-w-0 animate-fade-up [animation-delay:200ms]">
            <div className="overflow-hidden rounded-xl border border-navy-border bg-navy text-navy-foreground shadow-lg">
              <div className="relative border-b border-navy-border bg-grid-navy px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="system-label inline-flex items-center gap-2 text-navy-muted">
                    <Terminal className="size-3.5 text-primary" aria-hidden />
                    proof-of-work
                  </span>
                  <span className="system-label inline-flex items-center gap-1.5 text-navy-muted">
                    <span className="size-1.5 rounded-full bg-success" />
                    live
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold">{profile.full_name}</p>
                <p className="text-sm text-navy-muted">{profile.headline}</p>
              </div>
              <ul className="divide-y divide-navy-border">
                {featured.slice(0, 4).map((p, i) => {
                  const tone = STATUS_BADGE_VARIANT[p.status];
                  const dot =
                    tone === "success"
                      ? "bg-success"
                      : tone === "warning"
                        ? "bg-warning"
                        : "bg-primary";
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.03]"
                      >
                        <span className="shrink-0 font-mono text-xs text-navy-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy-foreground/90 group-hover:text-navy-foreground">
                          {p.title}
                        </span>
                        <span className={`size-1.5 rounded-full ${dot}`} />
                        <ArrowRight className="size-3.5 text-navy-muted transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/projects"
                className="block border-t border-navy-border px-5 py-3 font-mono text-xs text-primary transition-colors hover:bg-white/[0.03]"
              >
                cd ~/all-projects →
              </Link>
            </div>
          </div>
        </div>

        {/* Compact metrics line */}
        <div className="relative border-t bg-muted/30">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4 sm:justify-between">
            {metrics.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-baseline gap-2 font-mono text-xs text-muted-foreground"
              >
                <span className="text-base font-semibold text-foreground">
                  {m.value}
                </span>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personal intro ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="system-label mb-6 text-primary">{"// who I am"}</p>
        <p className="font-display text-2xl leading-snug text-foreground sm:text-3xl">
          I build software with a security mindset — and I learn by shipping. I
          treat building and breaking as one discipline: ship things well, then
          understand how they fail.
        </p>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Based in {profile.location}, I&rsquo;m a Network, Infrastructure &amp;
          Cybersecurity graduate moving into security-focused engineering. Every
          project here is real and documented end to end — no inflated titles,
          no invented experience.
        </p>
      </section>

      {/* ── Focus: cybersecurity + full-stack ────────────────────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-12">
            <p className="system-label mb-3 text-primary">
              {"// my direction"}
            </p>
            <h2 className="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
              Cybersecurity and full-stack, built together
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2">
            <FocusPanel
              Icon={ShieldCheck}
              kicker="01 / defend"
              title="Cybersecurity"
              body="Understanding how systems break and how to defend them — web app security, network segmentation, and threat modelling — practised in isolated labs I can rebuild from scratch."
              tags={cyberTags}
            />
            <FocusPanel
              Icon={Layers}
              kicker="02 / build"
              title="Full-stack development"
              body="Building complete, accessible web apps end to end with Next.js, TypeScript, and PostgreSQL — with real validation, authentication, and data modelling, not just a polished front end."
              tags={fullStackTags}
            />
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-3.5 text-primary" />
            The overlap is the point — a security mindset in everything I build.
          </p>
        </div>
      </section>

      {/* ── Featured projects ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="system-label mb-3 text-primary">
              {"// selected work"}
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Projects as evidence
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Each project is documented end to end: the problem, the build, the
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
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── Case study preview ───────────────────────────────────────── */}
      {flagship ? (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <div className="mb-10">
              <p className="system-label mb-3 text-primary">
                {"// a closer look"}
              </p>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                How I document a project
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b px-6 py-5 sm:px-8">
                <StatusPill tone="default">Featured case study</StatusPill>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {flagship.scope}
                </span>
              </div>
              <div className="px-6 py-6 sm:px-8">
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                  {flagship.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {flagship.short_description}
                </p>
              </div>

              <div className="grid gap-px border-t bg-border sm:grid-cols-2">
                <div className="bg-card p-6 sm:p-8">
                  <h4 className="system-label inline-flex items-center gap-2 text-muted-foreground">
                    <Target className="size-3.5 text-primary" /> the problem
                  </h4>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {flagshipProblem?.body ?? flagship.short_description}
                  </p>
                </div>
                <div className="bg-card p-6 sm:p-8">
                  <h4 className="system-label inline-flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-primary" /> security
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
          </div>
        </section>
      ) : null}

      {/* ── Skills snapshot ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-12">
          <p className="system-label mb-3 text-primary">
            {"// capabilities"}
          </p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Skills across six domains
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, i) => {
            const items = skills.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className="group bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {SKILL_CATEGORY_LABELS[cat]}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
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
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/skills">
              Explore all skills <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Credibility ──────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-12">
            <p className="system-label mb-3 text-primary">
              {"// why it’s credible"}
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Honest work, documented properly
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
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
              <div key={title} className="border-t-2 border-primary/30 pt-5">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {topTestimonial ? (
            <figure className="mx-auto mt-14 max-w-3xl text-center">
              <blockquote className="font-display text-balance text-2xl leading-snug sm:text-3xl">
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
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-navy-border bg-navy px-8 py-14 text-center text-navy-foreground sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid-navy opacity-70"
          />
          <div className="relative">
            <p className="system-label mb-5 text-primary">
              {"// let’s talk"}
            </p>
            <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl leading-tight sm:text-5xl">
              Let&rsquo;s turn the next project into proof.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-navy-muted">
              Open to internships, junior security/full-stack roles, and small
              freelance builds. I usually reply within a day or two.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">Contact me</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-border bg-transparent text-navy-foreground hover:border-primary/50 hover:bg-white/[0.04] hover:text-navy-foreground"
              >
                <Link href="/cv">View CV</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FocusPanel({
  Icon,
  kicker,
  title,
  body,
  tags,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  title: string;
  body: string;
  tags: string[];
}) {
  return (
    <div className="bg-card p-7 sm:p-9">
      <div className="flex items-center justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span className="system-label text-muted-foreground/70">{kicker}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded border border-border/80 bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
