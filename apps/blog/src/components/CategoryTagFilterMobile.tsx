"use client";

import { useState } from "react";
import { formatTag } from "@/lib/format";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { SHOW_ALL } from "@/lib/blog-listing";

export type TagChoice = {
  /** Tag slug, or `show-all`. */
  value: string;
  /** `/blog`-prefixed URL of that tag's listing page. */
  href: string;
};

/**
 * The mobile tag picker.
 *
 * The only client state left in the filter row: the popover is open or it is
 * not. Every choice inside it is a real `<a href>` to a server-rendered tag
 * route, so the list is crawlable and works before hydration — the picker used
 * to `router.replace()` a `?tag=` query instead.
 */
export function CategoryTagFilterMobile({
  choices,
  currentCategory,
}: {
  choices: TagChoice[];
  currentCategory: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
          {choices.map((choice) => {
            const isSelected = currentCategory === choice.value;
            return (
              <a
                key={choice.value}
                href={choice.href}
                aria-current={isSelected ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full items-center gap-2 rounded-square px-2 py-2 text-left text-sm capitalize transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground motion-reduce:transition-none"
              >
                <Check
                  className={`size-4 ${
                    isSelected ? "opacity-100 text-foreground-ppg" : "opacity-0"
                  }`}
                />
                <span>{choice.value === SHOW_ALL ? "Show all" : formatTag(choice.value)}</span>
              </a>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
