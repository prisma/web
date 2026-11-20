"use client";
import { type ComponentProps, Fragment } from "react";
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
  field,
  ...props
}: ComponentProps<"button"> & {
  hideIfDisabled?: boolean;
  /**
   * Render the "Search" word next to the icon. The docs navbar turns it off so
   * the trigger collapses to icon + shortcut, sized like the Ask AI pill
   * beside it.
   */
  showLabel?: boolean;
  /**
   * Render as the navbar's one field instead of a pill: this placeholder
   * text, the shortcut as a single quiet chip ("⌘K", not one box per key),
   * and the field filling the width its container gives it.
   */
  field?: { placeholder: string };
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const t = useTranslations({ note: "search trigger" });
  if (hideIfDisabled && !enabled) return null;

  if (field) {
    return (
      <button
        type="button"
        data-search-full=""
        {...props}
        className={cn(
          // A field, not a button: hairline edge on the page colour, muted
          // placeholder, and a hover that only firms the edge.
          "inline-flex h-9 w-full items-center gap-2.5 rounded-full border border-stroke-neutral bg-fd-background ps-3.5 pe-1.5 text-sm text-fd-muted-foreground transition-colors duration-[120ms] hover:border-fd-foreground/20 hover:duration-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary motion-reduce:transition-none",
          props.className,
        )}
        onClick={() => {
          setOpenSearch(true);
        }}
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 grow truncate text-start">{field.placeholder}</span>
        <kbd
          // Sans, not mono: the ⌘ glyph in the mono face renders too small
          // to read at a glance.
          className="inline-flex h-6 shrink-0 items-center rounded-full bg-fd-foreground/[0.06] px-2.5 font-sans text-xs font-medium text-fd-foreground/75"
          aria-hidden="true"
        >
          {/* One chip for the whole shortcut: "⌘K" on Mac, "Ctrl+K" where a
              key is named by a word rather than a glyph. */}
          {hotKey.map((k, i) => (
            <Fragment key={i}>
              {i > 0 &&
                hotKey.some((key) => typeof key.display === "string" && key.display.length > 1) &&
                "+"}
              {k.display}
            </Fragment>
          ))}
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      data-search-full=""
      aria-label={showLabel ? undefined : t("Search")}
      {...props}
      className={cn(
        // The navbar's pill: hairline ring on a paper wash, kbd chips squared
        // off inside it so the shapes read as nested rather than repeated.
        "quiet-hover inline-flex items-center gap-2 rounded-full border border-stroke-neutral bg-fd-secondary/50 text-sm",
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
