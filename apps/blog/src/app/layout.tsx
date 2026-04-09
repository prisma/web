import { Provider } from "@/components/provider";
import { getBaseUrl } from "@/lib/url";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";

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

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://kit.fontawesome.com/6916e9db27.js"
          crossOrigin="anonymous"
        ></Script>
      </head>
      <body className="flex flex-col min-h-screen relative">
        <div className="bg-blog absolute inset-0 -z-1 overflow-hidden" />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
