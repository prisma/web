"use client";

import { cva } from "class-variance-authority";
import {
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen,
} from "lucide-react";
import { type HTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "../lib/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const itemVariants = cva(
  "flex flex-row items-center gap-2 rounded-square my-1 px-2 py-1.5 type-text-sm hover:bg-background-neutral-weak [&_svg]:size-4",
);

export function Files({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "not-prose rounded-md bg-fd-card p-2 text-foreground-neutral",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;

  disabled?: boolean;

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}

export function File({
  name,
  icon = <FileIcon />,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <div className={cn(itemVariants({ className }))} {...rest}>
      <span className="text-foreground-neutral">{icon}</span>
      {name}
    </div>
  );
}

export function Folder({
  name,
  defaultOpen = false,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <CollapsibleTrigger
        className={cn(
          itemVariants({
            className: "w-full text-foreground-neutral cursor-pointer",
          }),
          open && "bg-background-neutral hover:bg-background-neutral",
        )}
      >
        <span className={cn("text-foreground-neutral")}>
          {open ? <FolderOpen /> : <FolderIcon />}
        </span>
        {name}
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t-0">
        <div className="ml-3.5 flex flex-col border-l ps-2 text-foreground-neutral border-t-0 ">
          {props.children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
