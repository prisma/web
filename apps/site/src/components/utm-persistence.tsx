"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";

const PROXIED_PATHS = ["/docs", "/blog"];

export function UtmPersistence() {
  return <SharedUtmPersistence storageKey="site_utm_params" proxiedPaths={PROXIED_PATHS} />;
}
