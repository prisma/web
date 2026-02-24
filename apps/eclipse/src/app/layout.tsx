import { Provider } from "@/components/provider";
import Script from "next/script";
import "./global.css";
import { Inter, Barlow } from "next/font/google";

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
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
          data-website-id="1b51bb03-43cc-4ef4-95f1-93288a91b560"
          data-project-name="Prisma"
          data-project-color="#71E8DF"
          data-user-analytics-fingerprint-enabled="true"
          data-project-logo="https://www.prisma.io/docs/ai_logo.png"
          data-button-text="Ask AI"
          data-modal-disclaimer="This AI assistant has access to all Prisma documentation and can help you with Prisma ORM, Prisma Postgres, Accelerate, and more."
          data-modal-title="Prisma AI Assistant"
          data-modal-ask-ai-input-placeholder="Ask me anything about Prisma..."
          data-modal-example-questions="How can I setup relations in my Prisma Schema?,What is the difference between the 'migrate dev' and 'db push' commands?,Which cache strategy should I use for my query with Prisma Accelerate?"
          data-modal-open-on-command-k="false"
          data-button-hide="true"
          data-color-mode="system"
          async
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
