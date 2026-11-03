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
export async function loadTemplates(): Promise<GalleryTemplate[]> {
  try {
    const response = await fetch(TEMPLATE_MANIFEST_URL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];

    const result = templateManifestSchema.safeParse(await response.json());
    return result.success ? enrichTemplates(result.data.templates) : [];
  } catch {
    return [];
  }
}

export async function findTemplate(id: string): Promise<GalleryTemplate | null> {
  const templates = await loadTemplates();
  return templates.find((template) => template.id === id) ?? null;
}
