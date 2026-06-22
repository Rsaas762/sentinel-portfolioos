import type { Metadata } from "next";
import { getRepo } from "@/lib/data";
import { PageHeader } from "@/components/public/page-header";
import { ProjectsExplorer } from "@/components/public/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Cybersecurity and full-stack case studies — the problem, the build, the security trade-offs, and what I learned.",
};

export default async function ProjectsPage() {
  const projects = await getRepo().listProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="Case studies"
        title="Projects"
        description="Self-directed labs, coursework, and full-stack builds — each documented as an honest, end-to-end case study."
        className="mb-12"
      />
      <ProjectsExplorer projects={projects} />
    </div>
  );
}
