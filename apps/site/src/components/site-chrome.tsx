"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isLandingPath } from "@/lib/landing-routes";

/**
 * Wraps the parts of the root layout that some routes replace.
 * `/lp` drops the site header, banner, and footer. `/compare` drops the
 * marketing header and banner because those pages use the docs-template
 * document header, and keeps the footer. Reading the pathname here keeps the
 * root layout a server component.
 */
/** Comparison pages carry the docs-template document header, so the marketing header stays off those routes. The footer stays. */
function isCompareDocumentPath(pathname: string) {
  return pathname === "/compare" || pathname.startsWith("/compare/");
}

export function SiteChrome({
  children,
  hideOnCompare = false,
}: {
  children: ReactNode;
  hideOnCompare?: boolean;
}) {
  const pathname = usePathname();
  if (isLandingPath(pathname)) return null;
  if (hideOnCompare && isCompareDocumentPath(pathname)) return null;
  return <>{children}</>;
}
