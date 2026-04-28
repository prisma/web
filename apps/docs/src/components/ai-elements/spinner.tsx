"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import type { ComponentProps } from "react";

export type SpinnerProps = ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg";
};

export const Spinner = ({ className, size = "sm", ...props }: SpinnerProps) => (
  <div
    className={cn(
      "border-2 border-fd-muted-foreground/30 border-t-fd-foreground rounded-full animate-spin",
      size === "sm" && "size-4",
      size === "md" && "size-5",
      size === "lg" && "size-6",
      className,
    )}
    {...props}
  />
);
