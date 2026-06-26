import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Code2,
  BookOpen,
  HeartHandshake,
  Quote,
  Languages as LanguagesIcon,
} from "lucide-react";
import { getRepo } from "@/lib/data";
import { SEED_LANGUAGES } from "@/lib/data/seed/content";
import { PageHeader } from "@/components/public/page-header";
import { ProseText } from "@/components/prose-text";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Network, Infrastructure & Cybersecurity graduate who learns by building and documents the work honestly.",
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
        <p className="system-label mb-6 text-primary">{"// how I work"}</p>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {VALUES.map(({ Icon, title, body }) => (
            <div key={title} className="border-t-2 border-primary/30 pt-5">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="mt-16">
        <p className="system-label mb-6 inline-flex items-center gap-2 text-primary">
          <LanguagesIcon className="size-3.5" /> languages
        </p>
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {SEED_LANGUAGES.map((lang) => (
            <div key={lang.name} className="bg-card p-4 text-center">
              <p className="font-medium">{lang.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {lang.level}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CV-ready summary */}
      <section className="mt-16 overflow-hidden rounded-xl border border-navy-border bg-navy p-6 text-navy-foreground sm:p-8">
        <p className="system-label text-primary">CV-ready summary</p>
        <p className="mt-3 text-pretty leading-relaxed text-navy-foreground/90">
          Network, Infrastructure & Cybersecurity graduate (BSc, Jönköping
          University) who learns by building. Hands-on with IT support,
          networking (Cisco routing &amp; switching, VLANs), and Windows/Linux
          administration, plus full-stack web development in Next.js, TypeScript
          and Supabase — applied with a security-conscious approach: input
          validation, least privilege, and honest documentation. Fluent in
          Swedish, English and Arabic. Seeking a junior role or internship in IT,
          infrastructure or cybersecurity where I can keep shipping and learning.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/cv">View full CV</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-navy-border bg-transparent text-navy-foreground hover:border-primary/50 hover:bg-white/[0.04] hover:text-navy-foreground"
          >
            <Link href="/projects">See the projects</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="mt-16">
          <p className="system-label mb-6 text-primary">
            {"// what others say"}
          </p>
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
