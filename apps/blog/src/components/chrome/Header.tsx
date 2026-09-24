"use client";

// Blog chrome, modelled on apps/site-redesign/src/components/header.tsx.
//
// Same idiom: one element that morphs between two states — docked at the page's
// content width, and a floating pill from the first scroll — with every
// property transitioned over 500ms on cubic-bezier(0.22,1,0.36,1) so the change
// is smooth in both directions, and `motion-reduce:transition-none` throughout.
//
// Adapted for the blog: CF hardcodes light-only values (`bg-white/85`,
// `border-black/[0.06]`); here those are eclipse tokens
// (`bg-background-default-075`, `border-stroke-neutral`) so dark mode works,
// with the drop shadow duplicated under `dark:` because a black-on-black shadow
// reads as nothing. Destinations are the blog's real ones (Products, Pricing,
// Resources, Docs, Blog + the console CTA pair), passed in from
// navigation-wrapper so UTM propagation is unchanged.
import { Button } from "@prisma/eclipse";
import { useSearchContext } from "@fumadocs/base-ui/contexts/search";
import { ThemeToggle } from "@prisma-docs/ui/components/theme-toggle";
import { cn } from "@prisma-docs/ui/lib/cn";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import {
  NavMenu,
  NavMenuContent,
  NavMenuItem,
  NavMenuLink,
  NavMenuList,
  NavMenuTopLink,
  NavMenuTrigger,
} from "./nav-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet";

export interface NavSubLink {
  text: string;
  url: string;
  external?: boolean;
  icon?: string;
  desc?: string;
}

export interface NavLink {
  text: string;
  url?: string;
  external?: boolean;
  icon?: string;
  desc?: string;
  col?: number;
  sub?: NavSubLink[];
}

interface HeaderProps {
  links: NavLink[];
  logoHref: string;
  loginHref: string;
  signupHref: string;
}

function externalProps(external?: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

// FontAwesome glyphs come from the nav data itself (`fa-regular fa-database`
// and friends); the kit is loaded app-wide, and reusing the existing strings
// keeps every destination's icon identical to what shipped before.
function SubLinkGlyph({ icon }: { icon?: string }) {
  return (
    <span className="border-stroke-neutral bg-card-wash rounded-square-low mt-0.5 flex size-7 shrink-0 items-center justify-center border">
      {icon ? <i aria-hidden className={cn(icon, "text-foreground-ppg text-xs")} /> : null}
    </span>
  );
}

function SearchButton({ className }: { className?: string }) {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      aria-label="Search Prisma"
      onClick={() => setOpenSearch(true)}
      className={cn(
        "text-foreground-neutral-weak hover:text-foreground-neutral hover:bg-background-neutral rounded-circle flex size-8 cursor-pointer items-center justify-center transition-colors duration-300 outline-none",
        "focus-visible:ring-foreground-neutral/25 focus-visible:ring-2",
        "motion-reduce:transition-none",
        className,
      )}
    >
      <Search className="size-4" aria-hidden />
    </button>
  );
}

