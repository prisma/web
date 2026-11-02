import { useState } from "react";
import { ArrowRight } from "@/components/icons/forma";
import { Marker } from "@/components/brand/marker";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import {
  authorBadge,
  type AuthorMeta,
  type GalleryTemplate,
  type StackMeta,
} from "../_lib/catalog";
import { PrismaMark } from "./prisma-mark";
import { TemplatePreview } from "./template-preview";

// One template. The preview leads, then the use case, name and description,
// then the stack chips (each a link into the matching page on prisma.io), and
// the two actions pinned to the bottom so every card's buttons line up.
//
// The preview and the title both link to the console's deploy flow; the
// preview link is taken out of the tab order so keyboard users reach each
// template once.

export function TemplateCard({ template }: { template: GalleryTemplate }) {
  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_10px_24px_-16px_rgba(21,21,21,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_1px_2px_rgba(21,21,21,0.05),0_18px_40px_-18px_rgba(21,21,21,0.22)] motion-reduce:transition-none">
      <a
        href={template.deployUrl}
        tabIndex={-1}
        aria-hidden
        className="block border-b border-black/[0.06]"
      >
        <TemplatePreview template={template} />
      </a>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex min-h-5 items-center gap-2 text-xs font-medium text-muted-foreground">
          <AuthorLine author={template.author} />
          {template.useCase && (
            <>
              <span aria-hidden>·</span>
              <span>{template.useCase}</span>
            </>
          )}
          {template.isNew && (
            <Marker color="bg-prism-red-500" className="ml-auto">
              New
            </Marker>
          )}
        </div>

        <h3 className="mt-2 text-xl leading-snug">
          <a
            href={template.deployUrl}
            className="spectrum-underline text-foreground"
            aria-label={`Use the ${template.name} app`}
          >
            {template.name}
          </a>
        </h3>

        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {template.description}
        </p>

        {template.stack.length > 0 && <StackChips stack={template.stack} />}

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          <PrismButtonOutline
            href={template.deployUrl}
            className="flex-1"
            ctaLocation="templates-card"
          >
            Use this app
          </PrismButtonOutline>
          <a
            href={template.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/source inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
            aria-label={`View the ${template.name} source on GitHub`}
          >
            View source
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover/source:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </article>
  );
}

// "by <mark> {name}", linked to the author's GitHub profile. "View source"
// is a separate link and is not this one. Prisma keeps the Prisma mark.
// Community authors show their GitHub profile photo; if that photo fails,
// the GitHub mark takes the same 14px slot. Never the Prisma logo.
function AuthorLine({ author }: { author: AuthorMeta }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>by</span>
      <a
        href={author.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
      >
        <AuthorMark author={author} />
        {author.name}
      </a>
    </span>
  );
}

function AuthorMark({ author }: { author: AuthorMeta }) {
  const badge = authorBadge(author);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (badge.kind === "prisma") {
    return <PrismaMark className="size-3.5 shrink-0" />;
  }

  if (badge.kind === "github" || failedSrc === badge.src) {
    return <GithubMark />;
  }

  return (
    <img
      src={badge.src}
      alt=""
      width={14}
      height={14}
      loading="lazy"
      className="size-3.5 shrink-0 rounded-sm object-contain"
      onError={() => setFailedSrc(badge.src)}
    />
  );
}

// Filled invertocat, the same drawing as /icons/technologies/github-dark.svg,
// in currentColor so a failed photo still reads in the 14px author slot.
function GithubMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 98 96"
      width={14}
      height={14}
      aria-hidden
      fill="currentColor"
      className="size-3.5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a47 47 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StackChips({ stack }: { stack: StackMeta[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
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
                loading="lazy"
                className="size-3.5 shrink-0 object-contain"
              />
            ) : (
              <PrismaMark className="size-3.5 shrink-0" />
            )}
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
