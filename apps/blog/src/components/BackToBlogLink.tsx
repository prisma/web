import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@prisma-docs/ui/lib/cn";

/**
 * The single "← Back to blog" affordance shared by the post, series and author
 * pages. Muted at rest, ink on hover, with the arrow nudging back a couple of
 * pixels — the same 300ms ease every other hover on the blog uses.
 */
export function BackToBlogLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm text-foreground-neutral-weak transition-colors duration-300 hover:text-foreground-neutral motion-reduce:transition-none",
        className,
      )}
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      Back to blog
    </Link>
  );
}
