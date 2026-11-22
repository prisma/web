"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A command set inline in a sentence that copies itself on click. Lighter than
 * CopyCommand (components/extensions/copy-command.tsx), which is a full-width
 * chip: this one sits in running text, e.g. the Free plan card's
 * "Or skip sign-up: npx create-db".
 *
 * `command` is what gets copied; `children` is what shows, so the visible text
 * can be shorter (`npx create-db` copies `npx create-db@latest`).
 */
export function CopyInline({
  command,
  children,
  className,
}: {
  command: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(command);
      ok = true;
    } catch {
      // Blocked in some embedded browsers and older Safari: fall back to the
      // legacy copy command. If that fails too, the command stays visible.
      const field = document.createElement("textarea");
      field.value = command;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      ok = document.execCommand("copy");
      field.remove();
    }
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${command}`}
        title={`Copy ${command}`}
        className={cn(
          "inline-grid cursor-copy rounded-md bg-paper px-1.5 py-0.5 align-baseline font-mono text-[0.92em] text-foreground ring-1 ring-inset ring-black/[0.08] outline-none transition-colors hover:ring-black/25 focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className,
        )}
      >
        {/* Both labels share one grid cell, so the button keeps the width of
            the wider one and "Copied" never pushes the line onto two. */}
        <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
          {children ?? command}
        </span>
        <span
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 text-center font-sans text-prism-cyan-700",
            !copied && "invisible",
          )}
        >
          Copied
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}
