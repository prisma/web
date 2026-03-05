"use client";

import * as React from "react";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Banner variants based on color prop
 */
const bannerVariants = cva(
  "text-sm font-medium py-3 px-6 flex items-center justify-center",
  {
    variants: {
      color: {
        default: "bg-background-neutral-reverse text-foreground-neutral-reverse",
        ppg: "bg-background-ppg-reverse-strong text-foreground-ppg-reverse",
        orm: "bg-background-orm-reverse-strong text-foreground-orm-reverse",
        error: "bg-background-error-reverse-strong text-foreground-error-reverse",
        success: "bg-background-success-reverse-strong text-foreground-success-reverse",
        warning: "bg-background-warning-reverse-strong text-foreground-warning-reverse",
        gradient: "bg-gradient-ppg-orm text-foreground-neutral",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

/**
 * Banner props
 */
export interface BannerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof bannerVariants> {
  /**
   * The color variant of the banner
   */
  color?:
    | "default"
    | "ppg"
    | "orm"
    | "error"
    | "success"
    | "warning"
    | "gradient";
  /**
   * The description text to display in the banner
   */
  description: string;
  /**
   * Whether to show the info icon
   */
  showIcon?: boolean;
  /**
   * ID for the banner (enables close functionality with persistence)
   */
  id?: string;
  /**
   * Whether to automatically adjust layout height
   * @default true
   */
  changeLayout?: boolean;
  /**
   * Height of the banner
   * @default "3rem"
   */
  height?: string;
}

/**
 * Banner component
 *
 * A page-level banner that appears at the top of the layout.
 * Built on Fumadocs Banner with Eclipse design system styling.
 *
 * @example
 * ```tsx
 * <Banner
 *   color="ppg"
 *   description="New feature available!"
 *   showIcon
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Banner
 *   id="maintenance-banner"
 *   color="error"
 *   description="Scheduled maintenance on Sunday"
 *   showIcon={false}
 * />
 * ```
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      color,
      description,
      showIcon = false,
      id,
      changeLayout = true,
      height,
      ...props
    },
    ref,
  ) => {
    return (
      <FumadocsBanner
        id={id}
        changeLayout={changeLayout}
        height={height}
        className={cn(bannerVariants({ color }), className)}
        {...props}
      >
        <div className="flex items-center justify-center gap-3">
          {showIcon && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
              aria-hidden="true"
            >
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M10 6V10M10 14H10.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span>{description}</span>
        </div>
      </FumadocsBanner>
    );
  },
);

Banner.displayName = "Banner";

export { bannerVariants };
