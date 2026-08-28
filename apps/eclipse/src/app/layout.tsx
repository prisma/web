import { Provider } from "@/components/provider";
import Script from "next/script";
import "./global.css";
import localFont from "next/font/local";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";

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

const monaSansMono = localFont({
  src: "../../../../packages/eclipse/src/static/fonts/MonaSansMonoVF[wght].woff2",
  variable: "--font-mona-mono",
  display: "swap",
  weight: "200 900",
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${monaSansMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script src={EclipseFA} crossOrigin="anonymous" async data-auto-add-css="false" />
        <Script
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
          data-website-id="1b51bb03-43cc-4ef4-95f1-93288a91b560"
          data-project-name="Prisma"
          data-project-color="#7BE7F0"
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
