"use client";

import { UnifiedSearchTrigger } from "@prisma-docs/ui/components/unified-search";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu } from "@/components/icons/forma";
import { PLATFORM_PRODUCT_ICONS, PRODUCT_ICONS } from "@/components/product/icons";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { SiteLink } from "@/components/site-link";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

// Product glyphs resolve through the canonical shared mapping so the navbar
// never drifts from the product pages (see product/icons.ts).
const PLATFORM_ICONS = Object.fromEntries(
  Object.entries(PLATFORM_PRODUCT_ICONS).map(([href, name]) => [href, PRODUCT_ICONS[name]]),
);

// At the very top of the page the navbar sits docked inside the hero wrapper.
// From the first scroll it detaches into a sticky floating pill with its own
// wrapper.
//
// The <header> is sticky with zero height: it takes no space in the flow (the
// hero still tucks underneath it), but any announcement banner above it in the
// layout pushes it down along with the page content, and it docks to the
// viewport top once the banner scrolls away. flow-root keeps the pill's top
// margin from collapsing through the zero-height header, which would push the
// rest of the page down.
export function Header() {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-0 flow-root">
      {/* one element morphs between two states: docked inside the hero wrapper
          (transparent, inset from the hero border) and the floating pill. */}
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3 rounded-full border transition-[background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          floating
            ? "mt-3 h-14 max-w-[calc(100%-1.5rem)] border-border bg-background/95 px-4 sm:px-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_24px_-8px_rgba(21,21,21,0.16)] backdrop-blur-md sm:max-w-[calc(100%-2rem)] lg:max-w-5xl"
            : "mt-3 h-16 max-w-[calc(100%-1.5rem)] border-transparent bg-transparent px-4 shadow-[0_1px_2px_rgba(21,21,21,0),0_8px_24px_-8px_rgba(21,21,21,0)] backdrop-blur-0 sm:mt-4 sm:h-[4.5rem] sm:max-w-[calc(100%-2rem)] sm:px-8 xl:max-w-[87.5rem]",
        )}
      >
        <Logo />

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto rounded-full bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent data-[state=open]:bg-accent data-[state=open]:text-foreground data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[19rem] gap-0.5">
                    {siteConfig.platform.map(({ label, href, description }) => {
                      const Icon = PLATFORM_ICONS[href];
                      return (
                        <li key={href}>
                          <NavigationMenuLink asChild>
                            <Link href={href} className="flex-row items-start gap-3 p-2.5">
                              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-card">
                                {Icon && <Icon className="size-3.5" />}
                              </span>
                              <span className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-foreground">{label}</span>
                                <span className="text-xs text-muted-foreground">{description}</span>
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                    <li className="mt-1 border-t border-border/70 pt-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href={siteConfig.stack.href}
                          className="group flex-row items-center gap-1.5 p-2.5 text-sm font-medium text-foreground"
                        >
                          {siteConfig.stack.label}
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {siteConfig.nav.map((item) => (
            <SiteLink
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </SiteLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <UnifiedSearchTrigger />
          <Button variant="ghost" asChild className="h-9 px-3">
            <a
              href="https://console.prisma.io/login"
              onClick={() =>
                trackCTA({
                  cta_text: "Log in",
                  cta_location: "navbar",
                  cta_destination: "https://console.prisma.io/login",
                  section: "website",
                })
              }
            >
              Log in
            </a>
          </Button>
          <Button asChild className="h-9 px-4">
            <a
              href="https://console.prisma.io/sign-up"
              onClick={() =>
                trackCTA({
                  cta_text: "Get Started",
                  cta_location: "navbar",
                  cta_destination: "https://console.prisma.io/sign-up",
                  section: "website",
                })
              }
            >
              Get Started
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <UnifiedSearchTrigger />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(22rem,100vw)] overflow-y-auto overscroll-contain"
              aria-describedby={undefined}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav
                aria-label="Mobile navigation"
                className="mt-8 flex flex-col gap-4 px-5 pb-6 text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Platform
                </p>
                {[...siteConfig.platform, siteConfig.stack].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 flex flex-col gap-4">
                  {siteConfig.nav.map((item) => (
                    <SiteLink
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </SiteLink>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" asChild>
                    <a
                      href="https://console.prisma.io/login"
                      onClick={() =>
                        trackCTA({
                          cta_text: "Log in",
                          cta_location: "navbar",
                          cta_destination: "https://console.prisma.io/login",
                          section: "website",
                        })
                      }
                    >
                      Log in
                    </a>
                  </Button>
                  <Button asChild>
                    <a
                      href="https://console.prisma.io/sign-up"
                      onClick={() =>
                        trackCTA({
                          cta_text: "Get Started",
                          cta_location: "navbar",
                          cta_destination: "https://console.prisma.io/sign-up",
                          section: "website",
                        })
                      }
                    >
                      Get Started
                    </a>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
