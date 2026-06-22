import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: 20,
  md: 28,
  lg: 40,
} as const;

export type LogoSize = keyof typeof SIZE_MAP;

export interface LogoMarkProps {
  size?: LogoSize | number;
  className?: string;
  /** Decorative by default; pass a title for standalone use. */
  title?: string;
}

/**
 * LogoMark — a shield enclosing a document/card with a small spark.
 * Pure inline SVG, theme-aware via currentColor + the brand accent.
 */
export function LogoMark({ size = "md", className, title }: LogoMarkProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      {title ? <title>{title}</title> : null}
      {/* Shield outline */}
      <path
        d="M24 3.5 6.5 10.2v11.3c0 10.8 7.2 19.4 17.5 23 10.3-3.6 17.5-12.2 17.5-23V10.2L24 3.5Z"
        fill="hsl(var(--primary) / 0.10)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Document / portfolio card */}
      <rect
        x="15"
        y="15.5"
        width="18"
        height="20"
        rx="2.5"
        fill="hsl(var(--background))"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19 21h7M19 25h10M19 29h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Spark — the "proof" / signal */}
      <path
        d="M31.5 9.5l1.4 3.2 3.2 1.4-3.2 1.4-1.4 3.2-1.4-3.2-3.2-1.4 3.2-1.4 1.4-3.2Z"
        fill="hsl(var(--brand-emerald))"
        stroke="hsl(var(--brand-emerald))"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
