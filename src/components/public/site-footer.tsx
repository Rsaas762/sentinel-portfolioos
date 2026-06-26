import Link from "next/link";
import { Globe, Mail, ArrowUpRight, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/social";
import { LogoMark } from "@/components/brand/logo-mark";
import { getRepo } from "@/lib/data";

export async function SiteFooter() {
  const repo = getRepo();
  const [profile, settings] = await Promise.all([
    repo.getProfile(),
    repo.getSettings(),
  ]);
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.github_url, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.website_url, label: "Website", Icon: Globe },
    { href: `mailto:${settings.contact_email}`, label: "Email", Icon: Mail },
  ].filter((s) => Boolean(s.href));

  const explore = [
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/experience", label: "Experience" },
    { href: "/about", label: "About" },
    { href: "/cv", label: "CV" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-navy-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-navy opacity-60"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Big editorial CTA line */}
        <div className="grid gap-10 border-b border-navy-border py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <LogoMark size="md" className="text-primary" />
              <span className="text-sm font-semibold text-navy-foreground">
                {profile.full_name}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-navy-muted">
              Security-minded engineer who learns by building, then documents
              the work honestly.
            </p>
            <p className="system-label inline-flex items-center gap-1.5 text-navy-muted">
              <MapPin className="size-3" aria-hidden /> {profile.location}
            </p>
          </div>

          <nav aria-label="Footer" className="space-y-3">
            <h3 className="system-label text-navy-muted">Explore</h3>
            <ul className="space-y-2.5 text-sm text-navy-foreground/85">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline hover:text-navy-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <h3 className="system-label text-navy-muted">Get in touch</h3>
            <p className="text-sm text-navy-muted">
              Open to internships, junior roles, and small freelance builds.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              Start a conversation <ArrowUpRight className="size-4" />
            </Link>
            <div className="flex gap-2 pt-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href as string}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-navy-border text-navy-muted transition-colors hover:border-primary/50 hover:text-navy-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* System metadata row */}
        <div className="flex flex-col items-center justify-between gap-2 py-6 font-mono text-[0.7rem] text-navy-muted sm:flex-row">
          <p>
            © {year} {profile.full_name} — built with Next.js &amp; Supabase
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="inline-flex size-1.5 rounded-full bg-success" />
            Honest by design — no guaranteed-security claims
          </p>
        </div>
      </div>
    </footer>
  );
}
