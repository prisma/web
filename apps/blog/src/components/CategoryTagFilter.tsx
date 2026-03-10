"use client";

import { useState } from "react";
import { Badge } from "@prisma/eclipse";
import { formatTag } from "@/lib/format";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";

type CategoryTagFilterProps = {
  uniqueTags: string[];
  currentCategory: string;
  onChange: (category: string) => void;
  className?: string;
};

export function CategoryTagFilter({
  uniqueTags,
  currentCategory,
  onChange,
  className,
}: CategoryTagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const desktopClassName = ["hidden", "md:flex", className]
    .filter(Boolean)
    .join(" ");

  const handleSelect = (category: string) => {
    const nextCategory =
      category === "show-all" || currentCategory === category
        ? "show-all"
        : category;

    if (nextCategory !== currentCategory) {
      onChange(nextCategory);
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className="md:hidden w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="inline-flex w-full items-center justify-between rounded-square border border-stroke-neutral px-3 py-2 text-sm text-foreground-neutral">
            <span>{formatTag(currentCategory)}</span>
            <ChevronDown className="size-4 text-foreground-neutral-weak" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[calc(100vw-2rem)] max-w-sm p-2">
            <div className="flex flex-col">
            <button
                  key="show-all"
                  type="button"
                  aria-pressed={currentCategory === "show-all"}
                  onClick={() => handleSelect("show-all")}
                  className="inline-flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-left hover:bg-background-muted"
                >
                  <Check
                    className={`size-4 ${
                      currentCategory === "show-all"
                        ? "opacity-100 text-foreground-neutral"
                        : "opacity-0"
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
                  className="inline-flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-left hover:bg-background-muted"
                >
                  <Check
                    className={`size-4 ${
                      currentCategory === category
                        ? "opacity-100 text-foreground-neutral"
                        : "opacity-0"
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
        {uniqueTags.map((category, idx) => (
          <Badge
            key={idx}
            color={currentCategory === category ? "ppg" : "neutral"}
            onClick={() => handleSelect(category)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect(category);
              }
            }}
            tabIndex={0}
            className="cursor-pointer transition-colors hover:bg-background-ppg/50"
            label={formatTag(category)}
          />
        ))}
      </div>
    </>
  );
}
