"use client";

import type { ComponentProps } from "react";

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

function TOCItemComponent({ item }: { item: TOCItem }) {
  return (
    <>
      <a
        href={item.url}
        className="border-s py-1 font-normal text-foreground-neutral-weak hover:text-foreground-neutral transition-colors hover:text-fd-accent-foreground no-underline"
        style={{
          paddingInlineStart: 12 * Math.max(item.depth - 1, 0),
        }}
      >
        {item.title}
      </a>
      {item.items?.map((child: TOCItem) => (
        <TOCItemComponent key={child.url} item={child} />
      ))}
    </>
  );
}

export function InlineTOC({ items, ...props }: InlineTocProps) {
  return (
    <div className="flex cursor-default flex-col p-4 pt-0 text-sm text-foreground-neutral-weak">
      {items.map((item) => (
        <TOCItemComponent key={item.url} item={item} />
      ))}
    </div>
  );
}
