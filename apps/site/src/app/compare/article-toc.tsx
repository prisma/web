"use client";

import { useEffect, useRef, useState } from "react";

type TocItem = { id: string; label: string };

/** Input that means the reader, not a TOC click, is moving the page. */
const READER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The heading list with the section being read marked: the last heading above
 * the top third of the viewport, the first item before any heading gets there,
 * and the last item once the page cannot scroll further. A clicked item stays
 * marked until the reader scrolls again, so a short final section can still
 * show the item that was clicked.
 */
export function ArticleToc({ items }: { items: readonly TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const pinned = useRef<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (pinned.current) return;
      const headings = items
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => element !== null);
      if (headings.length === 0) return;
      const line = Math.max(120, window.innerHeight * 0.3);
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = headings[headings.length - 1].id;
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const release = () => {
      pinned.current = null;
    };
    const followHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (items.some((item) => item.id === id)) {
        pinned.current = id;
        setActive(id);
      } else {
        release();
        schedule();
      }
    };

    if (window.location.hash) followHash();
    else measure();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("popstate", followHash);
    for (const type of READER_INPUT) window.addEventListener(type, release, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("popstate", followHash);
      for (const type of READER_INPUT) window.removeEventListener(type, release);
    };
  }, [items]);

  return (
    <ul className="space-y-4 border-l border-black/[0.08] text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={item.id === active ? "location" : undefined}
            onClick={() => {
              pinned.current = item.id;
              setActive(item.id);
            }}
            className="-ml-px block border-l-2 border-transparent pl-4 transition-colors duration-200 hover:text-foreground motion-reduce:transition-none aria-[current=location]:border-foreground/70 aria-[current=location]:text-foreground"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
