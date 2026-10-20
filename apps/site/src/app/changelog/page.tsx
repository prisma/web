import { createPageMetadata } from "@/lib/page-metadata";
import { ChangelogFeed } from "@/components/sections/changelog-feed";
import { ChangelogHero } from "@/components/sections/changelog-hero";
import { CtaBurst } from "@/components/sections/cta-burst";
import { extractPreview, getChangelogEntries } from "@/lib/changelog";
import { categoryForTags, isHighlight, type ChangelogEntry } from "@/lib/changelog-meta";

export const metadata = createPageMetadata({
  title: "Changelog",
  description:
    "New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the platform.",
  path: "/changelog",
  ogKicker: "Changelog",
});

// /changelog — the redesign (spectral hero, product-area filter, colour-coded
// timeline) driven by the live changelog content so it keeps auto-updating.
// Entries come from the same source as the per-entry pages and the AI/GEO feed;
// each entry's product area is derived from its tags (see categoryForTags), and
// the feed is a client component, so we build the list here and pass it down.
export default function ChangelogPage() {
  const entries: ChangelogEntry[] = getChangelogEntries().map((entry) => {
    const title = entry.frontmatter.headline ?? entry.frontmatter.title;
    return {
      date: entry.frontmatter.date,
      title,
      description: entry.frontmatter.metaDescription ?? extractPreview(entry.content) ?? "",
      category: categoryForTags(entry.frontmatter.tags),
      tags: entry.frontmatter.tags?.slice(0, 3) ?? [],
      highlight: isHighlight(title),
      href: `/changelog/${entry.slug}`,
    };
  });

  return (
    <>
      <ChangelogHero />
      <ChangelogFeed entries={entries} />
      <CtaBurst
        headline="Build on a platform that ships"
        headlineMaxWidth="max-w-[20ch]"
        body="Start free with the ORM, and add Postgres and Compute when you need them."
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
