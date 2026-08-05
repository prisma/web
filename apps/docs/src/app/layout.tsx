import { Provider } from "@/components/provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { getBaseUrl } from "@/lib/urls";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";
import { Banner } from "fumadocs-ui/components/banner";
import { ArrowRightIcon } from "lucide-react";

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
    <html lang="en" className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Docs is a section of prisma.io, not a site of its own. Declaring
            // a second WebSite here gave Google a competing candidate for the
            // site name, so this points at the canonical one in apps/site
            // instead. (The SearchAction it used to carry drove the sitelinks
            // search box, which Google retired.)
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Prisma Documentation",
              url: "https://www.prisma.io/docs",
              // @ids must match the nodes apps/site emits verbatim, which build
              // off an origin with no trailing slash.
              isPartOf: { "@id": "https://www.prisma.io#website" },
              publisher: { "@id": "https://www.prisma.io#organization" },
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
        {/* Google Tag Manager — consent-gated; activates only after CookieYes analytics consent */}
        <GoogleTagManager section="docs" />
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
        {/* Hidden llms.txt directive for AI agents. It must be the FIRST child
            of <body>: agent-readiness audits (afdocs "llms-txt-directive-html")
            measure the directive's byte position within the body and flag it as
            "buried" when it sits past 50% — which happens if it renders inside
            the page content, after the sidebar markup. data-markdown-ignore
            keeps it out of the HTML/markdown parity comparison; aria-hidden and
            tabIndex={-1} keep it away from screen readers and the tab order
            (audits read the raw HTML, not the accessibility tree). */}
        <div
          data-markdown-ignore
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          For the complete Prisma documentation index optimized for AI agents, see{" "}
          <a href="https://www.prisma.io/docs/llms.txt" tabIndex={-1}>
            https://www.prisma.io/docs/llms.txt
          </a>
          {". A markdown version of every docs page is available by appending "}
          <code>.md</code> to its URL.
        </div>
        <Banner
          id="prisma-next-docs"
          height="3.25rem"
          className="prisma-next-banner text-fd-foreground"
        >
          <div className="prisma-next-banner-content flex w-full items-center justify-center gap-2 pr-8 text-xs sm:text-sm">
            <span className="font-semibold">The Prisma 8 Release Candidate is available.</span>
            <span className="hidden text-fd-muted-foreground sm:inline">
              Explore the next Prisma ORM workflow.
            </span>
            <Link
              href="/v8"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "prisma-next-banner-cta h-7 shrink-0 whitespace-nowrap px-2 py-1 text-xs",
              )}
            >
              Read the docs
              <ArrowRightIcon className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Banner>
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
