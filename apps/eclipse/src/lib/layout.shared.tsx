import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logoDark from "../../public/img/logo-dark.svg";
import logoWhite from "../../public/img/logo-white.svg";

export const logo = (
  <>
    <Image alt="Prisma" src={logoDark} aria-label="Prisma" className="dark:hidden" />
    <Image alt="Prisma" src={logoWhite} aria-label="Prisma" className="hidden dark:block" />
  </>
);

export const docsLinks: LinkItemType[] = [];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo} <span className="font-mono text-lg">/eclipse</span>
        </>
      ),
      transparentMode: "none",
    },
    githubUrl: "https://github.com/prisma/docs",
  };
}
