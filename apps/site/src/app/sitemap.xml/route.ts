import { getHostSitemapUrls, renderSitemapIndexXml } from "@/lib/sitemap";

export const dynamic = "force-static";

/** Render the sitemap index as static XML. */
export function GET(): Response {
  const xml = renderSitemapIndexXml(getHostSitemapUrls());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
