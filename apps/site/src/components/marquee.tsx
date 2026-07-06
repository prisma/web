"use client";

import { CSSProperties, HTMLAttributes, ReactNode, useEffect, useState } from "react";

import { cn } from "@prisma-docs/ui/lib/cn";

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  direction?: "left" | "up";
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  fillContainer?: boolean;
  innerClassName?: string;
};

export function Marquee({
  children,
  direction = "left",
  pauseOnHover = false,
  reverse = false,
  fade = false,
  fillContainer = true,
  className,
  innerClassName,
  style,
  ...rest
}: MarqueeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const animationName = direction === "left" ? "marquee-left" : "marquee-up";
  const fadeMask = fade
    ? `linear-gradient(${
        direction === "left" ? "to right" : "to bottom"
      }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
    : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const containerStyle = {
    ...style,
    gap: "var(--gap, 1rem)",
    maskImage: fadeMask ?? style?.maskImage,
    WebkitMaskImage: fadeMask ?? style?.WebkitMaskImage ?? style?.maskImage,
  } as CSSProperties;

  const trackClassName = cn(
    "flex shrink-0",
    direction === "left"
      ? fillContainer
        ? "min-w-full flex-row justify-around"
        : "w-max flex-row justify-start"
      : fillContainer
        ? "min-h-full flex-col justify-around"
        : "h-max flex-col justify-start",
    innerClassName,
  );

  const trackStyle = {
    animation: `${animationName} var(--duration, 40s) linear infinite`,
    animationDirection: reverse ? "reverse" : "normal",
    animationPlayState: "var(--marquee-play-state)",
    gap: "var(--gap, 1rem)",
    willChange: "transform",
  } as CSSProperties;

  return (
    <div
      className={cn(
        "flex overflow-hidden [--marquee-play-state:running]",
        pauseOnHover && "hover:[--marquee-play-state:paused]",
        direction === "left" ? "flex-row" : "flex-col",
        className,
      )}
      style={containerStyle}
      {...rest}
    >
      {[0, 1].map((copyIndex) => (
        <div
          key={copyIndex}
          aria-hidden={copyIndex > 0 ? true : undefined}
          className={trackClassName}
          style={trackStyle}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
