import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { Badge, InlineTOC, Separator } from "@prisma/eclipse";
import { formatDate, formatTag } from "@/lib/format";
import { createPageMetadata } from "@/lib/page-metadata";
import { changelogSource, getSortedReleaseNotes } from "@/lib/changelog-source";
import { getMDXComponents } from "@/mdx-components";

interface PageParams {
  slug: string[];
}

interface TOCItem {
  title: string;
  url: string;
  depth: number;
  items?: TOCItem[];
}

const changeLabelColors = {
  New: "success",
  Improved: "neutral",
  Fixed: "neutral",
  Breaking: "error",
  Deprecated: "warning",
  Docs: "ppg",
} as const;

const changeLabelPrefix = new RegExp(`^(?:${Object.keys(changeLabelColors).join("|")}) · `);

function stripChangeLabels(items: TOCItem[]): TOCItem[] {
  return items.map((item) => ({
    ...item,
    title: typeof item.title === "string" ? item.title.replace(changeLabelPrefix, "") : item.title,
    items: item.items ? stripChangeLabels(item.items) : undefined,
  }));
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/** Splits "**Label** · rest" list-item children into label + remainder. */
function parseChangeLabelItem(li: ReactElement) {
  const kids = Children.toArray((li.props as { children?: ReactNode }).children);
  const label = textOf(kids[0]).trim() as keyof typeof changeLabelColors;
  const second = kids[1];
  if (!isValidElement(kids[0]) || !(label in changeLabelColors)) return null;
  if (typeof second !== "string" || !second.startsWith(" · ")) return null;
  const rest = second.slice(3);
  return { label, rest: [...(rest ? [rest] : []), ...kids.slice(2)] };
}

/**
 * Groups consecutive same-label items ("New", "Improved", ...) under one
 * badge instead of repeating the bold label on every bullet. Lists without
 * labels render unchanged.
 */
function withChangeLabelGroups(List: ElementType) {
  return function GroupedList({ children, ...props }: ComponentProps<"ul">) {
    const items = Children.toArray(children).filter(isValidElement);
    const parsed = items.map((li) => parseChangeLabelItem(li as ReactElement));
    if (items.length === 0 || parsed.some((p) => p === null)) {
      return <List {...props}>{children}</List>;
    }
    const groups: {
      label: keyof typeof changeLabelColors;
      items: ReactElement[];
    }[] = [];
    items.forEach((li, i) => {
      const { label, rest } = parsed[i]!;
      const item = cloneElement(li as ReactElement<{ children?: ReactNode }>, { children: rest });
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.items.push(item);
      else groups.push({ label, items: [item] });
    });
    return (
      <div className="flex flex-col gap-5 my-5">
        {groups.map((group, i) => (
          <div key={i}>
            <Badge color={changeLabelColors[group.label]} label={group.label} />
            <List {...props} className="mt-2 mb-0">
              {group.items.map((item, j) => cloneElement(item, { key: j }))}
            </List>
          </div>
        ))}
      </div>
    );
  };
}

/** Renders a leading "New · " / "Improved · " etc. in a heading as a badge. */
function withChangeLabelBadge(Heading: ElementType) {
  return function LabeledHeading({ children, ...props }: ComponentProps<"h3">) {
    const nodes = Children.toArray(children);
    const first = nodes[0];
    if (typeof first === "string") {
      for (const [label, color] of Object.entries(changeLabelColors)) {
        if (first.startsWith(`${label} · `)) {
          return (
            <Heading {...props}>
              <Badge color={color} label={label} className="align-middle mr-1" />
              {first.slice(label.length + 3)}
              {nodes.slice(1)}
            </Heading>
          );
        }
      }
    }
    return <Heading {...props}>{children}</Heading>;
  };
}

export default async function ReleaseNotesPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = changelogSource.getPage(slug);

  if (!page) notFound();

  const MDX = page.data.body;
  const description = page.data.summary ?? page.data.description;
  const tags = page.data.tags ?? [];
  const toc = stripChangeLabels((page.data.toc as TOCItem[] | undefined) ?? []);
  const sorted = getSortedReleaseNotes();
  const position = sorted.findIndex((entry) => entry.url === page.url);
  const newer = position > 0 ? sorted[position - 1] : null;
  const older = position >= 0 && position < sorted.length - 1 ? sorted[position + 1] : null;

  // Date-labeled entries set version to the date; showing both repeats it
  const versionLabel =
    page.data.date && page.data.version === new Date(page.data.date).toISOString().slice(0, 10)
      ? null
      : page.data.version;

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <div className="w-full px-4 z-1 mx-auto md:grid md:grid-cols-[1fr_180px] mt-4 md:mt-22 gap-12 max-w-257">
        <div className="post-contents w-full">
          {/* Title + meta */}
          <header className="w-full relative">
            <Link
              href="/changelog"
              className="text-fd-primary hover:underline text-sm absolute -top-8"
            >
              ← Back to Changelog
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-left mt-0 font-sans-display text-foreground-neutral">
              {page.data.title}
            </h1>
            <div className="text-sm flex gap-2 items-center text-foreground-neutral mt-4 mb-6">
              {versionLabel ? (
                <Badge
                  color="neutral"
                  label={versionLabel}
                  className="border border-stroke-neutral bg-background-default text-foreground-neutral"
                />
              ) : null}
              {versionLabel && page.data.date ? (
                <Separator orientation="vertical" className="h-4" />
              ) : null}
              {page.data.date ? (
                <span className="text-foreground-neutral-weak">
                  {formatDate(new Date(page.data.date).toISOString())}
                </span>
              ) : null}
            </div>
            {tags.length > 0 ? (
              <div className="filter-badge flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    color="neutral"
                    label={formatTag(tag)}
                    className="transition-colors border capitalize border-stroke-neutral-strong bg-transparent text-foreground-neutral-weak"
                  />
                ))}
              </div>
            ) : null}
          </header>

          {/* Body */}
          <article className="w-full flex flex-col pb-8 mt-12">
            <div className="prose min-w-0 [&_figure]:w-full [&_figure]:md:max-w-140 [&_figure]:lg:max-w-200">
              {description ? <p className="font-semibold text-lg">{description}</p> : null}

              <MDX
                components={(() => {
                  const components = getMDXComponents({
                    a: createRelativeLink(changelogSource, page),
                  });
                  components.h3 = withChangeLabelBadge((components.h3 ?? "h3") as ElementType);
                  components.ul = withChangeLabelGroups((components.ul ?? "ul") as ElementType);
                  return components;
                })()}
              />
            </div>
          </article>
          <Separator className="my-12" />

          {older || newer ? (
            <nav aria-label="More release notes" className="flex justify-between gap-8 mb-12">
              {older ? (
                <Link href={older.url} className="group flex flex-col gap-1 max-w-[45%]">
                  <span className="text-sm text-foreground-neutral-weak">← Older</span>
                  <span className="text-foreground-neutral font-semibold group-hover:underline">
                    {older.data.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link
                  href={newer.url}
                  className="group flex flex-col gap-1 max-w-[45%] text-right items-end"
                >
                  <span className="text-sm text-foreground-neutral-weak">Newer →</span>
                  <span className="text-foreground-neutral font-semibold group-hover:underline">
                    {newer.data.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          ) : null}

          {/* Share Container */}
          {/* <BlogShare desc={page.data.metaDescription as string} /> */}

          {/* Newsletter CTA */}
          {/* <div className="w-full px-8 py-12 shadow-box-low newsletter-bg rounded-square border border-background-neutral flex max-sm:flex-col wrap items-start gap-4 sm:items-center justify-between my-12">
          <FooterNewsletterForm apiUrl={newsletterApiUrl} />
        </div> */}
        </div>
        {toc.length > 0 ? (
          <div className="max-md:hidden toc">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto [&_a[data-state=inactive]]:text-foreground-neutral-weak! [&_a[data-state=active]]:text-foreground-neutral!">
              <span className="text-shadow-foreground-neutral-reverse font-semibold text-md mb-4 mt-0 block">
                On this page
              </span>
              <InlineTOC items={toc} className="px-0" />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = changelogSource.getPage(slug);

  if (!page) notFound();

  return createPageMetadata({
    title: page.data.metaTitle ?? `${page.data.title} | Prisma`,
    description:
      page.data.metaDescription ??
      page.data.summary ??
      page.data.description ??
      "Read the latest Prisma release notes.",
    path: page.url,
    ogImage: page.data.ogImage ?? "/og/og-changelog.png",
  });
}

export function generateStaticParams(): PageParams[] {
  return changelogSource.getPages().map((page) => ({
    slug: page.slugs,
  }));
}
