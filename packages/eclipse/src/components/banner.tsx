"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { buttonVariants } from "./ui/button";

/**
 * Banner variants based on color prop
 */
const bannerVariants = cva(
  "text-sm font-medium py-3 px-[27px] flex items-center justify-center",
  {
    variants: {
      color: {
        default:
          "bg-background-neutral-reverse text-foreground-neutral-reverse",
        ppg: "bg-background-ppg-reverse-strong text-foreground-ppg-reverse",
        orm: "bg-background-orm-reverse-strong text-foreground-orm-reverse",
        error:
          "bg-background-error-reverse-strong text-foreground-error-reverse",
        success:
          "bg-background-success-reverse-strong text-foreground-success-reverse",
        warning:
          "bg-background-warning-reverse-strong text-foreground-warning-reverse",
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
 * Styled for the Eclipse design system.
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
    const [open, setOpen] = React.useState(true);
    const globalKey = id ? `nd-banner-${id}` : null;

    React.useEffect(() => {
      if (globalKey) setOpen(localStorage.getItem(globalKey) !== "true");
    }, [globalKey]);

    if (!open) return null;

    return (
      <div
        id={id}
        ref={ref}
        className={cn(bannerVariants({ color }), className)}
        style={
          {
            height,
          } as React.CSSProperties
        }
        {...props}
      >
        {changeLayout && open ? (
          <style>
            {globalKey
              ? `:root:not(.${globalKey}) { --fd-banner-height: ${height ?? "3rem"}; }`
              : `:root { --fd-banner-height: ${height ?? "3rem"}; }`}
          </style>
        ) : null}
        {globalKey ? <style>{`.${globalKey} #${id} { display: none; }`}</style> : null}
        {globalKey ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `if (localStorage.getItem('${globalKey}') === 'true') document.documentElement.classList.add('${globalKey}');`,
            }}
          />
        ) : null}
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
        {id ? (
          <button
            type="button"
            aria-label="Close Banner"
            onClick={() => {
              setOpen(false);
              if (globalKey) localStorage.setItem(globalKey, "true");
            }}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "absolute end-2 top-1/2 -translate-y-1/2 text-foreground-neutral-weaker",
                size: "icon-sm",
              }),
            )}
          >
            <X />
          </button>
        ) : null}
      </div>
    );
  },
);

Banner.displayName = "Banner";

export { bannerVariants };
