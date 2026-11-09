import {
  enrichTemplates,
  TEMPLATE_MANIFEST_URL,
  templateManifestSchema,
  type GalleryTemplate,
} from "./catalog";

/**
 * How a caller reads the manifest.
 *
 * - `"revalidate"` (pages): cached and re-read every five minutes, so a
 *   template added to the manifest shows up without a deploy.
 * - `"build"` (the sitemap): read fresh, once, when the sitemap is built. A
 *   `fetch` with `next.revalidate` sets the revalidation of the whole route
 *   that makes it, so a page-style read would make Next rebuild
 *   `/sitemap-site.xml` every five minutes on the server, which has no git
 *   history: each rebuild would drop the `<lastmod>` of the TSX routes (see
 *   `@/lib/sitemap-lastmod`). Read this way, the sitemap stays a static file
 *   built once per deploy, and a new template enters it with the next deploy.
 */
export type ManifestRead = "revalidate" | "build";

/** Seconds between manifest re-reads for pages. */
export const MANIFEST_REVALIDATE_SECONDS = 300;

/** The `fetch` cache options for each {@link ManifestRead}. */
export function manifestFetchInit(read: ManifestRead): RequestInit {
  return read === "build"
    ? { cache: "no-store" }
    : { next: { revalidate: MANIFEST_REVALIDATE_SECONDS } };
}

// The manifest lives in prisma/prisma-examples. The gallery, each template's
// page, its social card and the sitemap all read it through here, so a
// template added to the manifest shows up everywhere on the site without a
// code change. Next memoises the fetch within a request, so a page and its
// metadata share one round trip.
async function fetchTemplates(read: ManifestRead = "revalidate"): Promise<GalleryTemplate[]> {
  const response = await fetch(TEMPLATE_MANIFEST_URL, {
    ...manifestFetchInit(read),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Template manifest responded ${response.status}`);
  return enrichTemplates(templateManifestSchema.parse(await response.json()).templates);
}

// Lists degrade to empty: the gallery shows its empty state until the next
// revalidation, and the sitemap omits the app pages until the next deploy.
export async function loadTemplates(read: ManifestRead = "revalidate"): Promise<GalleryTemplate[]> {
  try {
    return await fetchTemplates(read);
  } catch {
    return [];
  }
}

// A lookup must not degrade: `null` means "no such template" and the callers
// turn it into a 404 that ISR would then cache. A failed manifest load throws
// instead, so Next keeps serving the last good page (or returns an error)
// rather than a false 404.
export async function findTemplate(id: string): Promise<GalleryTemplate | null> {
  const templates = await fetchTemplates();
  return templates.find((template) => template.id === id) ?? null;
}
