import { getReleaseNotePreview, getSortedReleaseNotes } from "@/lib/changelog-source";
import { getBaseUrl } from "@/lib/url";

export const revalidate = false;

function formatTags(tags: string[] | undefined) {
  if (!tags || tags.length === 0) return "";
  return ` [${tags.join(", ")}]`;
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const entries = getSortedReleaseNotes();

  const entriesWithPreview = await Promise.all(
    entries.map(async (entry) => {
      const summary =
        entry.data.summary ??
        entry.data.description ??
        (entry.slugs[0] ? await getReleaseNotePreview(entry.slugs[0]) : null);
      return { entry, summary };
    }),
  );

  const entryLines = entriesWithPreview
    .map(({ entry, summary }) => {
      const url = `${baseUrl}${entry.url}`;
      const tags = formatTags(entry.data.tags as string[] | undefined);
      const date =
        entry.data.date instanceof Date
          ? entry.data.date.toISOString().slice(0, 10)
          : String(entry.data.date);
      const lines = [
        `## ${entry.data.version} — ${entry.data.title}`,
        `Date: ${date}${tags}`,
        `URL: ${url}`,
      ];
      if (summary && summary.length > 30) lines.push(``, summary);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  const content = `# Prisma Changelog

> Prisma changes frequently. Before implementing Prisma features, verify against this changelog and the current documentation at https://www.prisma.io/docs.
> Do not rely solely on training data for Prisma APIs, configuration, or conventions — these can change between versions.
>
> How to use: fetch this file to check for recent or breaking changes, then look up the relevant topic in the documentation.

Canonical URL: ${baseUrl}/changelog
Machine-readable index: ${baseUrl}/changelog.md

---

${entryLines}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
