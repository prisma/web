import type { LinkItemType } from "@/components/layout/link-item";
import type { BaseLayoutProps } from "@/components/layout/shared";
import Image from "next/image";
import logoLight from "../../public/logo/full-color.svg";
import logoDark from "../../public/logo/full-color-dark.svg";
import { DiscordIcon } from "@/components/icons/discord";
import Link from "next/link";

// The full-colour lockup (prism mark + wordmark) from the redesign. Two files
// rather than one recoloured file: the wordmark is solid black in the light
// asset and solid white in the dark one, while the prism mark keeps its own
// cyan/yellow/red in both.
export const logo = (
  <>
    <Image alt="Prisma" src={logoLight} aria-label="Prisma" className="h-7 w-auto dark:hidden" />
    <Image
      alt="Prisma"
      src={logoDark}
      aria-label="Prisma"
      className="hidden h-7 w-auto dark:block"
    />
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
          <Link
            href="https://www.prisma.io"
            className="rounded-md transition-opacity duration-150 hover:opacity-80 motion-reduce:transition-none"
          >
            {logo}
          </Link>
          <span className="text-fd-muted-foreground">/</span>
          <Link href="/" className="group relative inline-block pl-3 -ml-3!">
            <span className="font-mono text-lg block translate-y-px">docs</span>
          </Link>
        </>
      ),
      transparentMode: "none",
    },
    githubUrl: "https://pris.ly/github?utm_source=docs&utm_medium=navbar",
  };
}
