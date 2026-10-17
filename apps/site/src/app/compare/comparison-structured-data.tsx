"use client";

import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { usePathname } from "next/navigation";

type ComparisonSchemas = {
  slug: string;
  article: object;
  faq: object;
};

function normalizePath(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/**
 * Emit the registry's schema for the comparison that is on screen.
 * The directory is a collection; each head-to-head is an article plus its FAQ.
 */
export function ComparisonStructuredData({
  directory,
  pages,
}: {
  directory: object;
  pages: readonly ComparisonSchemas[];
}) {
  const pathname = normalizePath(usePathname() ?? "");

  if (pathname === "/compare") {
    return <JsonLd id="comparison-directory" data={directory} />;
  }

  const page = pages.find((entry) => pathname === `/compare/${entry.slug}`);
  if (!page) return null;

  return (
    <>
      <JsonLd id={`compare-${page.slug}-article`} data={page.article} />
      <JsonLd id={`compare-${page.slug}-faq`} data={page.faq} />
    </>
  );
}
