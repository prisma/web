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
} from "@prisma-docs/ui/components/navigation-menu";
import { StarCount } from "@prisma-docs/ui/components/star-count";
export function baseOptions() {
  return {
    nav: {
      title: "My App",
    },
    links: [
      {
        text: "Products",
        sub: [
          {
            text: "Postgres",
            url: "/postgres",
            desc: "Managed Postgres for global workloads",
          },
          {
            text: "ORM",
            url: "/orm",
          },
        ],
      },
      {
        url: "/pricing",
        text: "Pricing",
      },
      {
        text: "Resources",
        sub: [
          {
            text: "MCP",
            url: "/mcp",
            desc: "Managed Postgres for global workloads",
          },
          {
            text: "Tutorials",
            url: "/learn",
          },
        ],
      },
      {
        url: "/partners",
        text: "Partners",
      },
      {
        url: "/blog",
        text: "Blog",
      },
    ],
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationMenu>
        <NavigationWrapper>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="shrink-0 w-full p-0">
                {Logo}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div className="hidden md:contents">
              {baseOptions().links.map((link: any) =>
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
                      {link.sub.map((sublink: any) => (
                        <NavigationMenuLink
                          key={sublink.url}
                          href={sublink.url}
                        >
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
      {children}
    </>
  );
}
