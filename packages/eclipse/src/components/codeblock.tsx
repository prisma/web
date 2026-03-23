"use client";

import { Check, Clipboard } from "lucide-react";
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
  Children,
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"; // adjust to your actual path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { mergeRefs } from "../lib/merge-refs";

// ---------------------------------------------------------------------------
// useCopyButton
// ---------------------------------------------------------------------------

function useCopyButton(copy: () => void | Promise<void>, timeout = 2000) {
  const [checked, setChecked] = useState(false);

  const onClick = useCallback(async () => {
    await copy();
    setChecked(true);
    window.setTimeout(() => setChecked(false), timeout);
  }, [copy, timeout]);

  return [checked, onClick] as const;
}

// ---------------------------------------------------------------------------
// TabsContext — shared by all CodeBlockTabs children
// ---------------------------------------------------------------------------

interface TabsContextValue {
  containerRef: RefObject<HTMLDivElement | null>;
  nested: boolean;
  // variant axis (undefined when CodeBlockTabs is used without variants)
  variants?: string[];
  activeVariant?: string;
  setActiveVariant?: (v: string) => void;
  availableVariants?: Set<string>;
  availableTabs?: Set<string>;
  existingCombos?: Set<string>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// ---------------------------------------------------------------------------
// CodeBlockProps
// ---------------------------------------------------------------------------

export interface CodeBlockProps extends ComponentProps<"figure"> {
  icon?: ReactNode;
  allowCopy?: boolean;
  keepBackground?: boolean;
  viewportProps?: HTMLAttributes<HTMLElement>;
  "data-line-numbers"?: boolean;
  "data-line-numbers-start"?: number;
  Actions?: (props: { className?: string; children?: ReactNode }) => ReactNode;
}

// ---------------------------------------------------------------------------
// Pre
// ---------------------------------------------------------------------------

export function Pre(props: ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      className={cn("min-w-full w-max *:flex *:flex-col", props.className)}
    >
      {props.children}
    </pre>
  );
}

// ---------------------------------------------------------------------------
// CodeBlock
// ---------------------------------------------------------------------------

