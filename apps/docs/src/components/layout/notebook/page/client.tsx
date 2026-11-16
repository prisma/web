"use client";

import {
  type ComponentProps,
  createContext,
  Fragment,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import Link from "fumadocs-core/link";
import { cn } from "@prisma-docs/ui/lib/cn";
import { useTranslations } from "@fuma-translate/react";
import { useTreeContext, useTreePath } from "@fumadocs/base-ui/contexts/tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { usePathname } from "fumadocs-core/framework";
import { type BreadcrumbOptions, getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
import { formatSlugDisplayName } from "@/lib/breadcrumb-utils";
import { sentenceCase } from "@/lib/sentence-case";
import { getPageTitleText } from "@/lib/page-title";
import { getVersionedSidebarTree } from "@/lib/versioned-sidebar-tree";
import { isActive } from "../../../../lib/urls";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../ui/collapsible";
import { useTOCItems } from "../../../toc";
import { stripTocLinks } from "@/lib/toc-title";
import { useActiveAnchor } from "fumadocs-core/toc";
import { LayoutContext, SidebarEnabledSetterContext } from "../client";
import { flattenTree } from "fumadocs-core/page-tree";

const TocPopoverContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function formatBreadcrumbName(name: ReactNode) {
  const text = getPageTitleText(name);

  if (text.includes("-") || text.includes("_") || text === text.toLowerCase()) {
    return formatSlugDisplayName(text);
  }

  return text;
}

/**
 * Syncs DocsPage sidebar.enabled to the layout so the page can hide the sidebar.
 * Renders nothing; resets to enabled on unmount.
 */
export function SidebarEnabledSync({ enabled = true }: { enabled?: boolean }) {
  const setEnabled = use(SidebarEnabledSetterContext);
  useEffect(() => {
    setEnabled(enabled);
    return () => setEnabled(true);
  }, [enabled, setEnabled]);
  return null;
}

export function PageTOCPopover({ className, children, ...rest }: ComponentProps<"div">) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = use(LayoutContext)!;

  const onClick = useEffectEvent((e: Event) => {
    if (!open) return;

    if (ref.current && !ref.current.contains(e.target as HTMLElement)) setOpen(false);
  });

  useEffect(() => {
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <TocPopoverContext
      value={useMemo(
        () => ({
          open,
          setOpen,
        }),
        [setOpen, open],
      )}
    >
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        data-toc-popover=""
        className={cn(
          "sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]",
          className,
        )}
        {...rest}
      >
        <header
          ref={ref}
          className={cn(
            // Hairline stays; when the panel drops open it becomes a card —
            // brand radius on the two bottom corners only, since the strip is
            // full-bleed and pinned under the header.
            "border-b border-stroke-neutral backdrop-blur-sm transition-colors duration-300 motion-reduce:transition-none",
            (!isNavTransparent || open) && "bg-fd-background/80",
            // Open panel goes fully opaque: at 80% the page ghosts through the
            // rows and the panel's bottom edge, hurting scanability.
            open && "bg-fd-background rounded-b-(--radius-square-high) shadow-lg",
          )}
        >
          {children}
        </header>
      </Collapsible>
    </TocPopoverContext>
  );
}

export function PageTOCPopoverTrigger({ className, ...props }: ComponentProps<"button">) {
  const t = useTranslations({ note: "table of contents" });
  const { open } = use(TocPopoverContext)!;
  const items = useTOCItems();
  const active = useActiveAnchor();
  const selected = useMemo(
    () => items.findIndex((item) => active === item.url.slice(1)),
    [items, active],
  );
  const path = useTreePath().at(-1);
  const showItem = selected !== -1 && !open;

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full h-10 items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6",
        className,
      )}
      data-toc-popover-trigger=""
      {...props}
    >
      <ProgressCircle
        value={(selected + 1) / Math.max(1, items.length)}
        max={1}
        className={cn("shrink-0", open && "text-fd-primary")}
      />
      <span className="grid flex-1 *:my-auto *:row-start-1 *:col-start-1">
        <span
          className={cn(
            "truncate transition-all",
            open && "text-fd-foreground",
            showItem && "opacity-0 -translate-y-full pointer-events-none",
          )}
        >
          {path?.name ?? t("On this page")}
        </span>
        <span
          className={cn(
            "truncate transition-all",
            !showItem && "opacity-0 translate-y-full pointer-events-none",
          )}
        >
          {/* Anchors are unwrapped: the trigger is a <button>, and a heading that
              contains a link would otherwise nest an <a> inside it with a
              basePath-less href. */}
          {stripTocLinks(items[selected]?.title)}
        </span>
      </span>
      <ChevronDown className={cn("shrink-0 transition-transform mx-0.5", open && "rotate-180")} />
    </CollapsibleTrigger>
  );
}

