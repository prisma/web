"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";
import { UTM_ATTRIBUTION_STORAGE_KEY, buildSiteRef } from "@prisma-docs/ui/lib/utm";
import { CROSS_ZONE_PATHS } from "@/lib/zones";

/**
 * Site-wide attribution carrier. Hard-navigates into the docs and blog zones,
 * and stamps `ref=prisma.io/<page>` on every Console link, next to the
 * visitor's own attribution.
 */
export function UtmPersistence() {
  return (
    <SharedUtmPersistence
      storageKey={UTM_ATTRIBUTION_STORAGE_KEY}
      proxiedPaths={CROSS_ZONE_PATHS}
      consolePageRef={buildSiteRef}
    />
  );
}
