"use client";
import { type ReactNode, useRef, useState } from "react";
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
      <div className="flex flex-wrap items-center gap-2 p-3">
        <i className="fa-regular fa-sparkles text-fd-primary" aria-hidden="true" />
        <span className="text-sm font-medium grow">{title}</span>
        {guideHref && (
          <a
            href={withDocsBasePath(guideHref)}
            className="text-sm font-medium text-fd-primary hover:underline"
          >
            {guideTitle} <i className="fa-regular fa-arrow-right text-[0.7rem]" aria-hidden="true" />
          </a>
        )}
        <button
          className={cn(buttonVariants({ color: "secondary", size: "sm", className: "gap-2" }))}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <i
            className={cn("fa-regular text-[0.8rem]", open ? "fa-chevron-up" : "fa-chevron-down")}
            aria-hidden="true"
          />
          {open ? "Hide prompt" : "View prompt"}
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
      <div
        ref={bodyRef}
        className={cn(
          "border-t px-3 pb-1 [&_pre]:text-[0.8rem]",
          !open && "sr-only",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Supabase-style hero card: CLI and AI Prompt tabs with a shared copy action.
 * The prompt is a fenced code block child (crawlable + present in .md output);
 * the CLI command is repeated in visible page copy elsewhere.
 */
export function GetStartedTabs({ cli, children }: { cli: string; children: ReactNode }) {
  const [tab, setTab] = useState<"cli" | "prompt">("cli");
  const promptRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [checked, onCopy] = useCopyButton(async () => {
    const text = tab === "cli" ? cli : copyText(promptRef.current);
    await navigator.clipboard.writeText(text);
    posthog.capture("docs:copy_prompt", {
      page_path: window.location.pathname,
      tab,
    });
  });

  const tabButton = (value: "cli" | "prompt", icon: string, label: string) => (
    <button
      role="tab"
      aria-selected={tab === value}
      onClick={() => setTab(value)}
      className={cn(
        "inline-flex items-center gap-2 border-b-2 px-1 pb-2 text-sm font-medium transition-colors",
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
    <div className="not-prose rounded-xl border bg-fd-card shadow-sm">
      <div className="flex items-center gap-4 px-4 pt-3" role="tablist">
        {tabButton("cli", "fa-terminal", "CLI")}
        {tabButton("prompt", "fa-sparkles", "AI Prompt")}
        <button
          className={cn(
            buttonVariants({ color: "secondary", size: "sm", className: "ms-auto mb-1 gap-2" }),
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
      <div className={cn("border-t px-4 py-1", tab !== "cli" && "hidden")}>
        <code className="block py-3 font-mono text-sm text-fd-foreground">
          <span className="select-none text-fd-muted-foreground">$ </span>
          {cli}
        </code>
      </div>
      <div className={cn("relative border-t px-4 pb-1", tab !== "prompt" && "hidden")}>
        <div
          ref={promptRef}
          className={cn(
            "overflow-hidden [&_pre]:text-[0.78rem]",
            !expanded && "max-h-56 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]",
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
    <section className="not-prose grid gap-6 border-t py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div>
        <h2 id={id} className="scroll-m-24 text-xl font-semibold text-fd-foreground">
          <a href={`#${id}`} className="hover:underline">
            {title}
          </a>
        </h2>
        {description && <p className="mt-2 text-sm text-fd-muted-foreground">{description}</p>}
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
  const tile = "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-fd-background";
  return (
    <a
      href={withDocsBasePath(href)}
      className="group flex items-center gap-3 rounded-xl border bg-fd-card p-3 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
    >
      <span className={tile} aria-hidden="true">
        {icon ? (
          <span className="[&_svg]:size-5 text-fd-primary">{icon}</span>
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

/** Numbered step tile for the recommended stack path. */
export function StackStep({
  step,
  title,
  href,
  src,
  invertDark,
  icon,
  children,
}: {
  step: number | string;
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
      className="group flex items-start gap-3 rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background"
        aria-hidden="true"
      >
        {icon ? (
          <span className="[&_svg]:size-5 text-fd-primary">{icon}</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src ? withDocsBasePath(src) : undefined}
            alt=""
            className={cn("size-5 object-contain", invertDark && "dark:invert")}
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-fd-foreground">
          <span className="text-fd-muted-foreground">{step}.</span> {title}
        </span>
        {children && (
          <span className="mt-1 block text-xs leading-relaxed text-fd-muted-foreground">
            {children}
          </span>
        )}
      </span>
    </a>
  );
}

/** Vertical container for StackStep items. */
export function StackSteps({ children }: { children: ReactNode }) {
  return <div className="not-prose flex flex-col gap-3">{children}</div>;
}

/** Hero layout: stack steps on the left, the CLI / AI Prompt card on the right. */
export function HeroGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose grid items-start gap-6 py-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {children}
    </div>
  );
}
