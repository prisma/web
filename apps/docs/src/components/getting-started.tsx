"use client";
import { type MouseEventHandler, type ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import posthog from "posthog-js";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

function copyText(container: HTMLElement | null): string {
  const pre = container?.querySelector("pre");
  return (pre?.textContent ?? container?.textContent ?? "").trim();
}

/** Renders `backtick` spans in a plain-string prop as styled inline code. */
function InlineCode({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded-md border bg-fd-muted px-1.5 py-0.5 font-mono text-[0.85em] text-fd-foreground"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Native-dialog modal for reading a full prompt. Overlays the page, so
 * opening it never shifts the layout. Content stays mounted (display: none
 * while closed), so prompts remain in the served HTML for crawlers/agents.
 */
function PromptModal({
  open,
  onClose,
  title,
  checked,
  onCopy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  checked: boolean;
  onCopy: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(48rem,calc(100vw-2rem))] rounded-xl border bg-fd-card p-0 text-fd-foreground shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <span className="grow text-sm font-medium">{title}</span>
        <button
          className={cn(buttonVariants({ color: "primary", size: "sm", className: "gap-2" }))}
          onClick={onCopy}
        >
          {checked ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          Copy prompt
        </button>
        <button
          aria-label="Close"
          onClick={onClose}
          className="inline-flex items-center rounded-lg p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-4 pb-2 [&_button]:hidden [&_pre]:w-full [&_pre]:whitespace-pre-wrap [&_pre]:text-[0.8rem] [&_pre]:leading-6">
        {children}
      </div>
    </dialog>
  );
}

/**
 * A collapsed, copyable agent prompt. The prompt itself is authored as a
 * regular fenced code block child, so it stays in the DOM for crawlers and in
 * the generated .md / llms output for agents; visually it collapses into a
 * single row with copy and view actions. Viewing opens a modal, so the row
 * never pushes the content below it around.
 */
export function AgentPrompt({
  title = "Use with your agent",
  guideHref,
  guideTitle = "Guide",
  icon,
  children,
}: {
  title?: string;
  guideHref?: string;
  guideTitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [checked, onCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(copyText(bodyRef.current));
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname });
  });

  return (
    <div className="not-prose my-4 rounded-xl border bg-fd-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-fd-primary [&_svg]:size-4"
          aria-hidden="true"
        >
          {icon ?? <Sparkles />}
        </span>
        <span className="grow text-sm font-medium">{title}</span>
        {guideHref && (
          <a
            href={withDocsBasePath(guideHref)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
          >
            {guideTitle}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        )}
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
          )}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
          View
        </button>
        <button
          className={cn(buttonVariants({ color: "primary", size: "sm", className: "gap-2" }))}
          onClick={onCopy}
        >
          {checked ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          Copy prompt
        </button>
      </div>
      <PromptModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        checked={checked}
        onCopy={onCopy}
      >
        <div ref={bodyRef}>{children}</div>
      </PromptModal>
    </div>
  );
}

/**
 * A row that opens arbitrary content in a modal instead of expanding inline,
 * so revealing it never shifts the layout below. The content stays mounted
 * inside the (closed) dialog, so it remains in the served HTML for crawlers
 * and in the generated .md / llms output.
 */
export function ModalRow({
  title,
  description,
  modalTitle,
  icon,
  children,
}: {
  title: string;
  description?: string;
  modalTitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="not-prose my-4 rounded-xl border bg-fd-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-fd-primary [&_svg]:size-4"
          aria-hidden="true"
        >
          {icon ?? <Sparkles />}
        </span>
        <span className="min-w-0 grow">
          <span className="block text-sm font-medium">{title}</span>
          {description && (
            <span className="block text-xs text-fd-muted-foreground">{description}</span>
          )}
        </span>
        <button
          className={cn(buttonVariants({ color: "secondary", size: "sm", className: "gap-2" }))}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
          View
        </button>
      </div>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-[min(48rem,calc(100vw-2rem))] rounded-xl border bg-fd-card p-0 text-fd-foreground shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <span className="grow text-sm font-medium">{modalTitle ?? title}</span>
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="inline-flex items-center rounded-lg p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-2 text-sm leading-6 text-fd-foreground/80 [&>p]:my-3 [&>p_a]:font-medium [&>p_a]:text-fd-primary [&>p_a]:underline [&>p_a]:decoration-fd-primary/40 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-primary">
          {children}
        </div>
      </dialog>
    </div>
  );
}

/**
 * Compact launcher row for the condensed journey: a button opens a modal with
 * AI Prompt and CLI tabs, and a copy action grabs the prompt without opening
 * anything. The prompt is a fenced code block child that stays mounted inside
 * the (closed) dialog, so it remains in the served HTML for crawlers and in
 * the generated .md / llms output; the CLI commands are passed as a
 * newline-separated string and mirrored into .md by the markdown pipeline.
 */
export function GetStartedTabs({ cli, children }: { cli: string; children: ReactNode }) {
  const [tab, setTab] = useState<"prompt" | "cli">("prompt");
  const [open, setOpen] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const [rowChecked, onRowCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(copyText(promptRef.current));
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname, tab: "prompt" });
  });
  const [modalChecked, onModalCopy] = useCopyButton(async () => {
    const text = tab === "cli" ? cli : copyText(promptRef.current);
    await navigator.clipboard.writeText(text);
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname, tab });
  });

  const tabButton = (value: "prompt" | "cli", icon: ReactNode, label: string) => (
    <button
      role="tab"
      aria-selected={tab === value}
      onClick={() => setTab(value)}
      className={cn(
        "inline-flex items-center gap-2 border-b-2 px-1 pb-2.5 pt-0.5 text-sm font-medium transition-colors [&_svg]:size-4",
        tab === value
          ? "border-fd-primary text-fd-foreground"
          : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="not-prose my-6 rounded-xl border bg-fd-card shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-fd-primary [&_svg]:size-4"
          aria-hidden="true"
        >
          <Sparkles />
        </span>
        <span className="min-w-0 grow">
          <span className="block text-sm font-medium">AI prompt and CLI steps</span>
          <span className="block text-xs text-fd-muted-foreground">
            One journey scaffolds, seeds, migrates, and deploys the whole stack.
          </span>
        </span>
        <button
          className={cn(buttonVariants({ color: "secondary", size: "sm", className: "gap-2" }))}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
          View
        </button>
        <button
          className={cn(buttonVariants({ color: "primary", size: "sm", className: "gap-2" }))}
          onClick={onRowCopy}
        >
          {rowChecked ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          Copy prompt
        </button>
      </div>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-[min(48rem,calc(100vw-2rem))] rounded-xl border bg-fd-card p-0 text-fd-foreground shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center gap-5 border-b px-4 pt-3" role="tablist">
          {tabButton("prompt", <Sparkles aria-hidden="true" />, "AI Prompt")}
          {tabButton("cli", <Terminal aria-hidden="true" />, "CLI")}
          <button
            className={cn(
              buttonVariants({ color: "primary", size: "sm", className: "ms-auto mb-1.5 gap-2" }),
            )}
            onClick={onModalCopy}
            aria-label="Copy to clipboard"
          >
            {modalChecked ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            Copy
          </button>
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="mb-1.5 inline-flex items-center rounded-lg p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className={cn("max-h-[70vh] overflow-y-auto px-6 py-5", tab !== "cli" && "hidden")}>
          <div className="flex flex-col gap-1.5 font-mono text-sm text-fd-foreground">
            {cli.split("\n").map((line, i) =>
              line.startsWith("#") ? (
                <span
                  key={i}
                  className="mt-2 font-sans text-xs font-medium uppercase tracking-wide text-fd-muted-foreground first:mt-0"
                >
                  {line.replace(/^#\s*/, "")}
                </span>
              ) : (
                <span key={i} className="block leading-7">
                  <span className="select-none text-fd-muted-foreground">$ </span>
                  {line}
                </span>
              ),
            )}
          </div>
        </div>
        <div
          ref={promptRef}
          className={cn(
            "max-h-[70vh] overflow-y-auto px-4 pb-2 [&_button]:hidden [&_pre]:w-full [&_pre]:whitespace-pre-wrap [&_pre]:text-[0.8rem] [&_pre]:leading-6",
            tab !== "prompt" && "hidden",
          )}
        >
          {children}
        </div>
      </dialog>
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
    <section className="not-prose grid gap-x-12 gap-y-6 border-t py-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
      <div>
        <h2 id={id} className="scroll-m-24 text-xl font-semibold text-fd-foreground">
          <a href={`#${id}`} className="hover:underline">
            {title}
          </a>
        </h2>
        {description && (
          <p className="mt-3 max-w-sm text-[0.9375rem] leading-7 text-fd-foreground/70">
            <InlineCode text={description} />
          </p>
        )}
      </div>
      <div className="prose min-w-0 max-w-none [&>div+p]:mt-7 [&>p]:leading-7 [&>p_a]:font-medium [&>p_a]:text-fd-primary [&>p_a]:underline [&>p_a]:decoration-fd-primary/40 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-primary">
        {children}
      </div>
    </section>
  );
}

/** Grid wrapper for IconLink items. */
export function IconGrid({ columns = 2, children }: { columns?: 2 | 3; children: ReactNode }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
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
  badge,
}: {
  href: string;
  title: string;
  src?: string;
  darkSrc?: string;
  invertDark?: boolean;
  mono?: string;
  icon?: ReactNode;
  description?: string;
  badge?: string;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className="group flex items-center gap-3 rounded-xl border bg-fd-card p-3 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
    >
      <IconTile src={src} darkSrc={darkSrc} invertDark={invertDark} mono={mono} icon={icon} />
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-medium text-fd-foreground group-hover:text-fd-accent-foreground">
          <span className="truncate">{title}</span>
          {badge && (
            <span className="inline-flex shrink-0 items-center rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 text-[0.6875rem] font-medium leading-4 text-fd-primary">
              {badge}
            </span>
          )}
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
    <div className="not-prose grid items-center gap-x-16 gap-y-10 pb-12 pt-4 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
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
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-fd-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
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
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
        {secondaryHref && secondaryLabel && (
          <a
            href={withDocsBasePath(secondaryHref)}
            className="px-1 text-sm font-medium text-fd-muted-foreground underline decoration-fd-border underline-offset-4 transition-colors hover:text-fd-foreground hover:decoration-fd-primary"
          >
            {secondaryLabel}
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * One product layer inside the StackDiagram. Purely illustrative — the hero
 * copy carries the links — so it renders as a static tile with no click or
 * hover affordance. The description is the element's children so it survives
 * into the .md / llms output.
 */
export function StackLayer({
  title,
  src,
  invertDark,
  icon,
  children,
}: {
  title: string;
  src?: string;
  invertDark?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border bg-fd-background/80 p-3.5 shadow-sm">
      <IconTile src={src} invertDark={invertDark} icon={icon} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-fd-foreground">{title}</span>
        <span className="block text-xs text-fd-muted-foreground">{children}</span>
      </span>
    </div>
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
