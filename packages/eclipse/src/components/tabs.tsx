"use client";

import * as React from "react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn";
import * as Unstyled from "./ui/tabs";

type CollectionKey = string | symbol;

export interface TabsProps extends Omit<
  ComponentProps<typeof Unstyled.Tabs>,
  "value" | "onValueChange"
> {
  /**
   * Use simple mode instead of advanced usage as documented in https://radix-ui.com/primitives/docs/components/tabs.
   */
  items?: string[];

  /**
   * Shortcut for `defaultValue` when `items` is provided.
   *
   * @defaultValue 0
   */
  defaultIndex?: number;

  /**
   * Additional label in tabs list when `items` is provided.
   */
  label?: ReactNode;

  color?: "orm" | "ppg" | "default";
}

const TabsContext = createContext<{
  items?: string[];
  collection: CollectionKey[];
  color?: "orm" | "ppg" | "default";
} | null>(null);

function useTabContext() {
  return useContext(TabsContext);
}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof Unstyled.TabsList>,
  React.ComponentPropsWithoutRef<typeof Unstyled.TabsList>
>((props, ref) => (
  <Unstyled.TabsList
    ref={ref}
    {...props}
    className={cn(
      "flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose",
      props.className,
    )}
  />
));
TabsList.displayName = "TabsList";

const tabsTriggerVariants = {
  default:
    "hover:text-foreground-neutral data-[state=active]:border-stroke-neutral-stronger data-[state=active]:text-foreground-neutral",
  ppg: "hover:text-foreground-ppg data-[state=active]:border-stroke-ppg data-[state=active]:text-foreground-ppg",
  orm: "hover:text-foreground-orm data-[state=active]:border-stroke-orm data-[state=active]:text-foreground-orm",
};

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof Unstyled.TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof Unstyled.TabsTrigger> & {
    color?: "orm" | "ppg" | "default";
  }
>(({ color, ...props }, ref) => {
  const context = useTabContext();
  const resolvedColor = color ?? context?.color ?? "default";

  return (
    <Unstyled.TabsTrigger
      ref={ref}
      {...props}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap border-b border-transparent py-2 type-text-sm-strong transition-colors [&_svg]:size-4 disabled:pointer-events-none disabled:opacity-50 text-foreground-neutral-weak",
        tabsTriggerVariants[resolvedColor],
        props.className,
      )}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export function Tabs({
  ref,
  className,
  items,
  color = "default",
  label,
  defaultIndex = 0,
  defaultValue = items ? escapeValue(items[defaultIndex]) : undefined,
  ...props
}: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  const collection = useMemo<CollectionKey[]>(() => [], []);

  return (
    <Unstyled.Tabs
      ref={ref}
      className={cn("flex flex-col overflow-hidden my-4", className)}
      value={value}
      onValueChange={(v: string) => {
        if (items && !items.some((item) => escapeValue(item) === v)) return;
        setValue(v);
      }}
      {...props}
    >
      <TabsContext.Provider
        value={useMemo(
          () => ({ items, collection, color }),
          [collection, items, color],
        )}
      >
        {items && (
          <TabsList>
            {label && (
              <span className="type-text-sm-strong my-auto me-auto">
                {label}
              </span>
            )}
            {items.map((item) => (
              <TabsTrigger key={item} value={escapeValue(item)}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {props.children}
      </TabsContext.Provider>
    </Unstyled.Tabs>
  );
}

export interface TabProps extends Omit<
  ComponentProps<typeof Unstyled.TabsContent>,
  "value"
> {
  /**
   * Value of tab, detect from index if unspecified.
   */
  value?: string;
}

export function Tab({ value, ...props }: TabProps) {
  const context = useTabContext();
  const resolved =
    value ??
    // eslint-disable-next-line react-hooks/rules-of-hooks -- `value` is not supposed to change
    context?.items?.at(useCollectionIndex());
  if (!resolved)
    throw new Error(
      "Failed to resolve tab `value`, please pass a `value` prop to the Tab component.",
    );

  return (
    <TabsContent value={escapeValue(resolved)} {...props}>
      {props.children}
    </TabsContent>
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: ComponentProps<typeof Unstyled.TabsContent>) {
  return (
    <Unstyled.TabsContent
      value={value}
      forceMount
      className={cn(
        "text-[0.9375rem] outline-none prose-no-margin data-[state=inactive]:hidden [&>figure:only-child]:-m-4 [&>figure:only-child]:border-none",
        className,
      )}
      {...props}
    >
      {props.children}
    </Unstyled.TabsContent>
  );
}

/**
 * Inspired by Headless UI.
 *
 * Return the index of children, this is made possible by registering the order of render from children using React context.
 * This is supposed by work with pre-rendering & pure client-side rendering.
 */
function useCollectionIndex() {
  const key = useId();
  const context = useTabContext();
  const collection = context?.collection ?? [];

  useEffect(() => {
    return () => {
      const idx = collection.indexOf(key);
      if (idx !== -1) collection.splice(idx, 1);
    };
  }, [key, collection]);

  if (!collection.includes(key)) collection.push(key);
  return collection.indexOf(key);
}

/**
 * only escape whitespaces in values in simple mode
 */
function escapeValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}
