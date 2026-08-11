"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatTag } from "@/lib/format";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { cn } from "@prisma-docs/ui/lib/cn";

/**
 * Chip states: selected is an ink pill (the same ink the primary button and
 * the current pagination page use), unselected is a ghost pill on a hairline.
 * Unselected hover takes the docs shell's accent wash — `fd-accent` /
 * `fd-accent-foreground` are the very variables the docs sidebar and tabs
 * hover with (cyan-100/cyan-700 light, cyan-950/cyan-300 dark), remapped in
 * this app's global.css — so pointing at a chip here feels like pointing at a
 * docs nav item.
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
  onChange?: (category: string) => void;
  className?: string;
};

export function CategoryTagFilter({
  uniqueTags,
  currentCategory,
  onChange,
  className,
}: CategoryTagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const desktopClassName = ["hidden", "md:flex", className].filter(Boolean).join(" ");

  const handleSelect = (category: string) => {
    const nextCategory =
      category === "show-all" || currentCategory === category ? "show-all" : category;

    if (nextCategory !== currentCategory) {
      if (onChange) {
        onChange(nextCategory);
      } else {
        const params = new URLSearchParams(searchParams.toString());

        if (nextCategory === "show-all") {
          params.delete("tag");
        } else {
          params.set("tag", nextCategory);
        }

        params.delete("page");

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className="md:hidden w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="inline-flex w-full items-center justify-between rounded-circle border border-stroke-neutral bg-background-default px-4 py-2 text-sm text-foreground-neutral shadow-box-low transition-colors duration-300 hover:bg-fd-accent dark:bg-background-neutral-weak motion-reduce:transition-none">
            <span className="capitalize">{formatTag(currentCategory)}</span>
            <ChevronDown className="size-4 text-foreground-neutral-weak" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[calc(100vw-2rem)] max-w-sm rounded-square-high p-2"
          >
            <div className="flex flex-col">
              <button
                key="show-all"
                type="button"
                aria-pressed={currentCategory === "show-all"}
                onClick={() => handleSelect("show-all")}
                className="inline-flex w-full items-center gap-2 rounded-square px-2 py-2 text-left text-sm capitalize transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground motion-reduce:transition-none"
              >
                <Check
                  className={`size-4 ${
                    currentCategory === "show-all" ? "opacity-100 text-foreground-ppg" : "opacity-0"
                  }`}
                />
                <span>Show all</span>
              </button>
              {uniqueTags.map((category, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={currentCategory === category}
                  onClick={() => handleSelect(category)}
                  className="inline-flex w-full items-center gap-2 rounded-square px-2 py-2 text-left text-sm capitalize transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground motion-reduce:transition-none"
                >
                  <Check
                    className={`size-4 ${
                      currentCategory === category ? "opacity-100 text-foreground-ppg" : "opacity-0"
                    }`}
                  />
                  <span>{formatTag(category)}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className={desktopClassName}>
        {uniqueTags.map((category, idx) => {
          const isSelected = currentCategory === category;
          return (
            <button
              key={idx}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(category)}
              className={cn(chipBase, isSelected ? chipSelected : chipUnselected)}
            >
              {formatTag(category)}
            </button>
          );
        })}
      </div>
    </>
  );
}
