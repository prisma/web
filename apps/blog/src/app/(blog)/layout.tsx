import {
  Logo,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationWrapper,
} from "@prisma-docs/ui/components/navigation-menu";
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
              <NavigationMenuLink className="shrink-0 w-full">
                {Logo}
              </NavigationMenuLink>
            </NavigationMenuItem>
            {baseOptions().links.map((link: any) =>
              link.url ? (
                <NavigationMenuItem key={link.url}>
                  <NavigationMenuLink href={link.url}>
                    {link.text}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : link.sub ? (
                <NavigationMenuItem key={`sub-${link.url}`}>
                  <NavigationMenuTrigger>{link.text}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {link.sub.map((sublink: any) => (
                      <NavigationMenuLink key={sublink.url} href={sublink.url}>
                        {sublink.text}
                      </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : null,
            )}
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link 2</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationWrapper>
      </NavigationMenu>
      {children}
    </>
  );
}
