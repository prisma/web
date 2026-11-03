import {
  enrichTemplates,
  TEMPLATE_MANIFEST_URL,
  templateManifestSchema,
  type GalleryTemplate,
} from "./catalog";

// The manifest lives in prisma/prisma-examples and is refreshed every five
// minutes. The gallery, each template's page, its social card and the sitemap
// all read it through here, so a template added to the manifest shows up
// everywhere on the site without a code change. Next memoises the fetch
// within a request, so a page and its metadata share one round trip.
async function fetchTemplates(): Promise<GalleryTemplate[]> {
  const response = await fetch(TEMPLATE_MANIFEST_URL, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Template manifest responded ${response.status}`);
  return enrichTemplates(templateManifestSchema.parse(await response.json()).templates);
}

// Lists degrade to empty: the gallery shows its empty state and the sitemap
// simply omits the app pages until the next revalidation.
export async function loadTemplates(): Promise<GalleryTemplate[]> {
  try {
    return await fetchTemplates();
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
