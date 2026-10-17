"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

/**
 * A section heading with a copy-link button in the left gutter, following the
 * copy-link pattern in Eclipse's accordion. The button is absolutely positioned
 * so it never moves the heading, and only appears on devices that can hover.
 */
export function AnchorHeading({
  level,
  id,
  className,
  children,
}: {
  level: 2 | 3;
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, "", url);
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Tag id={id} className={`group/heading relative ${className ?? ""}`}>
      {children}
      <span className="absolute top-0 right-full hidden h-[1lh] items-center pr-2 [@media(hover:hover)]:flex">
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link to this section"
          className="relative flex size-6 items-center justify-center rounded-md text-foreground/40 opacity-0 transition-[opacity,color] duration-150 group-hover/heading:opacity-100 hover:text-foreground/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 motion-reduce:transition-none"
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <LinkIcon className="size-3.5" strokeWidth={2} aria-hidden />
          )}
          <span
            aria-hidden
            className={`pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 font-sans text-[11px] leading-4 font-normal text-background transition-opacity duration-200 after:content-['Copied'] motion-reduce:transition-none ${copied ? "opacity-90" : "opacity-0"}`}
          />
          <span role="status" className="sr-only">
            {copied ? "Link copied" : ""}
          </span>
        </button>
      </span>
    </Tag>
  );
}
