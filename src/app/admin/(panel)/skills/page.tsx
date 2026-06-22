import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const [skills, session] = await Promise.all([
    getRepo().listSkills(),
    getAdminSession(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Skills"
        description="Manage the skills shown on your public Skills and CV pages."
      />
      <SkillsManager skills={skills} readOnly={isReadOnlyAdmin(session)} />
    </div>
  );
}
