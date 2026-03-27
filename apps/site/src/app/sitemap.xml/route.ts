import { getHostSitemapUrls, renderSitemapIndexXml } from "@/lib/sitemap";

export function GET(): Response {
  const xml = renderSitemapIndexXml(getHostSitemapUrls());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
