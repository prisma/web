import { Provider } from "@/components/provider";
import { createBlogStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: BLOG_HOME_TITLE,
  description: BLOG_HOME_DESCRIPTION,
};

const blogStructuredData = createBlogStructuredData();

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd id="blog-structured-data" data={blogStructuredData} />
        {/* FontAwesome — not render-critical; explicit strategy prevents accidental beforeInteractive promotion */}
        <Script
          src={EclipseFA}
          crossOrigin="anonymous"
          data-auto-add-css="false"
          strategy="afterInteractive"
        />
        {/* CookieYes CMP — must be present on every public-facing app for GDPR/ePrivacy compliance */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/96980f76df67ad5235fc3f0d/script.js"
          strategy="afterInteractive"
        />
        {/* Google Tag Manager — consent-gated; activates only after CookieYes analytics consent */}
        <GoogleTagManager section="blog" />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <div className="bg-blog absolute inset-0 -z-1 overflow-hidden" />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
