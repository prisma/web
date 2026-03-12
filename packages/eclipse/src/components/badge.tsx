import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Define badge variants using CVA based on Figma design
 */
const badgeVariants = cva(
  "inline-flex flex-row justify-center items-center rounded-square type-text-xs-strong",
  {
    variants: {
      color: {
        neutral: "bg-background-neutral text-foreground-neutral",
        ppg: "bg-background-ppg text-foreground-ppg",
        orm: "bg-background-orm text-foreground-orm",
        error: "bg-background-error text-foreground-error",
        success: "bg-background-success text-foreground-success",
        warning: "bg-background-warning text-foreground-warning",
      },
      size: {
        md: "px-2 h-element-md min-w-element-md",
        lg: "px-2 h-element-lg min-w-element-lg",
      },
    },
    defaultVariants: {
      color: "neutral",
      size: "md",
    },
  },
);

/**
 * Badge props interface
 */
export interface BadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof badgeVariants> {
  /**
   * The color variant of the badge
   */
  color?: "neutral" | "ppg" | "orm" | "error" | "success" | "warning";
  /**
   * The size variant of the badge
   */
  size?: "md" | "lg";
  /**
   * The label text to display inside the badge
   */
  label: any;
}

/**
 * Badge component
 *
 * A label component that displays text with a colored background.
 * Matches Figma design specs with flex layout and proper sizing.
 *
 * @example
 * ```tsx
 * <Badge color="ppg" label="New Feature" />
 * <Badge color="error" label="Deprecated" />
 * <Badge color="success" label="Active" />
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color, size, label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ color, size, className }))}
        {...props}
      >
        <span className="flex-grow-1">{label}</span>
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
