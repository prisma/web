"use client";

import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./badge";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = false, maxLength, onChange, ...rest }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          data-slot="textarea"
          className={cn(
            "border border-stroke-neutral bg-background-default text-foreground-neutral disabled:cursor-not-allowed disabled:text-foreground-neutral disabled:bg-background-neutral-weak disabled:stroke-neutral-weak focus-visible:text-foreground-neutral focus:text-foreground-neutral aria-invalid:border-stroke-error aria-invalid:text-foreground-error rounded-square p-2 text-sm transition-colors flex field-sizing-content min-h-16 w-full outline-none",
            showCharCount && maxLength && "pb-8",
            className,
          )}
          {...rest}
          maxLength={maxLength}
          onChange={handleChange}
        />
        {showCharCount && maxLength && (
          <Badge
            color="neutral"
            className="absolute bottom-1 right-1 text-foreground-neutral font-mono"
            label={`${charCount}/${maxLength}`}
          ></Badge>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
