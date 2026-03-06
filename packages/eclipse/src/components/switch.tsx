"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "../lib/cn";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={(s) =>
        cn(
          "peer data-[checked]:bg-background-neutral-reverse data-[unchecked]:bg-background-neutral-strong focus-visible:border-ring  group/switch inline-flex shrink-0 items-center rounded-circle border-1 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed h-[1.15rem] w-8 disabled:outline-stroke-neutral-weak disabled:outline disabled:outline-solid disabled:bg-background-neutral-weak disabled:[&>span]:bg-foreground-neutral-weaker [&>span]:bg-foreground-neutral-reverse",
          typeof className === "function" ? className(s) : className,
        )
      }
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full ring-0 transition-transform size-3 data-[checked]:translate-x-[calc(100%+3px)] data-[unchecked]:translate-x-[2px] disabled:bg-foreground-neutral-weaker",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
