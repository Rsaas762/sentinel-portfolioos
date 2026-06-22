import type { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { getRepo } from "@/lib/data";
import { PageHeader } from "@/components/public/page-header";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Education, freelance work, and volunteering — the path behind the projects.",
};

export default async function ExperiencePage() {
  const experience = await getRepo().listExperience();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="Background"
        title="Experience"
        description="A mix of study, self-directed labs, freelance work, and volunteering — honest about scope and dates."
        className="mb-12"
      />

      <ol className="relative space-y-10 border-l pl-8">
        {experience.map((exp) => {
          const end = exp.end_date
            ? formatMonthYear(exp.end_date)
            : "Present";
          return (
            <li key={exp.id} className="relative">
              <span className="absolute -left-[2.55rem] top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                <span className="size-2 rounded-full bg-primary" />
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  {exp.role}
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatMonthYear(exp.start_date)} — {end}
                </span>
              </div>

              <p className="mt-0.5 text-sm font-medium text-primary">
                {exp.organization}
              </p>
              {exp.location ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {exp.location}
                </p>
              ) : null}

              <p className="mt-3 text-sm text-muted-foreground">
                {exp.summary}
              </p>

              {exp.highlights.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {exp.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
