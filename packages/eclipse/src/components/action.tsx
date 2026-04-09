import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const actionVariants = cva(
  "flex items-center justify-center rounded-square shrink-0",
  {
    variants: {
      color: {
        ppg: "bg-background-ppg text-foreground-ppg",
        orm: "bg-background-orm text-foreground-orm",
        "orm-reverse": "bg-background-orm-reverse text-foreground-orm-reverse",
        error: "bg-background-error text-foreground-error",
        success: "bg-background-success text-foreground-success",
        warning: "bg-background-warning text-foreground-warning",
        cyan: "bg-background-cyan text-foreground-cyan",
        fuchsia: "bg-background-fuchsia text-foreground-fuchsia",
        lime: "bg-background-lime text-foreground-lime",
        pink: "bg-background-pink text-foreground-pink",
        purple: "bg-background-purple text-foreground-purple",
        sky: "bg-background-sky text-foreground-sky",
        violet: "bg-background-violet text-foreground-violet",
        yellow: "bg-background-yellow text-foreground-yellow",
        neutral: "bg-background-neutral text-foreground-neutral",
        "neutral-reversed":
          "bg-background-neutral-reverse text-foreground-neutral-reverse",
      },
      size: {
        lg: "size-element-lg p-1.5",
        "2xl": "size-element-2xl p-2",
        "3xl": "size-element-3xl p-2.5",
        "4xl": "size-element-4xl p-3",
        "5xl": "size-element-5xl p-4",
      },
      isFramed: {
        true: "border",
        false: "",
      },
    },
    compoundVariants: [
      // Framed border colors for each color variant
      {
        color: "ppg",
        isFramed: true,
        className: "border-stroke-ppg",
      },
      {
        color: "orm",
        isFramed: true,
        className: "border-stroke-orm",
      },
      {
        color: "error",
        isFramed: true,
        className: "border-stroke-error",
      },
      {
        color: "success",
        isFramed: true,
        className: "border-stroke-success",
      },
      {
        color: "warning",
        isFramed: true,
        className: "border-stroke-warning",
      },
      {
        color: "cyan",
        isFramed: true,
        className: "border-stroke-cyan",
      },
      {
        color: "fuchsia",
        isFramed: true,
        className: "border-stroke-fuchsia",
      },
      {
        color: "lime",
        isFramed: true,
        className: "border-stroke-lime",
      },
      {
        color: "pink",
        isFramed: true,
        className: "border-stroke-pink",
      },
      {
        color: "purple",
        isFramed: true,
        className: "border-stroke-purple",
      },
      {
        color: "sky",
        isFramed: true,
        className: "border-stroke-sky",
      },
      {
        color: "violet",
        isFramed: true,
        className: "border-stroke-violet",
      },
      {
        color: "yellow",
        isFramed: true,
        className: "border-stroke-yellow",
      },
      {
        color: "neutral",
        isFramed: true,
        className: "border-stroke-neutral",
      },
      {
        color: "neutral-reversed",
        isFramed: true,
        className: "border-stroke-neutral",
      },
    ],
    defaultVariants: {
      color: "neutral",
      size: "lg",
      isFramed: false,
    },
  },
);

export interface ActionProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof actionVariants> {}

const Action = React.forwardRef<HTMLDivElement, ActionProps>(
  ({ className, color, size, isFramed, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(actionVariants({ color, size, isFramed }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Action.displayName = "Action";

export { Action, actionVariants };
