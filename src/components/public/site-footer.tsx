import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/social";
import { Logo } from "@/components/brand/logo";
import { getRepo } from "@/lib/data";

export async function SiteFooter() {
  const repo = getRepo();
  const profile = await repo.getProfile();
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.github_url, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.website_url, label: "Website", Icon: Globe },
    { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo size="md" />
          <p className="max-w-xs text-sm text-muted-foreground">
            A portfolio operating system for cybersecurity and full-stack
            engineers. Turn projects into proof.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              { href: "/projects", label: "Projects" },
              { href: "/skills", label: "Skills" },
              { href: "/experience", label: "Experience" },
              { href: "/cv", label: "CV" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Connect</h3>
          <div className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href as string}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {year} Sentinel PortfolioOS. Built with Next.js & Supabase.</p>
          <p>Honest by design — no guaranteed-security claims.</p>
        </div>
      </div>
    </footer>
  );
}
