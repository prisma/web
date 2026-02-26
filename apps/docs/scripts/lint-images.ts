#!/usr/bin/env npx tsx

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, "../content");
const PUBLIC_DIR = path.join(__dirname, "../public");

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".ico",
]);

const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*]\(([^)\n]+)\)/g;
const HTML_IMAGE_REGEX = /<img\b[^>]*\bsrc=(["'])(.*?)\1/g;

type Violation = {
  file: string;
  line: number;
  reference: string;
  checkedPath: string;
};

function findMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
      continue;
    }

    if (file.endsWith(".mdx")) fileList.push(filePath);
  }

  return fileList;
}

function stripCodeBlocks(content: string): string {
  // Replace fenced code blocks with an equal number of blank lines so
  // that match.index values stay aligned with the original file's line numbers.
  return content.replace(/```[\s\S]*?```/g, (match) =>
    "\n".repeat((match.match(/\n/g) ?? []).length),
  );
}

function extractMarkdownUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("<") && trimmed.includes(">")) {
    return trimmed.slice(1, trimmed.indexOf(">")).trim();
  }

  const [url] = trimmed.split(/\s+/);
  return url ?? "";
}

function stripQueryAndHash(url: string): string {
  return url.split(/[?#]/, 1)[0] ?? "";
}

function isLocalUrl(url: string): boolean {
  if (!url) return false;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("//")
  ) {
    return false;
  }
  return true;
}

function hasImageExtension(urlPath: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(urlPath).toLowerCase());
}

function toPublicPath(urlPath: string): string | null {
  if (urlPath.startsWith("/docs/")) {
    urlPath = urlPath.slice("/docs".length);
  }

  if (urlPath.startsWith("/")) {
    return path.join(PUBLIC_DIR, urlPath.slice(1));
  }

  // This linter validates public assets only.
  return null;
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function collectViolations(filePath: string): Violation[] {
  const rawContent = fs.readFileSync(filePath, "utf8");
  const content = stripCodeBlocks(rawContent);
  const violations: Violation[] = [];

  const relativeFile = path.relative(process.cwd(), filePath);

  for (const regex of [MARKDOWN_IMAGE_REGEX, HTML_IMAGE_REGEX]) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const rawUrl = regex === MARKDOWN_IMAGE_REGEX ? match[1] : match[2];
      const extracted = regex === MARKDOWN_IMAGE_REGEX ? extractMarkdownUrl(rawUrl) : rawUrl;
      const normalized = stripQueryAndHash(extracted);

      if (!isLocalUrl(normalized) || !hasImageExtension(normalized)) continue;

      const resolvedPublicPath = toPublicPath(normalized);
      if (!resolvedPublicPath) continue;

      if (!fs.existsSync(resolvedPublicPath)) {
        violations.push({
          file: relativeFile,
          line: lineNumberAt(content, match.index),
          reference: normalized,
          checkedPath: path.relative(process.cwd(), resolvedPublicPath),
        });
      }
    }
  }

  return violations;
}

function main(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Public directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  const files = findMdxFiles(CONTENT_DIR);
  const violations = files.flatMap((file) => collectViolations(file));

  if (violations.length === 0) {
    console.log("✅ All local image references in content resolve to public assets.");
    process.exit(0);
  }

  console.error(
    `❌ Found ${violations.length} local image reference(s) that do not exist in public:\n`,
  );

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}`);
    console.error(`  reference: ${violation.reference}`);
    console.error(`  expected:  ${violation.checkedPath}`);
  }

  process.exit(1);
}

main();
