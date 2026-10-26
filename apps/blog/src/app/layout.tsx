import "@prisma-docs/ui/search.css";
import { preload } from "react-dom";
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
import { OpenAiPixel } from "@prisma-docs/ui/components/openai-pixel";
import { PromptwatchScript } from "@prisma-docs/ui/components/promptwatch-script";

// Inter's shared Unicode-ranged CSS keeps one composite family, including
// non-Latin text, without preloading two full font files.
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
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: BLOG_HOME_TITLE,
  description: BLOG_HOME_DESCRIPTION,
};

const blogStructuredData = createBlogStructuredData();

export default function Layout({ children }: LayoutProps<"/">) {
  // Use the CSS face's exact URL, so body text does not wait for a CSS/font
  // discovery waterfall or swap line wraps after the first paint.
  preload(
    new URL(
      "../../../../packages/eclipse/src/static/fonts/subsets/InterVariable-latin.woff2",
      import.meta.url,
    ).href,
    { as: "font", type: "font/woff2", crossOrigin: "anonymous", fetchPriority: "high" },
  );
  return (
    <html
      lang="en"
      className={`${sora.variable} ${monaSansMono.variable}`}
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
        {/* ChatGPT ads pixel, consent-gated on the CookieYes advertisement category */}
        <OpenAiPixel />
        {/* Promptwatch visitor analytics — cookieless, loaded without a consent gate */}
        <PromptwatchScript />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <div className="bg-blog absolute inset-0 -z-1 overflow-hidden" />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
