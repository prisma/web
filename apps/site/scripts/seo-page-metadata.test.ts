/**
 * Pins the approved SEO copy for the priority platform pages (the 2026
 * post-launch audit, work package 2). The rebrand had replaced descriptive
 * titles with bare product names ("Prisma ORM") and cut the descriptions to
 * one-line taglines; these assertions keep the restored copy in place and keep
 * `createPageMetadata` from silently re-stripping or double-appending the
 * brand suffix.
 *
 * Each page is checked twice: once against the literal in its `page.tsx`
 * (so a copy edit has to be deliberate) and once against the metadata
 * `createPageMetadata` actually resolves (so a helper refactor can't change the
 * rendered `<title>`). The llms.txt / llms-full.txt copies of the same strings
 * are checked against the same table, because that file is a second,
 * independent transcription of every title and description.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import type { Metadata } from "next";
import { buildLlmsFullContent, buildLlmsIndexContent } from "@/app/llms-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-metadata";

const BASE_URL = "https://www.prisma.io";

// `getBaseUrl()` reads this, so canonical and OG URLs are the production ones
// here instead of the localhost dev fallback.
process.env.NEXT_PUBLIC_PRISMA_URL = BASE_URL;

const APP_DIR = path.join(fileURLToPath(new URL("../src/app", import.meta.url)));

type PageCopy = {
  path: string;
  title: string;
  description: string;
  /** The page also has its own titled block in llms-full.txt. */
  llmsBlock?: boolean;
};

/** Approved 2026-09 audit copy. Character for character; do not "improve". */
const PAGES: PageCopy[] = [
  {
    path: "/orm",
    title: "Prisma ORM | Type-Safe ORM for TypeScript and Node.js",
    description:
      "Prisma ORM is a type-safe ORM for TypeScript and Node.js. Model your data, run migrations, and query your database, with access your agent can't get wrong.",
    llmsBlock: true,
  },
  {
    path: "/postgres",
    title: "Prisma Postgres | Serverless PostgreSQL for TypeScript Apps",
    description:
      "Prisma Postgres is a production-ready serverless PostgreSQL database with instant setup, built-in connection pooling, automated backups, and usage-based pricing, already wired to your stack.",
    llmsBlock: true,
  },
  {
    path: "/compute",
    title: "Prisma Compute | Deploy TypeScript Apps and AI Agents on Bun",
    description:
      "Prisma Compute deploys TypeScript apps, APIs, and AI agents from your repo as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming. One platform for your app and its database.",
  },
  {
    path: "/pricing",
    title: "Prisma Pricing | Usage-Based Plans for Postgres and Compute",
    description:
      "Usage-based pricing for your whole stack — Prisma Compute app hosting and Prisma Postgres databases. Pay for the work your app does, not seats or deploys. Free tier with no time limit, hard spend limits on every paid plan.",
    llmsBlock: true,
  },
  {
    path: "/enterprise",
    title: "Prisma Enterprise | ORM Support and Database Workflows for Teams",
    description:
      "Enterprise-level support, security, and guidance for teams running Prisma in production.",
    llmsBlock: true,
  },
  {
    path: "/support",
    title: "Prisma Support | Get Help, Report Bugs, and Request Features",
    description:
      "Get help with Prisma. Search for answers, report bugs, request features, or contact the Prisma support team.",
  },
  {
    path: "/studio",
    title: "Prisma Studio | Visual Database Browser and Editor",
    description:
      "Explore, edit, and understand your data with a visual database browser for Prisma, locally or in Prisma Console.",
    llmsBlock: true,
  },
  {
    path: "/stack",
    title: "The Prisma Stack | ORM, Postgres, and Compute for TypeScript",
    description:
      "ORM, Postgres, and Compute, one platform for your app and its database, with one shared context across your stack.",
  },
];

type MetadataArgs = { title: string; description: string; ogKicker?: string };

/** Reads a `"…"` literal out of the `createPageMetadata({ … })` call source. */
function readStringOption(block: string, option: string): string | undefined {
  const match = block.match(new RegExp(`\\n\\s+${option}:\\s*(?:\\n\\s+)?("(?:[^"\\\\]|\\\\.)*")`));
  return match ? (JSON.parse(match[1]) as string) : undefined;
}

/**
 * Reads the options the page passes to `createPageMetadata`, from source. The
 * page modules themselves can't be imported here: they are React server
 * components pulling in CSS, fonts, and image assets that only Next can resolve.
 */
