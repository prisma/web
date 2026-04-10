import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "flex flex-row justify-center items-center rounded-square transition-all duration-50 cursor-pointer no-underline disabled:bg-background-neutral-weak! disabled:border-none! disabled:text-foreground-neutral-weaker! disabled:cursor-not-allowed disabled:shadow-none [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>i]:pointer-events-none [&>i]:shrink-0",
  {
    variants: {
      variant: {
        ppg: "bg-background-ppg-reverse text-foreground-ppg-reverse hover:bg-background-ppg-reverse-strong shadow-box-low",
        orm: "bg-background-orm-reverse text-foreground-orm-reverse hover:bg-background-orm-reverse-strong shadow-box-low",
        "default-strong":
          "bg-background-neutral text-foreground-neutral hover:bg-background-neutral-strong",
        default:
          "bg-background-default hover:bg-background-neutral border border-stroke-neutral hover:border-stroke-neutral-strong text-foreground-neutral shadow-box-low",
        "default-weak": "bg-transparent hover:bg-background-neutral text-foreground-neutral",
        error:
          "bg-background-error-reverse text-foreground-error-reverse hover:bg-background-error-reverse-strong shadow-box-low",
        success:
          "bg-background-success-reverse text-foreground-success-reverse hover:bg-background-success-reverse-strong shadow-box-low",
        link: "text-foreground-neutral underline-offset-4 hover:underline focus-visible:ring-foreground-neutral",
      },
      size: {
        lg: "px-2 h-element-lg gap-2 type-text-sm-strong [&>svg]:size-element-2xs [&>svg:first-child]:-ml-0.5 [&>svg:last-child]:-mr-0.5 [&>i]:size-element-2xs [&>i:first-child]:-ml-0.5 [&>i:last-child]:-mr-0.5",
        xl: "px-3 h-element-xl gap-2 type-text-sm-strong [&>svg]:size-element-xs [&>svg:first-child]:-ml-1 [&>svg:last-child]:-mr-1 [&>i]:size-element-xs [&>i:first-child]:-ml-1 [&>i:last-child]:-mr-1",
        "2xl":
          "px-3 h-element-2xl gap-2 type-text-sm-strong [&>svg]:size-element-xs [&>svg:first-child]:-ml-1 [&>svg:last-child]:-mr-1 [&>i]:size-element-xs [&>i:first-child]:-ml-1 [&>i:last-child]:-mr-1",
        "3xl":
          "px-4 h-element-4xl gap-3 type-heading-md [&>svg]:size-element-sm [&>svg:first-child]:-ml-1 [&>svg:last-child]:-mr-1 [&>i]:size-element-sm [&>i:first-child]:-ml-1 [&>i:last-child]:-mr-1",
        "icon-lg": "size-element-lg [&>svg]:size-element-xs [&>i]:size-element-xs",
        "icon-xl": "size-element-xl [&>svg]:size-element-xs [&>i]:size-element-xs",
        "icon-2xl": "size-element-2xl [&>svg]:size-element-sm [&>i]:size-element-sm",
        "icon-3xl": "size-element-4xl [&>svg]:size-element-md [&>i]:size-element-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
