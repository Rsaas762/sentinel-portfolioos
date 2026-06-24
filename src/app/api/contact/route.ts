import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import { getRepo, isDemoMode } from "@/lib/data";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Derive a client identifier for rate limiting (proxy-aware, best effort).
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limited.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Server-side validation — never trust the client.
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot: silently accept (200) so bots don't learn they were caught,
  // but do not persist.
  if (website && website.length > 0) {
    return NextResponse.json({ ok: true, demo: false });
  }

  const result = await getRepo().createMessage({
    name,
    email,
    subject: subject ?? "",
    message,
    ip_hash: hashIp(ip === "unknown" ? null : ip),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try later." },
      { status: 500 },
    );
  }

  // Best-effort email notification — the message is already stored, so we
  // never fail the request if email delivery is unavailable.
  try {
    const settings = await getRepo().getSettings();
    await sendContactNotification({
      name,
      email,
      subject: subject ?? "",
      message,
      to: settings.contact_email,
    });
  } catch {
    /* ignore notification failures */
  }

  return NextResponse.json({ ok: true, demo: isDemoMode() });
}
