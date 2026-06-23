import type { Metadata } from "next";
import { Download, Globe, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/social";
import { getRepo } from "@/lib/data";
import { SKILL_CATEGORIES } from "@/lib/data/types";
import { SEED_LANGUAGES } from "@/lib/data/seed/content";
import { SKILL_CATEGORY_LABELS, CERT_STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/public/print-button";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CV",
  description: "A printable, CV-ready summary of skills, experience, and projects.",
};

export default async function CvPage() {
  const repo = getRepo();
  const [profile, settings, skills, experience, certs, projects] =
    await Promise.all([
      repo.getProfile(),
      repo.getSettings(),
      repo.listSkills(),
      repo.listExperience(),
      repo.listCertifications(),
      repo.listProjects(),
    ]);

  const contacts = [
    { Icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
    profile.github_url
      ? { Icon: GithubIcon, text: profile.github_url.replace(/^https?:\/\//, ""), href: profile.github_url }
      : null,
    profile.linkedin_url
      ? { Icon: LinkedinIcon, text: profile.linkedin_url.replace(/^https?:\/\//, ""), href: profile.linkedin_url }
      : null,
    profile.website_url
      ? { Icon: Globe, text: profile.website_url.replace(/^https?:\/\//, ""), href: profile.website_url }
      : null,
  ].filter(Boolean) as { Icon: React.ComponentType<{ className?: string }>; text: string; href: string }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Action bar (hidden when printing) */}
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Curriculum Vitae</h1>
          <p className="text-sm text-muted-foreground">
            A snapshot you can print or save as PDF.
          </p>
        </div>
        <div className="flex gap-2">
          {settings.cv_url ? (
            <Button asChild>
              <a href={settings.cv_url} target="_blank" rel="noopener noreferrer">
                <Download className="size-4" /> Download CV
              </a>
            </Button>
          ) : null}
          <PrintButton />
        </div>
      </div>

      {/* Printable document */}
      <article className="rounded-lg border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
        <header className="border-b pb-5">
          <h2 className="text-2xl font-bold tracking-tight">
            {profile.full_name}
          </h2>
          <p className="mt-1 text-primary">{profile.headline}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {profile.location}
            </span>
            {contacts.map(({ Icon, text, href }) => (
              <a
                key={text}
                href={href}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Icon className="size-3" /> {text}
              </a>
            ))}
          </div>
        </header>

        <Section title="Summary">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
        </Section>

        <Section title="Skills">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {SKILL_CATEGORIES.map((cat) => {
              const items = skills.filter((s) => s.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="text-sm">
                  <dt className="font-semibold">{SKILL_CATEGORY_LABELS[cat]}</dt>
                  <dd className="text-muted-foreground">
                    {items.map((s) => s.name).join(", ")}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-semibold">
                    {exp.role} · {exp.organization}
                  </p>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatMonthYear(exp.start_date)} —{" "}
                    {exp.end_date ? formatMonthYear(exp.end_date) : "Present"}
                  </span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Selected projects">
          <ul className="space-y-2 text-sm">
            {projects.slice(0, 4).map((p) => (
              <li key={p.id}>
                <span className="font-semibold">{p.title}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — {p.short_description}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {certs.length > 0 ? (
          <Section title="Certifications">
            <ul className="space-y-1 text-sm text-muted-foreground">
              {certs.map((c) => (
                <li key={c.id}>
                  {c.name} · {c.issuer}{" "}
                  <span className="text-xs">
                    ({CERT_STATUS_LABELS[c.status]}
                    {c.issued_on ? `, ${formatMonthYear(c.issued_on)}` : ""})
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section title="Languages">
          <p className="text-sm text-muted-foreground">
            {SEED_LANGUAGES.map((l) => `${l.name} (${l.level})`).join(" · ")}
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
