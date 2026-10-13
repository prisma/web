import type { SiteDefinition } from "@prisma/proxy";
import {
  vercel,
  type VercelOptions,
  type NextjsRouting,
  type VercelConfig,
} from "@prisma/proxy/vercel";
import { readFileSync } from "node:fs";
import { mediaPath, type MediaShard } from "../media/catalog.ts";

export function gatewaySites(
  files = new URL("./sites/", import.meta.url),
  nextjs: VercelOptions["nextjs"] = new URL("site/routes-manifest.json", files),
  media: MediaShard[] = JSON.parse(readFileSync(new URL("blog/media.json", files), "utf8")),
  blogManifest: (NextjsRouting & Pick<VercelConfig, "headers">) | undefined = media.length
    ? JSON.parse(readFileSync(new URL("blog/routes-manifest.json", files), "utf8"))
    : undefined,
): SiteDefinition[] {
  // The other apps have no vercel.json; their routing stays in Next.js.
  const sites: SiteDefinition[] = ["site", "docs", "blog", "handbook", "eclipse"].map((name) => ({
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
      name === "site"
        ? { nextjs }
        : name === "blog" && blogManifest
          ? { nextjs: blogManifest }
          : undefined,
    ),
  }));
  // The catalog contains file identity, not routing rules. Build exact public
  // paths in memory, preserving parent-site rules and the blog's Next headers.
  for (const shard of media)
    sites.push({
      name: shard.name,
      mount: `/blog/_composer-media/${shard.name}`,
      paths: shard.files.map((file) => mediaPath(file.path)),
      routing: vercel({ headers: blogManifest?.headers }, { paths: "public" }),
    });
  return sites;
}