interface ProgressCircleProps extends Omit<React.ComponentProps<"svg">, "strokeWidth"> {
  value: number;
  strokeWidth?: number;
  size?: number;
  min?: number;
  max?: number;
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min;
  if (input > max) return max;
  return input;
}

function ProgressCircle({
  value,
  strokeWidth = 2,
  size = 24,
  min = 0,
  max = 100,
  ...restSvgProps
}: ProgressCircleProps) {
  const normalizedValue = clamp(value, min, max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedValue / max) * circumference;
  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: "none",
    strokeWidth,
  };

  return (
    <svg
      role="progressbar"
      viewBox={`0 0 ${size} ${size}`}
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      {...restSvgProps}
    >
      <circle {...circleProps} className="stroke-current/25" />
      <circle
        {...circleProps}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all"
      />
    </svg>
  );
}

export function PageTOCPopoverContent(props: ComponentProps<"div">) {
  return (
    <CollapsibleContent
      data-toc-popover-content=""
      {...props}
      className={cn("flex flex-col px-4 max-h-[50vh] md:px-6", props.className)}
    >
      {props.children}
    </CollapsibleContent>
  );
}

export function PageLastUpdate({
  date: value,
  ...props
}: Omit<ComponentProps<"p">, "children"> & { date: Date }) {
  const t = useTranslations({ note: "page footer" });
  const [date, setDate] = useState("");

  useEffect(() => {
    // In the reader's timezone, written out ("9 November 2026") so it never
    // reads as month-first or day-first ("09/11/2026").
    setDate(value.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, [value]);

  return (
    <p {...props} className={cn("text-sm text-fd-muted-foreground", props.className)}>
      {t("Updated")} {date}
    </p>
  );
}

type Item = Pick<PageTree.Item, "name" | "description" | "url">;
export interface FooterProps extends ComponentProps<"div"> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function PageFooter({ items, children, className, ...props }: FooterProps) {
  const pathname = usePathname();
  const { root } = useTreeContext();
  const footerList = useMemo(() => {
    const tree = getVersionedSidebarTree(root as PageTree.Root, pathname);
    return flattenTree(tree.children).filter((item) => !item.external);
  }, [pathname, root]);
  const { previous, next } = useMemo(() => {
    if (items) return items;

    const idx = footerList.findIndex((item) => isActive(item.url, pathname, false));

    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1],
    };
  }, [footerList, items, pathname]);

  return (
    <>
      {(previous || next) && (
        // Two columns whether or not both links exist, so "next" always sits
        // on the right and "previous" on the left; one column on phones.
        <div className={cn("@container grid gap-x-8 sm:grid-cols-2", className)} {...props}>
          {previous ? <FooterItem item={previous} index={0} /> : <span className="max-sm:hidden" />}
          {next && <FooterItem item={next} index={1} />}
        </div>
      )}
      {children}
    </>
  );
}

/**
 * Previous / next page: a plain link on a hairline (the same treatment as the
 * landing page's docs index), not a filled card. Hover underlines the title
 * and nudges the arrow; no colour fill.
 */
function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
  const t = useTranslations({ note: "pagination" });
  const Icon = index === 0 ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={item.url}
      className={cn(
        "group block rounded-sm border-t pt-4 pb-5 outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60",
        index === 1 && "sm:text-end",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-6 text-fd-foreground",
          index === 0 && "flex-row-reverse",
        )}
      >
        <span className="decoration-fd-foreground/35 underline-offset-4 group-hover:underline">
          {item.name}
        </span>
        <Icon
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-150 motion-reduce:transition-none rtl:rotate-180",
            index === 0 ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5",
          )}
        />
      </span>
      <span className="mt-1 block truncate text-sm leading-6 text-fd-muted-foreground">
        {item.description ?? (index === 0 ? t("Previous Page") : t("Next Page"))}
      </span>
    </Link>
  );
}

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<"div">;

function breadcrumbLabel(name: ReactNode) {
  const label = formatBreadcrumbName(name);
  return typeof label === "string" ? sentenceCase(label) : label;
}

export function PageBreadcrumb({
  includeRoot,
  includeSeparator,
  includePage,
  ...props
}: BreadcrumbProps) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage,
      includeSeparator,
      includeRoot,
    });
  }, [includePage, includeRoot, includeSeparator, path, root]);

  if (items.length === 0) return null;

  return (
    <div
      {...props}
      className={cn("flex items-center gap-1.5 text-sm text-fd-muted-foreground", props.className)}
    >
      {items.map((item, i) => {
        // The path above the title (Supabase-style): quiet links with
        // chevrons, the nearest group a step darker. Ink, not the theme cyan.
        const className = cn(
          "truncate",
          i === items.length - 1 && "font-medium text-fd-foreground/75",
        );

        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
            {item.url ? (
              <Link
                href={item.url}
                className={cn(className, "transition-colors hover:text-fd-foreground")}
              >
                {breadcrumbLabel(item.name)}
              </Link>
            ) : (
              <span className={className}>{breadcrumbLabel(item.name)}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
