"use client";

import * as Primitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { type ComponentProps, type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

export function Accordion({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item className={cn("scroll-m-24", className)} {...props}>
      {children}
    </Primitive.Item>
  );
}

export function AccordionHeader({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Header>) {
  return (
    <Primitive.Header
      className={cn(
        "not-prose flex flex-row items-center text-foreground-neutral font-medium has-focus-visible:bg-fd-accent",
        className,
      )}
      {...props}
    >
      {children}
    </Primitive.Header>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      className={cn(
        "group flex flex-1 items-center gap-2 px-3 py-2.5 text-start focus-visible:outline-none cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
      {children}
    </Primitive.Trigger>
  );
}

export function AccordionContent({
  className,
  children,
  style,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  // Radix sizes the open and close animations from a measurement of this node
  // taken in a layout effect. With forceMount that measurement happens while
  // the panel is closed and collapsed to h-0, so it reads 0 and the open
  // animation snaps instead of sliding. Measure the inner wrapper instead: it
  // keeps its natural height however the panel is clipped. Before hydration the
  // variable is 0px, so a closed panel starts collapsed rather than animating
  // from its full height on load.
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const node = inner.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.getBoundingClientRect().height));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Primitive.Content
      // Keep the panel mounted so its text is present in the server-rendered
      // HTML. Radix unmounts closed content by default, which leaves FAQ
      // answers out of the markup entirely: crawlers that do not execute
      // JavaScript see the questions and none of the answers. A closed panel
      // collapses to height 0 and stays clipped by overflow-hidden, so this
      // changes what is in the DOM, not what a reader sees.
      forceMount
      className={cn(
        "overflow-hidden data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down text-foreground-neutral-weak",
        className,
      )}
      style={{ "--radix-accordion-content-height": `${height}px`, ...style } as CSSProperties}
      {...props}
    >
      <div ref={inner}>{children}</div>
    </Primitive.Content>
  );
}
