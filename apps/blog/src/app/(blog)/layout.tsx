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
            icon: "fa-regular fa-chart-pyramid",
          },
          {
            text: "ORM",
            url: "/orm",
            desc: "Managed Postgres for global workloads",
            icon: "fa-regular fa-database",
          },
          {
            text: "Studio",
            icon: "fa-regular fa-table",
            url: "/studio",
            desc: "Explore and manipulate your data",
          },
          {
            icon: "fa-regular fa-bolt",
            text: "Accelerate",
            desc: "Make your database global",
            url: "/accelerate",
          },
          {
            icon: "fa-regular fa-plug",
            text: "Management API",
            desc: "Offer Postgres to your users",
            url: "/",
          },
        ],
      },
      {
        url: "/pricing",
        text: "Pricing",
      },
      {
        text: "Resources",
        col: 2,
        sub: [
          {
            text: "MCP",
            url: "/mcp",
            icon: "fa-regular fa-message-code",
          },
          {
            text: "Get started",
            url: "/docs",
            icon: "fa-regular fa-book-open",
          },
          {
            text: "Tutorials",
            url: "/learn",
            icon: "fa-regular fa-clapperboard-play",
          },
          {
            text: "Examples",
            url: "/",
            icon: "fa-regular fa-grid-2",
          },
          {
            text: "Stack",
            url: "/stack",
            icon: "fa-regular fa-layer-group",
          },
          {
            text: "Ecosystem",
            url: "/ecosystem",
            icon: "fa-regular fa-globe",
          },
          {
            text: "Customer stories",
            url: "/",
            icon: "fa-regular fa-users",
          },
          {
            text: "Data guide",
            url: "/dataguide",
            icon: "fa-regular fa-file-binary",
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
