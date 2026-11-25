"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GuideTocItem = { url: string; title: ReactNode };

/** Distance from the top of the viewport at which a heading counts as "being read". */
const READING_LINE = 140;

/** Reader input that ends a pin: the reader has taken over the scroll. */
const READER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The guide's "On this page" list. The section being read is marked as the
 * reader scrolls: the last heading that has passed the reading line is
 * active, and the first one is active before any heading has.
 */
export function GuideToc({ items }: { items: readonly GuideTocItem[] }) {
  const [active, setActive] = useState(items[0]?.url);
  // After a click or a hash change, keep that item pinned through the
  // programmatic scroll it starts, and release it on the reader's next input,
  // as compare/article-toc.tsx does. No timer guesses when scrolling settles.
  const pinned = useRef<string | null>(null);

  const pin = (url: string) => {
    pinned.current = url;
    setActive(url);
  };

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const release = () => {
      pinned.current = null;
    };
    const followHash = () => {
      let hash: string;
      try {
        hash = decodeURIComponent(window.location.hash);
      } catch {
        // A malformed fragment, such as a bare "%", names no TOC item.
        hash = "";
      }
      if (items.some((item) => item.url === hash)) {
        pin(hash);
      } else {
        // A fragment outside the TOC ends any pin, so scroll position decides again.
        release();
        onScroll();
      }
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current) return;
      let current = targets[0];
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= READING_LINE) current = el;
      }
      // At the very bottom of the page the last section can't reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = targets[targets.length - 1];
      }
      setActive(`#${current.id}`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    followHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", followHash);
    for (const type of READER_INPUT) window.addEventListener(type, release, { passive: true });
    return () => {
      for (const type of READER_INPUT) window.removeEventListener(type, release);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", followHash);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <ul className="border-l border-border text-sm leading-snug">
      {items.map((item) => {
        const isActive = item.url === active;
        return (
          <li key={item.url}>
            <a
              href={item.url}
              onClick={() => pin(item.url)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 transition-colors duration-200",
                isActive
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
