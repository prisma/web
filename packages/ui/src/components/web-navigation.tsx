"use client";

import { Button } from "@prisma-docs/eclipse";
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
import { FontAwesomeScript } from "./fontawesome-web";
import { cn } from "../lib/cn";

interface Link {
  text: string;
  url?: string;
  desc?: string;
  col?: number;
  sub?: Array<{
    text: string;
    url: string;
    desc?: string;
  }>;
}

interface WebNavigationProps {
  links: Link[];
}

export function WebNavigation({ links }: WebNavigationProps) {
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (mobileView) {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("md:overflow-auto");
    } else document.body.classList.remove("overflow-hidden");
  }, [mobileView]);
  return (
    <>
      <FontAwesomeScript />
      <NavigationMenu mobileOpen={mobileView}>
        <NavigationWrapper mobileOpen={mobileView}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="shrink-0 w-full p-0">
                {Logo}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div className="hidden md:contents">
              {links.map((link) =>
                link.url ? (
                  <NavigationMenuItem key={link.url}>
                    <NavigationMenuLink href={link.url}>
                      {link.text}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : link?.sub?.length ? (
                  <NavigationMenuItem key={link.text}>
                    <NavigationMenuTrigger>{link.text}</NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-high! overflow-hidden!">
                      <div
                        className={cn(
                          "list gap-1 flex flex-col",
                          link?.col && `grid grid-cols-${link.col}`,
                        )}
                      >
                        {link.sub.map((sub: any) => (
                          <MenuNavigationItem key={link.text} link={sub} />
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
                <Button variant="default-stronger">Login</Button>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <Button variant="ppg" className="whitespace-nowrap">
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
            {mobileView && <NavigationMobileMenu links={links} />}
          </NavigationMenuList>
        </NavigationWrapper>
      </NavigationMenu>
    </>
  );
}
