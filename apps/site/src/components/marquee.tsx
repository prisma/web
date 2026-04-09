import { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cn } from "@prisma-docs/ui/lib/cn";

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  direction?: "left" | "up";
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  innerClassName?: string;
  numberOfCopies?: number;
};

export function Marquee({
  children,
  direction = "left",
  pauseOnHover = false,
  reverse = false,
  fade = false,
  className,
  innerClassName,
  numberOfCopies = 2,
  style,
  ...rest
}: MarqueeProps) {
  const animationName = direction === "left" ? "marquee-left" : "marquee-up";

  return (
    <div
      className={cn(
        "group flex gap-[1rem] overflow-hidden",
        direction === "left" ? "flex-row" : "flex-col",
        className
      )}
      style={{
        ...style,
        maskImage: fade
          ? `linear-gradient(${
              direction === "left" ? "to right" : "to bottom"
            }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
        WebkitMaskImage: fade
          ? `linear-gradient(${
              direction === "left" ? "to right" : "to bottom"
            }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
      }}
      {...rest}
    >
      {Array(numberOfCopies)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-[1rem] [--gap:1rem] shrink-0",
              direction === "left"
                ? "min-w-full flex-row justify-around"
                : "min-h-full flex-col justify-start",
              pauseOnHover && "group-hover:paused",
              innerClassName
            )}
            style={
              {
                animation: `${animationName} var(--duration, 40s) linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
                willChange: "transform",
              } as CSSProperties
            }
          >
            {children}
          </div>
        ))}
    </div>
  );
}