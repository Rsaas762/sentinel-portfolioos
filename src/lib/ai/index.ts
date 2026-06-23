import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  KIND_META,
  SYSTEM_PROMPT,
  type AiOutputKind,
} from "@/lib/ai/guardrails";
import { fallbackGenerate } from "@/lib/ai/fallback";

export type AiSource = "ai" | "fallback";

export interface GenerateResult {
  text: string;
  source: AiSource;
}

/** Whether a real model is configured. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

/**
 * Turn raw project notes into a polished, honest draft of the requested kind.
 * Uses Claude when configured; otherwise the deterministic fallback. Never
 * throws to the caller — on any error it degrades to the fallback.
 */
export async function generateCaseStudy(
  notes: string,
  kind: AiOutputKind,
): Promise<GenerateResult> {
  const trimmed = notes.trim();
  if (!trimmed) return { text: "", source: "fallback" };

  if (!isAiConfigured()) {
    return { text: fallbackGenerate(trimmed, kind), source: "fallback" };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const meta = KIND_META[kind];
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${meta.instruction}\n\nNotes:\n"""\n${trimmed}\n"""`,
        },
      ],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) {
      return { text: fallbackGenerate(trimmed, kind), source: "fallback" };
    }
    return { text, source: "ai" };
  } catch {
    // Quota, network, or auth failure — fall back gracefully.
    return { text: fallbackGenerate(trimmed, kind), source: "fallback" };
  }
}
