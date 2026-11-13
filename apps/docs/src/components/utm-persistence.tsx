"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";
import { UTM_ATTRIBUTION_STORAGE_KEY, buildSiteRef } from "@prisma-docs/ui/lib/utm";

/**
 * Docs attribution carrier. Client-routes only under `/docs`, and stamps
 * `ref=prisma.io/docs/<page>` on every Console link, next to the visitor's own
 * attribution or, for an untagged visitor, the `utm_*` tags that
 * `remark-console-utm` writes into those links.
 */
export function UtmPersistence() {
  return (
    <SharedUtmPersistence
      storageKey={UTM_ATTRIBUTION_STORAGE_KEY}
      basePath="/docs"
      consolePageRef={buildSiteRef}
    />
  );
}
