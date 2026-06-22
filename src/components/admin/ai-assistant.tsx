"use client";

import * as React from "react";
import { Sparkles, Loader2, Copy, Check, ShieldAlert, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AI_OUTPUT_KINDS, KIND_META } from "@/lib/ai/guardrails";

export function AiAssistant({
  defaultNotes = "",
}: {
  defaultNotes?: string;
}) {
  const [notes, setNotes] = React.useState(defaultNotes);
  const [kind, setKind] = React.useState<(typeof AI_OUTPUT_KINDS)[number]>(
    "summary",
  );
  const [output, setOutput] = React.useState("");
  const [source, setSource] = React.useState<"ai" | "fallback" | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function generate() {
    setError(null);
    setPending(true);
    setOutput("");
    setSource(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, kind }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not generate a draft.");
        return;
      }
      setOutput(data.text);
      setSource(data.source);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Wand2 className="size-4" />
        </span>
        <h3 className="text-sm font-semibold">AI case-study assistant</h3>
        <Badge variant="muted" className="ml-auto">
          Drafts only
        </Badge>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground/80">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
          <p>
            Suggestions are drafts based only on your notes. They never invent
            experience or results — always review and edit before publishing.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ai-notes">Your raw notes</Label>
          <Textarea
            id="ai-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Jot down what you built, the tech, decisions, and what you learned…"
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1 space-y-1.5">
            <Label htmlFor="ai-kind">Output type</Label>
            <Select
              id="ai-kind"
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as (typeof AI_OUTPUT_KINDS)[number])
              }
            >
              {AI_OUTPUT_KINDS.map((k) => (
                <option key={k} value={k}>
                  {KIND_META[k].label}
                </option>
              ))}
            </Select>
          </div>
          <Button
            type="button"
            onClick={generate}
            disabled={pending || notes.trim().length === 0}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate draft
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {KIND_META[kind].description}
        </p>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {output ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Draft
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={source === "ai" ? "default" : "muted"}>
                  {source === "ai" ? "Claude" : "Template (no API key)"}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copy}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm leading-relaxed">
              {output}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
