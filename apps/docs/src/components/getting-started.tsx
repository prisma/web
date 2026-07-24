"use client";
import { type ReactNode, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import posthog from "posthog-js";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

function copyText(container: HTMLElement | null): string {
  const pre = container?.querySelector("pre");
  return (pre?.textContent ?? container?.textContent ?? "").trim();
}

/**
 * A collapsed, copyable agent prompt. The prompt itself is authored as a
 * regular fenced code block child, so it stays in the DOM for crawlers and in
 * the generated .md / llms output for agents; visually it collapses into a
 * single row with copy and view actions.
 */
export function AgentPrompt({
  title = "Use with your agent",
  guideHref,
  guideTitle = "Guide",
  children,
}: {
  title?: string;
  guideHref?: string;
  guideTitle?: string;
  children: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [checked, onCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(copyText(bodyRef.current));
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname });
  });

  return (
    <div className="not-prose my-3 rounded-xl border bg-fd-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2.5">
        <i className="fa-regular fa-sparkles text-fd-primary text-[0.8rem]" aria-hidden="true" />
        <span className="grow text-sm font-medium">{title}</span>
        {guideHref && (
          <a
            href={withDocsBasePath(guideHref)}
            className="text-sm font-medium text-fd-primary hover:underline"
          >
            {guideTitle}{" "}
            <i className="fa-regular fa-arrow-right text-[0.7rem]" aria-hidden="true" />
          </a>
        )}
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <i
            className={cn("fa-regular text-[0.7rem]", open ? "fa-chevron-up" : "fa-chevron-down")}
            aria-hidden="true"
          />
          {open ? "Hide" : "View"}
        </button>
        <button
          className={cn(buttonVariants({ color: "primary", size: "sm", className: "gap-2" }))}
          onClick={onCopy}
        >
          <i
            className={cn("fa-regular text-[0.8rem]", checked ? "fa-check" : "fa-copy")}
            aria-hidden="true"
          />
          Copy prompt
        </button>
      </div>
      <div ref={bodyRef} className={cn("border-t px-3 pb-1 [&_pre]:text-[0.8rem]", !open && "sr-only")}>
        {children}
      </div>
    </div>
  );
}

/**
 * Hero card: AI Prompt and CLI tabs with a shared copy action, in the style
 * of the Supabase docs hero. The prompt is a fenced code block child
 * (crawlable + present in .md output); the CLI commands are passed as a
 * newline-separated string and mirrored into .md by the markdown pipeline.
 */
export function GetStartedTabs({ cli, children }: { cli: string; children: ReactNode }) {
  const [tab, setTab] = useState<"prompt" | "cli">("prompt");
  const promptRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [checked, onCopy] = useCopyButton(async () => {
    const text = tab === "cli" ? cli : copyText(promptRef.current);
    await navigator.clipboard.writeText(text);
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname, tab });
  });

  const tabButton = (value: "prompt" | "cli", icon: string, label: string) => (
    <button
      role="tab"
      aria-selected={tab === value}
      onClick={() => setTab(value)}
      className={cn(
        "inline-flex items-center gap-2 border-b-2 px-1 pb-2.5 pt-0.5 text-sm font-medium transition-colors",
        tab === value
          ? "border-fd-primary text-fd-foreground"
          : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      <i className={cn("fa-regular", icon, "text-[0.8rem]")} aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <div className="not-prose my-2 rounded-xl border bg-fd-card shadow-sm">
      <div className="flex items-center gap-4 px-4 pt-3" role="tablist">
        {tabButton("prompt", "fa-sparkles", "AI Prompt")}
        {tabButton("cli", "fa-terminal", "CLI")}
        <button
          className={cn(
            buttonVariants({ color: "secondary", size: "sm", className: "ms-auto mb-1.5 gap-2" }),
          )}
          onClick={onCopy}
          aria-label="Copy to clipboard"
        >
          <i
            className={cn("fa-regular text-[0.8rem]", checked ? "fa-check" : "fa-copy")}
            aria-hidden="true"
          />
          Copy
        </button>
      </div>
      <div className={cn("border-t px-5 py-4", tab !== "cli" && "hidden")}>
        <code className="block font-mono text-sm leading-7 text-fd-foreground">
          {cli.split("\n").map((line, i) => (
            <span key={i} className="block">
              <span className="select-none text-fd-muted-foreground">
                {line.startsWith("#") ? "" : "$ "}
              </span>
              <span className={cn(line.startsWith("#") && "text-fd-muted-foreground")}>{line}</span>
            </span>
          ))}
        </code>
      </div>
      <div className={cn("relative border-t px-4 pb-1", tab !== "prompt" && "hidden")}>
        <div
          ref={promptRef}
          className={cn(
            "overflow-hidden [&_pre]:text-[0.78rem]",
            !expanded && "max-h-52 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]",
          )}
        >
          {children}
        </div>
        {!expanded && (
          <button
            className="absolute inset-x-0 bottom-2 mx-auto w-fit text-sm font-medium text-fd-primary hover:underline"
            onClick={() => setExpanded(true)}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Two-column section: heading and blurb on the left, content on the right.
 * Stacks on small screens.
 */
export function SectionRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return (
    <section className="not-prose grid gap-x-10 gap-y-5 border-t py-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
      <div>
        <h2 id={id} className="scroll-m-24 text-xl font-semibold text-fd-foreground">
          <a href={`#${id}`} className="hover:underline">
            {title}
          </a>
        </h2>
        {description && (
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fd-foreground/70">
            {description}
          </p>
        )}
      </div>
      <div className="prose min-w-0 max-w-none">{children}</div>
    </section>
  );
}

/** Grid wrapper for IconLink items. */
export function IconGrid({ columns = 2, children }: { columns?: 2 | 3; children: ReactNode }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
      {children}
    </div>
  );
}

function IconTile({
  src,
  darkSrc,
  invertDark,
  mono,
  icon,
  className,
}: {
  src?: string;
  darkSrc?: string;
  invertDark?: boolean;
  mono?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-fd-background",
        className,
      )}
      aria-hidden="true"
    >
      {icon ? (
        <span className="text-fd-primary [&_svg]:size-5">{icon}</span>
      ) : src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withDocsBasePath(src)}
            alt=""
            className={cn(
              "size-5 object-contain",
              darkSrc && "dark:hidden",
              invertDark && "dark:invert",
            )}
          />
          {darkSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={withDocsBasePath(darkSrc)}
              alt=""
              className="hidden size-5 object-contain dark:block"
            />
          )}
        </>
      ) : (
        <span className="font-mono text-sm font-semibold text-fd-muted-foreground">{mono}</span>
      )}
    </span>
  );
}

