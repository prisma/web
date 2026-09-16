"use client";
import { UnifiedSearchDialog } from "@prisma-docs/ui/components/unified-search";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import posthog from "posthog-js";

function trackSearch(query: string) {
  posthog.capture("docs:search", { query });
}
export default function CustomSearchDialog(props: SharedProps) {
  return <UnifiedSearchDialog {...props} api="/docs/api/search" onStableQuery={trackSearch} />;
}
