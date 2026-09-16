import assert from "node:assert/strict";
import Mixedbread from "@mixedbread/sdk";
import { searchPages, GET } from "../src/lib/unified-search";
import { assertSearchScope } from "./search-verification";

const client = new Mixedbread({ apiKey: process.env.MIXEDBREAD_API_KEY });
let inspectionFailed = false;
for (const name of ["web-search", "blog-search", "website-search"]) {
  try {
    const store = await client.stores.retrieve(name);
    console.log(JSON.stringify({ name, status: store.status }));
  } catch (error) {
    if (error instanceof Mixedbread.APIError) {
      inspectionFailed = true;
      console.log(JSON.stringify({ name, status: error.status }));
    } else throw error;
  }
}
if (inspectionFailed) process.exitCode = 1;
if (!inspectionFailed && process.argv.includes("--verify")) {
  for (const source of ["website", "docs", "blog", "all"] as const) {
    const result = await searchPages("Prisma Postgres", source);
    assertSearchScope(result, source);
    if (source === "website") assert.ok(result.some((item) => item.url === "/postgres"));
    console.log(
      JSON.stringify({
        source,
        count: result.length,
        urls: result.slice(0, 3).map((item) => item.url),
      }),
    );
    const response = await GET(
      new Request(`https://www.prisma.io/api/search?query=Prisma%20Postgres&tag=${source}`),
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assertSearchScope(body, source);
    assert.ok(
      body.every((item: { url: string }) => new URL(item.url).origin === "https://www.prisma.io"),
    );
  }
  console.log("Live Mixedbread-only search and HTTP handler verification passed for all sources.");
}
