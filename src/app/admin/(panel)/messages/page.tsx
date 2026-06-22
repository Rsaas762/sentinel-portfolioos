import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export default async function AdminMessagesPage() {
  const [messages, session] = await Promise.all([
    getRepo().listMessages(),
    getAdminSession(),
  ]);

  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Messages"
        description={
          unread > 0
            ? `${unread} new message${unread === 1 ? "" : "s"} from your contact form.`
            : "Submissions from your public contact form."
        }
      />
      <MessagesInbox
        messages={messages}
        readOnly={isReadOnlyAdmin(session)}
      />
    </div>
  );
}
