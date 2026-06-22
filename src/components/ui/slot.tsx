import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal `asChild` slot: merges the parent's props/className onto a single
 * child element. Avoids pulling in a Radix dependency for this one need.
 */
export const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  return React.cloneElement(child, {
    ...props,
    ...childProps,
    className: cn(className, childProps.className as string | undefined),
    ref,
  } as Record<string, unknown>);
});
Slot.displayName = "Slot";
