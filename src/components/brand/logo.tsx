import { cn } from "@/lib/utils";
import { LogoMark, type LogoSize } from "@/components/brand/logo-mark";

const TEXT_SIZE: Record<LogoSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

const GAP: Record<LogoSize, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

export interface LogoProps {
  size?: LogoSize;
  className?: string;
  /** When true, render only the wordmark text styling (no "OS" emphasis). */
  showText?: boolean;
}

/** Full lockup: mark + "Sentinel PortfolioOS" wordmark. */
export function Logo({ size = "md", className, showText = true }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-primary",
        GAP[size],
        className,
      )}
    >
      <LogoMark size={size} />
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            TEXT_SIZE[size],
          )}
        >
          Sentinel<span className="text-primary">&nbsp;PortfolioOS</span>
        </span>
      ) : null}
    </span>
  );
}
