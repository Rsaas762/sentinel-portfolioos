import type { AiOutputKind } from "@/lib/ai/guardrails";

/**
 * Deterministic, no-API fallback generator. It restructures and lightly
 * reframes the user's own notes — it never adds facts that aren't there.
 * Always available so the assistant works without an API key.
 */

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function clauses(text: string): string[] {
  // Split into bullet-able fragments on sentence and comma/semicolon boundaries.
  return text
    .split(/[\n;]+|(?<=[.!?])\s+/)
    .flatMap((part) => part.split(/,\s+(?=and |which |that |using |with )/))
    .map((s) => s.replace(/^[-•\s]+/, "").trim())
    .filter((s) => s.length > 3);
}

function ensureEnding(s: string): string {
  const trimmed = s.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function fallbackGenerate(notes: string, kind: AiOutputKind): string {
  const clean = notes.trim();
  if (!clean) return "";

  const sents = sentences(clean);

  switch (kind) {
    case "summary": {
      const body = sents.slice(0, 4).map(ensureEnding).join(" ");
      return capitalize(body);
    }

    case "recruiter": {
      const lead = sents[0] ? ensureEnding(sents[0]) : "";
      const rest = sents.slice(1, 3).map(ensureEnding).join(" ");
      return capitalize(
        `${lead} In short, it demonstrates practical, hands-on work: ${rest}`.trim(),
      );
    }

    case "technical": {
      const body = sents.slice(0, 5).map(ensureEnding).join(" ");
      return capitalize(body);
    }

    case "security": {
      const body = sents.slice(0, 4).map(ensureEnding).join(" ");
      return `${capitalize(
        body,
      )} These are sensible, documented measures rather than a guarantee — security is an ongoing trade-off, and a production deployment would warrant further review.`;
    }

    case "cv_bullets": {
      const items = clauses(clean).slice(0, 5);
      if (items.length === 0) return "";
      return items
        .map((c) => {
          const text = capitalize(c.replace(/^I\s+/i, ""));
          return `- ${ensureEnding(text)}`;
        })
        .join("\n");
    }

    default:
      return capitalize(sents.slice(0, 3).map(ensureEnding).join(" "));
  }
}
