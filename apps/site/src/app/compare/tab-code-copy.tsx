"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clipboard } from "lucide-react";

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
    timer.current = setTimeout(() => setCopied(false), 1600);
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
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
