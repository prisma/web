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

function TOCItemComponent({
  item,
  activeId,
}: {
  item: TOCItem;
  activeId: string | null;
}) {
  const id = item.url.slice(1);
  const isActive = id === activeId;

  return (
    <>
      <a
        href={item.url}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "toc-item-comp border-s py-1 font-normal transition-colors no-underline data-[state=active]:border-s-fd-primary data-[state=active]:text-fd-accent-foreground data-[state=active]:font-medium data-[state=inactive]:text-foreground-neutral-weak data-[state=inactive]:hover:text-foreground-neutral data-[state=inactive]:hover:text-fd-accent-foreground",
        )}
        style={{
          paddingInlineStart: 12 * Math.max(item.depth - 1, 0),
        }}
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

  useEffect(() => {
    const flat = flattenItems(items);
    const ids = flat.map((item) => item.url.slice(1));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

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

  return (
    <div
      className={cn(
        "flex cursor-default flex-col p-4 pt-0 text-sm text-foreground-neutral-weak",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <TOCItemComponent key={item.url} item={item} activeId={activeId} />
      ))}
    </div>
  );
}
