import Image from "next/image";
import { cn } from "@/lib/utils";

/** Preserve the full-color symbol; only the wordmark changes with the surface. */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/logo/full-color.svg"
        alt="Prisma"
        width={110}
        height={28}
        priority={priority}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src="/logo/full-color-dark.svg"
        alt="Prisma"
        width={110}
        height={28}
        priority={priority}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