function readPageMetadataOptions(pagePath: string): MetadataArgs {
  const file = path.join(APP_DIR, pagePath, "page.tsx");
  const source = readFileSync(file, "utf8");
  const start = source.indexOf("export const metadata = createPageMetadata({");
  assert.notEqual(start, -1, `${pagePath}: no createPageMetadata({ … }) metadata export`);
  const end = source.indexOf("\n});", start);
  assert.notEqual(end, -1, `${pagePath}: unterminated createPageMetadata call`);
  const block = source.slice(start, end);

  const title = readStringOption(block, "title");
  const description = readStringOption(block, "description");
  assert.ok(title, `${pagePath}: no literal title in the metadata call`);
  assert.ok(description, `${pagePath}: no literal description in the metadata call`);

  return { title, description, ogKicker: readStringOption(block, "ogKicker") };
}

/** The string Next renders into `<title>`. */
function resolvedTitle(metadata: Metadata): string {
  const title = metadata.title;
  assert.ok(
    title && typeof title === "object" && "absolute" in title,
    "expected an absolute title so the root layout template adds no second suffix",
  );
  return title.absolute;
}

function ogImageUrl(metadata: Metadata): string {
  const images = metadata.openGraph?.images;
  const image = Array.isArray(images) ? images[0] : images;
  assert.ok(image, "expected a generated OG image");
  if (typeof image === "string") return image;
  if (image instanceof URL) return image.toString();
  assert.ok("url" in image, "expected an OG image descriptor with a url");
  return image.url.toString();
}

for (const page of PAGES) {
  test(`${page.path}: page.tsx carries the approved copy`, () => {
    const options = readPageMetadataOptions(page.path);
    assert.equal(options.title, page.title);
    assert.equal(options.description, page.description);
  });

  test(`${page.path}: resolves to the approved title and description`, () => {
    const options = readPageMetadataOptions(page.path);
    const metadata = createPageMetadata({ ...options, path: page.path });

    // The suffix is neither stripped nor doubled: these titles already carry
    // the brand, so the helper must pass them through untouched.
    assert.equal(resolvedTitle(metadata), page.title);
    assert.equal(metadata.description, page.description);
    assert.equal(metadata.openGraph?.title, page.title);
    assert.equal(metadata.twitter?.title, page.title);
    assert.ok(
      !page.title.endsWith(` | ${SITE_NAME}`),
      "approved titles end on the descriptive half, not the brand suffix",
    );
    assert.equal(
      metadata.alternates?.canonical,
      `${BASE_URL}${page.path}`,
      "canonical URL should stay on the page path",
    );
  });

  test(`${page.path}: OG card neither truncates nor repeats the product name`, () => {
    const options = readPageMetadataOptions(page.path);
    const metadata = createPageMetadata({ ...options, path: page.path });
    const card = new URL(ogImageUrl(metadata)).searchParams;
    const headline = card.get("title") ?? "";
    const kicker = card.get("kicker") ?? SITE_NAME;

    assert.ok(headline.length > 0, "OG card has no headline");
    assert.ok(!headline.endsWith("…"), `OG card headline is truncated: ${headline}`);
    assert.ok(
      page.title.endsWith(headline),
      `OG card headline should come from the title: ${headline}`,
    );
    assert.ok(
      !headline.includes(kicker),
      `OG card would print "${kicker}" twice: kicker "${kicker}", headline "${headline}"`,
    );
    // The card's body text is clamped at 200 characters by design
    // (`lib/og-card.ts`), so long descriptions ride on the card as an ellipsed
    // prefix. The meta description tag itself always carries the full string.
    const cardDescription = card.get("description") ?? "";
    const unclamped = cardDescription.endsWith("…")
      ? cardDescription.slice(0, -1).trimEnd()
      : cardDescription;
    assert.ok(
      page.description.startsWith(unclamped),
      `OG card description is not the approved copy: ${cardDescription}`,
    );
  });
}

test("llms.txt lists the approved copy for every priority page", () => {
  const index = buildLlmsIndexContent(BASE_URL);
  for (const page of PAGES) {
    assert.ok(
      index.includes(`- [\`${page.title}\`](${BASE_URL}${page.path}): ${page.description}`),
      `llms.txt entry for ${page.path} does not match the approved copy`,
    );
  }
});

test("llms-full.txt repeats the approved copy for every priority page", () => {
  const full = buildLlmsFullContent(BASE_URL);
  for (const page of PAGES) {
    assert.ok(
      full.includes(`- ${page.title}: ${BASE_URL}${page.path}`),
      `llms-full.txt key page index for ${page.path} does not match the approved copy`,
    );
    if (!page.llmsBlock) continue;
    assert.ok(
      full.includes(
        `URL: ${BASE_URL}${page.path}\nTitle: ${page.title}\nDescription: ${page.description}\n`,
      ),
      `llms-full.txt page block for ${page.path} does not match the approved copy`,
    );
  }
});
