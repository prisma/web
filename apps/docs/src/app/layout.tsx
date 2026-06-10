import { Provider } from "@/components/provider";
import { getBaseUrl } from "@/lib/urls";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const monaSans = localFont({
  src: [
    {
      path: "../../../../packages/eclipse/src/static/fonts/MonaSansVF[wdth,wght,opsz,ital].woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../../../../packages/eclipse/src/static/fonts/MonaSansVF[wdth,wght,opsz,ital].woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-mona-sans",
  display: "swap",
});

const monaSansMono = localFont({
  src: "../../../../packages/eclipse/src/static/fonts/MonaSansMonoVF[wght].woff2",
  variable: "--font-mona-mono",
  display: "swap",
  weight: "200 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Prisma Documentation",
    template: "%s | Prisma Documentation",
  },
  description:
    "Documentation for Prisma ORM, Prisma Postgres, Prisma Accelerate, and the Prisma ecosystem. Build type-safe database applications with ease.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Prisma Documentation",
              url: "https://www.prisma.io/docs",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.prisma.io/docs?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* CookieYes CMP — declared first so its consent hooks are in place
            before any other consent-gated script can execute */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/96980f76df67ad5235fc3f0d/script.js"
          strategy="afterInteractive"
        />
        {/* FontAwesome — icons are non-critical; explicit strategy avoids
            Next.js silently defaulting to afterInteractive without a source hint */}
        <Script
          src={EclipseFA}
          crossOrigin="anonymous"
          data-auto-add-css="false"
          strategy="afterInteractive"
        />
        {/* PromptWatch — type="text/plain" keeps the script inert in the browser
            until CookieYes activates it once analytics consent is granted */}
        <script
          type="text/plain"
          src="https://ingest.promptwatch.com/js/client.min.js"
          data-project-id="25f18e15-6306-4faa-b5c2-8078804778ac"
          data-cookieyes="cookieyes-analytics"
          data-cookieyes-category="analytics"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
        {/* Tolt affiliate tracking — type="text/plain" + data-cookieyes mirrors
            the consent-gate pattern used in the site app; stays inert until
            CookieYes activates it after analytics consent */}
        <script
          async
          type="text/plain"
          src="https://cdn.tolt.io/tolt.js"
          data-tolt="fda67739-7ed0-42d2-b716-6da0edbec191"
          data-cookieyes="cookieyes-analytics"
          data-cookieyes-category="analytics"
        />
      </body>
    </html>
  );
}
