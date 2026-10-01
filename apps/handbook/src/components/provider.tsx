"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { NextProvider } from "fumadocs-core/framework/next";
import type { ReactNode } from "react";

// No search yet. The docs and blog zones run a Mixedbread-backed dialog; the
// handbook gets wired into that once it has real chapters worth indexing.
export function Provider({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <RootProvider search={{ enabled: false }}>{children}</RootProvider>
    </NextProvider>
  );
}
