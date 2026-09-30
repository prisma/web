"use client";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import logoLight from "../../public/logo/full-color.svg";
import logoDark from "../../public/logo/full-color-white.svg";
import logoMark from "../../public/logo/mark.svg";

// Same lockup treatment as apps/docs: the wordmark is solid ink in the light
// file and solid paper in the dark one; the prism mark keeps its own
// cyan/yellow/red in both. One of the pair is always hidden by CSS, so both
// images are decorative and the link names itself.
const logo = (
  <>
    <Image alt="" src={logoLight} aria-hidden className="h-7 w-auto shrink-0 dark:hidden" />
    <Image alt="" src={logoDark} aria-hidden className="hidden h-7 w-auto shrink-0 dark:block" />
  </>
);

// Passed to DocsLayout as a component, so it renders this container as-is.
// Given a plain node it wraps the title in its own link, which would nest the
// two links below inside a third. It has to be a client component: the layout
// that hands it over is a server component, and only a client reference can
// cross that boundary as a prop.
export function NavTitle({ className }: ComponentProps<"a">) {
  return (
    <div className={className}>
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
    </div>
  );
}
