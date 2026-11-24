"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** A one-line shell command in a pill that copies itself to the clipboard. */
export function CommandPill({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard access can be refused (permissions, insecure context); the
      // command stays visible and selectable either way.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy command: ${command}`}
      className={cn(
        "group inline-flex h-12 items-center gap-3 rounded-full border border-[#E4E4E4] bg-white pr-4 pl-5 font-[family-name:var(--font-code)] text-[0.875rem] text-foreground transition-colors hover:border-[#BDBDBD] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <span aria-hidden className="text-[#9A9B9E] select-none">
        $
      </span>
      <span className="select-all">{command}</span>
      <span aria-hidden className="text-[#6B6B6B] transition-colors group-hover:text-foreground">
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
