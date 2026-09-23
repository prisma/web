"use client";

import * as Primitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { type ComponentProps } from "react";
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
  ...props
}: ComponentProps<typeof Primitive.Content>) {
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
      {...props}
    >
      {children}
    </Primitive.Content>
  );
}
