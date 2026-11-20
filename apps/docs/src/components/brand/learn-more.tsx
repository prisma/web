import type { ReactNode } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";
import { ArrowRightBold } from "@/components/icons/forma";

// The brand "learn more" link (prisma.io/brand, "Learn more links"), ported
// from apps/site/src/components/brand/learn-more.tsx: an ink pill with the
// bold Forma arrow whose text catches the spectrum on hover (`.spectrum-ink`,
// eclipse globals). The site's component always reads "Learn more"; docs links
// name their destination ("Deploy guide"), so the label is the children.
//
// Docs adaptations: the link goes through the docs base path, and the
// spectrum sweep is off in dark mode, where `.spectrum-ink`'s lighten blend
// (light-theme only by design) would tint the whole pill.
export function LearnMore({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className={cn(
        "spectrum-ink inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold text-fd-foreground outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-fd-primary/40 dark:after:hidden",
        className,
      )}
    >
      {children}
      <ArrowRightBold className="size-3.5 shrink-0" aria-hidden />
    </a>
  );
}
