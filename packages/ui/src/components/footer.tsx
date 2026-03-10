import footerData from "../data/footer";
import clsx from "clsx";
import { AnchorHTMLAttributes } from "react";
import { getRedirectableLink, isAbsoluteUrl } from "../lib/is-absolute-url";
import {
  Action,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@prisma/eclipse";
import { Logo } from "./navigation-menu";
import { gdpr, hipaa, iso27, soc2 } from "./footer-badges";
import PDPStatus from "./pdp-status";
import { ThemeToggle } from "./theme-toggle";

type ColorType = "indigo" | "teal" | "white" | undefined;

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  external?: boolean;
  color?: ColorType;
};

const Link = ({ external, color, children, href, ...rest }: LinkProps) => {
  const className = clsx(
    "text-foreground-neutral-weak text-md font-semibold leading-md flex items-center cursor-pointer font-medium box-border no-underline px-2.5 -ml-2.5 py-1.5 transition-colors hover:bg-background-ppg-strong rounded-square transition-all",
  );

  if (external || !href || href.startsWith("http") || href.startsWith("#")) {
    return (
      <a
        {...rest}
        href={href}
        className={className}
        target={external ? "_blank" : "_self"}
      >
        {children}
        {external && (
          <i className="fa-regular fa-arrow-up-right text-foreground-neutral-weaker text-xs ml-1" />
        )}
      </a>
    );
  }

  return (
    <a {...rest} href={href} className={className}>
      {children}
    </a>
  );
};

interface FooterProps {
  className?: string;
  style?: any;
  color?: ColorType;
  darker?: boolean;
  hideNewsletter?: boolean;
  lightTheme?: boolean;
  absoluteLinks?: boolean;
  newsletterComponent?: any;
}

const Footer = ({
  style,
  darker = false,
  absoluteLinks = false,
}: FooterProps) => {
  return (
    <footer className="z-1 bg-background-default w-screen overflow-x-hidden overflow-y-visible max-w-full">
      <div
        className={clsx(
          "px-8 pt-[72px] pb-8 md:px-6 md:pt-[46px] md:pb-[100px] max-w-[1288px] mx-auto",
          darker && "bg-[#090A15]",
        )}
        style={style}
      >
        <div className="font-inter print:hidden relative">
          {/* Logo and Social Links Column */}
          <div className="mb-8 flex-1 lg:mb-0 w-full top-0 flex justify-between items-center lg:flex-col lg:items-start lg:absolute lg:max-w-fit lg:h-72">
            <div className="flex flex-col justify-center">
              <div className="text-stroke-neutral-stronger [&>svg]:h-10!">
                {Logo}
              </div>
            </div>
            <div className="flex justify-start gap-2 md:max-w-[190px]">
              {footerData.socialIcons.map((socialLink: any, idx: number) => (
                <a
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener"
                  key={idx}
                  aria-label={socialLink.title}
                  className={clsx(
                    "text-[1.375rem] transition-colors hover:[&>div]:bg-background-ppg-strong",
                  )}
                >
                  <Action color="neutral" size="2xl">
                    <i
                      className={`fa-brands fa-${socialLink.icon} text-current text-foreground-neutral-weak transition-colors`}
                    />
                  </Action>
                </a>
              ))}
            </div>
          </div>
          {/* Main Grid Row */}
          <div className="grid max-md:gap-8 max-md:grid-cols-2 grid-cols-[repeat(4,auto)] lg:gap-8 xl:gap-12 relative lg:w-fit ml-auto">
            {/* Footer Columns */}
            {footerData.footerItems.map((footerItem: any, idx: number) => (
              <div
                className="flex-1 lg:mb-0 lg:px-2 min-w-40"
                key={`footer-${idx}`}
              >
                <span className="uppercase stretch-display font-mona-sans inline-block font-bold text-base text-foreground-neutral tracking-[0.1em] mt-0 mb-2.5 lg:mb-3">
                  {footerItem.title}
                </span>
                {footerItem.links.map((link: any, idx: number) =>
                  link._type === "footerLinkType" ? (
                    <Link
                      key={idx}
                      href={getRedirectableLink(link.url, absoluteLinks)}
                      external={isAbsoluteUrl(link.url)}
                      referrerPolicy={`${link.url ? "no-referrer" : ""}`}
                    >
                      {link.title}
                    </Link>
                  ) : (
                    <DropdownMenu key={idx}>
                      <DropdownMenuTrigger className="focus-visible:outline-none">
                        <span className="text-foreground-neutral-weak text-lg flex cursor-pointer font-medium box-border no-underline leading-[1.39] px-8 -ml-8 py-1.5 transition-colors relative w-max items-center hover:bg-background-ppg-strong rounded-square transition-all">
                          {link.title}
                          <i className="fa-regular fa-chevron-down text-foreground-neutral-weaker ml-2 text-base text-inherit" />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {link.links.map(
                          (dropLink: { title: string; url: string }) => (
                            <DropdownMenuItem
                              key={dropLink.title}
                              className="hover:bg-background-ppg-strong!"
                            >
                              <a
                                href={dropLink.url}
                                target="_blank"
                                className="text-left capitalize text-foreground-neutral-weak text-md font-semibold"
                              >
                                {dropLink.title}
                              </a>
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ),
                )}
              </div>
            ))}
          </div>
          <div className="h-px w-full bg-stroke-neutral-weak my-6" />
          
          {/* Compliance Footer */}
          <div className="gap-6 md:items-center justify-between flex md:flex-nowrap flex-wrap w-full md:pb-0 pb-11">
            <PDPStatus className="justify-start order-1" />
            <div className="md:max-w-78 flex justify-between w-full items-center order-3 md:order-2">
              <a
                href="https://trust.prisma.io/"
                target="__blank"
                rel="noopener noreferrer"
                aria-label="Prisma Trust"
              >
                {gdpr}
              </a>
              <a
                href="https://trust.prisma.io/"
                target="__blank"
                rel="noopener noreferrer"
                aria-label="Prisma Trust"
              >
                {hipaa}
              </a>
              <a
                href="https://trust.prisma.io/"
                target="__blank"
                rel="noopener noreferrer"
                aria-label="Prisma Trust"
              >
                {iso27}
              </a>
              <a
                href="https://trust.prisma.io/"
                target="__blank"
                rel="noopener noreferrer"
                aria-label="Prisma Trust"
              >
                {soc2}
              </a>
            </div>
            <ThemeToggle
              mode="light-dark-system"
              className="md:order-3 order-2"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