export function CodeBlock({
  ref,
  title,
  allowCopy = true,
  keepBackground = false,
  icon,
  viewportProps = {},
  children,
  Actions = (props) => (
    <div {...props} className={cn("empty:hidden", props.className)} />
  ),
  ...props
}: CodeBlockProps) {
  const inTab = use(TabsContext) !== null;
  const areaRef = useRef<HTMLDivElement>(null);

  return (
    <figure
      ref={ref}
      dir="ltr"
      {...props}
      tabIndex={-1}
      className={cn(
        inTab
          ? "bg-fd-secondary -mx-px -mb-px"
          : "my-4 bg-fd-card rounded-square",
        keepBackground && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
        "shiki relative border border-stroke-neutral not-prose overflow-hidden type-code-sm",
        props.className,
      )}
    >
      {title ? (
        <div className="flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          {typeof icon === "string" ? (
            <div
              className="[&_svg]:size-3.5"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : (
            icon
          )}
          <figcaption className="flex-1 truncate">{title}</figcaption>
          {Actions({
            className: "-me-2",
            children: allowCopy && <CopyButton containerRef={areaRef} />,
          })}
        </div>
      ) : (
        Actions({
          className:
            "absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground",
          children: allowCopy && <CopyButton containerRef={areaRef} />,
        })
      )}
      <div
        ref={areaRef}
        {...viewportProps}
        role="region"
        tabIndex={0}
        className={cn(
          "text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring bg-background-default",
          viewportProps.className,
        )}
        style={
          {
            "--padding-right": !title ? "calc(var(--spacing) * 8)" : undefined,
            counterSet: props["data-line-numbers"]
              ? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}`
              : undefined,
            ...viewportProps.style,
          } as object
        }
      >
        {children}
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

function CopyButton({
  className,
  containerRef,
  ...props
}: ComponentProps<"button"> & {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [checked, onClick] = useCopyButton(() => {
    const pre = containerRef.current?.getElementsByTagName("pre").item(0);
    if (!pre) return;
    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
      node.replaceWith("\n");
    });
    void navigator.clipboard.writeText(clone.textContent ?? "");
  });

  return (
    <button
      type="button"
      data-checked={checked || undefined}
      className={cn(
        buttonVariants({
          className:
            "hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground",
          size: "icon-xs",
        }),
        className,
      )}
      aria-label={checked ? "Copied Text" : "Copy Text"}
      onClick={onClick}
      {...props}
    >
      {checked ? <Check /> : <Clipboard />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CodeBlockTabs
// ---------------------------------------------------------------------------

export interface CodeBlockTabsProps extends ComponentProps<typeof Tabs> {
  /**
   * Secondary axis labels rendered as a dropdown on the right of the tab bar.
   * When omitted, CodeBlockTabs behaves exactly as before.
   */
  variants?: string[];
  /** Default selected variant. Falls back to variants[0]. */
  defaultVariant?: string;
}

export function CodeBlockTabs({
  ref,
  variants,
  defaultVariant,
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: CodeBlockTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nested = use(TabsContext) !== null;

  // ── track the active tab ──
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    controlledValue ?? defaultValue ?? "",
  );

  // Use controlled value if provided, otherwise use internal state
  const activeTab = controlledValue ?? internalActiveTab;

  // ── variant state (only when variants are provided) ──
  const [activeVariant, setActiveVariant] = useState<string>(
    defaultVariant ?? variants?.[0] ?? "",
  );

  // Build the set of existing tab+variant combos by inspecting children.
  // We only do this when variants are in use.
  const existingCombos = useMemo<Set<string>>(() => {
    if (!variants) return new Set();
    const s = new Set<string>();
    Children.forEach(children, (child) => {
      const el = child as ReactElement;
      const { value, variant } = (el?.props ?? {}) as {
        value?: string;
        variant?: string;
      };
      if (value && variant) s.add(`${value}__${variant}`);
    });
    return s;
  }, [children, variants]);

  // When the primary tab changes, update the state
  function handleTabChange(tab: string) {
    console.log("handleTabChange called:", { tab, activeTab, activeVariant });
    setInternalActiveTab(tab);
    onValueChange?.(tab);
  }

  // Which variants are available for the currently active tab?
  const availableVariants = useMemo<Set<string>>(() => {
    if (!variants) return new Set();
    const available = new Set(
      variants.filter((v) => existingCombos.has(`${activeTab}__${v}`)),
    );
    console.log("availableVariants calculation:", {
      activeTab,
      variants,
      existingCombos: Array.from(existingCombos),
      available: Array.from(available),
    });
    return available;
  }, [variants, activeTab, existingCombos]);

  // Which tabs are available for the currently selected variant?
  const availableTabs = useMemo<Set<string>>(() => {
    if (!variants) return new Set();
    const allTabs = new Set<string>();
    Children.forEach(children, (child) => {
      const el = child as ReactElement;
      const { value, variant } = (el?.props ?? {}) as {
        value?: string;
        variant?: string;
      };
      if (value && variant === activeVariant) {
        allTabs.add(value);
      }
    });
    return allTabs;
  }, [children, variants, activeVariant]);

  const ctxValue = useMemo<TabsContextValue>(
    () => ({
      containerRef,
      nested,
      variants,
      activeVariant,
      setActiveVariant,
      availableVariants,
      availableTabs,
      existingCombos,
    }),
    [
      nested,
      variants,
      activeVariant,
      availableVariants,
      availableTabs,
      existingCombos,
    ],
  );

  return (
    <Tabs
      ref={mergeRefs(containerRef, ref)}
      {...props}
      value={activeTab}
      defaultValue={defaultValue}
      onValueChange={handleTabChange}
      className={cn(
        "bg-background-default rounded-square border border-stroke-neutral overflow-hidden",
        !nested && "my-4",
        props.className,
      )}
    >
      <TabsContext value={ctxValue}>{children}</TabsContext>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// CodeBlockTabsList
// ---------------------------------------------------------------------------

export function CodeBlockTabsList(props: ComponentProps<typeof TabsList>) {
  const ctx = use(TabsContext);
  const hasVariants = !!ctx?.variants?.length;

  return (
    <TabsList
      {...props}
      className={cn(
        "flex flex-row px-2 overflow-x-auto text-fd-muted-foreground bg-background-default",
        hasVariants && "items-center justify-between pr-2",
        props.className,
      )}
    >
      {/* Tab pills — left side */}
      <div className="flex items-center overflow-x-auto">{props.children}</div>
      {/* Variant dropdown — right side, only rendered when variants exist */}
      {hasVariants && ctx && (
        <Select value={ctx.activeVariant} onValueChange={ctx.setActiveVariant}>
          <SelectTrigger
            className={cn(
              "h-7 min-w-[7rem] shrink-0 border-none bg-transparent px-2 py-0",
              "text-fd-muted-foreground type-text-sm focus:ring-0 focus:ring-offset-0",
              "hover:text-fd-accent-foreground",
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {ctx.variants!.map((v) => (
              <SelectItem
                key={v}
                value={v}
                disabled={!ctx.availableVariants?.has(v)}
                className="type-text-sm"
              >
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </TabsList>
  );
}

// ---------------------------------------------------------------------------
// CodeBlockTabsTrigger
// ---------------------------------------------------------------------------

export function CodeBlockTabsTrigger({
  children,
  ...props
}: ComponentProps<typeof TabsTrigger>) {
  const ctx = use(TabsContext);

  // Check if this tab has content for the currently selected variant
  const isAvailable =
    !ctx?.variants ||
    !ctx?.availableTabs ||
    ctx.availableTabs.has(props.value as string);

  return (
    <TabsTrigger
      {...props}
      disabled={!isAvailable}
      className={cn(
        "relative group inline-flex type-text-sm-strong text-nowrap items-center transition-colors gap-2 px-2 py-1.5 hover:text-fd-accent-foreground data-[state=active]:text-fd-primary [&_svg]:size-3.5",
        !isAvailable && "opacity-50 cursor-not-allowed",
        props.className,
      )}
    >
      <div className="absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary" />
      {children}
    </TabsTrigger>
  );
}

// ---------------------------------------------------------------------------
// CodeBlockTab
// ---------------------------------------------------------------------------

export interface CodeBlockTabProps extends ComponentProps<typeof TabsContent> {
  /**
   * When inside a multi-axis CodeBlockTabs, declare which variant this
   * content belongs to. Content is only rendered when both the parent tab
   * is active AND this variant matches the dropdown selection.
   */
  variant?: string;
}

export function CodeBlockTab({
  variant,
  children,
  ...props
}: CodeBlockTabProps) {
  const ctx = use(TabsContext);

  // If this tab has a variant declared, only render its children when the
  // active variant matches. The TabsContent visibility is still controlled
  // by Radix (active tab), so we only gate the inner content.
  const variantMatch =
    !variant || !ctx?.variants || ctx.activeVariant === variant;

  return <TabsContent {...props}>{variantMatch ? children : null}</TabsContent>;
}
