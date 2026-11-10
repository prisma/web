import { getSiteSitemapEntries, renderSitemapXml } from "@/lib/sitemap";

// Built once per deploy. The TSX routes' `<lastmod>` comes from git history,
// which only the build has, so no `fetch` behind this route may set
// `next.revalidate`: that would make Next rebuild the sitemap on the server
// without those dates (see `loadTemplates("build")`).
export const dynamic = "force-static";

/** Render the app sitemap as static XML. */
export async function GET(): Promise<Response> {
  const xml = renderSitemapXml(await getSiteSitemapEntries());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