/**
 * Compact horizontal link: a small icon tile plus a label, in the style of
 * framework pickers. Icon can be an image (src), a mono letter fallback, or a
 * passed element (e.g. a lucide icon).
 */
export function IconLink({
  href,
  title,
  src,
  darkSrc,
  invertDark,
  mono,
  icon,
  description,
}: {
  href: string;
  title: string;
  src?: string;
  darkSrc?: string;
  invertDark?: boolean;
  mono?: string;
  icon?: ReactNode;
  description?: string;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className="group flex items-center gap-3 rounded-xl border bg-fd-card p-3 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
    >
      <IconTile src={src} darkSrc={darkSrc} invertDark={invertDark} mono={mono} icon={icon} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-fd-foreground group-hover:text-fd-accent-foreground">
          {title}
        </span>
        {description && (
          <span className="block truncate text-xs text-fd-muted-foreground">{description}</span>
        )}
      </span>
    </a>
  );
}

/** Hero layout: pitch and actions on the left, the stack diagram on the right. */
export function HeroGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose grid items-center gap-x-12 gap-y-8 pb-10 pt-2 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      {children}
    </div>
  );
}

/** Left side of the hero: badge, pitch, and CTA buttons. */
export function HeroPitch({
  badge,
  children,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  badge?: string;
  children: ReactNode;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-5">
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full border border-fd-primary/40 bg-fd-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fd-primary">
          <i className="fa-regular fa-sparkles text-[0.7rem]" aria-hidden="true" />
          {badge}
        </span>
      )}
      <div className="text-[1.0625rem] leading-relaxed text-fd-foreground/80 [&_a]:font-medium [&_a]:text-fd-foreground [&_a]:underline [&_a]:decoration-fd-primary/50 [&_a]:underline-offset-4 hover:[&_a]:decoration-fd-primary">
        {children}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={withDocsBasePath(primaryHref)}
          className={cn(buttonVariants({ color: "primary", className: "gap-2" }))}
        >
          {primaryLabel}
          <i className="fa-regular fa-arrow-right text-[0.8rem]" aria-hidden="true" />
        </a>
        {secondaryHref && secondaryLabel && (
          <a
            href={withDocsBasePath(secondaryHref)}
            className={cn(buttonVariants({ color: "secondary" }))}
          >
            {secondaryLabel}
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * One product layer inside the StackDiagram. Links straight into that
 * product's getting-started flow; the description is the element's children
 * so it survives into the .md / llms output.
 */
export function StackLayer({
  title,
  href,
  src,
  invertDark,
  icon,
  children,
}: {
  title: string;
  href: string;
  src?: string;
  invertDark?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className="group flex items-center gap-3.5 rounded-xl border bg-fd-background/80 p-3.5 shadow-sm transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
    >
      <IconTile src={src} invertDark={invertDark} icon={icon} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-fd-foreground">{title}</span>
        <span className="block text-xs text-fd-muted-foreground">{children}</span>
      </span>
      <i
        className="fa-regular fa-arrow-right ms-auto text-[0.75rem] text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </a>
  );
}

/**
 * Visual of the Prisma stack: linked product layers joined by connectors.
 * Children are StackLayer elements.
 */
export function StackDiagram({ caption, children }: { caption?: string; children: ReactNode }) {
  const layers = Array.isArray(children) ? children : [children];
  return (
    <div className="relative rounded-2xl border bg-gradient-to-br from-fd-primary/[0.06] via-fd-card to-fd-card p-5 sm:p-6">
      <div className="flex flex-col items-stretch">
        {layers
          .filter((child) => child != null && child !== "\n")
          .map((child, i) => (
            <div key={i} className="flex flex-col items-stretch">
              {i > 0 && (
                <span
                  className="mx-auto flex h-6 items-center text-fd-muted-foreground/60"
                  aria-hidden="true"
                >
                  <ArrowUpDown className="size-3.5" />
                </span>
              )}
              {child}
            </div>
          ))}
      </div>
      {caption && (
        <div className="mt-4 text-center text-xs font-medium text-fd-primary">{caption}</div>
      )}
    </div>
  );
}
