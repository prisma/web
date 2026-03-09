import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const admonitionVariants = cva(
  "relative w-full rounded-md border p-4 gap-3 text-sm [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg]:w-5 [&>svg]:h-5 alert-admonition flex items-start [&>i]:mt-0.5",
  {
    variants: {
      variant: {
        ppg: "bg-background-ppg text-foreground-ppg border-none [&>svg]:text-foreground-ppg",
        error:
          "bg-background-error border-none text-foreground-error [&>svg]:text-foreground-error",
        success:
          "bg-background-success border-none text-foreground-success [&>svg]:text-foreground-success",
        warning:
          "bg-background-warning border-none text-foreground-warning [&>svg]:text-foreground-warning",
      },
    },
    defaultVariants: {
      variant: "ppg",
    },
  },
);

type AdmonitionProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof admonitionVariants> & {
    icon?: React.ReactNode;
  };

const Admonition = React.forwardRef<HTMLDivElement, AdmonitionProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const IconComponent =
      icon !== undefined ? (
        icon
      ) : (
        <i className="fa-duotone fa-solid fa-circle-exclamation"></i>
      );
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(admonitionVariants({ variant }), className)}
        {...props}
      >
        {IconComponent}
        <div className="[&>*]:first:mt-0 [&>*]:last:mb-0 [& strong]:text-inherit">
          {children}
        </div>
      </div>
    );
  },
);
Admonition.displayName = "Admonition";

export { Admonition };
