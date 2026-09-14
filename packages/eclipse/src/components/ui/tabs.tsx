"use client";

import {
  type ComponentProps,
  createContext,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Primitive from "@radix-ui/react-tabs";
import { mergeRefs } from "../../lib/merge-refs";
import { escapeTabValue } from "../../lib/tab-value";

type ChangeListener = (v: string) => void;
const listeners = new Map<string, Set<ChangeListener>>();

export interface TabsProps extends ComponentProps<typeof Primitive.Tabs> {
  /**
   * Identifier for Sharing value of tabs
   */
  groupId?: string;

  /**
   * Enable persistent
   */
  persist?: boolean;

  /**
   * If true, updates the URL hash based on the tab's id
   */
  updateAnchor?: boolean;
}

const TabsContext = createContext<{
  valueToIdMap: Map<string, string>;
} | null>(null);

function useTabContext() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("You must wrap your component in <Tabs>");
  return ctx;
}

export const TabsList = Primitive.TabsList;

/**
 * The single place where a tab value crosses into Radix, which builds DOM ids
 * out of it. Everything is escaped here so a label with whitespace ("Relational
 * databases") cannot produce an id — and therefore an `aria-controls` /
 * `aria-labelledby` — containing a space. `escapeTabValue` is idempotent, so
 * callers that already escaped (see `tabs.tsx`, `codeblock.tsx`) are unaffected.
 */
export function TabsTrigger({ value, ...props }: ComponentProps<typeof Primitive.TabsTrigger>) {
  return <Primitive.TabsTrigger value={escapeTabValue(value)} {...props} />;
}

export function Tabs({
  ref,
  groupId,
  persist = false,
  updateAnchor = false,
  defaultValue,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const valueToIdMap = useMemo(() => new Map<string, string>(), []);
  const onValueChangeRef = useRef(_onValueChange);
  useLayoutEffect(() => {
    onValueChangeRef.current = _onValueChange;
  }, [_onValueChange]);
  const [internalValue, setInternalValue] = useState(
    defaultValue !== undefined ? escapeTabValue(defaultValue) : undefined,
  );
  const stableOnValueChange = useCallback((v: string) => onValueChangeRef.current?.(v), []);
  const value = _value !== undefined ? escapeTabValue(_value) : internalValue;
  const setValue = _value !== undefined ? stableOnValueChange : setInternalValue;

  useLayoutEffect(() => {
    if (!groupId) return;
    let previous = sessionStorage.getItem(groupId);
    if (persist) previous ??= localStorage.getItem(groupId);
    if (previous) setValue(escapeTabValue(previous));

    const groupListeners = listeners.get(groupId) ?? new Set();
    groupListeners.add(setValue);
    listeners.set(groupId, groupListeners);
    return () => {
      groupListeners.delete(setValue);
    };
  }, [groupId, persist, setValue]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    for (const [value, id] of valueToIdMap.entries()) {
      if (id === hash) {
        setValue(value);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [setValue, valueToIdMap]);

  return (
    <Primitive.Tabs
      ref={mergeRefs(ref, tabsRef)}
      value={value}
      onValueChange={(v: string) => {
        if (updateAnchor) {
          const id = valueToIdMap.get(v);

          if (id) {
            window.history.replaceState(null, "", `#${id}`);
          }
        }

        if (groupId) {
          const groupListeners = listeners.get(groupId);
          if (groupListeners) {
            for (const listener of groupListeners) listener(v);
          }

          sessionStorage.setItem(groupId, v);
          if (persist) localStorage.setItem(groupId, v);
        } else {
          setValue(v);
        }
      }}
      {...props}
    >
      <TabsContext value={useMemo(() => ({ valueToIdMap }), [valueToIdMap])}>
        {props.children}
      </TabsContext>
    </Primitive.Tabs>
  );
}

export function TabsContent({ value, ...props }: ComponentProps<typeof Primitive.TabsContent>) {
  const { valueToIdMap } = useTabContext();
  const escaped = escapeTabValue(value);

  if (props.id) {
    valueToIdMap.set(escaped, props.id);
  }

  return (
    <Primitive.TabsContent value={escaped} {...props}>
      {props.children}
    </Primitive.TabsContent>
  );
}
