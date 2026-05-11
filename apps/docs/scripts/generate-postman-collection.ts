import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";

// openapi-to-postmanv2 is a CommonJS package; load it via createRequire in this ESM context
// @ts-ignore
const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Converter = require("openapi-to-postmanv2") as {
  convert: (
    input: { type: "json"; data: unknown },
    options: Record<string, unknown>,
    cb: (err: Error | null, result: { result: boolean; reason?: string; output: Array<{ data: Record<string, unknown> }> }) => void,
  ) => void;
};

async function main() {
  const cwd = process.cwd();

  const cachePath = join(cwd, "cache/openapi.json");
  let spec: unknown;
  try {
    spec = JSON.parse(await readFile(cachePath, "utf-8"));
  } catch {
    console.error("Failed to read cache/openapi.json — run `pnpm fetch-openapi` first");
    process.exit(1);
  }

  console.log("Converting OpenAPI spec to Postman Collection v2.1...");

  const collection = await new Promise<Record<string, unknown>>((resolve, reject) => {
    Converter.convert(
      { type: "json", data: spec },
      {
        optimizeConversion: false,
        requestNameSource: "Fallback",
        exampleParametersResolution: "Schema",
        folderStrategy: "Tags",
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result.result) return reject(new Error(`Conversion failed: ${result.reason}`));
        resolve(result.output[0].data);
      },
    );
  });

  // Drop the experimental folder entirely
  (collection.item as { name?: string }[]) = (collection.item as { name?: string }[]).filter(
    (f) => f.name !== "[Experimental]",
  );

  type UrlObj = { raw?: string; path?: string[]; query?: { disabled?: boolean }[] };
  type CollectionItem = {
    name?: string;
    item?: CollectionItem[];
    request?: { method?: string; url?: UrlObj };
  };

  // Within each folder, find requests that share a name and append their path to disambiguate.
  function deduplicateNames(items: CollectionItem[]) {
    for (const item of items) {
      if (!item.item) continue;
      deduplicateNames(item.item);

      const nameCounts = new Map<string, number>();
      for (const r of item.item) {
        if (r.name) nameCounts.set(r.name, (nameCounts.get(r.name) ?? 0) + 1);
      }

      for (const r of item.item) {
        if (!r.name || (nameCounts.get(r.name) ?? 0) <= 1) continue;
        const path = r.request?.url?.path ?? [];
        const pathStr = "/" + path.map((s) => (s.startsWith(":") ? `{${s.slice(1)}}` : s)).join("/");
        r.name = `${r.name} ${pathStr}`;
      }
    }
  }
  deduplicateNames((collection.item as CollectionItem[]) ?? []);

  // Disable all query params by default so they're visible but unchecked.
  // Users can enable them individually in their API client.
  function disableQueryParams(items: CollectionItem[]) {
    for (const item of items) {
      if (item.item) disableQueryParams(item.item);
      const query = item.request?.url?.query;
      if (Array.isArray(query)) {
        for (const param of query) param.disabled = true;
      }
    }
  }
  disableQueryParams((collection.item as CollectionItem[]) ?? []);

  // Pre-configure OAuth2 auth on the collection so importers get it for free
  collection.auth = {
    type: "oauth2",
    oauth2: [
      { key: "authUrl", value: "https://auth.prisma.io/authorize", type: "string" },
      { key: "accessTokenUrl", value: "https://auth.prisma.io/token", type: "string" },
      { key: "scope", value: "workspace:admin", type: "string" },
      { key: "grant_type", value: "authorization_code", type: "string" },
    ],
  };

  const outputPath = join(cwd, "public/prisma-management-api.postman_collection.json");
  await writeFile(outputPath, JSON.stringify(collection, null, 2), "utf-8");
  console.log(`Generated Postman collection: ${outputPath}`);
}

main().catch((err) => {
  console.error("Failed to generate Postman collection:", err);
  process.exit(1);
});
