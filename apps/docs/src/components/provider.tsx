"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { NextProvider } from "fumadocs-core/framework/next";
import { KapaProvider } from "@kapaai/react-sdk";
import CustomSearchDialog from "@/components/search";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { TrackingProvider } from "@/components/tracking-provider";
import { UtmPersistence } from "@/components/utm-persistence";

const KAPA_INTEGRATION_ID = "1b51bb03-43cc-4ef4-95f1-93288a91b560";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <KapaProvider
        integrationId={KAPA_INTEGRATION_ID}
        callbacks={{
          askAI: {
            onQuerySubmit: (data: { question: string }) => {
              console.log("Question asked:", data.question);
            },
          },
        }}
      >
        <RootProvider
          search={{
            SearchDialog: CustomSearchDialog,
          }}
        >
          <TrackingProvider />
          <UtmPersistence />
          {children}
        </RootProvider>
      </KapaProvider>
    </NextProvider>
  );
}
