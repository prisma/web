"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "../lib/cn";

// Helper to handle className that can be a string or function
function handleClassName<T>(
  className: string | ((state: T) => string | undefined) | undefined,
  staticClasses: string,
): string | ((state: T) => string | undefined) {
  if (typeof className === "function") {
    return (state: T) => cn(staticClasses, className(state));
  }
  return cn(staticClasses, className);
}

const Select = SelectPrimitive.Root;

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.Group.Props
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Group
      ref={ref}
      data-slot="select-group"
      className={handleClassName(className, "scroll-my-1 p-1")}
      {...props}
    />
  );
});
SelectGroup.displayName = "SelectGroup";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  SelectPrimitive.Value.Props
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Value
      ref={ref}
      data-slot="select-value"
      className={handleClassName(className, "flex flex-1 text-left")}
      {...props}
    />
  );
});
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectPrimitive.Trigger.Props & {
    size?: "sm" | "default";
  }
>(({ className, size = "default", children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-size={size}
      className={handleClassName(
        className,
        "border-input data-placeholder:text-foreground-neutral-weak aria-invalid:text-foreground-error aria-invalid:border-destructive gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer data-placeholder:hover:text-foreground-neutral hover:border-foreground-neutral-weaker",
      )}
      {...props}
    >
      {children}
      <i className="fa-regular fa-chevron-down text-foreground-neutral-weak size-4 pointer-events-none" />
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 shadow-none!"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={handleClassName(
            className,
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-36 rounded-lg border border-stroke-neutral duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none shadow-none!",
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.GroupLabel.Props
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.GroupLabel
      ref={ref}
      data-slot="select-label"
      className={handleClassName(
        className,
        "text-foreground-neutral-weak px-1.5 py-1 text-xs",
      )}
      {...props}
    />
  );
});
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.Item.Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <SelectPrimitive.Item
        ref={ref}
        data-slot="select-item"
        className={handleClassName(
          className,
          "focus:bg-background-neutral-weak focus:text-foreground-neutral not-data-[variant=destructive]:focus:**:text-foreground-neutral gap-1.5 rounded-square py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-pointer items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        )}
        {...props}
      >
        <SelectPrimitive.ItemText className="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
          {children}
        </SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
              <i className="fa-regular fa-check pointer-events-none" />
            </span>
          }
        />
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.Separator.Props
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      data-slot="select-separator"
      className={handleClassName(
        className,
        "bg-border -mx-1 my-1 h-px pointer-events-none",
      )}
      {...props}
    />
  );
});
SelectSeparator.displayName = "SelectSeparator";

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollUpArrow
      ref={ref}
      data-slot="select-scroll-up-button"
      className={handleClassName(
        className,
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full",
      )}
      {...props}
    >
      <i className="fa-regular fa-chevron-up" />
    </SelectPrimitive.ScrollUpArrow>
  );
});
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollDownArrow
      ref={ref}
      data-slot="select-scroll-down-button"
      className={handleClassName(
        className,
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
      )}
      {...props}
    >
      <i className="fa-regular fa-chevron-down" />
    </SelectPrimitive.ScrollDownArrow>
  );
});
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
