import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import Link from "next/link";
import logoLight from "../../public/logo/full-color.svg";
import logoDark from "../../public/logo/full-color-white.svg";
import logoMark from "../../public/logo/mark.svg";

// Same lockup treatment as apps/docs: the wordmark is solid ink in the light
// file and solid paper in the dark one; the prism mark keeps its own
// cyan/yellow/red in both. One of the pair is always hidden by CSS, so both
// images are decorative and the link names itself.
export const logo = (
  <>
    <Image alt="" src={logoLight} aria-hidden className="h-7 w-auto shrink-0 dark:hidden" />
    <Image alt="" src={logoDark} aria-hidden className="hidden h-7 w-auto shrink-0 dark:block" />
  </>
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Link href="https://www.prisma.io" aria-label="Prisma home" className="flex items-center">
            <span className="max-lg:hidden lg:contents">{logo}</span>
            <Image alt="" src={logoMark} aria-hidden className="h-7 w-auto shrink-0 lg:hidden" />
            <span className="sr-only">Prisma home</span>
          </Link>
          <span className="text-fd-muted-foreground" aria-hidden="true">
            /
          </span>
          <Link href="/" className="font-mono text-lg translate-y-px">
            handbook
          </Link>
        </>
      ),
      transparentMode: "none",
    },
    githubUrl: "https://github.com/prisma/web",
  };
}
