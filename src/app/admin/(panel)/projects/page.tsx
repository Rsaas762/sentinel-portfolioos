import Link from "next/link";
import { Plus } from "lucide-react";
import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/admin/projects-table";

export default async function AdminProjectsPage() {
  const [projects, session] = await Promise.all([
    getRepo().listProjects(),
    getAdminSession(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Projects"
        description="Create and edit your case studies, including sections and the AI assistant."
      >
        <Button asChild size="sm">
          <Link href="/admin/projects/new">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </PageTitle>
      <ProjectsTable
        projects={projects}
        readOnly={isReadOnlyAdmin(session)}
      />
    </div>
  );
}
