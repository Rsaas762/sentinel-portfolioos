import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { ProjectEditor } from "@/components/admin/project-editor";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, session] = await Promise.all([
    getRepo().getProjectById(id),
    getAdminSession(),
  ]);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>
      <PageTitle
        title={`Edit: ${project.title}`}
        description="Update details and case-study sections."
      />
      <ProjectEditor project={project} readOnly={isReadOnlyAdmin(session)} />
    </div>
  );
}
