"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

export const MONO = "font-[ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

/**
 * A monospace install command that copies itself on click. `ink` is the
 * brand's dark surface for the one command a page leads with; `paper` is the
 * quiet version used in list rows.
 */
export function CopyCommand({
  command,
  className,
  tone = "paper",
}: {
  command: string;
  className?: string;
  tone?: "paper" | "ink";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied; the command stays visible for manual copy.
    }
  };

  const ink = tone === "ink";
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${command}`}
      className={cn(
        "group/copy flex w-full cursor-pointer items-center gap-3 rounded-xl border text-left transition-colors",
        MONO,
        ink
          ? "border-primary bg-primary px-4 py-3 text-sm text-primary-foreground hover:border-prism-cyan-400 sm:text-[15px]"
          : "border-black/[0.12] bg-paper px-3 py-2 text-[13px] text-primary hover:border-black/[0.4]",
        className,
      )}
    >
      <span
        className={cn("select-none", ink ? "text-prism-cyan-400" : "text-muted-foreground")}
        aria-hidden
      >
        $
      </span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      {copied ? (
        <Check
          className={cn("size-4 shrink-0", ink ? "text-prism-cyan-400" : "text-prism-cyan-700")}
          aria-hidden
        />
      ) : (
        <Copy
          className={cn(
            "size-4 shrink-0 transition-colors",
            ink
              ? "text-primary-foreground/70 group-hover/copy:text-primary-foreground"
              : "text-muted-foreground group-hover/copy:text-primary",
          )}
          aria-hidden
        />
      )}
    </button>
  );
}
