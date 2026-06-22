import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { generateCaseStudy } from "@/lib/ai";
import { AI_OUTPUT_KINDS } from "@/lib/ai/guardrails";

const schema = z.object({
  notes: z.string().trim().min(1, "Add some notes first.").max(6000),
  kind: z.enum(AI_OUTPUT_KINDS),
});

export async function POST(request: NextRequest) {
  // Only the admin uses the assistant. In demo mode this still works
  // (fallback templates) so reviewers can try it.
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const result = await generateCaseStudy(parsed.data.notes, parsed.data.kind);
  return NextResponse.json({ ok: true, ...result });
}
