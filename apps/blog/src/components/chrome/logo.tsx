import { cn } from "@prisma-docs/ui/lib/cn";
import { withBlogBasePath } from "@/lib/url";

// The full-colour lockup (prism mark + wordmark) from the redesign. Two files
// rather than one recoloured file: the wordmark is solid black in the light
// asset and solid white in the dark one, while the prism mark keeps its own
// cyan/yellow/red in both. Swapping <img> on `.dark` is cheaper than inlining
// ~6 kB of path data twice.
const LIGHT = "/logo/full-color.svg";
const DARK = "/logo/full-color-white.svg";

export function Logo({
  href = "https://www.prisma.io",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label="Prisma"
      className={cn("flex shrink-0 items-center focus-visible:outline-none", className)}
    >
      <img
        src={withBlogBasePath(LIGHT)}
        alt="Prisma"
        width={304}
        height={77}
        className="h-6.5 w-auto dark:hidden sm:h-7"
      />
      <img
        src={withBlogBasePath(DARK)}
        alt=""
        aria-hidden
        width={304}
        height={77}
        className="hidden h-6.5 w-auto dark:block sm:h-7"
      />
    </a>
  );
}
