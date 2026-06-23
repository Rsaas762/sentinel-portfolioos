import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getRepo } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DemoBanner } from "@/components/admin/demo-banner";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Supabase configured but not signed in → middleware normally redirects;
  // this is a defence-in-depth guard for the layout itself.
  if (!session) redirect("/admin/login");

  // Unread-messages badge for the sidebar (best effort).
  const messages = await getRepo().listMessages();
  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebar
        email={session.email}
        mode={session.mode}
        badges={unread > 0 ? { "/admin/messages": unread } : {}}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {session.mode === "demo" ? <DemoBanner /> : null}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
