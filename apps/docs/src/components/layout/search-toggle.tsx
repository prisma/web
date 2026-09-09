"use client";
import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { useSearchContext } from "@fumadocs/base-ui/contexts/search";
import { useTranslations } from "@fuma-translate/react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { type ButtonProps, buttonVariants } from "../ui/button";

interface SearchToggleProps extends Omit<ComponentProps<"button">, "color">, ButtonProps {
  hideIfDisabled?: boolean;
}

export function SearchToggle({
  hideIfDisabled,
  size = "icon-sm",
  color = "ghost",
  ...props
}: SearchToggleProps) {
  const { setOpenSearch, enabled } = useSearchContext();
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          size,
          color,
        }),
        props.className,
      )}
      data-search=""
      aria-label="Open Search"
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search />
    </button>
  );
}

export function LargeSearchToggle({
  hideIfDisabled,
  showLabel = true,
  ...props
}: ComponentProps<"button"> & {
  hideIfDisabled?: boolean;
  /**
   * Render the "Search" word next to the icon. The docs navbar turns it off so
   * the trigger collapses to icon + shortcut, sized like the Ask AI pill
   * beside it.
   */
  showLabel?: boolean;
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const t = useTranslations({ note: "search trigger" });
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      aria-label={showLabel ? undefined : "Open Search"}
      {...props}
      className={cn(
        // The navbar's pill: hairline ring on a paper wash, kbd chips squared
        // off inside it so the shapes read as nested rather than repeated.
        "inline-flex items-center gap-2 rounded-full border border-stroke-neutral bg-fd-secondary/50 text-sm text-fd-muted-foreground transition-colors duration-300 hover:bg-fd-accent hover:text-fd-accent-foreground motion-reduce:transition-none",
        // Labelled: a wide field that stretches with its container. Unlabelled:
        // the same 32px pill geometry as the Ask AI button.
        showLabel ? "p-1.5 ps-3" : "h-8 px-3",
        props.className,
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search className="size-4" />
      {showLabel && t("Search")}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd key={i} className="rounded-md border border-stroke-neutral bg-fd-background px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  );
}
