"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import { Badge } from "./badge";

const textareaVariants = cva(
  "border border-stroke-neutral bg-background-default text-foreground-neutral disabled:cursor-not-allowed disabled:text-foreground-neutral disabled:bg-background-neutral-weak disabled:stroke-neutral-weak focus-visible:text-foreground-neutral focus:text-foreground-neutral aria-invalid:border-stroke-error aria-invalid:text-foreground-error rounded-square text-sm transition-colors flex field-sizing-content min-h-16 w-full outline-none",
  {
    variants: {
      size: {
        lg: "p-2",
        xl: "p-3",
        "2xl": "p-3",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);

interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = false, maxLength, onChange, size, ...rest }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const resolvedSize = size ?? "lg";

    const badgeInset = {
      lg: "bottom-2 right-2",
      xl: "bottom-3 right-3",
      "2xl": "bottom-3 right-3",
    };

    const charCountPadding = {
      lg: "pb-10",
      xl: "pb-12",
      "2xl": "pb-12",
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          data-slot="textarea"
          className={cn(
            textareaVariants({ size }),
            showCharCount && maxLength && charCountPadding[resolvedSize],
            className,
          )}
          {...rest}
          maxLength={maxLength}
          onChange={handleChange}
        />
        {showCharCount && maxLength && (
          <Badge
            color={
              charCount >= maxLength
                ? "error"
                : charCount >= 0.8 * maxLength
                  ? "warning"
                  : "neutral"
            }
            className={cn(
              "absolute",
              badgeInset[resolvedSize],
            )}
            label={`${charCount}/${maxLength}`}
          ></Badge>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
