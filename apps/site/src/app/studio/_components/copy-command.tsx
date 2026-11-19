"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// Copy-to-clipboard control for the hero's command rows. Local to /studio.
export function CopyCommand({
  text,
  tone = "light",
  className,
}: {
  text: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions, insecure context): do nothing.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy command: ${text}`}
      className={cn(
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prism-yellow-400",
        tone === "light"
          ? "text-muted-foreground hover:bg-black/[0.05] hover:text-foreground"
          : "text-[#f9faf5]/60 hover:bg-white/10 hover:text-[#f9faf5]",
        className,
      )}
    >
      {copied ? (
        <Check
          className={cn("size-4", tone === "light" ? "text-prism-cyan-600" : "text-prism-cyan-300")}
          aria-hidden
        />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}
