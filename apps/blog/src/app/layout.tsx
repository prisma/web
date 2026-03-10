import { Provider } from "@/components/provider";
import "./global.css";
import { Inter, Barlow } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

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
      <body className="flex flex-col min-h-screen pt-24 relative">
        <div className="bg-blog absolute inset-0 -z-1 overflow-hidden" />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
