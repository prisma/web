import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import {
  extensions,
  getExtensionBySlug,
  getInstallCommand,
  getNpmUrl,
  getDatabaseLabel,
  isDatabase,
  isMiddleware,
  EXTENSION_SOURCE_LABELS,
  EXTENSION_STATUS_LABELS,
} from "@prisma-docs/ui/data/extensions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "@/components/icons/forma";
import { DatabaseBadges, SourceBadge, StatusBadge } from "@/components/extensions/badges";
import { CopyCommand, MONO } from "@/components/extensions/copy-command";
import { PanelHero } from "@/components/extensions/panel-hero";
import { getUsageSnippets } from "@/components/extensions/usage-snippets";
import { createPageMetadata } from "@/lib/page-metadata";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return extensions.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getExtensionBySlug(slug);
  if (!entry) return {};
  const maintainer =
    entry.source === "official" ? "maintained by Prisma" : `maintained by ${entry.author.name}`;
  return createPageMetadata({
    title: `${entry.name} | Prisma 8 extension`,
    description: `${entry.tldr} ${entry.package} for Prisma ORM 8, ${maintainer}.`,
    path: `/extensions/${entry.slug}`,
    ogKicker: "Prisma 8 extension",
  });
}

/** Render a description paragraph, turning `code` spans into <code>. */
function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={index} className={cn("rounded bg-black/[0.06] px-1 text-[0.9em]", MONO)}>
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

const LINK = "font-semibold text-primary underline underline-offset-4 hover:text-prism-cyan-700";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.15] text-primary">{children}</h2>
  );
}

export default async function ExtensionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getExtensionBySlug(slug);
  if (!entry) notFound();

  const snippets = getUsageSnippets(entry);

  const structuredData = createSoftwareApplicationStructuredData({
    path: `/extensions/${entry.slug}`,
    name: `${entry.name} for Prisma 8`,
    description: entry.tldr,
  });

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Package", value: <code className={MONO}>{entry.package}</code> },
    { label: "Maintainer", value: EXTENSION_SOURCE_LABELS[entry.source] },
    { label: "Status", value: EXTENSION_STATUS_LABELS[entry.status] },
    { label: "Databases", value: entry.databases.map(getDatabaseLabel).join(", ") },
    {
      label: "Author",
      value: (
        <a href={entry.author.url} className={LINK} rel="noopener noreferrer">
          {entry.author.name}
        </a>
      ),
    },
  ];

  const links = [
    { label: "Source", href: entry.repo, external: true },
    { label: "npm", href: getNpmUrl(entry), external: true },
    ...(entry.docs ? [{ label: "Docs", href: entry.docs, external: false }] : []),
    ...(entry.example ? [{ label: "Example", href: entry.example, external: true }] : []),
  ];

  const isPack = entry.source === "official" && !isMiddleware(entry) && !isDatabase(entry);

  return (
    <>
      <JsonLd id="extension-software-application" data={structuredData} />

      <PanelHero
        kicker="Prisma 8 extension"
        title={entry.name}
        lead={entry.tldr}
        breadcrumb={
          <Link
            href="/extensions"
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-prism-cyan-700"
          >
            <ArrowRight
              className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
            All extensions
          </Link>
        }
      >
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <SourceBadge source={entry.source} />
          <StatusBadge status={entry.status} />
          <DatabaseBadges databases={entry.databases} />
        </div>
        <div className="mt-6 flex w-full max-w-xl flex-col gap-3">
          <CopyCommand command={getInstallCommand(entry)} tone="ink" />
          <div className="flex flex-wrap gap-2">
            {links.map((link, index) => (
              <Button
                key={link.label}
                asChild
                size="sm"
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? undefined : "border-black/[0.3] text-primary"}
              >
                <a href={link.href} rel={link.external ? "noopener noreferrer" : undefined}>
                  {index === 0 ? <Github aria-hidden /> : null}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </PanelHero>

      <section className="bg-white px-4 py-10 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto grid max-w-site gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-3">
              <SectionTitle>What it does</SectionTitle>
              <p className="max-w-[70ch] leading-relaxed text-foreground">
                <InlineCode text={entry.description} />
              </p>
              {entry.source === "community" ? (
                <p className="max-w-[70ch] text-sm leading-relaxed text-foreground">
                  Registration steps are in the package README in the{" "}
                  <a href={entry.repo} className={LINK} rel="noopener noreferrer">
                    source repository
                  </a>
                  .
                </p>
              ) : null}
            </div>

            {snippets.map((snippet) => (
              <div key={snippet.title} className="flex flex-col gap-3">
                <SectionTitle>{snippet.title}</SectionTitle>
                <div className="overflow-hidden rounded-xl border border-black/[0.2]">
                  <div
                    className={cn(
                      "border-b border-black/[0.12] bg-paper px-4 py-2 text-xs text-foreground",
                      MONO,
                    )}
                  >
                    {snippet.file}
                  </div>
                  <pre
                    className={cn(
                      "overflow-x-auto bg-white p-4 text-[13px] leading-relaxed text-primary",
                      MONO,
                    )}
                  >
                    <code className={MONO}>{snippet.code}</code>
                  </pre>
                </div>
              </div>
            ))}

            {isPack ? (
              <p className="max-w-[70ch] text-sm leading-relaxed text-foreground">
                Then run <code className={MONO}>npx prisma@latest db init</code>, or{" "}
                <code className={MONO}>db update</code> on an existing database. The extension ships
                its own migration for anything the database needs installed. Full walkthrough in the{" "}
                <a
                  href="https://www.prisma.io/docs/orm/extensions/using-extensions"
                  className={LINK}
                >
                  extensions docs
                </a>
                .
              </p>
            ) : null}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <dl className="flex flex-col gap-3 rounded-xl border border-black/[0.2] bg-paper p-5 text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="break-words text-primary">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-relaxed text-foreground">
              Wrong or out of date?{" "}
              <a
                href="https://github.com/prisma/web/tree/main/packages/ui/src/data/extensions"
                className={LINK}
                rel="noopener noreferrer"
              >
                Edit the listing on GitHub
              </a>
              .
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
