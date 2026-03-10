"use client";

import { ChevronDown } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";
import { type ReactNode, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export interface ParameterNode {
  name: string;
  description: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  parameters?: ParameterNode[];

  returns?: ReactNode;
}

const keyVariants = cva("text-foreground-ppg", {
  variants: {
    deprecated: {
      true: "line-through text-foreground-ppg/50",
    },
  },
});

const fieldVariants = cva("text-foreground-neutral-weaker not-prose pe-2");

export function TypeTable({ type }: { type: Record<string, TypeNode> }) {
  return (
    <div className="@container flex flex-col p-1 bg-background-neutral-weaker text-fd-card-foreground rounded-square border my-6 text-sm overflow-hidden">
      <div className="flex font-medium items-center px-3 py-1 mb-1 not-prose text-foreground-neutral-weak">
        <p className="w-[25%]">Prop</p>
        <p className="@max-xl:hidden">Type</p>
      </div>
      <div className="bg-background-default border rounded-square">
        {Object.entries(type).map(([key, value]) => (
          <Item key={key} name={key} item={value} />
        ))}
      </div>
    </div>
  );
}

function Item({
  name,
  item: {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    returns,
  },
}: {
  name: string;
  item: TypeNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "overflow-hidden transition-all not-last:border-b ",
        open ? "not-last:-0" : "not-last:rounded-b-none",
      )}
    >
      <CollapsibleTrigger className="cursor-pointer relative flex flex-row items-center w-full group text-start p-3 not-prose hover:bg-background-neutral-weak">
        <code
          className={cn(
            keyVariants({
              deprecated,
              className: "min-w-fit w-[25%] font-medium pe-2",
            }),
          )}
        >
          {name}
          {!required && "?"}
        </code>
        {typeDescriptionLink ? (
          <a
            href={typeDescriptionLink}
            className="underline text-foreground-neutral @max-xl:hidden"
          >
            {type}
          </a>
        ) : (
          <span className="@max-xl:hidden text-foreground-neutral">{type}</span>
        )}
        <ChevronDown className="absolute end-2 size-4 text-fd-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t border-stroke-neutral">
          <div className="text-sm prose col-span-full prose-no-margin empty:hidden text-foreground-neutral-weak">
            {description}
          </div>
          {typeDescription && (
            <>
              <p className={cn(fieldVariants())}>Type</p>
              <p className="my-auto not-prose">{typeDescription}</p>
            </>
          )}
          {defaultValue && (
            <>
              <p className={cn(fieldVariants())}>Default</p>
              <p className="my-auto not-prose text-foreground-neutral">
                {defaultValue}
              </p>
            </>
          )}
          {parameters.length > 0 && (
            <>
              <p className={cn(fieldVariants())}>Parameters</p>
              <div className="flex flex-col gap-2">
                {parameters.map((param) => (
                  <div
                    key={param.name}
                    className="inline-flex items-center flex-wrap gap-1"
                  >
                    <p className="font-medium not-prose text-nowrap">
                      {param.name} -
                    </p>
                    <div className="text-sm prose prose-no-margin">
                      {param.description}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {returns && (
            <>
              <p className={cn(fieldVariants())}>Returns</p>
              <div className="my-auto text-sm prose prose-no-margin">
                {returns}
              </div>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
