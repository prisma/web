import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import { Button } from "./button";

function Takeover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="takeover"
      className={cn(
        "w-full min-w-0 flex flex-1 flex-col items-center justify-center text-center text-balance",
        className,
      )}
      {...props}
    />
  );
}

const takeoverMenuVariants = cva("p-6 w-full", {
  variants: {
    variant: {
      default: "flex justify-between items-center",
      wizard: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function TakeoverMenu({
  className,
  variant = "default",
  onBack,
  onClose,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof takeoverMenuVariants> & {
    onBack?: () => void;
    onClose?: () => void;
  }) {
  return (
    <div
      data-slot="takeover-menu"
      className={cn(takeoverMenuVariants({ variant, className }))}
      {...props}
    >
      {variant === "default" ? (
        <>
          <button
            className="p-1.5"
            onClick={() => onBack?.()}
            aria-label="Go back"
          >
            <i className="text-foreground-neutral-weak fa-regular fa-arrow-left" />
          </button>
          <button
            className="p-1.5"
            onClick={() => onClose?.()}
            aria-label="Close"
          >
            <i className="text-foreground-neutral-weak fa-regular fa-xmark" />
          </button>
        </>
      ) : (
        props.children
      )}
    </div>
  );
}

function TakeoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="takeover-header"
      className={cn("gap-2 flex max-w-sm flex-col items-center", className)}
      {...props}
    />
  );
}

function TakeoverTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="takeover-title"
      className={cn(
        "text-2xl text-foreground-neutral font-medium tracking-tight mb-3 mt-6",
        className,
      )}
      {...props}
    />
  );
}

function TakeoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="takeover-description"
      className={cn(
        "text-base text-foreground-neutral [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary mb-11! mt-0!",
        className,
      )}
      {...props}
    />
  );
}

function TakeoverContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="takeover-content"
      className={cn(
        "gap-2.5 text-sm flex w-full max-w-sm min-w-0 flex-col items-center text-balance mb-12",
        className,
      )}
      {...props}
    />
  );
}
function TakeoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="takeover-footer"
      className={cn("w-full p-6 border-t border-stroke-neutral", className)}
      {...props}
    />
  );
}

export {
  Takeover,
  TakeoverMenu,
  TakeoverHeader,
  TakeoverTitle,
  TakeoverDescription,
  TakeoverContent,
  TakeoverFooter,
};
