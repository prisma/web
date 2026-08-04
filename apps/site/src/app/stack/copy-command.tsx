"use client";

import { cn } from "@/lib/cn";
import { useRef, useState } from "react";

/**
 * The primary CTA: the scaffold command with a copy button. The command is
 * plain text in the DOM (crawlable, selectable); the button is labelled and
 * announces success politely.
 */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (permissions, http); the text stays selectable.
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-square-high border border-stroke-neutral bg-background-neutral-weaker py-2.5 pl-4 pr-2.5",
        className,
      )}
    >
      <code className="font-mono text-sm text-foreground-neutral md:text-base">
        <span className="select-none text-foreground-neutral-weaker">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy the command ${command}`}
        className="grid size-8 shrink-0 place-items-center rounded-square border border-stroke-neutral text-foreground-neutral-weak transition-colors hover:border-stroke-ppg hover:text-foreground-ppg"
      >
        <i className={copied ? "fa-regular fa-check" : "fa-regular fa-copy"} aria-hidden />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
