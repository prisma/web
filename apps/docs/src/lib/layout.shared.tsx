import type { LinkItemType } from "@/components/layout/link-item";
import type { BaseLayoutProps } from "@/components/layout/shared";
import Image from "next/image";
import logoLight from "../../public/logo/full-color.svg";
import logoDark from "../../public/logo/full-color-white.svg";
import { DiscordIcon } from "@/components/icons/discord";
import Link from "next/link";

// The full-colour lockup (prism mark + wordmark) from the redesign. Two files
// rather than one recoloured file: the wordmark is solid black in the light
// asset and solid white in the dark one, while the prism mark keeps its own
// cyan/yellow/red in both.
// The link that wraps this lockup names itself (aria-label + a visually hidden
// text node), so the two images are decorative here: one of the pair is always
// hidden by CSS, and announcing "Prisma" twice inside one link helps nobody.
export const logo = (
  <>
    <Image alt="Prisma" src={logoLight} aria-hidden className="h-7 w-auto dark:hidden" />
    <Image alt="Prisma" src={logoDark} aria-hidden className="hidden h-7 w-auto dark:block" />
  </>
);

// Section navigation lives in the sidebar (src/lib/sidebar-sections.tsx +
// SidebarNav); the navbar only carries external links and buttons.
export const links: LinkItemType[] = [
  {
    type: "icon",
    label: "Join Discord",
    icon: <DiscordIcon />,
    text: "Discord",
    url: "https://pris.ly/discord?utm_source=docs&utm_medium=navbar",
  },
];

export const docsLinks: LinkItemType[] = [];

export const authLinks: LinkItemType[] = [
  {
    type: "button",
    text: "Login",
    url: "https://console.prisma.io/login?utm_source=docs&utm_medium=login",
    active: "none",
    on: "nav",
    secondary: true,
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {/* An image-only anchor reads as an empty link to crawlers, so the
              link carries both an aria-label (for assistive tech) and a
              visually hidden text node (for text-only crawlers). */}
          <Link
            href="https://www.prisma.io"
            aria-label="Prisma home"
            className="mb-0 hover:mb-1 transition-[margin] duration-300 motion-reduce:transition-none"
          >
            {logo}
            <span className="sr-only">Prisma home</span>
          </Link>
          <span className="text-fd-muted-foreground">/</span>
          {/* The visible wordmark stays "docs"; the hidden text makes the
              anchor specific rather than one more generic "docs" link. */}
          <Link
            href="/"
            aria-label="Prisma documentation home"
            className="group relative inline-block pl-3 -ml-3!"
          >
            <span className="font-mono text-lg block translate-y-px">docs</span>
            <span className="sr-only">Prisma documentation home</span>
          </Link>
        </>
      ),
      transparentMode: "none",
    },
    githubUrl: "https://pris.ly/github?utm_source=docs&utm_medium=navbar",
  };
}
