import { cn } from "@/lib/utils";

/** Prisma's three solid color bands, with no blended gradient. */
export function BrandStripe({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-1 w-28 overflow-hidden rounded-full", className)}
    >
      <span className="flex-1 bg-prism-cyan-400" />
      <span className="flex-1 bg-prism-yellow-300" />
      <span className="flex-1 bg-prism-red-500" />
    </span>
  );
}
