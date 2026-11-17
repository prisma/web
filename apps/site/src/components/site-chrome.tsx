"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isLandingPath } from "@/lib/landing-routes";

/**
 * Wraps the parts of the root layout that the campaign landing pages under
 * `/lp` replace with their own minimal chrome (see app/lp/layout.tsx). Every
 * other route renders the children untouched. Reading the pathname here keeps
 * the root layout a server component and avoids a second root layout, which
 * would mean moving every existing route into a route group.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isLandingPath(pathname)) return null;
  return <>{children}</>;
}
