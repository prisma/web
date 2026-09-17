import { ArrowRightBold } from "@/components/icons/forma";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";

// The standard "Learn more" CTA: a spectrum-ink pill link with the bold
// arrow. Pass `outline` to escalate to the bordered brand button where the
// link needs more weight (e.g. a section's single closing CTA).
export function LearnMore({
  href,
  product,
  outline = false,
  className,
}: {
  href: string;
  /** What the link leads to — read by screen readers only. */
  product: string;
  outline?: boolean;
  className?: string;
}) {
  if (outline) {
    return (
      <span className={cn("mt-7 inline-flex", className)}>
        <PrismButtonOutline href={href}>
          Learn more
          <span className="sr-only"> about {product}</span>
        </PrismButtonOutline>
      </span>
    );
  }
  return (
    <span className={cn("mt-5 inline-flex", className)}>
      <a
        href={href}
        className="spectrum-ink -ml-3.5 inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
      >
        Learn more
        <span className="sr-only"> about {product}</span>
        <ArrowRightBold className="size-3.5" aria-hidden />
      </a>
    </span>
  );
}
