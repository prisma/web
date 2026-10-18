"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { COPIED_VISIBLE_MS } from "./copied";

function headingText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(headingText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return headingText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/**
 * A section heading with a copy-link button as a sibling, so the heading's
 * accessible name stays the visible text. The button is absolutely positioned
 * so it never moves the heading, and only appears on devices that can hover.
 * Inside a frame or card, `placement="end"` puts it at the heading's right end
 * instead, where the left gutter would fall outside the frame.
 */
export function AnchorHeading({
  level,
  id,
  className,
  placement = "gutter",
  children,
}: {
  level: 2 | 3;
  id: string;
  className?: string;
  placement?: "gutter" | "end";
  children: ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const end = placement === "end";
  const [copied, setCopied] = useState(false);
  const [inTabOrder, setInTabOrder] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const label = headingText(children).trim();

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
    timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS);
  }

  return (
    <div
      className="group/heading relative"
      onMouseEnter={() => setInTabOrder(true)}
      onMouseLeave={() => setInTabOrder(false)}
      onFocusCapture={() => setInTabOrder(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInTabOrder(false);
        }
      }}
    >
      <Tag id={id} tabIndex={-1} className={className}>
        {children}
      </Tag>
      <span
        className={`absolute top-0 hidden h-[1lh] items-center [@media(hover:hover)]:flex ${end ? "right-0" : "right-full pr-2"}`}
      >
        <button
          type="button"
          onClick={copy}
          tabIndex={inTabOrder ? 0 : -1}
          aria-label={label ? `Copy link to “${label}”` : "Copy link to this section"}
          className="relative flex size-6 items-center justify-center rounded-md text-foreground/40 opacity-0 transition-[opacity,color] duration-150 group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 hover:text-foreground/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70 motion-reduce:transition-none after:absolute after:-inset-2.5 after:content-['']"
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <LinkIcon className="size-3.5" strokeWidth={2} aria-hidden />
          )}
          <span
            aria-hidden
            className={`pointer-events-none absolute whitespace-nowrap ${end ? "top-1/2 right-full mr-1 -translate-y-1/2" : "bottom-full left-1/2 mb-1 -translate-x-1/2"} rounded bg-foreground px-1.5 py-0.5 font-sans text-[11px] leading-4 font-normal text-background transition-opacity duration-200 after:content-['Copied'] motion-reduce:transition-none ${copied ? "opacity-90" : "opacity-0"}`}
          />
          <span role="status" className="sr-only">
            {copied ? "Link copied" : ""}
          </span>
        </button>
      </span>
    </div>
  );
}
