"use client";
import { cn } from "@prisma-docs/ui/lib/cn";
import {
  type ComponentProps,
  createContext,
  Fragment,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  use,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSidebar } from "../sidebar/base";
import { ChevronDown } from "lucide-react";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { useIsScrollTop } from "@fumadocs/base-ui/utils/use-is-scroll-top";
import { isLinkItemVisibleOn } from "../link-item-visibility";
import { LinkItem, type LinkItemType, type MainItemType, type MenuItemType } from "../link-item";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

export const LayoutContext = createContext<{
  isNavTransparent: boolean;
} | null>(null);

export const SidebarEnabledContext = createContext<boolean>(true);

export const SidebarEnabledSetterContext = createContext<(enabled: boolean) => void>(() => {});

/**
 * Renders children only when the sidebar is enabled (layout + page). Use in the navbar
 * so that sidebar toggles hide when a page sets DocsPage sidebar={{ enabled: false }}.
 */
export function SidebarEnabledGate({ children }: { children: ReactNode }) {
  const enabled = use(SidebarEnabledContext);
  if (!enabled) return null;
  return <>{children}</>;
}

/**
 * Client provider that merges layout sidebar.enabled with the page's choice (from DocsPage).
 * Layout wraps content in this; DocsPage syncs via the setter so the page can hide the sidebar.
 */
export function SidebarEnabledFromPageProvider({
  layoutEnabled,
  children,
}: {
  layoutEnabled: boolean;
  children: ReactNode;
}) {
  const [pageEnabled, setPageEnabled] = useState(true);
  const effective = layoutEnabled && pageEnabled;
  const setter = useMemo(() => (enabled: boolean) => setPageEnabled(enabled), []);
  return (
    <SidebarEnabledSetterContext.Provider value={setter}>
      <SidebarEnabledContext.Provider value={effective}>{children}</SidebarEnabledContext.Provider>
    </SidebarEnabledSetterContext.Provider>
  );
}

export interface LayoutInfo {}

export function LayoutContextProvider({
  navTransparentMode = "none",
  children,
}: {
  navTransparentMode?: "always" | "top" | "none";
  children: ReactNode;
}) {
  const isTop = useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
  const isNavTransparent = navTransparentMode === "top" ? isTop : navTransparentMode === "always";

  return (
    <LayoutContext
      value={useMemo(
        () => ({
          isNavTransparent,
        }),
        [isNavTransparent],
      )}
    >
      {children}
    </LayoutContext>
  );
}

export function LayoutHeader(props: ComponentProps<"header">) {
  const { open } = useSidebar();
  const { isNavTransparent } = use(LayoutContext)!;

  return (
    <header data-transparent={isNavTransparent && !open} {...props}>
      {props.children}
    </header>
  );
}

export function LayoutBody({ className, style, children, ...props }: ComponentProps<"div">) {
  const { collapsed } = useSidebar();
  const sidebarEnabled = use(SidebarEnabledContext);
  const pageCol =
    "calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-col) - var(--fd-toc-width))";
  const sidebarCol = !sidebarEnabled || collapsed ? "0px" : "var(--fd-sidebar-width)";

  return (
    <div
      id="nd-notebook-layout"
      className={cn(
        "grid overflow-x-clip min-h-(--fd-docs-height) transition-[grid-template-columns] auto-cols-auto auto-rows-auto [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px]",
        className,
      )}
      style={
        {
          gridTemplate: `". header header header ."
        "sidebar sidebar toc-popover toc-popover ."
        "sidebar sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, ${pageCol}) var(--fd-toc-width) minmax(min-content, 1fr)`,
          "--fd-docs-row-1": "var(--fd-banner-height, 0px)",
          "--fd-docs-row-2": "calc(var(--fd-docs-row-1) + var(--fd-header-height))",
          "--fd-docs-row-3": "calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))",
          "--fd-sidebar-col": sidebarCol,
          ...style,
        } as object
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function LayoutHeaderTabs({
  links,
  className,
  ...props
}: ComponentProps<"div"> & {
  links: LinkItemType[];
}) {
  const items = useMemo(() => {
    const visibleItems = links.filter(
      (item) =>
        item.type !== "icon" &&
        item.type !== "custom" &&
        item.type !== "button" &&
        isLinkItemVisibleOn(item, "menu"),
    );

    if (
      visibleItems.length <= 6 ||
      visibleItems.some((item): item is Extract<LinkItemType, { type: "menu" }> => item.type === "menu")
    ) {
      return visibleItems;
    }

    const primaryItems = visibleItems.slice(0, 5);
    const overflowItems = visibleItems
      .slice(5)
      .filter((item): item is MainItemType => "url" in item && item.type !== "menu" && item.type !== "button");

    return [
      ...primaryItems,
      {
        type: "menu",
        text: "More",
        items: overflowItems,
      } satisfies MenuItemType,
    ];
  }, [links]);

  return (
    <div className={cn("flex flex-row items-end gap-6", className)} {...props}>
      {items.map((item, i) => {
        if ((item as any)?.type === "custom") {
          return <span key={i}>{(item as any).children}</span>;
        }

        if ((item as any)?.type === "menu") {
          return (
            <NavbarLinkItemMenu
              key={i}
              item={item as MenuItemType}
              className={cn(
                "inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground",
              )}
            />
          );
        }

        if ("url" in (item as any)) {
          return (
            <LinkItem
              key={i}
              item={item as any}
              className={cn(
                "inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground",
                "data-[active=true]:border-fd-primary data-[active=true]:text-fd-primary",
              )}
            >
              {"text" in item ? (item as any).text : null}
            </LinkItem>
          );
        }

        return null;
      })}
    </div>
  );
}

export function NavbarLinkItem({
  item,
  className,
  ...props
}: { item: LinkItemType } & HTMLAttributes<HTMLElement>) {
  if (item.type === "custom") return item.children;

  if (item.type === "menu") {
    return <NavbarLinkItemMenu item={item} className={className} {...props} />;
  }

  return (
    <LinkItem
      item={item}
      className={cn(
        "text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary",
        className,
      )}
      {...props}
    >
      {item.text}
    </LinkItem>
  );
}

function NavbarLinkItemMenu({
  item,
  hoverDelay = 50,
  className,
  ...props
}: { item: MenuItemType; hoverDelay?: number } & HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number>(null);
  const freezeUntil = useRef<number>(null);

  const delaySetOpen = (value: boolean) => {
    window.clearTimeout(timeoutRef.current ?? undefined);
    timeoutRef.current = window.setTimeout(() => {
      setOpen(value);
    }, hoverDelay);
  };

  const handlePointerEnter = () => {
    if (freezeUntil.current && performance.now() < freezeUntil.current) return;
    delaySetOpen(true);
  };

  const handlePointerLeave = () => {
    delaySetOpen(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") {
      freezeUntil.current = performance.now() + 500;
    }
  };

  const pathname = usePathname();
  const active =
    item.items.some(
      (child) => "url" in child && (child.url === pathname || pathname.startsWith(`${child.url}/`)),
    ) ||
    (typeof item.url === "string" &&
      (pathname === item.url || pathname.startsWith(`${item.url}/`)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary",
          active && "text-fd-primary",
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        {...props}
      >
        {item.text}
        <ChevronDown className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="min-w-52 p-1"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="flex flex-col">
          {item.items.map((child, index) => (
            <Fragment
              key={`${"text" in child && typeof child.text === "string" ? child.text : "item"}-${index}`}
            >
              <NavbarLinkItem
                item={child}
                className="rounded-md px-3 py-2 hover:bg-fd-accent data-[active=true]:bg-fd-accent"
              />
            </Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