export function Header({ links, logoHref, loginHref, signupHref }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* one element morphs between two states: docked at the site content
            width (transparent, no shadow) and the floating pill. Every property
            is transitioned so the change is smooth in both directions. */}
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-3 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            floating
              ? "border-stroke-neutral bg-background-default-075 mt-3 h-14 max-w-[calc(100%-1.5rem)] px-4 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_24px_-8px_rgba(21,21,21,0.16)] backdrop-blur-md sm:max-w-5xl sm:px-5 dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_8px_24px_-8px_rgba(0,0,0,0.8)]"
              : "bg-background-default/0 mt-4 h-16 max-w-[87.5rem] border-transparent px-4 shadow-[0_1px_2px_rgba(21,21,21,0),0_8px_24px_-8px_rgba(21,21,21,0)] backdrop-blur-0 sm:mt-6 sm:h-18 sm:px-10 dark:shadow-[0_1px_2px_rgba(0,0,0,0),0_8px_24px_-8px_rgba(0,0,0,0)]",
          )}
        >
          <Logo href={logoHref} />

          <NavMenu className="hidden md:flex">
            <NavMenuList className="gap-0.5 lg:gap-1">
              {links.map((link) =>
                link.sub?.length ? (
                  <NavMenuItem key={link.text}>
                    <NavMenuTrigger>{link.text}</NavMenuTrigger>
                    <NavMenuContent>
                      <ul
                        className={cn(
                          "grid gap-0.5",
                          link.col === 2 ? "w-[30rem] grid-cols-2" : "w-[21rem]",
                        )}
                      >
                        {link.sub.map((item) => (
                          <li key={item.url}>
                            <NavMenuLink
                              href={item.url}
                              className={item.desc ? undefined : "items-center"}
                              {...externalProps(item.external)}
                            >
                              <SubLinkGlyph icon={item.icon} />
                              <span className="flex flex-col gap-0.5">
                                <span className="text-foreground-neutral text-sm font-medium">
                                  {item.text}
                                </span>
                                {item.desc ? (
                                  <span className="text-foreground-neutral-weak text-xs leading-snug">
                                    {item.desc}
                                  </span>
                                ) : null}
                              </span>
                            </NavMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavMenuContent>
                  </NavMenuItem>
                ) : (
                  <NavMenuItem key={link.text}>
                    <NavMenuTopLink href={link.url} {...externalProps(link.external)}>
                      {link.text}
                    </NavMenuTopLink>
                  </NavMenuItem>
                ),
              )}
            </NavMenuList>
          </NavMenu>

          <div className="hidden items-center gap-2 md:flex">
            <SearchButton />
            <ThemeToggle mode="light-dark" className="border-stroke-neutral" />
            <Button
              asChild
              variant="default-weak"
              className="spectrum-ink-text text-foreground-neutral px-3 hover:bg-transparent"
            >
              <a href={loginHref}>Log in</a>
            </Button>
            <Button asChild variant="ink" className="px-4">
              <a href={signupHref}>Get started</a>
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <SearchButton />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="text-foreground-neutral-weak hover:text-foreground-neutral hover:bg-background-neutral rounded-circle flex size-8 cursor-pointer items-center justify-center transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-foreground-neutral/25 motion-reduce:transition-none"
              >
                <Menu className="size-5" aria-hidden />
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <nav className="flex flex-col gap-6 px-5 pt-16 pb-8 text-left">
                  {links.map((link) =>
                    link.sub?.length ? (
                      <div key={link.text} className="flex flex-col gap-3">
                        <p className="text-foreground-neutral-weaker text-xs font-semibold tracking-wide uppercase">
                          {link.text}
                        </p>
                        {link.sub.map((item) => (
                          <a
                            key={item.url}
                            href={item.url}
                            onClick={() => setOpen(false)}
                            className="text-foreground-neutral text-base font-medium no-underline"
                            {...externalProps(item.external)}
                          >
                            {item.text}
                          </a>
                        ))}
                      </div>
                    ) : null,
                  )}

                  <div className="border-stroke-neutral flex flex-col gap-3 border-t pt-6">
                    {links.map((link) =>
                      link.sub?.length ? null : (
                        <a
                          key={link.text}
                          href={link.url}
                          onClick={() => setOpen(false)}
                          className="text-foreground-neutral text-base font-medium no-underline"
                          {...externalProps(link.external)}
                        >
                          {link.text}
                        </a>
                      ),
                    )}
                  </div>

                  <div className="border-stroke-neutral flex flex-col gap-2 border-t pt-6">
                    <Button asChild variant="default">
                      <a href={loginHref}>Log in</a>
                    </Button>
                    <Button asChild variant="ink">
                      <a href={signupHref}>Get started</a>
                    </Button>
                  </div>

                  <div className="border-stroke-neutral flex items-center justify-between border-t pt-6">
                    <span className="text-foreground-neutral-weak text-sm">Theme</span>
                    <ThemeToggle mode="light-dark-system" className="border-stroke-neutral" />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* The header is fixed, so it contributes no height. This spacer stands in
          for its docked footprint (margin + bar) and keeps every page's first
          element clear of it. */}
      <div aria-hidden className="h-20 sm:h-24" />
    </>
  );
}
