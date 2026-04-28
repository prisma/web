"use client";

import { UtmPersistence as SharedUtmPersistence } from "@prisma-docs/ui/components/utm-persistence";

export function UtmPersistence() {
  return <SharedUtmPersistence storageKey="blog_utm_params" basePath="/blog" />;
}
