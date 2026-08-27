"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// Ink code card — the redesign's surface for code and config content:
// near-black fill (#151515), paper text (#f9faf5), mono type. Click to copy.
export function InkCode({
  code,
  ariaLabel,
  className,
  textClassName,
}: {
  code: string;
  /** Read by screen readers — what gets copied, e.g. "Copy example prompt". */
  ariaLabel: string;
  className?: string;
  textClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : ariaLabel}
      className={cn(
        "group/ink relative flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl bg-[#151515] px-4 py-3 text-left transition-opacity duration-300 hover:opacity-90",
        className,
      )}
    >
      <code
        className={cn(
          "whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-[#f9faf5]",
          textClassName,
        )}
      >
        {code}
      </code>
      <span
        aria-hidden
        className="mt-0.5 shrink-0 text-[#f9faf5]/40 transition-colors duration-300 group-hover/ink:text-[#f9faf5]/80"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </span>
    </button>
  );
}
