"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/** A short label for one or more consecutive sections; `id` is the link target. */
export type TocItem = { id: string; label: string; also?: readonly string[] };

/** Input that means the reader, not a TOC click, is moving the page. */
const READER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The item for the section being read: the last heading above the top third
 * of the viewport, the first item before any heading gets there, and the last
 * item once the page cannot scroll further. A clicked item stays marked until
 * the reader scrolls again, so a short final section can still show the item
 * that was clicked.
 */
function useActiveItem(items: readonly TocItem[]) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);
  const pinned = useRef<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const owner = new Map<string, string>();
    for (const item of items) {
      owner.set(item.id, item.id);
      for (const id of item.also ?? []) owner.set(id, item.id);
    }

    const measure = () => {
      frame = 0;
      if (pinned.current) return;
      const headings = [...owner.keys()]
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      if (headings.length === 0) return;
      const line = Math.max(120, window.innerHeight * 0.3);
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = headings[headings.length - 1].id;
      setActive(owner.get(current));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const release = () => {
      pinned.current = null;
    };
    const followHash = () => {
      const target = owner.get(decodeURIComponent(window.location.hash.slice(1)));
      if (target) {
        pinned.current = target;
        setActive(target);
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

  const choose = (id: string) => {
    pinned.current = id;
    setActive(id);
  };
  return [active, choose] as const;
}

function TocList({
  items,
  active,
  onChoose,
}: {
  items: readonly TocItem[];
  active: string | undefined;
  onChoose: (id: string) => void;
}) {
  return (
    <ul className="border-l-2 border-black/[0.08] text-[0.8125rem] leading-5 text-muted-foreground">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={item.id === active ? "location" : undefined}
            onClick={() => onChoose(item.id)}
            className="-ml-0.5 block border-l-2 border-transparent py-2.5 pl-3.5 transition-colors duration-200 hover:text-foreground motion-reduce:transition-none aria-[current=location]:border-foreground aria-[current=location]:font-medium aria-[current=location]:text-foreground"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The sticky right-hand list, matching the docs' table of contents. */
export function ArticleToc({ items }: { items: readonly TocItem[] }) {
  const [active, choose] = useActiveItem(items);
  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <p className="mb-3 text-[0.8125rem] font-medium text-foreground">On this page</p>
      <TocList items={items} active={active} onChoose={choose} />
    </nav>
  );
}

/** The same list folded into a disclosure for narrow screens; it closes after a pick. */
export function ArticleTocDisclosure({ items }: { items: readonly TocItem[] }) {
  const [active, choose] = useActiveItem(items);
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={details} className="group rounded-xl border border-black/[0.08]">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        On this page
        <ChevronDown
          className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        />
      </summary>
      <nav aria-label="On this page" className="px-4 pt-1 pb-3">
        <TocList
          items={items}
          active={active}
          onChoose={(id) => {
            choose(id);
            if (details.current) details.current.open = false;
          }}
        />
      </nav>
    </details>
  );
}
