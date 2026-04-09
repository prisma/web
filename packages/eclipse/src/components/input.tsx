import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const inputVariants = cva(
  "flex w-full rounded-square border border-stroke-neutral bg-background-default text-foreground-neutral transition-colors placeholder:text-foreground-neutral-weak focus-visible:outline-none focus-visible:shadow-box-low focus-visible:ring-ring focus-visible:border-stroke-neutral-strong disabled:cursor-not-allowed disabled:text-foreground-neutral-weaker disabled:placeholder:text-foreground-neutral-weaker disabled:border-stroke-neutral-weak disabled:bg-background-neutral-weak aria-invalid:border-stroke-error aria-invalid:text-foreground-error aria-invalid:focus-visible:border-stroke-error type-text-sm",
  {
    variants: {
      size: {
        lg: "px-2 h-element-lg file:py-1 file:px-2",
        xl: "px-3 h-element-xl file:py-1.5 file:px-3",
        "2xl": "px-3 h-element-2xl file:py-2 file:px-3",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
