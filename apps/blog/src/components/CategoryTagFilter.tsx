import { formatTag } from "@/lib/format";
import { cn } from "@prisma-docs/ui/lib/cn";
import { buildListingHref, SHOW_ALL } from "@/lib/blog-listing";
import { CategoryTagFilterMobile, type TagChoice } from "./CategoryTagFilterMobile";

/**
 * Chip states: selected is an ink pill (the same ink the primary button and
 * the current pagination page use), unselected is a ghost pill on a hairline.
 * Unselected hover takes the docs shell's accent wash — `fd-accent` /
 * `fd-accent-foreground` are the very variables the docs sidebar and tabs
 * hover with (cyan-100/cyan-700 light, cyan-950/cyan-300 dark), remapped in
 * this app's global.css — so pointing at a chip here feels like pointing at a
 * docs nav item.
 *
 * The chips used to be `<button>`s that pushed a `?tag=` query at the router,
 * which meant the tag listings existed only after hydration and were
 * `Disallow`ed in robots.txt. They are anchors to `/blog/tag/<tag>` now;
 * clicking the selected chip still clears the filter, because its href points
 * back at `/blog`.
 */
const chipBase =
  "inline-flex cursor-pointer items-center rounded-circle border px-3 py-1.5 text-sm font-medium capitalize whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none";
const chipSelected =
  "border-transparent bg-background-neutral-reverse-strong text-foreground-neutral-reverse shadow-box-low hover:bg-background-neutral-reverse";
const chipUnselected =
  "border-stroke-neutral bg-transparent text-foreground-neutral-weak hover:border-stroke-ppg-weak hover:bg-fd-accent hover:text-fd-accent-foreground";

type CategoryTagFilterProps = {
  uniqueTags: string[];
  currentCategory: string;
  className?: string;
};

export function CategoryTagFilter({
  uniqueTags,
  currentCategory,
  className,
}: CategoryTagFilterProps) {
  const desktopClassName = ["hidden", "md:flex", className].filter(Boolean).join(" ");

  const choices: TagChoice[] = [
    { value: SHOW_ALL, href: buildListingHref(undefined, 1) },
    ...uniqueTags.map((tag) => ({ value: tag, href: buildListingHref(tag, 1) })),
  ];

  return (
    <>
      <div className="md:hidden w-full">
        <CategoryTagFilterMobile choices={choices} currentCategory={currentCategory} />
      </div>

      <div className={desktopClassName}>
        {uniqueTags.map((category) => {
          const isSelected = currentCategory === category;
          return (
            <a
              key={category}
              // Re-clicking the active chip clears the filter, the toggle the
              // button version had.
              href={buildListingHref(isSelected ? undefined : category, 1)}
              aria-current={isSelected ? "page" : undefined}
              className={cn(chipBase, isSelected ? chipSelected : chipUnselected)}
            >
              {formatTag(category)}
            </a>
          );
        })}
      </div>
    </>
  );
}
