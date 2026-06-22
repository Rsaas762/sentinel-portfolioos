import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([
    getRepo().getSettings(),
    getAdminSession(),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle
        title="Site settings"
        description="Control your hero copy, contact details, and feature toggles."
      />
      <SettingsForm settings={settings} readOnly={isReadOnlyAdmin(session)} />
    </div>
  );
}
