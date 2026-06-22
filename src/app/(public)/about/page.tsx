import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Code2, BookOpen, HeartHandshake, Quote } from "lucide-react";
import { getRepo } from "@/lib/data";
import { PageHeader } from "@/components/public/page-header";
import { ProseText } from "@/components/prose-text";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "A cybersecurity and full-stack student who learns by building and documents the work honestly.",
};

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Security-first",
    body: "I think about trust boundaries, validation, and least privilege from the start — not as an afterthought.",
  },
  {
    Icon: Code2,
    title: "Build to learn",
    body: "Every concept becomes a lab or a project. I'd rather ship something small and real than only read about it.",
  },
  {
    Icon: BookOpen,
    title: "Honest engineering",
    body: "I document trade-offs and limitations plainly. No guaranteed-security claims, no inflated experience.",
  },
  {
    Icon: HeartHandshake,
    title: "Easy to work with",
    body: "Clear communication, maintainable handovers, and code the next person can actually read.",
  },
];

export default async function AboutPage() {
  const repo = getRepo();
  const [profile, testimonials] = await Promise.all([
    repo.getProfile(),
    repo.listTestimonials(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="About"
        title={profile.full_name}
        description={profile.headline}
        className="mb-12"
      />

      {/* Bio */}
      <section className="mx-auto max-w-2xl">
        <ProseText text={profile.bio} className="text-base" />
        <p className="mt-4 text-sm text-muted-foreground">
          Based in {profile.location}.
        </p>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="mb-6 text-center text-xl font-semibold tracking-tight">
          How I work
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-lg border bg-card p-5">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CV-ready summary */}
      <section className="mt-16 rounded-xl border bg-muted/30 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          CV-ready summary
        </p>
        <p className="mt-3 text-pretty leading-relaxed">
          Cybersecurity and full-stack engineer (student) who learns by
          building. Comfortable across the stack — Next.js, TypeScript,
          PostgreSQL — with a security-first approach: input validation, least
          privilege, and documented threat models. Maintains a reproducible home
          lab and a portfolio of self-directed projects spanning security
          tooling, infrastructure hardening, and accessible web apps. Seeking an
          internship or junior role where I can keep shipping and learning.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/cv">View full CV</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/projects">See the projects</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-center text-xl font-semibold tracking-tight">
            What others say
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-lg border bg-card p-5">
                <Quote className="size-5 text-primary/40" />
                <blockquote className="mt-3 text-sm leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {t.author}
                  </span>{" "}
                  — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
