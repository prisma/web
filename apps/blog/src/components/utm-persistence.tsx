"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";
import { UTM_ATTRIBUTION_STORAGE_KEY, buildSiteRef } from "@prisma-docs/ui/lib/utm";

/**
 * Blog attribution carrier. Client-routes only under `/blog`, and stamps
 * `ref=prisma.io/blog/<slug>` on Console links for untagged visitors.
 */
export function UtmPersistence() {
  return (
    <SharedUtmPersistence
      storageKey={UTM_ATTRIBUTION_STORAGE_KEY}
      basePath="/blog"
      fallbackConsoleRef={buildSiteRef}
    />
  );
}
