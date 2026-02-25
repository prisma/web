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
  Socials,
} from "./navigation-menu";

interface Link {
  text: string;
  url?: string;
  desc?: string;
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
  return (
    <NavigationMenu>
      <NavigationWrapper>
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
              ) : link.sub ? (
                <NavigationMenuItem key={link.text}>
                  <NavigationMenuTrigger>{link.text}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {link.sub.map((sublink) => (
                      <NavigationMenuLink key={sublink.url} href={sublink.url}>
                        {sublink.text}
                      </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : null,
            )}
          </div>
        </NavigationMenuList>
        <NavigationMenuList>
          <Socials />
          <NavigationMenuItem className="ml-2 -mr-2 hidden sm:block">
            <Button variant="default-stronger">Login</Button>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden sm:block">
            <Button variant="ppg" className="whitespace-nowrap">
              Get started
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex md:hidden">
            <i className="fa-regular fa-bars" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationWrapper>
    </NavigationMenu>
  );
}
