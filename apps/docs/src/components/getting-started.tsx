"use client";
import {
  Fragment,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowRight,
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
import { PrismRay } from "@/components/chrome/prism-ray";

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
      className="spectrum-ring-hover group flex items-center gap-3 rounded-xl border bg-fd-card p-3 transition-colors hover:bg-fd-accent"
    >
      <IconTile src={src} darkSrc={darkSrc} invertDark={invertDark} mono={mono} icon={icon} />
      <span className="min-w-0">
        <span className="spectrum-text-hover flex items-center gap-2 text-sm font-medium text-fd-foreground">
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

// The prismatic halo from the reference hero (hero-home.tsx HALO): the
// spectrum swept around a card's perimeter — yellow up top, red right, cyan
// below — radiating out as a soft glow behind the card.
const halo =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))";

/**
 * Full-width hero for the build-then-deploy overview. Children are the intro
 * paragraph(s), a WorkflowGrid, and a CliCallout; the wrapper only supplies
 * the brand light (spectral washes plus the structural prism ray) and intro
 * typography. Static by design — nothing here moves, so no reduced-motion
 * variant is needed.
 */
export function WorkflowHero({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose relative isolate pb-12 pt-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 top-0 -bottom-8 -z-10 overflow-hidden"
        // The wash box stops at the hero's top and fades in over the first
        // 5rem, so no glow reaches the title row and its buttons above, and
        // the crop never shows as a hard edge (visible in dark mode).
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 5rem)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 5rem)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              // Washes stay in the hero's upper half: a bottom bloom would
              // spill past the last content row and dangle over the section
              // below (the wash box extends beyond the content bounds).
              "radial-gradient(38% 45% at 78% 16%, color-mix(in srgb, var(--color-prism-cyan-400) 20%, transparent), transparent 68%)",
              "radial-gradient(30% 38% at 94% 55%, color-mix(in srgb, var(--color-prism-yellow-300) 15%, transparent), transparent 66%)",
            ].join(","),
          }}
        />
        <PrismRay
          intensity="structural"
          className="left-[24%] top-[48%] h-12 w-[90rem] -translate-y-1/2"
        />
      </div>
      <div className="flex flex-col gap-8 [&>p]:text-[1.0625rem] [&>p]:leading-relaxed [&>p]:text-fd-foreground/80 [&>p_a]:font-medium [&>p_a]:text-fd-foreground [&>p_a]:underline [&>p_a]:decoration-fd-primary/50 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-primary">
        {children}
      </div>
    </div>
  );
}

/**
 * The two workflow stages side by side — Build, then Deploy — joined by an
 * arrow. Children are WorkflowStage elements.
 */
export function WorkflowGrid({ children }: { children: ReactNode }) {
  const stages = (Array.isArray(children) ? children : [children]).filter(
    (child) => child != null && child !== "\n",
  );
  return (
    <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      {stages.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span
              className="flex items-center justify-center self-center text-fd-muted-foreground/70"
              aria-hidden="true"
            >
              <ArrowDown className="size-5 lg:hidden" />
              <ArrowRight className="hidden size-5 lg:block" />
            </span>
          )}
          {child}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * One stage of the workflow: a titled panel of WorkflowLink tiles. The panel
 * carries the prismatic halo so the pair reads as the page's centrepiece.
 */
export function WorkflowStage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return (
    <section className="relative isolate flex flex-col rounded-2xl border bg-gradient-to-br from-fd-primary/[0.06] via-fd-card to-fd-card p-5 sm:p-6">
      {/* The card's own gradient is translucent toward its top-left corner, so
          the tight ring bleeds into the panel — kept subtle in light, where it
          reads as tint; dark gets the fuller glassy glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-20 blur-[18px] dark:opacity-40"
        style={{ background: halo }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-15 blur-[44px] dark:opacity-25"
        style={{ background: halo }}
      />
      <h2 id={id} className="scroll-m-24 text-lg font-semibold text-fd-foreground">
        <a href={`#${id}`} className="hover:underline">
          {title}
        </a>
      </h2>
      <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{description}</p>
      <div className="mt-4 flex grow flex-col gap-3">{children}</div>
    </section>
  );
}

/**
 * One product inside a WorkflowStage: a linked tile with an icon, title, and
 * a short description. The description is the element's children so it
 * survives into the .md / llms output.
 */
export function WorkflowLink({
  href,
  title,
  badge,
  src,
  invertDark,
  icon,
  children,
}: {
  href: string;
  title: string;
  badge?: string;
  src?: string;
  invertDark?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className="spectrum-ring-hover group flex items-start gap-3.5 rounded-xl border bg-fd-background/80 p-3.5 shadow-sm transition-colors hover:bg-fd-accent"
    >
      <IconTile src={src} invertDark={invertDark} icon={icon} />
      <span className="min-w-0 grow">
        <span className="spectrum-text-hover flex flex-wrap items-center gap-2 text-sm font-semibold text-fd-foreground">
          {title}
          {badge && (
            <span className="inline-flex shrink-0 items-center rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 text-[0.6875rem] font-medium leading-4 text-fd-primary">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-fd-muted-foreground">{children}</span>
      </span>
      {/* The whole tile is the link; this label just makes the destination
          explicit. A span, not a nested anchor. */}
      <span
        className="inline-flex shrink-0 items-center gap-1 self-center text-xs font-medium text-fd-primary group-hover:underline"
        aria-hidden="true"
      >
        docs
        <ArrowRight className="size-3" />
      </span>
    </a>
  );
}

/**
 * Full-width bar under the workflow grid for the one-CLI message. The message
 * is the element's children (plain prose with inline code), so it stays in
 * the served HTML and the generated .md / llms output for agents.
 */
export function CliCallout({
  href,
  linkLabel = "CLI reference",
  children,
}: {
  href: string;
  linkLabel?: string;
  children: ReactNode;
}) {
  return (
    <aside className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-fd-card px-4 py-3.5 shadow-sm">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-fd-primary [&_svg]:size-4"
        aria-hidden="true"
      >
        <Terminal />
      </span>
      <span className="min-w-0 grow text-sm leading-6 text-fd-foreground/80 [&_code]:rounded-md [&_code]:border [&_code]:bg-fd-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-fd-foreground">
        {children}
      </span>
      <a
        href={withDocsBasePath(href)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
      >
        {linkLabel}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </a>
    </aside>
  );
}
