import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { ProjectEditor } from "@/components/admin/project-editor";

export default async function NewProjectPage() {
  const session = await getAdminSession();

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>
      <PageTitle
        title="New project"
        description="Add a case study. Use the assistant to draft honest copy from your notes."
      />
      <ProjectEditor project={null} readOnly={isReadOnlyAdmin(session)} />
    </div>
  );
}
