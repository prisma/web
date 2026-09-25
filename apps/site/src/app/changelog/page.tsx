import { createPageMetadata } from "@/lib/page-metadata";
import { ChangelogFeed } from "@/components/sections/changelog-feed";
import { ChangelogHero } from "@/components/sections/changelog-hero";
import { CtaBurst } from "@/components/sections/cta-burst";
import { getChangelogFeedEntries } from "@/lib/changelog";

export const metadata = createPageMetadata({
  title: "Changelog",
  description:
    "New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the Prisma platform.",
  path: "/changelog",
  ogKicker: "Changelog",
});

// /changelog — the same MDX release notes as before (content/changelog, also
// served machine-readable at /changelog.md), given the brand front door
// (spectral hero), a product-area filter, and a colour-coded release timeline
// you can scan without reading. The category, tags and highlight flag per
// entry come from the entry's frontmatter via lib/changelog.ts.
export default function ChangelogPage() {
  const entries = getChangelogFeedEntries();

  return (
    <>
      <ChangelogHero />
      <ChangelogFeed entries={entries} />
      <CtaBurst
        headline="Build on a platform that ships"
        headlineMaxWidth="max-w-[20ch]"
        body="Everything above landed in the last few months. Start free with the ORM, and add Postgres and Compute when you need them."
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io/sign-up" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
