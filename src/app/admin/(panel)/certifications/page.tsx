import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { CertificationsManager } from "@/components/admin/certifications-manager";

export default async function AdminCertificationsPage() {
  const [certifications, session] = await Promise.all([
    getRepo().listCertifications(),
    getAdminSession(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Certifications"
        description="Track what you've earned, what's in progress, and what's planned."
      />
      <CertificationsManager
        certifications={certifications}
        readOnly={isReadOnlyAdmin(session)}
      />
    </div>
  );
}
