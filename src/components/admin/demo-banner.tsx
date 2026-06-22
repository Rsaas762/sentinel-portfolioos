import { Info } from "lucide-react";

/** Shown across the admin when running without Supabase: changes don't persist. */
export function DemoBanner() {
  return (
    <div className="flex items-start gap-2.5 border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-sm sm:px-6">
      <Info className="mt-0.5 size-4 shrink-0 text-warning" />
      <p className="text-foreground/90">
        <span className="font-semibold">Demo mode.</span> You’re viewing the
        admin with sample data and no database connected. You can explore every
        screen, but changes won’t be saved. Add Supabase credentials to enable a
        live CMS — see{" "}
        <code className="rounded bg-background/60 px-1 font-mono text-xs">
          README.md
        </code>
        .
      </p>
    </div>
  );
}
