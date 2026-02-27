import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva("", {
  variants: {
    variant: {
      ppg: "bg-background-ppg-reverse text-foreground-ppg-reverse hover:bg-background-ppg-reverse-strong",
      orm: "bg-background-orm-reverse text-foreground-orm-reverse hover:bg-background-orm-reverse-strong",
      default:
        "bg-background-default border border-stroke-neutral text-foreground-neutral",
      "default-stronger":
        "bg-background-neutral text-foreground-neutral hover:bg-background-neutral-strong",
      "default-weaker": "bg-background-neutral text-foreground-neutral-weaker",
      error:
        "bg-background-error-reverse text-foreground-error-reverse hover:bg-backΩground-error-reverse-strong focus-visible:ring-stroke-error",
      link: "text-foreground-neutral underline-offset-4 hover:underline focus-visible:ring-foreground-neutral",
    },
    size: {
      lg: "px-2 py-1 text-sm rounded-square",
      xl: "py-1.5 px-2.5 text-md rounded-square",
      "2xl": "py-2 px-3 text-lg rounded-square",
      "4xl": "py-3 px-4 text-xl rounded-square",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "lg",
  },
});

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
