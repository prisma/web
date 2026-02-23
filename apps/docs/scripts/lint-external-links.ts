#!/usr/bin/env npx tsx

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, "../content");
const TIMEOUT_MS = 10_000;
const MAX_CONCURRENCY = 15;
const ACCEPTED_STATUSES = new Set([403, 429]);

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".bmp",
  ".ico",
]);

const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*]\(([^)\n]+)\)/g;
const MARKDOWN_LINK_REGEX = /(?<!!)\[[^\]]*]\(([^)\n]+)\)/g;
const AUTOLINK_REGEX = /<((?:https?:\/\/)[^>\s]+)>/g;
const HTML_ANCHOR_REGEX = /<a\b[^>]*\bhref=(["'])(.*?)\1/gi;
const BROWSER_HEADERS: HeadersInit = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};

type LinkOccurrence = {
  file: string;
  line: number;
};

type FailedResult = {
  url: string;
  reason: string;
  occurrences: LinkOccurrence[];
};

function findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
      continue;
    }

    if (file.endsWith(".md") || file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function stripCodeBlocks(content: string): string {
  return content.replace(CODE_BLOCK_REGEX, (match) =>
    "\n".repeat((match.match(/\n/g) ?? []).length),
  );
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function extractMarkdownUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("<") && trimmed.includes(">")) {
    return trimmed.slice(1, trimmed.indexOf(">")).trim();
  }

  const [url] = trimmed.split(/\s+/);
  return url ?? "";
}

function stripQueryAndHash(url: string): string {
  return url.split(/[?#]/, 1)[0] ?? "";
}

function isImageUrl(url: string): boolean {
  const noQuery = stripQueryAndHash(url);
  try {
    const parsed = new URL(noQuery);
    return IMAGE_EXTENSIONS.has(path.extname(parsed.pathname).toLowerCase());
  } catch {
    return IMAGE_EXTENSIONS.has(path.extname(noQuery).toLowerCase());
  }
}

function toExternalHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (parsed.hostname === "localhost") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function collectFileLinks(filePath: string): Array<{ url: string; line: number }> {
  const rawContent = fs.readFileSync(filePath, "utf8");
  const content = stripCodeBlocks(rawContent);
  const links: Array<{ url: string; line: number }> = [];

  MARKDOWN_IMAGE_REGEX.lastIndex = 0;
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  AUTOLINK_REGEX.lastIndex = 0;
  HTML_ANCHOR_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    const extracted = extractMarkdownUrl(match[1] ?? "");
    if (!extracted) continue;
    const external = toExternalHttpUrl(extracted);
    if (!external || isImageUrl(external)) continue;

    links.push({
      url: external,
      line: lineNumberAt(content, match.index),
    });
  }

  while ((match = AUTOLINK_REGEX.exec(content)) !== null) {
    const external = toExternalHttpUrl(match[1] ?? "");
    if (!external || isImageUrl(external)) continue;

    links.push({
      url: external,
      line: lineNumberAt(content, match.index),
    });
  }

  while ((match = HTML_ANCHOR_REGEX.exec(content)) !== null) {
    const external = toExternalHttpUrl(match[2] ?? "");
    if (!external || isImageUrl(external)) continue;

    links.push({
      url: external,
      line: lineNumberAt(content, match.index),
    });
  }

  return links;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrl(url: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    // Some providers (e.g. VS Marketplace, Bluesky) return 404 for HEAD
    // while the same URL works with GET in a browser.
    let response = await fetchWithTimeout(url, {
      method: "HEAD",
      headers: BROWSER_HEADERS,
    });

    if (response.status >= 400 || response.status === 429) {
      response = await fetchWithTimeout(url, { method: "GET", headers: BROWSER_HEADERS });
    }

    if (response.status === 404) {
      return { ok: false, reason: "HTTP 404" };
    }

    if (ACCEPTED_STATUSES.has(response.status)) {
      return { ok: true };
    }

    if (response.status < 200 || response.status >= 400) {
      return { ok: false, reason: `HTTP ${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, reason: "timeout" };
    }

    const message = error instanceof Error ? error.message : "unknown error";
    return { ok: false, reason: message };
  }
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index];
      index += 1;
      await worker(item);
    }
  });

  await Promise.all(workers);
}

async function main(): Promise<void> {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = findMarkdownFiles(CONTENT_DIR);
  const occurrencesByUrl = new Map<string, LinkOccurrence[]>();
  let extractedLinks = 0;

  for (const filePath of files) {
    const relativeFile = path.relative(process.cwd(), filePath);
    const links = collectFileLinks(filePath);
    extractedLinks += links.length;

    for (const link of links) {
      const occurrences = occurrencesByUrl.get(link.url) ?? [];
      occurrences.push({ file: relativeFile, line: link.line });
      occurrencesByUrl.set(link.url, occurrences);
    }
  }

  const uniqueUrls = [...occurrencesByUrl.keys()];
  const failed: FailedResult[] = [];

  await runWithConcurrency(uniqueUrls, MAX_CONCURRENCY, async (url) => {
    const result = await checkUrl(url);
    if (result.ok) return;

    failed.push({
      url,
      reason: result.reason ?? "invalid status code",
      occurrences: occurrencesByUrl.get(url) ?? [],
    });
  });

  failed.sort((a, b) => a.url.localeCompare(b.url));

  console.log(`Scanned files: ${files.length}`);
  console.log(`Extracted external links: ${extractedLinks}`);
  console.log(`Unique links checked: ${uniqueUrls.length}`);
  console.log(`Failed links: ${failed.length}`);

  if (failed.length === 0) {
    console.log("✅ No failed external links found.");
    process.exit(0);
  }

  console.error("\n❌ Failed external links:\n");
  for (const item of failed) {
    console.error(`${item.url}`);
    console.error(`  reason: ${item.reason}`);
    for (const occurrence of item.occurrences) {
      console.error(`  at: ${occurrence.file}:${occurrence.line}`);
    }
    console.error("");
  }

  process.exit(1);
}

void main();
