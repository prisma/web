import Mixedbread from "@mixedbread/sdk";
import type { StoreFile } from "@mixedbread/sdk/resources/stores/files";
import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";

const origin = "https://www.prisma.io";
const storeName = "website-search";
const owner = "prisma-website-sitemap";
const write = process.argv.includes("--write");
const allowed = (url: URL) =>
  url.origin === origin && !/^\/(docs|blog|eclipse|api)(\/|$)/.test(url.pathname);
const sitemap = await fetch(`${origin}/sitemap-site.xml`, { signal: AbortSignal.timeout(30_000) });
if (!sitemap.ok) throw new Error(`Sitemap returned ${sitemap.status}`);
const browser = await chromium.launch();
const corpus = new Map<string, { title: string; text: string; hash: string }>();
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route("**/*", (route) =>
    route.request().resourceType() === "document" ? route.continue() : route.abort(),
  );
  const parser = await context.newPage();
  const urls = await parser.evaluate(
    (xml) =>
      Array.from(
        new DOMParser().parseFromString(xml, "application/xml").querySelectorAll("loc"),
        (node) => node.textContent ?? "",
      ),
    await sitemap.text(),
  );
  await parser.close();
  if (!urls.length) throw new Error("Site sitemap is empty");
  const queue = [...new Set(urls)].filter((url) => allowed(new URL(url)));
  let skipped = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      const page = await context.newPage();
      while (queue.length) {
        const target = queue.shift()!;
        const response = await page.goto(target, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        if (response?.status() === 404 || response?.status() === 410) {
          skipped++;
          continue;
        }
        if (!response?.ok()) throw new Error(`Cannot index ${target}: HTTP ${response?.status()}`);
        if (!allowed(new URL(page.url()))) {
          skipped++;
          continue;
        }
        const snapshot = await page.evaluate(() => {
          const noindex = document
            .querySelector('meta[name="robots"]')
            ?.getAttribute("content")
            ?.toLowerCase()
            .includes("noindex");
          const root = (document.querySelector("main") ?? document.body).cloneNode(
            true,
          ) as HTMLElement;
          root
            .querySelectorAll(
              "script,style,noscript,nav,header,footer,aside,svg,form,[hidden],[aria-hidden=true]",
            )
            .forEach((node) => node.remove());
          root
            .querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,div,section,article")
            .forEach((node) => node.appendChild(document.createTextNode(" ")));
          return {
            noindex,
            title: document.title,
            text: root.textContent?.replace(/\s+/g, " ").trim() ?? "",
            canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          };
        });
        if (snapshot.noindex) {
          skipped++;
          continue;
        }
        const url = new URL(snapshot.canonical || page.url(), origin);
        if (!allowed(url)) {
          skipped++;
          continue;
        }
        if (snapshot.text.length < 80 || !snapshot.title) {
          console.log(`Skipping page without substantive text: ${target}`);
          skipped++;
          continue;
        }
        const path = url.pathname.replace(/\/$/, "") || "/";
        const text = `# ${snapshot.title}\n\n${snapshot.text}\n`;
        corpus.set(path, {
          title: snapshot.title,
          text,
          hash: createHash("sha256").update(text).digest("hex"),
        });
      }
      await page.close();
    }),
  );
  console.log(
    `Crawled ${corpus.size} canonical website pages; skipped ${skipped} redirects, noindex, or removed pages.`,
  );
} finally {
  await browser.close();
}
if (!corpus.has("/postgres") || !corpus.has("/pricing") || !corpus.has("/"))
  throw new Error("Core website pages missing from crawl");
if (!write) {
  console.log("Dry run: no Mixedbread changes.");
} else {
  if (!process.env.MIXEDBREAD_API_KEY) throw new Error("MIXEDBREAD_API_KEY is required");
  const client = new Mixedbread({ apiKey: process.env.MIXEDBREAD_API_KEY });
  try {
    await client.stores.retrieve(storeName);
  } catch (error) {
    if (!(error instanceof Mixedbread.APIError) || error.status !== 404) throw error;
    await client.stores.create({
      name: storeName,
      description: "Published Prisma website pages. Managed by sitemap sync.",
      is_public: false,
    });
  }
  const existing: StoreFile[] = [];
  let after: string | null | undefined;
  do {
    const result = await client.stores.files.list(storeName, { limit: 100, after });
    existing.push(...result.data);
    after = result.pagination.has_more ? result.pagination.last_cursor : null;
    if (result.pagination.has_more && !after) throw new Error("Missing file pagination cursor");
  } while (after);
  const byId = new Map(existing.map((file) => [file.external_id, file]));
  const pending = [...corpus];
  let uploaded = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (pending.length) {
        const [path, document] = pending.shift()!;
        const externalId = `${owner}:${path}`;
        const previous = byId.get(externalId);
        const metadata = previous?.metadata as Record<string, unknown> | undefined;
        if (previous?.status === "completed" && metadata?.content_hash === document.hash) continue;
        const file = await client.stores.files.uploadAndPoll({
          storeIdentifier: storeName,
          file: new File([document.text], `${encodeURIComponent(path)}.md`, {
            type: "text/markdown",
          }),
          body: {
            external_id: externalId,
            overwrite: true,
            metadata: {
              managed_by: owner,
              source: "website",
              url: path,
              title: document.title,
              content_hash: document.hash,
            },
          },
          pollIntervalMs: 2000,
          pollTimeoutMs: 300_000,
        });
        if (file.status !== "completed") throw new Error(`Indexing failed for ${path}`);
        uploaded++;
      }
    }),
  );
  // Prune only this sync's files, and only after a complete successful crawl/upload.
  let removed = 0;
  for (const file of existing) {
    const metadata = file.metadata as Record<string, unknown> | undefined;
    if (
      metadata?.managed_by === owner &&
      typeof metadata.url === "string" &&
      !corpus.has(metadata.url)
    ) {
      await client.stores.files.delete(file.id, { store_identifier: storeName });
      removed++;
    }
  }
  const result = await client.stores.search({
    query: "Prisma Postgres",
    store_identifiers: [storeName],
    top_k: 10,
    search_options: { rerank: true, return_metadata: true },
  });
  if (
    !result.data.some((chunk) => (chunk.metadata as Record<string, unknown>)?.url === "/postgres")
  )
    throw new Error("Website search smoke test did not return /postgres");
  console.log(
    `Website store ready: ${corpus.size} pages, ${uploaded} uploaded, ${removed} removed. Live Postgres search passed.`,
  );
}
