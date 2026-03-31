"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Section = {
  title: string;
  content: ReactNode;
};

function AccordionItem({
  section,
  isOpen,
  onToggle,
  index,
}: {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const anchorId = section.title.trim().toLowerCase().replace(/\s+/g, "-");
  const contentId = `${anchorId}-content-${index}`;

  return (
    <div className="scroll-mt-16 md:scroll-mt-24 border-t border-stroke-neutral" id={anchorId}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="text-lg font-bold leading-[25px] text-foreground-neutral">
          {section.title}
        </span>
        <i
          className={cn(
            "fa-regular text-foreground-neutral-weaker text-lg",
            isOpen ? "fa-chevron-up" : "fa-chevron-down",
          )}
        />
      </button>
      <div
        id={contentId}
        hidden={!isOpen}
        className="pb-4 text-foreground-neutral-weak text-left [&_p]:my-4 [&_a]:underline [&_a]:transition-colors [&_a]:duration-150 hover:[&_a]:text-foreground-neutral [&_ul]:list-revert [&_ul]:m-revert [&_ul]:p-revert [&_ol]:list-revert [&_ol]:m-revert [&_ol]:p-revert [&_li]:my-2 print:text-foreground-neutral"
      >
        {section.content}
      </div>
    </div>
  );
}

export function LegalAccordion({
  sections,
  defaultExpand = false,
}: {
  sections: Section[];
  defaultExpand?: boolean;
}) {
  const allIndices = sections.map((_, i) => i);
  const [openItems, setOpenItems] = useState<Set<number>>(
    () => new Set(defaultExpand ? allIndices : []),
  );

  const isAllExpanded = openItems.size === sections.length;

  const toggleAll = () => {
    setOpenItems(new Set(isAllExpanded ? [] : allIndices));
  };

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const printPage = () => {
    setOpenItems(new Set(allIndices));
    setIsPrinting(true);
  };

  useEffect(() => {
    if (isPrinting && openItems.size === sections.length) {
      window.print();
      setIsPrinting(false);
    }
  }, [isPrinting, openItems, sections.length]);

  return (
    <>
      {/* Controls — sticky sidebar on desktop, horizontal row on mobile */}
      <div className="flex items-start flex-row-reverse gap-4 justify-between pt-14 pb-14 md:justify-center md:sticky md:top-[120px] md:flex-col md:pt-14 md:pb-24 md:self-start print:hidden">
        <button
          type="button"
          className="text-foreground-orm hover:text-foreground-orm-strong transition-all duration-300 cursor-pointer"
          onClick={toggleAll}
        >
          <span className="text-lg leading-6 font-semibold underline">
            {isAllExpanded ? "Collapse" : "Expand"} all
          </span>
          <i
            className={`fa-regular fa-${isAllExpanded ? "minus" : "plus"} ml-2 text-base`}
          />
        </button>
        <button
          type="button"
          className="text-foreground-orm hover:text-foreground-orm-strong transition-all duration-300 cursor-pointer"
          onClick={printPage}
        >
          <span className="text-lg leading-6 font-semibold underline">
            Print
          </span>
          <i className="fa-regular fa-print ml-2 text-base" />
        </button>
      </div>

      {/* Accordion content */}
      <div className="w-full pb-24 md:pt-10">
        {sections.map((section, idx) => (
          <AccordionItem
            key={idx}
            section={section}
            isOpen={openItems.has(idx)}
            onToggle={() => toggleItem(idx)}
            index={idx}
          />
        ))}
      </div>
    </>
  );
}
