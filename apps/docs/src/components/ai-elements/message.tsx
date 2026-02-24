"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import type { ComponentProps, HTMLAttributes } from "react";
import { memo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@prisma-docs/ui/components/tooltip";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant";
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:w-fit group-[.is-user]:rounded-lg group-[.is-user]:bg-fd-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-fd-foreground",
      "group-[.is-assistant]:text-fd-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageActionsProps = ComponentProps<"div">;

export const MessageActions = ({
  className,
  children,
  ...props
}: MessageActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = ComponentProps<"button"> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  className,
  ...props
}: MessageActionProps) => {
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={(triggerProps) => (
            <button
              {...triggerProps}
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), className)}
              type="button"
              {...props}
            >
              {children}
              <span className="sr-only">{label || tooltip}</span>
            </button>
          )}
        />
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), className)}
      type="button"
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </button>
  );
};

// For markdown streaming content use Streamdown  
export type MessageResponseMarkdownProps = ComponentProps<typeof Streamdown>;

export const MessageResponseMarkdown = memo(
  ({ className, ...props }: MessageResponseMarkdownProps) => (
    <Streamdown
      plugins={{ code }}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "**:data-[streamdown='code-block-body']:overflow-x-auto!",
        "**:data-[streamdown='code-block-body']:overscroll-x-contain",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

MessageResponseMarkdown.displayName = "MessageResponseMarkdown";

// For HTML content (like from Kapa which returns pre-rendered HTML)
export type MessageResponseProps = HTMLAttributes<HTMLDivElement>;

export const MessageResponse = ({
  className,
  ...props
}: MessageResponseProps) => (
  <div
    className={cn(
      "prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      className
    )}
    {...props}
  />
);

export type MessageToolbarProps = ComponentProps<"div">;

export const MessageToolbar = ({
  className,
  children,
  ...props
}: MessageToolbarProps) => (
  <div
    className={cn(
      "mt-4 flex w-full items-center justify-between gap-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
