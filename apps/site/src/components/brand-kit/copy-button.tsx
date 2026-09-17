"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// Small copy-to-clipboard control used by the colour swatches and the
// boilerplate blocks. Shows a check for a beat after a successful copy.
export function CopyButton({
  value,
  label,
  className,
  onDark = false,
}: {
  value: string;
  /** Accessible label, e.g. "Copy HEX #01D7E4". */
  label: string;
  className?: string;
  onDark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context); fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
        onDark
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
