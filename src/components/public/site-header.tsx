import { MapPin } from "lucide-react";
import { getRepo } from "@/lib/data";
import { HeaderNav } from "@/components/public/header-nav";

export async function SiteHeader() {
  const repo = getRepo();
  const [profile, settings] = await Promise.all([
    repo.getProfile(),
    repo.getSettings(),
  ]);

  return (
    <header>
      {/* Terminal system bar — scrolls away; nav below stays sticky */}
      <div className="hidden border-b border-navy-border bg-navy text-navy-muted md:block">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between px-6 system-label">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3" aria-hidden />
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-4">
            <span aria-hidden>{profile.headline}</span>
            {settings.available_for_work ? (
              <span className="inline-flex items-center gap-1.5 text-navy-foreground">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                </span>
                Open to work
              </span>
            ) : null}
          </span>
        </div>
      </div>

      <HeaderNav brandName={profile.full_name} />
    </header>
  );
}
