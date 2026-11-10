import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Use the parser shipped with our pinned Next version. This runs in CI only;
// it neither adds a runtime dependency nor mistakes script/comment examples
// for live metadata. Next can stream metadata into the body, so inspect both.
const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser") as {
  parse(
    html: string,
    options: { lowerCaseTagName: boolean },
  ): {
    querySelectorAll(selector: string): { getAttribute(name: string): string | undefined }[];
  };
};

/** Check the public page itself, not merely its ingress headers. */
export function assertIndexable(headers: Headers, html: string, path: string) {
  assert.doesNotMatch(
    headers.get("x-robots-tag") ?? "",
    // `none` can be a standalone exclusion, optionally scoped to a crawler,
    // or a max-image-preview value that leaves the page itself indexable.
    /\bnoindex\b|(?:^|,)\s*(?!max-image-preview\s*:)(?:[^\s:,]+\s*:\s*)?none\s*(?=,|$)/i,
    `${path}: public host must be indexable, including internal ingress headers`,
  );
  for (const meta of parse(html, { lowerCaseTagName: true }).querySelectorAll("meta[name]")) {
    const name = meta.getAttribute("name")?.trim().toLowerCase();
    if (!["robots", "googlebot", "googlebot-news", "bingbot"].includes(name ?? "")) continue;
    assert.doesNotMatch(
      meta.getAttribute("content") ?? "",
      /(?:^|,)\s*(?:noindex|none)(?:$|[\s,])/i,
      `${path}: public host must be indexable, including ${name} robots metadata`,
    );
  }
}
