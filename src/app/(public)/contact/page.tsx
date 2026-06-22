import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/social";
import { getRepo } from "@/lib/data";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about internships, junior roles, or small freelance builds.",
};

export default async function ContactPage() {
  const repo = getRepo();
  const [profile, settings] = await Promise.all([
    repo.getProfile(),
    repo.getSettings(),
  ]);

  const channels = [
    { Icon: Mail, label: settings.contact_email, href: `mailto:${settings.contact_email}` },
    profile.github_url
      ? { Icon: GithubIcon, label: "GitHub", href: profile.github_url }
      : null,
    profile.linkedin_url
      ? { Icon: LinkedinIcon, label: "LinkedIn", href: profile.linkedin_url }
      : null,
  ].filter(Boolean) as { Icon: React.ComponentType<{ className?: string }>; label: string; href: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="Contact"
        title="Let’s talk"
        description="Open to internships, junior security/full-stack roles, and small freelance builds. Drop a message and I’ll reply."
        className="mb-12"
      />

      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-sm font-semibold">Direct channels</h2>
            <ul className="mt-4 space-y-3">
              {channels.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border bg-muted/30 p-6">
            <ShieldCheck className="size-5 text-primary" />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Your message is validated on both the client and the server, rate
              limited to deter spam, and stored without your raw IP address.
              I’ll only use your details to reply.
            </p>
          </div>
        </aside>

        <div className="rounded-lg border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
