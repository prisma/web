import "@prisma-docs/ui/search.css";
import { Provider } from "@/components/provider";
import { createBlogStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import "./global.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Script from "next/script";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { GoogleTagManager } from "@prisma-docs/ui/components/google-tag-manager";

// Inter is vendored inside @prisma/eclipse now, so load the same files here
// rather than pulling a second copy from Google.
const inter = localFont({
  src: [
    {
      path: "../../../../packages/eclipse/src/static/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../../packages/eclipse/src/static/fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Sora replaces Mona Sans VF as the display face. next/font/local has no
// per-source `unicode-range`, so only the latin subset is preloaded here; the
// latin-ext subset is served by the plain "Sora" @font-face in the package's
// fonts.css, which sits directly behind this variable in the family stack.
const sora = localFont({
  src: "../../../../packages/eclipse/src/static/fonts/SoraVF-latin.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-sora",
  display: "swap",
});

// Code face — unchanged by the rebrand.
const monaSansMono = localFont({
  src: "../../../../packages/eclipse/src/static/fonts/MonaSansMonoVF[wght].woff2",
  variable: "--font-mona-mono",
  display: "swap",
  weight: "200 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: BLOG_HOME_TITLE,
  description: BLOG_HOME_DESCRIPTION,
};

const blogStructuredData = createBlogStructuredData();

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${monaSansMono.variable}`}
      suppressHydrationWarning
    >
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
