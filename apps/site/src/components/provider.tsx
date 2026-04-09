"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { NextProvider } from "fumadocs-core/framework/next";
import type { ReactNode } from "react";
import CustomSearchDialog from "./support/search";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <RootProvider
        search={{
          SearchDialog: CustomSearchDialog,
        }}
      >
        {children}
      </RootProvider>
    </NextProvider>
  );
}
