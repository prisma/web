"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";
import { UTM_ATTRIBUTION_STORAGE_KEY } from "@prisma-docs/ui/lib/utm";

const PROXIED_PATHS = ["/docs", "/blog"];

export function UtmPersistence() {
  return (
    <SharedUtmPersistence storageKey={UTM_ATTRIBUTION_STORAGE_KEY} proxiedPaths={PROXIED_PATHS} />
  );
}
