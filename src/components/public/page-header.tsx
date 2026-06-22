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
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {kicker ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-4 text-balance text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
