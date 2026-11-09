import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { extensions } from "@prisma-docs/ui/data/extensions";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { CopyCommand, MONO } from "@/components/extensions/copy-command";
import { ExtensionsDirectory } from "@/components/extensions/directory";
import { PanelHero } from "@/components/extensions/panel-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { createCollectionPageStructuredData } from "@/lib/structured-data";

const PAGE_TITLE = "Prisma 8 Extensions | Databases, column types, indexes, and middleware";
const PAGE_DESCRIPTION =
  "Every package that plugs into Prisma ORM 8: PostgreSQL, MongoDB, and SQLite support, pgvector, PostGIS, full-text search, typed JSON, and caching, by Prisma and the community.";
const DOCS_EXTENSIONS = "https://www.prisma.io/docs/orm/extensions/using-extensions";
const DOCS_PUBLISH = "https://www.prisma.io/docs/orm/extensions#publish-your-own";
const NPM_KEYWORD_SEARCH = "https://www.npmjs.com/search?q=keywords:prisma-orm-extension";
const LINK = "font-semibold text-primary underline underline-offset-4 hover:text-prism-cyan-700";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/extensions",
  ogKicker: "Prisma 8 Extensions",
});

const structuredData = createCollectionPageStructuredData({
  path: "/extensions",
  name: "Prisma 8 Extensions",
  description: PAGE_DESCRIPTION,
  items: extensions.map((entry) => ({
    url: `/extensions/${entry.slug}`,
    name: entry.name,
    description: entry.tldr,
  })),
});

export default function ExtensionsPage() {
  return (
    <>
      <JsonLd id="extensions-collection" data={structuredData} />

      <PanelHero
        kicker="Prisma ORM 8"
        title="Extensions"
        lead="Everything that plugs into Prisma 8: the database packages, column types, indexes, query operations, and middleware. Each one is an npm package you install and register in your config and on your client."
      >
        <div className="mt-6 flex w-full max-w-xl flex-col gap-3">
          <CopyCommand command="npm install @prisma/orm-extension-pgvector" tone="ink" />
          <div className="flex flex-wrap items-center gap-3">
            <PrismButton href="/extensions/submit" ctaLocation="extensions-hero">
              Submit an extension
            </PrismButton>
            <PrismButtonOutline href={DOCS_EXTENSIONS}>How extensions work</PrismButtonOutline>
          </div>
        </div>
      </PanelHero>

      <section className="bg-white px-4 py-10 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-site flex-col gap-8">
          <ExtensionsDirectory entries={extensions} />
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
            <p>
              Writing a Prisma 8 extension? The{" "}
              <a href={DOCS_PUBLISH} className={LINK}>
                developer documentation
              </a>{" "}
              covers its entry points, its name, and how to publish it.
            </p>
            <p>
              Every community extension lists the keyword <code className={MONO}>prisma-orm-extension</code> in its{" "}
              <code className={MONO}>package.json</code>, so you can{" "}
              <a href={NPM_KEYWORD_SEARCH} className={LINK} rel="noopener noreferrer">
                find them all on npm
              </a>
              .
            </p>
            <p>
              Maintain a Prisma 8 extension?{" "}
              <a href="/extensions/submit" className={LINK}>
                Submit it
              </a>{" "}
              and the form opens the pull request. Listings live in{" "}
              <a
                href="https://github.com/prisma/web/tree/main/packages/ui/src/data/extensions"
                className={LINK}
                rel="noopener noreferrer"
              >
                prisma/web
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
