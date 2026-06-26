import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/20 bg-warning/10 text-warning",
        muted: "border-transparent bg-muted text-muted-foreground",
        // Terminal-style system label
        system:
          "rounded border-border bg-transparent font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/** Status pill with a leading signal dot — used for project / availability state. */
const STATUS_DOT: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  default: "bg-primary",
  muted: "bg-muted-foreground",
};

function StatusPill({
  tone = "default",
  children,
  className,
}: {
  tone?: keyof typeof STATUS_DOT;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-1.5">
        {tone === "success" ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
        ) : null}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            STATUS_DOT[tone],
          )}
        />
      </span>
      {children}
    </span>
  );
}

export { Badge, badgeVariants, StatusPill };
