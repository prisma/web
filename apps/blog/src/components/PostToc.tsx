"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type PostTocItem = { url: string; title: ReactNode; depth: number };

/** Distance from the top of the viewport at which a heading counts as "being read". */
const READING_LINE = 140;

/** Reader input that ends a pin: the reader has taken over the scroll. */
const READER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The post's "On this page" list, matching the site's guides
 * (apps/site/src/components/answer-pages/guide-toc.tsx): a plain ruled list,
 * the section being read marked with an ink rail and medium weight. No
 * gradient text, spectrum thumb or icon (client, 2026-11-25: "match it to the
 * guides, remove the chrome"). It stays in the right-hand rail (client, same
 * day: "move it to the right").
 *
 * The last heading that has passed the reading line is active, and the first
 * one is active before any heading has. After a click or a hash change the
 * item stays pinned through the programmatic scroll and is released on the
 * reader's next input, as the guides do.
 */
export function PostToc({ items }: { items: readonly PostTocItem[] }) {
  const [active, setActive] = useState(items[0]?.url);
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
    <ul className="border-l border-stroke-neutral text-sm leading-snug">
      {items.map((item) => {
        const isActive = item.url === active;
        return (
          <li key={item.url}>
            <a
              href={item.url}
              onClick={() => pin(item.url)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 no-underline transition-colors duration-200 motion-reduce:transition-none",
                // Subsections sit one step in, so the outline reads at a glance.
                item.depth > 2 ? "pl-7" : "pl-4",
                isActive
                  ? "border-foreground-neutral font-medium text-foreground-neutral"
                  : "border-transparent text-foreground-neutral-weak hover:text-foreground-neutral",
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
