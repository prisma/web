import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "../lib/cn";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg]:w-5 [&>svg]:h-5 [&>*:not(svg)]:pl-7 alert-admonition",
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

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
  };

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const IconComponent =
      icon !== undefined ? icon : <CircleAlert className="h-4 w-4" />;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
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
Alert.displayName = "Alert";

export { Alert };
