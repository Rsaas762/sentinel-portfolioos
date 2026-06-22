import { cn } from "@/lib/utils";

/** Five-segment proficiency meter (1–5). Decorative bars + accessible label. */
export function Proficiency({ level }: { level: number }) {
  const clamped = Math.max(1, Math.min(5, level));
  return (
    <span
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`Proficiency ${clamped} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full",
            i < clamped ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </span>
  );
}
