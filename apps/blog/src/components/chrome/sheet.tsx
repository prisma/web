"use client";

// Blog-local slide-over, modelled on apps/site-redesign/src/components/ui/sheet.tsx.
// That file is Radix `Dialog` + tw-animate-css keyframes; neither is a blog
// dependency, so the same shape is rebuilt on `@base-ui/react/dialog` (already
// a direct dependency here, and the primitive the rest of this monorepo's
// chrome uses). Base UI exposes `data-starting-style` / `data-ending-style`
// during the enter/exit transitions, which gives us CF's 500ms
// cubic-bezier(0.22,1,0.36,1) slide with plain transition utilities — no
// animation library, and `motion-reduce:` still applies.
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("type-heading-md", className)} {...props} />;
}

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Dialog.Popup> & { children?: ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        className={cn(
          "fixed inset-0 z-[60] bg-black/25 transition-opacity duration-300 ease-out",
          "supports-backdrop-filter:backdrop-blur-xs",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          "motion-reduce:transition-none",
        )}
      />
      <Dialog.Popup
        className={cn(
          "border-stroke-neutral bg-background-default fixed inset-y-0 right-0 z-[60] flex w-[19rem] max-w-[85vw] flex-col overflow-y-auto border-l shadow-box-high outline-none",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-starting-style:translate-x-full data-ending-style:translate-x-full",
          "motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <SheetClose
          aria-label="Close menu"
          className="text-foreground-neutral-weak hover:text-foreground-neutral hover:bg-background-neutral rounded-circle absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center transition-colors motion-reduce:transition-none"
        >
          <X className="size-4" aria-hidden />
        </SheetClose>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
