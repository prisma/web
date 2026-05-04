"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import { usePathname } from "fumadocs-core/framework";
import { cn } from "@prisma-docs/ui/lib/cn";
import { normalize, isActive, isActiveAny } from "../../../../lib/urls";
import { useSidebar } from "../base";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import type { SidebarTab } from "./index";
import type { LinkItemType } from "../../link-item";
import { LinkItem } from "../../link-item";

export interface SidebarTabWithProps extends SidebarTab {
  props?: ComponentProps<"a">;
}

export function SidebarTabsDropdown({
  links,
  placeholder,
  ...props
}: {
  placeholder?: ReactNode;
  links: LinkItemType[];
} & ComponentProps<"button">) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function hasUrl(item: LinkItemType): item is LinkItemType & { url: string } {
    return "url" in item && typeof (item as any).url === "string" && !!(item as any).url;
  }
  function isMenu(item: LinkItemType): item is Extract<LinkItemType, { type: "menu" }> {
    return (item as any)?.type === "menu";
  }

  const options = useMemo(() => {
    return links.filter((item) => item.type !== "icon" && (hasUrl(item) || isMenu(item)));
  }, [links]);

  const isLinkActive = (item: LinkItemType & { url: string }) => {
    const activePaths = (item as any).activePaths as string[] | undefined;
    if (activePaths?.length) {
      return isActiveAny(activePaths, pathname);
    }
    const activeMode = (item as any).active ?? "url";
    return isActive(item.url, pathname, activeMode === "nested-url");
  };
  const isMenuAnyChildActive = (item: Extract<LinkItemType, { type: "menu" }>) => {
    for (const child of item.items) {
      if ("url" in child && child.url && isLinkActive(child as any)) return true;
    }
    return false;
  };

  const selected = useMemo(() => {
    return options.findLast((item) =>
      hasUrl(item) ? isLinkActive(item) : isMenu(item) && isMenuAnyChildActive(item),
    );
  }, [options, pathname]);

  const onClick = () => setOpen(false);

  const item = selected ? (
    <>
      {"icon" in selected && (selected as any).icon && (
        <div className="size-9 shrink-0 empty:hidden md:size-5">{selected.icon}</div>
      )}
      <div>
        <p className="text-sm font-medium">{"text" in selected ? (selected as any).text : null}</p>
        <p className="text-sm text-fd-muted-foreground empty:hidden md:hidden">
          {"description" in selected ? (selected as any).description : null}
        </p>
      </div>
    </>
  ) : (
    placeholder
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {item && (
        <PopoverTrigger
          {...props}
          className={cn(
            "flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-open:bg-fd-accent data-open:text-fd-accent-foreground",
            props.className,
          )}
        >
          {item}
          <ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
        </PopoverTrigger>
      )}
      <PopoverContent className="flex flex-col gap-1 w-(--anchor-width) p-1 fd-scroll-container">
        {options.map((opt, idx) => {
          if (hasUrl(opt)) {
            const active = selected && hasUrl(selected as any) && opt.url === (selected as any).url;
            return (
              <LinkItem
                key={`${opt.url}-${idx}`}
                item={opt as any}
                onClick={onClick}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground",
                )}
              >
                {"icon" in opt && (opt as any).icon && (
                  <div className="shrink-0 size-9 md:mb-auto md:size-5 empty:hidden">
                    {(opt as any).icon}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium leading-none">
                    {"text" in opt ? (opt as any).text : null}
                  </p>
                  <p className="text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden">
                    {"description" in opt ? (opt as any).description : null}
                  </p>
                </div>

                <Check
                  className={cn(
                    "shrink-0 ms-auto size-3.5 text-fd-primary",
                    !active && "invisible",
                  )}
                />
              </LinkItem>
            );
          }

          if (isMenu(opt)) {
            return (
              <div key={`menu-${idx}`} className="flex flex-col gap-1.5">
                <div className="px-1 pt-1 text-[0.8125rem] font-medium text-fd-muted-foreground">
                  {opt.text}
                </div>
                {opt.items.map((child, cIdx) => {
                  if (!("url" in child) || !child.url) return null;
                  const childActive = isLinkActive(child as any);
                  return (
                    <LinkItem
                      key={`${child.url}-${cIdx}`}
                      item={child as any}
                      onClick={onClick}
                      className={cn(
                        "flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground",
                      )}
                    >
                      {"icon" in child && (child as any).icon && (
                        <div className="shrink-0 size-9 md:mb-auto md:size-5 empty:hidden">
                          {(child as any).icon}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {"text" in child ? (child as any).text : null}
                        </p>
                        <p className="text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden">
                          {"description" in child ? (child as any).description : null}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "shrink-0 ms-auto size-3.5 text-fd-primary",
                          !childActive && "invisible",
                        )}
                      />
                    </LinkItem>
                  );
                })}
              </div>
            );
          }

          return null;
        })}
      </PopoverContent>
    </Popover>
  );
}

export function isTabActive(tab: SidebarTab, pathname: string) {
  if (tab.urls) return tab.urls.has(normalize(pathname));

  return isActive(tab.url, pathname, true);
}
