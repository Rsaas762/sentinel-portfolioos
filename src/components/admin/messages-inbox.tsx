"use client";

import * as React from "react";
import { Mail, MailOpen, Archive, Trash2, Reply, Inbox } from "lucide-react";
import type { ContactMessage } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { setMessageStatus, deleteMessage } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function MessagesInbox({
  messages,
  readOnly,
}: {
  messages: ContactMessage[];
  readOnly: boolean;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  if (messages.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border bg-card">
        <EmptyState
          Icon={Inbox}
          title="No messages yet"
          description="Submissions from your public contact form will appear here."
        />
      </div>
    );
  }

  function open(m: ContactMessage) {
    setOpenId((cur) => (cur === m.id ? null : m.id));
    if (m.status === "new" && !readOnly) {
      startTransition(async () => {
        await setMessageStatus(m.id, "read");
      });
    }
  }

  return (
    <ul className="space-y-2">
      {messages.map((m) => {
        const isOpen = openId === m.id;
        return (
          <li
            key={m.id}
            className={cn(
              "overflow-hidden rounded-lg border bg-card",
              m.status === "new" && "border-primary/40",
            )}
          >
            <button
              type="button"
              onClick={() => open(m)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              {m.status === "new" ? (
                <Mail className="size-4 shrink-0 text-primary" />
              ) : (
                <MailOpen className="size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm",
                    m.status === "new" ? "font-semibold" : "font-medium",
                  )}
                >
                  {m.subject || "(no subject)"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {m.name} · {m.email}
                </p>
              </div>
              {m.status === "archived" ? (
                <Badge variant="muted">Archived</Badge>
              ) : m.status === "new" ? (
                <Badge>New</Badge>
              ) : null}
              <time className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                {new Date(m.created_at).toLocaleDateString()}
              </time>
            </button>

            {isOpen ? (
              <div className="border-t bg-muted/20 px-4 py-4">
                <p className="whitespace-pre-wrap text-sm text-foreground/90">
                  {m.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "your message")}`}>
                      <Reply className="size-4" /> Reply
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await setMessageStatus(m.id, "archived");
                      })
                    }
                  >
                    <Archive className="size-4" /> Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteMessage(m.id);
                      })
                    }
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                  {readOnly ? (
                    <span className="self-center text-xs text-muted-foreground">
                      Demo mode — actions are not saved.
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
