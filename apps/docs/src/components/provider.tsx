"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { NextProvider } from "fumadocs-core/framework/next";
import CustomSearchDialog from "@/components/search";
import type { ReactNode } from "react";
import { TrackingProvider } from "@/components/tracking-provider";
import { UtmPersistence } from "@/components/utm-persistence";
import { DatabaseProvider } from "@/components/database-provider";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <RootProvider
        search={{
          SearchDialog: CustomSearchDialog,
        }}
      >
        <TrackingProvider />
        <UtmPersistence />
        <DatabaseProvider>{children}</DatabaseProvider>
      </RootProvider>
    </NextProvider>
  );
}
