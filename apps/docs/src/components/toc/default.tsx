"use client";
import { useI18n } from "@fumadocs/base-ui/contexts/i18n";
import { cn } from "@prisma-docs/ui/lib/cn";
import { type ComponentProps, useRef } from "react";
import { mergeRefs } from "../../lib/merge-refs";
import { TocThumb, useTOCItems } from "./index";
import * as Primitive from "fumadocs-core/toc";
import { flattenTocTitle } from "../../lib/toc-title";

export function TOCItems({ ref, className, ...props }: ComponentProps<"div">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const { text } = useI18n();

  if (items.length === 0)
    return (
      <div className="rounded-square border bg-fd-card p-3 text-xs text-fd-muted-foreground">
        {text.tocNoHeadings}
      </div>
    );

  return (
    <>
      <TocThumb
        containerRef={containerRef}
        className="absolute top-(--fd-top) h-(--fd-height) w-0.5 rounded-e-sm spectrum-thumb transition-[top,height] ease-linear"
      />
      <div
        ref={mergeRefs(ref, containerRef)}
        className={cn("flex flex-col border-s border-fd-foreground/10", className)}
        {...props}
      >
        {items.map((item) => (
          <TOCItem key={item.url} item={item} />
        ))}
      </div>
    </>
  );
}

function TOCItem({ item }: { item: Primitive.TOCItemType }) {
  return (
    <Primitive.TOCItem
      href={item.url}
      className={cn(
        "prose spectrum-text-active py-1.5 text-sm text-fd-muted-foreground wrap-anywhere first:pt-0 last:pb-0",
        item.depth <= 2 && "ps-3",
        item.depth === 3 && "ps-6",
        item.depth >= 4 && "ps-8",
      )}
    >
      {/* Plain text only: a heading that contains a link would otherwise nest
          an <a> inside this one and emit a basePath-less href. */}
      {flattenTocTitle(item.title)}
    </Primitive.TOCItem>
  );
}
