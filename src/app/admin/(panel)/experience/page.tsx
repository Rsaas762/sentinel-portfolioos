import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function AdminExperiencePage() {
  const [experience, session] = await Promise.all([
    getRepo().listExperience(),
    getAdminSession(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Experience"
        description="Education, freelance work, and volunteering shown on your timeline and CV."
      />
      <ExperienceManager
        experience={experience}
        readOnly={isReadOnlyAdmin(session)}
      />
    </div>
  );
}
