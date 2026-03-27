import { getSiteSitemapEntries, renderSitemapXml } from "@/lib/sitemap";

export async function GET(): Promise<Response> {
  const xml = renderSitemapXml(await getSiteSitemapEntries());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
