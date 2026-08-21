"use client";

import Script from "next/script";

/**
 * FontAwesome Script Component
 *
 * Loads the FontAwesome kit script required for eclipse design system icons.
 * This component should be added to your app's layout to enable FontAwesome icons
 * used throughout the eclipse components.
 *
 * @example
 * ```tsx
 * import { FontAwesomeScript } from "@prisma-docs/eclipse";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <FontAwesomeScript />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function FontAwesomeScript() {
  return (
    <Script
      src="https://kit.fontawesome.com/c1448b716e.js"
      crossOrigin="anonymous"
      async
      strategy="afterInteractive"
    />
  );
}
