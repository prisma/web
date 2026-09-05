"use client";

import { UnifiedSearchProvider } from "@prisma-docs/ui/components/unified-search";
import { MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <UnifiedSearchProvider>{children}</UnifiedSearchProvider>
      </MotionConfig>
    </NextThemesProvider>
  );
}
