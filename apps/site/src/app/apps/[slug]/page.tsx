import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { Marker } from "@/components/brand/marker";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { ArrowRight, Github } from "@/components/icons/forma";
import { CtaBurst } from "@/components/sections/cta-burst";
import { createPageMetadata } from "@/lib/page-metadata";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { PrismaMark } from "../_components/prisma-mark";
import { ShareRow } from "../_components/share-row";
import { TemplatePreview } from "../_components/template-preview";
import {
  authorBadge,
  CONTRIBUTE,
  ogCardPathFor,
  templatePage,
  type GalleryTemplate,
  type StackMeta,
} from "../_lib/catalog";
import { findTemplate, loadTemplates } from "../_lib/manifest";

// One template's public page: /apps/{id}. The manifest decides which pages
// exist, so a template added there gets a page on the next revalidation with
// no site change; the registry's optional `page` block sharpens the copy.
// Built at deploy time for the templates known then, and on demand for any
// added since; a slug the manifest does not know is a 404.

type Params = { slug: string };

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  const templates = await loadTemplates();
  return templates.map((template) => ({ slug: template.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const template = await findTemplate(slug);
  if (!template) return {};
  const page = templatePage(template);
  const metadata = createPageMetadata({
    title: page.title,
    description: page.description,
    path: template.pagePath,
    ogImage: {
      path: ogCardPathFor(template),
      alt: `${template.name}, a ${template.framework.label} app by ${template.author.name}, running in a browser`,
    },
  });
  // The card gets its own, shorter headline; the <title> keeps the SEO one.
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, title: page.ogTitle, description: page.ogDescription },
    twitter: { ...metadata.twitter, title: page.ogTitle, description: page.ogDescription },
  };
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const template = await findTemplate(slug);
  if (!template) notFound();

  const page = templatePage(template);
  const pageUrl = new URL(template.pagePath, getBaseUrl()).toString();
  const isPrisma = authorBadge(template.author).kind === "prisma";

  const structuredData = createSoftwareApplicationStructuredData({
    path: template.pagePath,
    name: template.name,
    description: page.description,
    downloadUrl: template.sourceUrl,
    image: template.preview ?? undefined,
    author: isPrisma ? undefined : { name: template.author.name, url: template.author.href },
  });

  return (
    <>
      <JsonLd id="app-software-application" data={structuredData} />

      <Hero template={template} tagline={page.tagline} demoUrl={page.demoUrl} />

      <section className="bg-white px-4 py-12 pb-20 sm:px-8 sm:py-16 sm:pb-24">
        <div className="mx-auto grid max-w-site gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-12">
            <div className="flex flex-col gap-5">
              <SectionTitle>What it does</SectionTitle>
              {page.highlights.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {page.highlights.map((highlight, index) => (
                    <li
                      key={highlight.title}
                      className="flex flex-col gap-2 rounded-2xl border border-black/[0.08] bg-card p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
                    >
                      <span
                        aria-hidden
                        className={`size-2 rounded-full ${HIGHLIGHT_DOTS[index % HIGHLIGHT_DOTS.length]}`}
                      />
                      <h3 className="text-lg leading-snug">{highlight.title}</h3>
                      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                        {highlight.body}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="max-w-[70ch] leading-relaxed text-foreground">
                  {template.description} The code is open source, so read it, fork it and make it
                  yours; the README in the repository walks through running it locally.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <SectionTitle>Deploy it in a minute</SectionTitle>
              <ol className="grid gap-4 sm:grid-cols-3">
                {DEPLOY_STEPS.map((step, index) => (
                  <li key={step.title} className="flex flex-col gap-2">
                    <span className="font-heading text-sm text-muted-foreground">0{index + 1}</span>
                    <h3 className="text-base leading-snug">{step.title}</h3>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <PrismButtonOutline href={template.deployUrl} ctaLocation="app-page-deploy-steps">
                  Deploy on Prisma
                </PrismButtonOutline>
                <a
                  href="/docs/compute"
                  className="group/docs inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
                >
                  How Prisma Compute works
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/docs:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-black/[0.08] pt-8">
              <h2 className="text-base font-semibold text-foreground">Share this app</h2>
              <ShareRow url={pageUrl} title={page.ogTitle} />
            </div>
          </div>

          <Facts template={template} builtWith={page.builtWith} license={page.license} />
        </div>
      </section>

      <CtaBurst
        headline="Built something on the Prisma Stack?"
        headlineMaxWidth="max-w-[20ch]"
        body="Community templates get a page like this one, with your name on it. Add a folder under compute/ in prisma-examples, name yourself in the manifest, and open a pull request."
        checks={[
          { label: "Open source, under your GitHub name", color: "text-prism-cyan-500" },
          { label: "One-click deploy from the Prisma Console", color: "text-prism-yellow-400" },
          { label: "Listed on prisma.io/apps", color: "text-prism-red-500" },
        ]}
        primaryCta={{ label: "Read the contributing guide", href: CONTRIBUTE.guideUrl }}
        secondaryCta={{ label: "Browse all apps", href: "/apps" }}
      />
    </>
  );
}

const HIGHLIGHT_DOTS = [
  "bg-prism-cyan-400",
  "bg-prism-yellow-300",
  "bg-prism-red-500",
  "bg-foreground/60",
] as const;

// From the deploy-button contract (docs/compute/deploy-button) and the
// template READMEs: the button copies the repository to the visitor's GitHub
// account, the first deploy provisions the database and runs the migrations,
// and the connected branch deploys on every push afterwards.
const DEPLOY_STEPS = [
  {
    title: "Click Deploy on Prisma",
    body: "The Prisma Console copies the repository to your GitHub account and connects it to a new project.",
  },
  {
    title: "Get a database with it",
    body: "The first deploy provisions Prisma Postgres, applies the migrations and runs the app on Bun.",
  },
  {
    title: "Push to ship",
    body: "Every push to the connected branch deploys. Other branches get their own preview with an empty database.",
  },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">{children}</h2>;
}

// Panel hero in the /apps idiom: hairline border, Compute's red wash along the
// bottom edge, copy on the left and the running app on the right.
function Hero({
  template,
  tagline,
  demoUrl,
}: {
  template: GalleryTemplate;
  tagline: string;
  demoUrl: string | null;
}) {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-red-400) 16%, transparent), transparent 70%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto grid max-w-site items-center gap-10 pb-12 pt-16 md:pt-20 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-14 lg:pb-16">
            <div className="flex flex-col items-start">
              <Link
                href="/apps"
                className="group/back mb-6 flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-prism-cyan-700"
              >
                <ArrowRight
                  className="size-4 rotate-180 transition-transform duration-300 group-hover/back:-translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
                All apps
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <RoleKicker color="bg-prism-red-500">Prisma Compute app</RoleKicker>
                {template.isNew && <Marker color="bg-prism-red-500">New</Marker>}
              </div>

              <h1 className="isolate mt-3 text-balance text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[1.06]">
                {template.name}
              </h1>

              <p className="mt-4 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                {tagline}
              </p>

              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <AuthorLine template={template} />
                <span aria-hidden>·</span>
                <FrameworkLink template={template} />
                {template.useCase && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{template.useCase}</span>
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PrismButton href={template.deployUrl} ctaLocation="app-page-hero" size="lg">
                  Deploy on Prisma
                </PrismButton>
                <PrismButtonOutline
                  href={template.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  ctaLocation="app-page-hero-source"
                  size="lg"
                >
                  <Github className="size-[18px]" aria-hidden />
                  View source
                </PrismButtonOutline>
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/demo inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
                  >
                    Open the live demo
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/demo:translate-x-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </a>
                )}
              </div>
            </div>

            <figure className="group/card relative min-w-0">
              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.05),0_24px_60px_-24px_rgba(21,21,21,0.3)]">
                <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-paper px-4 py-2.5">
                  <span aria-hidden className="size-2.5 rounded-full bg-prism-red-500" />
                  <span aria-hidden className="size-2.5 rounded-full bg-prism-yellow-300" />
                  <span aria-hidden className="size-2.5 rounded-full bg-prism-cyan-400" />
                </div>
                <TemplatePreview
                  template={template}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
              </div>
              <figcaption className="sr-only">{template.name} running in a browser</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthorLine({ template }: { template: GalleryTemplate }) {
  const badge = authorBadge(template.author);
  return (
    <span className="inline-flex items-center gap-1.5">
      by
      <a
        href={template.author.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
      >
        {badge.kind === "prisma" ? (
          <PrismaMark className="size-4" />
        ) : badge.kind === "photo" ? (
          <img
            src={badge.src}
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0 rounded-full object-cover"
          />
        ) : null}
        {template.author.name}
      </a>
    </span>
  );
}

function FrameworkLink({ template }: { template: GalleryTemplate }) {
  const { framework } = template;
  const inner = (
    <>
      {framework.logo && (
        <img src={framework.logo} alt="" width={16} height={16} className="size-4 object-contain" />
      )}
      {framework.label}
    </>
  );
  const className =
    "inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-prism-cyan-700";
  // Framework pages may live in the docs zone, so this is a plain anchor.
  return framework.href ? (
    <a href={framework.href} className={className}>
      {inner}
    </a>
  ) : (
    <span className={className}>{inner}</span>
  );
}

// The sidebar: the facts a reader scans before deploying, each a link into
// the matching page on prisma.io or out to the source.
function Facts({
  template,
  builtWith,
  license,
}: {
  template: GalleryTemplate;
  builtWith: readonly { label: string; href: string }[];
  license: { label: string; href: string };
}) {
  const added = template.publishedAt
    ? new Date(`${template.publishedAt}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
      <dl className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-paper p-5 text-sm">
        <Fact label="Stack">
          <StackList stack={template.stack} />
        </Fact>
        {builtWith.length > 0 && (
          <Fact label="Built with">
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {builtWith.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Fact>
        )}
        {added && <Fact label="Added">{added}</Fact>}
        <Fact label="Source">
          <a href={template.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            prisma-examples/{template.path}
          </a>
        </Fact>
        <Fact label="License">
          <a href={license.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            {license.label}
          </a>
        </Fact>
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Something wrong on this page?{" "}
        <a
          href="https://github.com/prisma/web/tree/main/apps/site/src/app/apps/_lib/catalog.ts"
          target="_blank"
          rel="noopener noreferrer"
          className={LINK}
        >
          Edit the listing on GitHub
        </a>
        .
      </p>
    </aside>
  );
}

const LINK = "font-semibold text-foreground underline underline-offset-4 hover:text-prism-cyan-700";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="break-words text-foreground">{children}</dd>
    </div>
  );
}

function StackList({ stack }: { stack: StackMeta[] }) {
  if (stack.length === 0) return <span>TypeScript on Prisma Compute</span>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.08] bg-white px-2 py-1 text-xs font-medium leading-none text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            {item.logo ? (
              <img
                src={item.logo}
                alt=""
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            ) : (
              <PrismaMark className="size-3.5" />
            )}
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
