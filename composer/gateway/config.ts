import type { SiteDefinition } from "@prisma/proxy";
import { vercel, type VercelOptions } from "@prisma/proxy/vercel";

export function gatewaySites(
  files = new URL("./sites/", import.meta.url),
  nextjs: VercelOptions["nextjs"] = new URL("site/routes-manifest.json", files),
): SiteDefinition[] {
  // The other apps have no vercel.json; their routing stays in Next.js.
  return ["site", "docs", "blog", "handbook", "eclipse"].map((name) => ({
    name,
    mount: name === "site" ? "/" : `/${name}`,
    paths: name === "site" ? [] : [`/${name}.md`, `/${name}.mdx`],
    assets: [
      {
        prefix: `/${name}-static/_next`,
        destination: `${name === "site" ? "" : `/${name}`}/_next`,
      },
    ],
    routing: vercel(
      ["site", "docs"].includes(name) ? new URL(`${name}/vercel.json`, files) : {},
      name === "site" ? { nextjs } : undefined,
    ),
  }));
}
