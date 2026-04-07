"use client";

import { Button } from "@prisma/eclipse";
import {
  Logo,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationWrapper,
  NavigationMobileMenu,
  MenuNavigationItem,
  Socials,
} from "./navigation-menu";
import { useEffect, useState } from "react";
import { FontAwesomeScript as WebFA } from "./fontawesome-web";
import { cn } from "../lib/cn";

export interface Link {
  text: string;
  external?: boolean;
  url?: string;
  icon?: string;
  desc?: string;
  col?: number;
  sub?: Array<{
    text: string;
    external?: boolean;
    url: string;
    icon?: string;
    desc?: string;
  }>;
  buttonVariant?: "ppg" | "orm" | undefined;
}

interface WebNavigationProps {
  links: Link[];
  utm?: Record<string, string>;
  preserveExactUtm?: boolean;
  buttonVariant?: "ppg" | "orm" | undefined;
}

function buildConsoleHref(
  pathname: "/login" | "/sign-up",
  utm?: WebNavigationProps["utm"],
  preserveExactUtm = false,
) {
  if (!utm) {
    return `https://console.prisma.io${pathname}`;
  }

  const href = new URL(`https://console.prisma.io${pathname}`);

  for (const [key, value] of Object.entries(utm)) {
    if (key.startsWith("utm_") && value) {
      href.searchParams.set(key, value);
    }
  }

  if (!preserveExactUtm && !href.searchParams.has("utm_campaign")) {
    href.searchParams.set(
      "utm_campaign",
      pathname === "/login" ? "login" : "signup",
    );
  }

  return href.toString();
}

export function WebNavigation({
  links,
  utm,
  preserveExactUtm = false,
  buttonVariant = "ppg",
}: WebNavigationProps) {
  const [mobileView, setMobileView] = useState(false);
  const loginHref = buildConsoleHref("/login", utm, preserveExactUtm);
  const signupHref = buildConsoleHref("/sign-up", utm, preserveExactUtm);

  useEffect(() => {
    if (mobileView) {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("md:overflow-auto");
    } else document.body.classList.remove("overflow-hidden");
  }, [mobileView]);
  return (
    <>
      <WebFA />
      <NavigationMenu mobileOpen={mobileView}>
        <NavigationWrapper mobileOpen={mobileView}>
          <NavigationMenuList>
            <NavigationMenuItem className="outline-none!">
              <NavigationMenuLink
                className="shrink-0 w-full p-0 hover:bg-transparent focus:bg-transparent focus-visible:outline-none focus-visible:ring-0"
                href="https://www.prisma.io"
              >
                {Logo}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div className="hidden md:contents">
              {links.map((link) =>
                link.url ? (
                  <NavigationMenuItem key={link.url}>
                    <NavigationMenuLink href={link.url} variant={buttonVariant}>
                      {link.text}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : link?.sub?.length ? (
                  <NavigationMenuItem key={link.text}>
                    <NavigationMenuTrigger variant={buttonVariant}>
                      {link.text}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-square-high! overflow-hidden!">
                      <div
                        className={cn(
                          "list gap-1 flex flex-col",
                          link?.col && `grid grid-cols-${link.col}`,
                        )}
                      >
                        {link.sub.map((sub, index: number) => (
                          <MenuNavigationItem
                            key={`${sub.text}-${sub.url}-${index}`}
                            link={sub}
                            variant={buttonVariant}
                          />
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : null,
              )}
            </div>
          </NavigationMenuList>
          <NavigationMenuList>
            <div
              className={cn("contents", mobileView && "hidden md:contents!")}
            >
              <Socials include={["discord"]} />
              <NavigationMenuItem className="ml-2 -mr-2 hidden sm:block">
                <Button variant="default-stronger" href={loginHref}>
                  Login
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <Button
                  variant={buttonVariant}
                  className="whitespace-nowrap"
                  href={signupHref}
                >
                  Get started
                </Button>
              </NavigationMenuItem>
            </div>
            <NavigationMenuItem
              className="flex md:hidden"
              onClick={() => setMobileView(!mobileView)}
            >
              <i
                className={cn(
                  "fa-regular",
                  mobileView ? "fa-xmark" : "fa-bars",
                )}
              />
            </NavigationMenuItem>
            {mobileView && (
              <NavigationMobileMenu
                links={links}
                loginHref={loginHref}
                signupHref={signupHref}
                buttonVariant={buttonVariant}
              />
            )}
          </NavigationMenuList>
        </NavigationWrapper>
      </NavigationMenu>
    </>
  );
}
