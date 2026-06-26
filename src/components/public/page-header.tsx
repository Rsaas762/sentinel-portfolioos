import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {kicker ? (
        <p className="system-label mb-4 inline-flex items-center gap-2 text-primary">
          <span aria-hidden className="text-muted-foreground/60">
            {"//"}
          </span>
          {kicker}
        </p>
      ) : null}
      <h1 className="font-display text-balance text-4xl leading-[1.05] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
