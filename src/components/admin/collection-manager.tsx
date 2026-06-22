"use client";

import * as React from "react";
import { useActionState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormBanner, SubmitButton } from "@/components/admin/form-controls";
import { deleteRow } from "@/lib/actions";
import { IDLE, type ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/utils";

export interface Identifiable {
  id: string;
}

type CreateAction = (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
type UpdateAction = (
  id: string,
  prev: ActionResult,
  fd: FormData,
) => Promise<ActionResult>;

interface ManagerProps<T extends Identifiable> {
  items: T[];
  table: string;
  readOnly: boolean;
  /** Singular noun, e.g. "skill". */
  noun: string;
  createAction: CreateAction;
  updateAction: UpdateAction;
  /** Row content in the list. */
  renderRow: (item: T) => React.ReactNode;
  /** Form fields, prefilled from `item` (null when creating). */
  renderFields: (
    item: T | null,
    errors: Record<string, string>,
  ) => React.ReactNode;
  emptyHint?: string;
}

export function CollectionManager<T extends Identifiable>({
  items,
  table,
  readOnly,
  noun,
  createAction,
  updateAction,
  renderRow,
  renderFields,
  emptyHint,
}: ManagerProps<T>) {
  const [editing, setEditing] = React.useState<T | "new" | null>(null);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> Add {noun}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {emptyHint ?? `No ${noun}s yet.`}
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">{renderRow(item)}</div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${noun}`}
                    onClick={() => setEditing(item)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteButton table={table} id={item.id} readOnly={readOnly} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing !== null ? (
        <Modal
          title={`${editing === "new" ? "Add" : "Edit"} ${noun}`}
          onClose={() => setEditing(null)}
        >
          <EntityForm
            key={editing === "new" ? "new" : editing.id}
            item={editing === "new" ? null : editing}
            readOnly={readOnly}
            createAction={createAction}
            updateAction={updateAction}
            renderFields={renderFields}
            onDone={() => setEditing(null)}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function EntityForm<T extends Identifiable>({
  item,
  readOnly,
  createAction,
  updateAction,
  renderFields,
  onDone,
}: {
  item: T | null;
  readOnly: boolean;
  createAction: CreateAction;
  updateAction: UpdateAction;
  renderFields: (item: T | null, errors: Record<string, string>) => React.ReactNode;
  onDone: () => void;
}) {
  const action: CreateAction = item
    ? (prev, fd) => updateAction(item.id, prev, fd)
    : createAction;

  const [state, formAction] = useActionState(action, IDLE);

  React.useEffect(() => {
    if (state.status === "ok") onDone();
    // demo + error keep the form open so the user sees the message
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <FormBanner status={state.status} message={state.message} />
      {renderFields(item, state.fieldErrors ?? {})}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        {readOnly ? (
          <Button type="submit">Try save (demo)</Button>
        ) : (
          <SubmitButton>Save</SubmitButton>
        )}
      </div>
    </form>
  );
}

function DeleteButton({
  table,
  id,
  readOnly,
}: {
  table: string;
  id: string;
  readOnly: boolean;
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
          {readOnly ? "Demo" : "Delete"}
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
      aria-label="Delete"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirm(true)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "my-8 w-full max-w-lg rounded-xl border bg-card shadow-xl",
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
