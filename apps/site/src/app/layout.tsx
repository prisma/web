import "@prisma-docs/ui/search.css";
import { UnifiedSearchProvider } from "@prisma-docs/ui/components/unified-search";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type React from "react";
import { AprilFoolsAnnouncement } from "@/components/april-fools";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BuildersDayBanner } from "@/components/builders-day-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { UtmPersistence } from "@/components/utm-persistence";
import { siteConfig } from "@/lib/config";
import { createSiteStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";
import { OpenAiPixel } from "@prisma-docs/ui/components/openai-pixel";
import { FontAwesomeScript as WebFA } from "@prisma/eclipse";
import "./globals.css";
import "./april-fools.css";

// April Fools presentation; the production analytics, consent, UTM, search,
// and structured data continue to run in the shared marketing shell.

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: SITE_HOME_TITLE,
    template: `%s | Prisma`,
  },
  description: SITE_HOME_DESCRIPTION,
  openGraph: {
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    images: [siteConfig.ogImage],
  },
};

const siteStructuredData = createSiteStructuredData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-scroll-behavior` is what lets Next temporarily force
    // `scroll-behavior: auto` during route transitions. Without it, the
    // unlayered `html { scroll-behavior: smooth }` in globals.css makes every
    // client-side navigation *animate* its scroll-to-top instead of snapping.
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="april-fools">
      <head>
        <Script
          id="fontawesome"
          src={WebFA}
          crossOrigin="anonymous"
          data-auto-add-css="false"
          strategy="afterInteractive"
        />
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/96980f76df67ad5235fc3f0d/script.js"
          strategy="lazyOnload"
        />
        <script
          async
          type="text/plain"
          src="https://cdn.tolt.io/tolt.js"
          data-tolt="fda67739-7ed0-42d2-b716-6da0edbec191"
          data-cookieyes="cookieyes-analytics"
          data-cookieyes-category="analytics"
        />
        <GoogleTagManager section="website" />
        {/* ChatGPT ads pixel, consent-gated on the CookieYes advertisement category */}
        <OpenAiPixel />
        <JsonLd id="site-structured-data" data={siteStructuredData} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <UnifiedSearchProvider>
            <UtmPersistence />
            <AprilFoolsAnnouncement />
            <BuildersDayBanner />
            <Header />
            <main id="main-content" className="min-h-screen" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </UnifiedSearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
