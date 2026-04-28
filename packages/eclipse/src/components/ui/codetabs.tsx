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
import { cn } from "../../lib/cn";
import * as Unstyled from "./tabs";

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
}

const TabsContext = createContext<{
  items?: string[];
  collection: CollectionKey[];
} | null>(null);

function useTabContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("You must wrap your component in <Tabs>");
  return ctx;
}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof Unstyled.TabsList>,
  React.ComponentPropsWithoutRef<typeof Unstyled.TabsList> & {
    currentValue?: string;
    onValueChange?: (value: string) => void;
    items?: string[];
  }
>(({ currentValue, onValueChange, items, ...props }, ref) => {
  return (
    <Unstyled.TabsList
      ref={ref}
      {...props}
      className={cn("flex flex-row px-2 overflow-x-auto text-fd-muted-foreground", props.className)}
    >
      {items && items.length > 0
        ? items.map((item) => (
            <TabsTrigger key={item} value={escapeValue(item)}>
              {item}
            </TabsTrigger>
          ))
        : props.children}
    </Unstyled.TabsList>
  );
});
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof Unstyled.TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof Unstyled.TabsTrigger>
>((props, ref) => (
  <Unstyled.TabsTrigger
    ref={ref}
    {...props}
    className={cn(
      "relative group inline-flex text-sm font-medium text-nowrap items-center transition-colors gap-2 px-2 py-1.5 hover:text-fd-accent-foreground data-[state=active]:text-fd-primary [&_svg]:size-3.5",
      props.className,
    )}
  >
    <div className="absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary" />
    {props.children}
  </Unstyled.TabsTrigger>
));
TabsTrigger.displayName = "TabsTrigger";

export function Tabs({
  ref,
  className,
  items,
  label,
  defaultIndex = 0,
  defaultValue = items ? escapeValue(items[defaultIndex]) : undefined,
  ...props
}: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  const collection = useMemo<CollectionKey[]>(() => [], []);

  console.log("Tabs component rendered", { items, value, defaultValue });

  return (
    <Unstyled.Tabs
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-stroke-neutral bg-fd-card my-4",
        className,
      )}
      value={value}
      onValueChange={(v: string) => {
        if (items && !items.some((item) => escapeValue(item) === v)) return;
        setValue(v);
      }}
      {...props}
    >
      {items && <TabsList currentValue={value} onValueChange={setValue} items={items} />}
      <TabsContext.Provider value={useMemo(() => ({ items, collection }), [collection, items])}>
        {props.children}
      </TabsContext.Provider>
    </Unstyled.Tabs>
  );
}

export interface TabProps extends Omit<ComponentProps<typeof Unstyled.TabsContent>, "value"> {
  /**
   * Value of tab, detect from index if unspecified.
   */
  value?: string;
}

export function Tab({ value, ...props }: TabProps) {
  const { items } = useTabContext();
  const resolved =
    value ??
    // eslint-disable-next-line react-hooks/rules-of-hooks -- `value` is not supposed to change
    items?.at(useCollectionIndex());

  console.log("Tab component rendered", { value, resolved, items });

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
  console.log("TabsContent rendered!", { value, className, props });

  return (
    <Unstyled.TabsContent
      value={value}
      forceMount
      className={cn(
        "p-4 text-[0.9375rem] bg-fd-background rounded-xl outline-none prose-no-margin data-[state=inactive]:hidden [&>figure]:-m-4 [&>figure]:border-none",
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
  const { collection } = useTabContext();

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
