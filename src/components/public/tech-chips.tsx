import { cn } from "@/lib/utils";

/** Consistent monospace tech-stack chips. Optionally caps the count with a +N. */
export function TechChips({
  items,
  max,
  className,
}: {
  items: string[];
  max?: number;
  className?: string;
}) {
  const shown = max ? items.slice(0, max) : items;
  const extra = max ? items.length - shown.length : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((tech) => (
        <span
          key={tech}
          className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {tech}
        </span>
      ))}
      {extra > 0 ? (
        <span className="px-1 py-0.5 font-mono text-[11px] text-muted-foreground">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
