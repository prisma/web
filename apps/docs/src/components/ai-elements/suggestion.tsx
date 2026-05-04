"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";

export type SuggestionsProps = ComponentProps<"div">;

export const Suggestions = ({ className, children, ...props }: SuggestionsProps) => (
  <div className="w-full" {...props}>
    <div className={cn("flex flex-col items-start gap-2", className)}>{children}</div>
  </div>
);

export type SuggestionProps = Omit<ComponentProps<"button">, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
  variant?: "link" | "outline" | "pill";
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "link",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  if (variant === "link") {
    return (
      <button
        className={cn(
          "rounded-none p-0 text-left text-sm text-fd-muted-foreground hover:text-fd-foreground hover:underline transition-colors",
          className,
        )}
        onClick={handleClick}
        type="button"
        {...props}
      >
        {children || suggestion}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "cursor-pointer rounded-full px-4",
          className,
        )}
        onClick={handleClick}
        type="button"
        {...props}
      >
        {children || suggestion}
      </button>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children || suggestion}
    </button>
  );
};
