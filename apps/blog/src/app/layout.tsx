import { Provider } from "@/components/provider";
import { getBaseUrl } from "@/lib/url";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";

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

const baseUrl = getBaseUrl();
const blogUrl = new URL("/blog", baseUrl).toString();

const blogStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "Prisma",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: new URL("/images/logo.svg", baseUrl).toString(),
      },
      sameAs: [
        "https://github.com/prisma",
        "https://twitter.com/prisma",
        "https://www.linkedin.com/company/prisma-io",
        "https://www.youtube.com/prismadata",
        "https://www.facebook.com/prisma.io/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${blogUrl}#website`,
      name: "Prisma Blog",
      url: blogUrl,
      description: BLOG_HOME_DESCRIPTION,
      publisher: {
        "@id": `${baseUrl}#organization`,
      },
    },
  ],
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <head>
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
        <JsonLd id="blog-site-structured-data" data={blogStructuredData} />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <div className="bg-blog absolute inset-0 -z-1 overflow-hidden" />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
