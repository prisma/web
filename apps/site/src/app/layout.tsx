import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type React from "react";
import { Inter, Sora } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { UtmPersistence } from "@/components/utm-persistence";
import { siteConfig } from "@/lib/config";
import { createSiteStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { BuildersDayBanner } from "@/components/builders-day-banner";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";
import { FontAwesomeScript as WebFA } from "@prisma/eclipse";
import "./globals.css";

// The 2026-rebrand shell (Sora/Inter, redesign Header/Footer) carrying the
// production analytics stack unchanged: CookieYes consent, GTM (Consent Mode),
// Tolt affiliate, PostHog (src/instrumentation-client.ts), UTM persistence,
// and site structured data. FontAwesome stays mounted while pages that still
// use fa-* glyphs are being rebuilt in the new system.

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
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable}`}>
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
        <JsonLd id="site-structured-data" data={siteStructuredData} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <UtmPersistence />
          <BuildersDayBanner />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
