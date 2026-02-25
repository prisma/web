import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
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
      <WebNavigation links={baseOptions().links} />
      {children}
    </>
  );
}
