"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useReducedMotion } from "framer-motion";
import { Slot } from "radix-ui";

import { BurstFill } from "@/components/brand/burst-fill";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:scale-[1.04] motion-reduce:hover:scale-100",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "spectrum-border border border-[#646567] bg-background duration-500 hover:border-transparent dark:bg-input/30 dark:border-input",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "spectrum-ink",
        link: "text-primary",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-10 px-6 has-[>svg]:px-5",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState(false);

  // Primary buttons carry the brand's prismatic-burst hover (not available
  // with asChild, where we can't inject the overlay).
  const burst = variant === "default" && !asChild && !reduce;

  if (!burst) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {variant === "link" && !asChild ? (
          <span className="spectrum-underline inline-flex items-center gap-2">{children}</span>
        ) : (
          children
        )}
      </Comp>
    );
  }

  // `burst` implies !asChild, so Comp is "button" here by construction —
  // rendering the literal element lets the handler args type as
  // MouseEvent<HTMLButtonElement> instead of a Slot/button union.
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      <BurstFill on={hover} />
      <span className="relative z-10 inline-flex items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0">
        {children}
      </span>
    </button>
  );
}

export { Button, buttonVariants };
