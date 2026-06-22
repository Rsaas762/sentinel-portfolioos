import { describe, expect, it } from "vitest";
import { fallbackGenerate } from "@/lib/ai/fallback";
import { AI_OUTPUT_KINDS } from "@/lib/ai/guardrails";

const NOTES =
  "I built a ticket triage app with Next.js and PostgreSQL. It classifies tickets and drafts replies. A human approves every reply. API keys are server-only and inputs are validated with Zod.";

describe("fallback generator", () => {
  it("returns non-empty structured text for every output kind", () => {
    for (const kind of AI_OUTPUT_KINDS) {
      const out = fallbackGenerate(NOTES, kind);
      expect(out.length).toBeGreaterThan(0);
    }
  });

  it("formats cv_bullets as dash-led lines", () => {
    const out = fallbackGenerate(NOTES, "cv_bullets");
    const lines = out.split("\n");
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.every((l) => l.startsWith("- "))).toBe(true);
  });

  it("adds an honest caveat to security output and avoids absolute claims", () => {
    const out = fallbackGenerate(NOTES, "security").toLowerCase();
    expect(out).toContain("trade-off");
    expect(out).not.toContain("fully secure");
    expect(out).not.toContain("guaranteed");
  });

  it("only uses words derived from the notes (no invented technologies)", () => {
    const out = fallbackGenerate(NOTES, "technical").toLowerCase();
    // Should not introduce a tech that wasn't in the notes.
    expect(out).not.toContain("kubernetes");
    expect(out).not.toContain("aws");
  });

  it("returns empty string for empty notes", () => {
    expect(fallbackGenerate("   ", "summary")).toBe("");
  });
});
