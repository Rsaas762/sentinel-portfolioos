"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contactSchema } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; demo: boolean }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""), // honeypot
    };

    // Client-side validation with the same schema the server uses.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      setStatus({ kind: "success", demo: Boolean(data.demo) });
      e.currentTarget.reset();
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-success" />
        <h3 className="mt-3 font-semibold">Message sent</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thanks for reaching out — I’ll get back to you soon.
        </p>
        {status.demo ? (
          <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Demo mode: this message was validated but not stored (no database
            configured).
          </p>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status.kind === "error" ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {status.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name} htmlFor="name">
          <Input id="name" name="name" autoComplete="name" placeholder="Jordan Lee" />
        </Field>
        <Field label="Email" error={errors.email} htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject} htmlFor="subject" optional>
        <Input id="subject" name="subject" placeholder="Internship enquiry" />
      </Field>

      <Field label="Message" error={errors.message} htmlFor="message">
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell me a little about the role or project…"
        />
      </Field>

      {/* Honeypot — hidden from users & AT; display:none fields still submit,
          so naive bots that fill every field get caught. */}
      <div hidden aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={status.kind === "submitting"}>
        {status.kind === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="size-4" /> Send message
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
