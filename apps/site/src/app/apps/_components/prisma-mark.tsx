import { cn } from "@/lib/utils";

// The current Prisma logomark, from the brand kit. Full colour, so it is an
// image rather than an inline path that takes the ink colour.
export function PrismaMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand-kit/logo-mark/logo-mark.svg"
      alt=""
      width={16}
      height={16}
      loading="lazy"
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  );
}
