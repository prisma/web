import "./global.css";
import { Provider } from "@/components/provider";
import { getBaseUrl } from "@/lib/url";
import localFont from "next/font/local";
import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";

// Fonts are vendored in @prisma/eclipse; same three faces as the other zones.
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

// Display face. Only the latin subset is preloaded; latin-ext comes from the
// plain "Sora" @font-face in the package's fonts.css behind this variable.
const sora = localFont({
  src: "../../../../packages/eclipse/src/static/fonts/SoraVF-latin.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-sora",
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
    default: "Builders Handbook",
    template: "%s | Builders Handbook",
  },
  description: "A handbook for people who build software with AI, from Prisma.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${monaSansMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* FontAwesome: Eclipse's Alert and friends render <i class="fa-..."> glyphs. */}
        <Script
          src={EclipseFA}
          crossOrigin="anonymous"
          data-auto-add-css="false"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
