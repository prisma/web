"use client";

// Blog-local navigation-menu primitives. site-redesign's header drives its
// "Platform" dropdown with Radix `NavigationMenu` (viewport={false}); the blog
// has no Radix dependency of its own, so the same behaviour is rebuilt on
// `@base-ui/react/navigation-menu` — the primitive @prisma-docs/ui's own
// WebNavigation already uses at this exact version, so the part names and the
// `--positioner-*` / `--popup-*` custom properties are known-good.
//
// Styling is CF's, not the old web nav's: hairline `stroke-neutral` panel on
// `background-default`, 14px radius, soft double shadow, and the shared
// cubic-bezier(0.22,1,0.36,1) / 300–500ms motion with `motion-reduce` guards.
import { NavigationMenu as Primitive } from "@base-ui/react/navigation-menu";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

export function NavMenu({ className, children, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root className={cn("flex items-center", className)} {...props}>
      {children}
      <NavMenuPositioner />
    </Primitive.Root>
  );
}

export function NavMenuList({ className, ...props }: Primitive.List.Props) {
  return (
    <Primitive.List className={cn("flex list-none items-center gap-1", className)} {...props} />
  );
}

export function NavMenuItem({ className, ...props }: Primitive.Item.Props) {
  return <Primitive.Item className={cn("relative", className)} {...props} />;
}

export function NavMenuTrigger({ className, children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Trigger
      className={cn(
        "group/trigger text-foreground-neutral-weak hover:text-foreground-neutral data-popup-open:text-foreground-neutral rounded-circle flex h-8 w-max cursor-pointer items-center gap-1 bg-transparent px-2.5 text-sm font-medium transition-colors duration-300 outline-none",
        "focus-visible:ring-foreground-neutral/25 focus-visible:ring-2",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden
        className="relative top-px size-3 transition-transform duration-300 group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none"
      />
    </Primitive.Trigger>
  );
}

export function NavMenuContent({ className, ...props }: Primitive.Content.Props) {
  return (
    <Primitive.Content
      className={cn(
        "h-full w-auto p-2 transition-[opacity,transform,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "data-starting-style:data-[activation-direction=left]:-translate-x-8 data-starting-style:data-[activation-direction=right]:translate-x-8",
        "data-ending-style:data-[activation-direction=left]:translate-x-8 data-ending-style:data-[activation-direction=right]:-translate-x-8",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

// One shared popup that morphs between the triggers, CF-style: the panel keeps
// its position and resizes into the next menu's content rather than blinking.
function NavMenuPositioner({ className, ...props }: Primitive.Positioner.Props) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        side="bottom"
        sideOffset={10}
        align="start"
        collisionPadding={16}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <Primitive.Popup
          className={cn(
            "border-stroke-neutral bg-background-default rounded-square-high relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) border outline-none",
            "shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_32px_-12px_rgba(21,21,21,0.22)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_12px_32px_-12px_rgba(0,0,0,0.8)]",
            "transition-[opacity,transform,width,height,scale,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            "motion-reduce:transition-none",
          )}
        >
          <Primitive.Viewport className="relative size-full overflow-hidden" />
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}

// Top-level (non-dropdown) destination. The label sits in its own <span> so
// eclipse's `.spectrum-underline` — which fires on `:hover > .spectrum-underline`
// — is triggered by the anchor around it, giving the nav CF's spectrum sweep
// instead of a plain text-colour change.
export function NavMenuTopLink({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Link>) {
  return (
    <Primitive.Link
      className={cn(
        "text-foreground-neutral-weak hover:text-foreground-neutral rounded-circle flex h-8 items-center px-2.5 text-sm font-medium no-underline transition-colors duration-300 outline-none",
        "focus-visible:ring-foreground-neutral/25 focus-visible:ring-2",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className="spectrum-underline">{children}</span>
    </Primitive.Link>
  );
}

export function NavMenuLink({ className, ...props }: ComponentProps<typeof Primitive.Link>) {
  return (
    <Primitive.Link
      className={cn(
        "hover:bg-background-neutral-weak rounded-square flex items-start gap-3 p-2.5 no-underline transition-colors duration-300 outline-none",
        "focus-visible:ring-foreground-neutral/25 focus-visible:ring-2",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
