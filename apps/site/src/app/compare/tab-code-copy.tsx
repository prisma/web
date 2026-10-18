"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { COPIED_VISIBLE_MS } from "./copied";

function tabsRoot(from: HTMLElement) {
  let node: HTMLElement | null = from;
  while (node) {
    if (node.querySelector('[role="tablist"]') && node.querySelector('[role="tabpanel"]')) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/** Copies the open tab's snippet. Sits in the tab bar so it never covers the code. */
export function TabCodeCopy({ label }: { label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const root = tabsRoot(event.currentTarget);
    const panel =
      root?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])') ??
      root?.querySelector<HTMLElement>('[role="tabpanel"][data-state="active"]');
    const text = panel?.querySelector("pre")?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="relative mr-1 flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70"
    >
      {copied ? (
        <Check className="size-4" strokeWidth={2} aria-hidden />
      ) : (
        <Clipboard className="size-4" strokeWidth={2} aria-hidden />
      )}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-full left-1/2 z-10 mt-1 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 font-sans text-[11px] leading-4 font-normal text-background transition-opacity duration-200 after:content-['Copied'] motion-reduce:transition-none ${copied ? "opacity-90" : "opacity-0"}`}
      />
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
