"use client";

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
// viewport top once the banner scrolls away.
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
    <header className="sticky top-0 z-50 h-0">
      {/* one element morphs between two states: docked inside the hero wrapper
          (transparent, wrapper-wide) and the floating pill. Every property is
          transitioned so the change is smooth in both directions. */}
      <div
        className={cn(
          "mx-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          floating
            ? "mt-3 h-14 max-w-[calc(100%-1.5rem)] border-black/[0.06] bg-white/85 px-5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_24px_-8px_rgba(21,21,21,0.16)] backdrop-blur-md sm:max-w-4xl"
            : "mt-5 h-16 max-w-[96rem] border-transparent bg-white/0 px-10 shadow-[0_1px_2px_rgba(21,21,21,0),0_8px_24px_-8px_rgba(21,21,21,0)] backdrop-blur-0 sm:mt-7 sm:h-[4.5rem] sm:px-16",
        )}
      >
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto bg-transparent p-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent">
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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild className="spectrum-ink-text">
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
              href="https://console.prisma.io"
              onClick={() =>
                trackCTA({
                  cta_text: "Get Started",
                  cta_location: "navbar",
                  cta_destination: "https://console.prisma.io",
                  section: "website",
                })
              }
            >
              Get Started
            </a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]" aria-describedby={undefined}>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4 px-5 pb-6 text-left">
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
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
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
                    href="https://console.prisma.io"
                    onClick={() =>
                      trackCTA({
                        cta_text: "Get Started",
                        cta_location: "navbar",
                        cta_destination: "https://console.prisma.io",
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
    </header>
  );
}
