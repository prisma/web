import { ArrowRight } from "@/components/icons/forma";
import { Marker } from "@/components/brand/marker";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import type { AuthorMeta, GalleryTemplate, StackMeta } from "../_lib/catalog";
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

// "by <mark> Prisma": the maintainer, linked. Community templates carry their
// own name and logo from the registry.
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
        {author.logo ? (
          <img
            src={author.logo}
            alt=""
            width={14}
            height={14}
            loading="lazy"
            className="size-3.5 shrink-0 rounded-sm object-contain"
          />
        ) : (
          <PrismaMark className="size-3.5 shrink-0" />
        )}
        {author.name}
      </a>
    </span>
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
