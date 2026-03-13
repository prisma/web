import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { Footer } from "@prisma-docs/ui/components/footer";
import { ThemeProvider } from "@prisma-docs/ui/components/theme-provider";
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
            url: "https://www.prisma.io/postgres",
            desc: "Managed Postgres for global workloads",
            icon: "fa-regular fa-chart-pyramid",
          },
          {
            text: "ORM",
            url: "https://www.prisma.io/orm",
            desc: "Managed Postgres for global workloads",
            icon: "fa-regular fa-database",
          },
          {
            text: "Studio",
            icon: "fa-regular fa-table",
            url: "https://www.prisma.io/studio",
            desc: "Explore and manipulate your data",
          },
          {
            icon: "fa-regular fa-bolt",
            text: "Accelerate",
            desc: "Make your database global",
            url: "https://www.prisma.io/accelerate",
          },
          {
            icon: "fa-regular fa-plug",
            text: "Management API",
            desc: "Offer Postgres to your users",
            url: "https://www.prisma.io/management-api",
          },
        ],
      },
      {
        url: "https://www.prisma.io/pricing",
        text: "Pricing",
      },
      {
        text: "Resources",
        col: 2,
        sub: [
          {
            text: "MCP",
            url: "https://www.prisma.io/mcp",
            icon: "fa-regular fa-message-code",
          },
          {
            text: "Get started",
            url: "https://www.prisma.io/docs",
            icon: "fa-regular fa-book-open",
          },
          {
            text: "Tutorials",
            url: "https://www.prisma.io/learn",
            icon: "fa-regular fa-clapperboard-play",
          },
          {
            text: "Examples",
            url: "https://www.prisma.io/examples",
            icon: "fa-regular fa-grid-2",
          },
          {
            text: "Stack",
            url: "https://www.prisma.io/stack",
            icon: "fa-regular fa-layer-group",
          },
          {
            text: "Ecosystem",
            url: "https://www.prisma.io/ecosystem",
            icon: "fa-regular fa-globe",
          },
          {
            text: "Customer stories",
            url: "https://www.prisma.io/showcase",
            icon: "fa-regular fa-users",
          },
          {
            text: "Data guide",
            url: "https://www.prisma.io/dataguide",
            icon: "fa-regular fa-file-binary",
          },
        ],
      },
      {
        url: "/partners",
        text: "Partners",
      },
      {
        url: "https://www.prisma.io/blog",
        text: "Blog",
      },
    ],
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <WebNavigation links={baseOptions().links} />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
