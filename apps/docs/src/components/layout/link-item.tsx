"use client";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";
import { usePathname } from "fumadocs-core/framework";
import { isActive, isActiveAny } from "../../lib/urls";
import { getUtmParams, hasUtmParams } from "@prisma-docs/ui/lib/utm";
import Link from "fumadocs-core/link";

function useUtmHref(base: string): string {
  const [href, setHref] = useState(base);
  useEffect(() => {
    const utm = getUtmParams(new URLSearchParams(window.location.search));
    if (!hasUtmParams(utm)) {
      setHref(base);
      return;
    }
    try {
      const isAbsolute = base.startsWith("http");
      const url = isAbsolute ? new URL(base) : new URL(base, "https://n.co");
      for (const [key, value] of Object.entries(utm)) {
        url.searchParams.set(key, value);
      }
      setHref(isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`);
    } catch {
      setHref(base);
    }
  }, [base]);
  return href;
}

interface Filterable {
  /**
   * Restrict where the item is displayed
   *
   * @defaultValue 'all'
   */
  on?: "menu" | "nav" | "all";
}

interface WithHref {
  url: string;
  /**
   * When the item is marked as active
   *
   * @defaultValue 'url'
   */
  active?: "url" | "nested-url" | "none";
  /**
   * Optional list of paths that make this link active (exact or nested).
   * Use for catch-all links that should be active on e.g. `/`, `/prisma-orm/*`, `/prisma-postgres/*`.
   * When set, this overrides the default active behavior based on `url` and `active`.
   */
  activePaths?: string[];
  external?: boolean;
}

export interface MainItemType extends WithHref, Filterable {
  type?: "main";
  icon?: ReactNode;
  text: ReactNode;
  description?: ReactNode;
}

export interface IconItemType extends WithHref, Filterable {
  type: "icon";
  /**
   * `aria-label` of icon button
   */
  label?: string;
  icon: ReactNode;
  text: ReactNode;
  /**
   * @defaultValue true
   */
  secondary?: boolean;
}

export interface ButtonItemType extends WithHref, Filterable {
  type: "button";
  icon?: ReactNode;
  text: ReactNode;
  /**
   * @defaultValue false
   */
  secondary?: boolean;
}

export interface MenuItemType extends Partial<WithHref>, Filterable {
  type: "menu";
  icon?: ReactNode;
  text: ReactNode;

  items: (
    | (MainItemType & {
        /**
         * Options when displayed on navigation menu
         */
        menu?: ComponentProps<"a"> & {
          banner?: ReactNode;
        };
      })
    | CustomItemType
  )[];

  /**
   * @defaultValue false
   */
  secondary?: boolean;
}

export interface CustomItemType extends Filterable {
  type: "custom";
  /**
   * @defaultValue false
   */
  secondary?: boolean;
  children: ReactNode;
}

export type LinkItemType =
  | MainItemType
  | IconItemType
  | ButtonItemType
  | MenuItemType
  | CustomItemType;

export function LinkItem({
  ref,
  item,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { item: WithHref }) {
  const pathname = usePathname();
  const activeType = item.active ?? "url";
  const active = item.activePaths
    ? isActiveAny(item.activePaths, pathname)
    : activeType !== "none" && isActive(item.url, pathname, activeType === "nested-url");

  const href = useUtmHref(item.url);

  return (
    <Link ref={ref} href={href} external={item.external} {...props} data-active={active}>
      {props.children}
    </Link>
  );
}
