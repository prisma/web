"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "../lib/cn";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-square-low bg-background-default border border-stroke-neutral focus-visible:shadow-box-low focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-background-neutral-weak disabled:border-stroke-neutral-weak data-[state=checked]:text-foreground-neutral disabled:text-foreground-neutral-weaker",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="10"
        viewBox="0 0 11 10"
        color="inherit"
      >
        <path
          d="M10.19 0.145603C10.5252 0.389353 10.6002 0.858103 10.3564 1.19326L4.35645 9.44326C4.22754 9.62138 4.02832 9.73154 3.80801 9.75029C3.5877 9.76904 3.37441 9.68701 3.21973 9.53232L0.219727 6.53232C-0.0732422 6.23935 -0.0732422 5.76357 0.219727 5.4706C0.512695 5.17763 0.988477 5.17763 1.28145 5.4706L3.66035 7.84951L9.14473 0.309665C9.38848 -0.0254911 9.85723 -0.100491 10.1924 0.143259L10.19 0.145603Z"
          fill="currentColor"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
