"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// Which items are open, and which item a content panel belongs to, so a closed
// panel can be marked inert. Closed panels stay mounted (see AccordionContent)
// so their text is in the server-rendered HTML; inert keeps any links or
// buttons inside them out of the tab order and the accessibility tree while
// the panel is collapsed.
const OpenValuesContext = React.createContext<readonly string[]>([]);
const ItemValueContext = React.createContext<string | null>(null);

function Accordion({
  type,
  defaultValue,
  value: controlledValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const [value, setValue] = React.useState<string | string[]>(
    () => defaultValue ?? (type === "multiple" ? [] : ""),
  );

  // A caller may drive this controlled. Its value has to win for both the root
  // and the inert context, or a panel can render open while its content is
  // still inert.
  const effectiveValue = controlledValue ?? value;

  const handleValueChange = React.useCallback(
    (next: string | string[]) => {
      setValue(next);
      (onValueChange as ((next: string | string[]) => void) | undefined)?.(next);
    },
    [onValueChange],
  );

  const openValues = React.useMemo(
    () =>
      typeof effectiveValue === "string"
        ? effectiveValue
          ? [effectiveValue]
          : []
        : effectiveValue,
    [effectiveValue],
  );

  const root = (
    // @ts-expect-error -- single and multiple roots take different value types
    <AccordionPrimitive.Root
      data-slot="accordion"
      type={type}
      value={effectiveValue}
      onValueChange={handleValueChange}
      {...props}
    />
  );

  return <OpenValuesContext.Provider value={openValues}>{root}</OpenValuesContext.Provider>;
}

function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <ItemValueContext.Provider value={value}>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        value={value}
        className={cn("border-b last:border-b-0", className)}
        {...props}
      />
    </ItemValueContext.Provider>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const itemValue = React.useContext(ItemValueContext);
  const isOpen = React.useContext(OpenValuesContext).includes(itemValue ?? "");

  // Radix sizes the open and close animations from a measurement of this node
  // taken in a layout effect. With forceMount that measurement happens while
  // the panel is closed and collapsed to h-0, so it reads 0 and the open
  // animation snaps instead of sliding. Measure the inner wrapper instead: it
  // keeps its natural height however the panel is clipped. Before hydration the
  // variable is 0px, so a closed panel starts collapsed rather than animating
  // from its full height on load.
  const inner = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const node = inner.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.getBoundingClientRect().height));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // Keep the panel mounted so its text is present in the server-rendered
      // HTML. Radix unmounts closed content by default, which leaves FAQ
      // answers out of the markup entirely: crawlers that do not execute
      // JavaScript see the questions and none of the answers. A closed panel
      // collapses to height 0 and stays clipped by overflow-hidden, so this
      // changes what is in the DOM, not what a reader sees.
      forceMount
      inert={!isOpen}
      className="data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      style={{ "--radix-accordion-content-height": `${height}px`, ...style } as React.CSSProperties}
      {...props}
    >
      <div ref={inner} className={cn("pt-0 pb-4", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
