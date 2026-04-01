import { readFile } from "node:fs/promises";
import path from "node:path";
import { releaseNotes } from "../../.source/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const changelogSource = loader({
  baseUrl: "/changelog",
  source: toFumadocsSource(releaseNotes, []),
});

export function getSortedReleaseNotes() {
  return [...changelogSource.getPages()].sort((left, right) => {
    const leftDate = new Date(String(left.data.date)).getTime();
    const rightDate = new Date(String(right.data.date)).getTime();

    return rightDate - leftDate;
  });
}

function stripMarkdown(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\\([#:[\]{}()\-])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function truncatePreview(value: string, maxLength = 180) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export async function getReleaseNotePreview(slug: string) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "changelog",
    `${slug}.mdx`,
  );
  let raw: string;

  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
  const body = raw.replace(/^---[\s\S]*?\n---\n?/, "");

  const lines = body.split("\n");
  let inCodeBlock = false;
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    if (!trimmed) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      continue;
    }

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("![") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith(">") ||
      /^\d+\.\s/.test(trimmed)
    ) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      continue;
    }

    currentParagraph.push(trimmed);
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  const preview = paragraphs
    .map(stripMarkdown)
    .find((paragraph) => paragraph.length > 0);

  return preview ? truncatePreview(preview) : null;
}
