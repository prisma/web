"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import {
  ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./ui/button";
import { mergeRefs } from "../lib/merge-refs";
import {
  Accordion as Root,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

function useCopyButton(copy: () => void | Promise<void>, timeout = 2000) {
  const [checked, setChecked] = useState(false);

  const onClick = useCallback(async () => {
    await copy();
    setChecked(true);
    window.setTimeout(() => {
      setChecked(false);
    }, timeout);
  }, [copy, timeout]);

  return [checked, onClick] as const;
}

export function Accordions({
  type = "single",
  ref,
  className,
  defaultValue,
  ...props
}: ComponentProps<typeof Root>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const composedRef = mergeRefs(ref, rootRef);
  const [value, setValue] = useState<string | string[]>(() =>
    type === "single" ? (defaultValue ?? "") : (defaultValue ?? []),
  );

  useEffect(() => {
    const id = window.location.hash.substring(1);
    const element = rootRef.current;
    if (!element || id.length === 0) return;

    const selected = document.getElementById(id);
    if (!selected || !element.contains(selected)) return;
    const value = selected.getAttribute("data-accordion-value");

    if (value)
      setValue((prev) => (typeof prev === "string" ? value : [value, ...prev]));
  }, []);

  return (
    // @ts-expect-error -- Multiple types
    <Root
      type={type}
      ref={composedRef}
      value={value}
      onValueChange={setValue}
      collapsible={type === "single" ? true : undefined}
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-square border bg-background-default",
        className,
      )}
      {...props}
    />
  );
}

export function Accordion({
  title,
  id,
  value = String(title),
  children,
  ...props
}: Omit<ComponentProps<typeof AccordionItem>, "value" | "title"> & {
  title: string | ReactNode;
  value?: string;
}) {
  return (
    <AccordionItem value={value} {...props}>
      <AccordionHeader id={id} data-accordion-value={value}>
        <AccordionTrigger>{title}</AccordionTrigger>
        {id ? <CopyButton id={id} /> : null}
      </AccordionHeader>
      <AccordionContent>
        <div className="ps-9 pr-4 pb-2 text-[0.9375rem] prose-no-margin">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CopyButton({ id }: { id: string }) {
  const [checked, onClick] = useCopyButton(() => {
    const url = new URL(window.location.href);
    url.hash = id;

    return navigator.clipboard.writeText(url.toString());
  });

  return (
    <button
      type="button"
      aria-label="Copy Link"
      className={cn(
        buttonVariants({
          variant: "ghost",
          className:
            "text-fd-muted-foreground me-2 hover:bg-background-default bg-background-default",
        }),
      )}
      onClick={onClick}
    >
      {checked ? (
        <Check className="size-3.5" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
    </button>
  );
}
