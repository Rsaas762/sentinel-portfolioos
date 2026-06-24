import "server-only";

/**
 * Sends an email notification when someone submits the contact form, so you
 * don't have to watch the admin inbox. Uses Resend via a plain fetch (no extra
 * dependency). If RESEND_API_KEY is not set, this is a no-op — the message is
 * still stored, so the app keeps working with zero email configuration.
 */
export async function sendContactNotification(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Where to send the notification (your inbox). */
  to: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "no-key" };
  if (!input.to) return { sent: false, reason: "no-recipient" };

  const from =
    process.env.EMAIL_FROM ?? "Portfolio <onboarding@resend.dev>";
  const subject = `New portfolio message: ${input.subject || "(no subject)"}`;
  const text =
    `You received a new message from your portfolio contact form.\n\n` +
    `From: ${input.name} <${input.email}>\n` +
    `Subject: ${input.subject || "(none)"}\n\n` +
    `${input.message}\n\n` +
    `— Reply directly to this email to respond to ${input.name}.`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      return { sent: false, reason: `resend ${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "error" };
  }
}
