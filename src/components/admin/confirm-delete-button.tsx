"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRow } from "@/lib/actions";

/**
 * Inline two-step delete for a single row. Calls the `deleteRow` server action
 * (which enforces auth + RLS); in demo mode the action no-ops and labels itself.
 */
export function ConfirmDeleteButton({
  table,
  id,
  readOnly,
  label = "Delete",
}: {
  table: string;
  id: string;
  readOnly: boolean;
  label?: string;
}) {
  const [pending, startTransition] = React.useTransition();
  const [confirm, setConfirm] = React.useState(false);

  function onDelete() {
    startTransition(async () => {
      await deleteRow(table, id);
      setConfirm(false);
    });
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={pending}
        >
          {readOnly ? "Demo" : label}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirm(true)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
