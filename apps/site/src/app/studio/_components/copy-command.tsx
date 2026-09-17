"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons/forma";

// Copy-to-clipboard control for the ink terminal card. Local to /studio:
// replaces the old homepage CopyCode button from the retired system.
export function CopyCommand({ text }: { text: string }) {
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
      aria-label={copied ? "Copied" : "Copy command"}
      className="absolute right-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-md text-[#f9faf5]/60 transition-colors hover:bg-white/10 hover:text-[#f9faf5]"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    </button>
  );
}
