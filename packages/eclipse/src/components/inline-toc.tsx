"use client";

import { cn } from "../lib/cn";
import { type ComponentProps, useEffect, useRef, useState } from "react";

export interface TOCItem {
  title: string;
  url: string;
  depth: number;
  items?: TOCItem[];
}

export interface InlineTocProps extends ComponentProps<"div"> {
  items: TOCItem[];
}

export type { TOCItem as TOCItemType };

function flattenItems(items: TOCItem[]): TOCItem[] {
  return items.flatMap((item) => [item, ...flattenItems(item.items ?? [])]);
}

function TOCItemComponent({ item, activeId }: { item: TOCItem; activeId: string | null }) {
  const id = item.url.slice(1);
  const isActive = id === activeId;

  return (
    <>
      <a
        href={item.url}
        data-active={isActive}
        // `.spectrum-text-active` / `.spectrum-text-hover` (eclipse
        // globals.css) paint the docs TOC treatment: cool-spectrum gradient
        // text on the active item, the same gradient fading in on hover —
        // matching the docs sidebar's hover.
        className={cn(
          "spectrum-text-active spectrum-text-hover py-1.5 text-sm text-fd-muted-foreground no-underline wrap-anywhere transition-colors first:pt-0 last:pb-0",
          item.depth <= 2 && "ps-3",
          item.depth === 3 && "ps-6",
          item.depth >= 4 && "ps-8",
        )}
      >
        {item.title}
      </a>
      {item?.items?.map((child: TOCItem) => (
        <TOCItemComponent key={child.url} item={child} activeId={activeId} />
      ))}
    </>
  );
}

export function InlineTOC({ items, className, ...props }: InlineTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const flat = flattenItems(items);
    const ids = flat.map((item) => item.url.slice(1));
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [items]);

  // The docs TOC marks the active item with a gradient segment on the rail
  // (`.spectrum-thumb`); mirror it by measuring the active link's offset
  // within the relative wrapper.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeId === null) {
      setThumb(null);
      return;
    }
    const link = container.querySelector<HTMLAnchorElement>(`a[data-active="true"]`);
    if (!link) {
      setThumb(null);
      return;
    }
    setThumb({ top: link.offsetTop, height: link.offsetHeight });
  }, [activeId]);

  return (
    <div ref={containerRef} className={cn("relative", className)} {...props}>
      {thumb && (
        <div
          role="none"
          className="spectrum-thumb absolute start-0 w-0.5 rounded-e-sm transition-[top,height] ease-linear"
          style={{ top: thumb.top, height: thumb.height }}
        />
      )}
      <div className="flex cursor-default flex-col border-s border-fd-foreground/10 text-sm text-fd-muted-foreground">
        {items.map((item) => (
          <TOCItemComponent key={item.url} item={item} activeId={activeId} />
        ))}
      </div>
    </div>
  );
}
