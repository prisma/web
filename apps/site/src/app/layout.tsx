import { Provider } from "@/components/provider";
import { JsonLd } from "@/components/json-ld";
import { createSiteStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import type React from "react";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/blog-metadata";
import {
  NavigationWrapper,
  FooterWrapper,
} from "@/components/navigation-wrapper";
import { Footer } from "@prisma-docs/ui/components/footer";
import { ThemeProvider } from "@prisma-docs/ui/components/theme-provider";
import { FontAwesomeScript as WebFA } from "@prisma/eclipse";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

const themeInitScript = `
(() => {
  try {
    const storageKey = "theme";
    const stored = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light";

    const root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    root.classList.toggle("dark", resolved === "dark");
  } catch {
    // Ignore storage/media-query failures and use CSS defaults.
  }
})();
`;

const siteStructuredData = createSiteStructuredData();

function baseOptions() {
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
            text: "Prisma Partners",
            url: "/partners",
            icon: "fa-regular fa-lightbulb",
          },
          {
            text: "Tutorials",
            url: "https://www.prisma.io/docs/guides",
            icon: "fa-regular fa-clapperboard-play",
          },
          {
            text: "Examples",
            url: "https://github.com/prisma/prisma-examples",
            icon: "fa-regular fa-grid-2",
            external: true,
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
            url: "/showcase",
            icon: "fa-regular fa-users",
          },
          {
            text: "Data guide",
            url: "https://www.prisma.io/dataguide",
            icon: "fa-regular fa-file-binary",
            external: true,
          },
        ],
      },
      {
        url: "https://www.prisma.io/docs",
        text: "Docs",
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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Script src={WebFA} crossOrigin="anonymous" />

        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/96980f76df67ad5235fc3f0d/script.js"
        />

        <script
          async
          type="text/plain"
          src="https://cdn.tolt.io/tolt.js"
          data-tolt="fda67739-7ed0-42d2-b716-6da0edbec191"
          data-cookieyes="cookieyes-analytics"
          data-cookieyes-category="analytics"
        />
        <script
          id="gmanager"
          type="text/plain"
          data-cookieyes="cookieyes-analytics"
          data-cookieyes-category="analytics"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KCGZPWB');
          `,
          }}
        />
        <JsonLd id="site-structured-data" data={siteStructuredData} />
      </head>
      <body className="flex flex-col min-h-screen pt-24 relative">
        <div className="bg-background-default absolute inset-0 -z-1 overflow-hidden" />
        <Provider>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <NavigationWrapper
              links={baseOptions().links}
              utm={{ source: "website", medium: "blog" }}
            />
            {children}
            <FooterWrapper />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
