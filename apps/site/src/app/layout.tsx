import "@prisma-docs/ui/search.css";
import { UnifiedSearchProvider } from "@prisma-docs/ui/components/unified-search";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type React from "react";
import { Inter, Sora } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { UtmPersistence } from "@/components/utm-persistence";
import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/config";
import { createSiteStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { BuildersDayBanner } from "@/components/builders-day-banner";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";
import { OpenAiPixel } from "@prisma-docs/ui/components/openai-pixel";
import { PromptwatchScript } from "@prisma-docs/ui/components/promptwatch-script";
import { FontAwesomeScript as WebFA } from "@prisma/eclipse";
import "./globals.css";

// The 2026-rebrand shell (Sora/Inter, redesign Header/Footer) carrying the
// production analytics stack: CookieYes consent, GTM (Consent Mode), Tolt
// affiliate, PostHog (src/instrumentation-client.ts), Promptwatch (cookieless,
// ungated), UTM persistence, and site structured data. FontAwesome stays
// mounted while pages that still use fa-* glyphs are being rebuilt in the
// new system.

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${inter.variable}`}
    >
      <head>
        <script
          async
          src="https://front.agentfront.sh/v1/serve/a47a4199-8327-477f-bfe8-74523dddb644/webmcp.js"
        />
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
        {/* Promptwatch visitor analytics — cookieless, loaded without a consent gate */}
        <PromptwatchScript />
        <JsonLd id="site-structured-data" data={siteStructuredData} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <UnifiedSearchProvider>
            <UtmPersistence />
            <a href="#content" className="skip-link">
              Skip to content
            </a>
            {/* The campaign landing pages under /lp carry their own header and
                footer (app/lp/layout.tsx); SiteChrome drops the site's for them. */}
            <SiteChrome>
              <BuildersDayBanner />
              <Header />
            </SiteChrome>
            <main id="content" className="min-h-screen">
              {children}
            </main>
            <SiteChrome>
              <Footer />
            </SiteChrome>
          </UnifiedSearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

