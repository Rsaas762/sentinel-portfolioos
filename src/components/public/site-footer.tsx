import Link from "next/link";
import { Globe, Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/social";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        {/* Who I am */}
        <div className="space-y-4">
          <Logo size="md" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {profile.headline}. {settings.hero_title}
          </p>
          {settings.available_for_work ? (
            <Badge variant="success">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-success" />
              Available for work
            </Badge>
          ) : null}
        </div>

        {/* Explore */}
        <nav className="space-y-3" aria-label="Footer">
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* How to reach me */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Get in touch</h3>
          <p className="text-sm text-muted-foreground">
            Open to internships, junior roles, and small freelance builds.
          </p>
          <Button asChild size="sm">
            <Link href="/contact">
              Contact me <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <div className="flex gap-2 pt-1">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href as string}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {profile.full_name}. Built with Next.js &amp; Supabase.
          </p>
          <p>Honest by design — no guaranteed-security claims.</p>
        </div>
      </div>
    </footer>
  );
}
