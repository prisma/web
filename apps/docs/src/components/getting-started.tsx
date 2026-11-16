"use client";
import {
  Children,
  createContext,
  isValidElement,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ArrowRight, Check, Copy, Sparkles, X } from "lucide-react";
import posthog from "posthog-js";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";
import { LearnMore } from "@/components/brand/learn-more";
import { GlassPrism } from "@/components/brand/glass-prism";

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
          // The docs' hairline inline-code chip (global.css), and a command
          // never splits across lines ("npx" / "create-prisma@stable").
          <code
            key={i}
            className="whitespace-nowrap rounded border border-fd-foreground/[0.09] bg-fd-foreground/[0.025] px-1 font-mono text-[0.875em] text-fd-foreground"
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

// Row and dialog controls, following Eclipse's Button guidance: one filled
// button per view at most (the dialog's own Copy prompt), bordered or bare
// controls everywhere else, and text-styled navigation in ink rather than
// the theme's cyan. Hovers match the header's `quiet-hover`: instant in,
// 120ms out, a faint ink tint and no colour change.
const crisp =
  "transition-colors duration-[120ms] ease-out hover:duration-0 motion-reduce:transition-none";
const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60";
/** Bordered pill for a row's main action. */
const outlinePill = cn(
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-stroke-neutral px-3 text-sm font-medium text-fd-foreground hover:bg-fd-foreground/5 [&_svg]:size-3.5",
  crisp,
  focusRing,
);
/** The one filled (ink) button, inside the prompt dialog. */
const inkPill = cn(
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-background-neutral-reverse-strong px-3 text-sm font-medium text-foreground-neutral-reverse hover:bg-background-neutral-reverse-strong/85 [&_svg]:size-3.5",
  crisp,
  focusRing,
);
/** Bare text control (View), tinted on hover like the header icons. */
const barePill = cn(
  "quiet-hover inline-flex h-8 shrink-0 items-center rounded-full px-3 text-sm",
  focusRing,
);
/** Text navigation (guide links): Eclipse's `link` style, ink with an underline on hover. */
const inkLink = cn(
  "inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-fd-foreground/70 underline-offset-4 hover:text-fd-foreground hover:underline [&_svg]:size-3.5",
  crisp,
  focusRing,
);
const closeButton = cn("quiet-hover inline-flex items-center rounded-full p-1.5", focusRing);
/** Icon tile on a row: brand cyan, matching the icon tiles elsewhere on the page. */
const rowIconTile =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-fd-primary [&_svg]:size-4";

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
    if (open && !dialog.open) {
      // Prompts are plain text, so a numbered step is just a highlighted
      // line starting with "2." etc. Mark each step that follows another
      // line, so the steps get breathing room between them (the first step
      // already sits under a blank line). Display only: the copied text and
      // the served HTML are unchanged.
      const lines = dialog.querySelectorAll<HTMLElement>(".line");
      lines.forEach((line, i) => {
        const previous = lines[i - 1]?.textContent?.trim();
        if (/^\d+\.\s/.test(line.textContent ?? "") && previous) {
          line.dataset.promptStep = "";
        }
      });
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="m-auto w-[min(48rem,calc(100vw-2rem))] rounded-xl border bg-fd-card p-0 text-fd-foreground shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center gap-3 border-b py-4 ps-7 pe-5">
        <span className="grow text-sm font-medium">{title}</span>
        <button className={inkPill} onClick={onCopy}>
          {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          Copy prompt
        </button>
        <button aria-label="Close" onClick={onClose} className={closeButton}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {/* The prompt sits directly on the dialog, not in a second bordered
          code box: the code block's frame, padding and copy button are
          flattened so the text lines up with the title at 28px and the
          spacing is even on every side. */}
      <div className="max-h-[70vh] overflow-y-auto px-7 py-7 [&_.fd-scroll-container]:max-h-none [&_.fd-scroll-container]:overflow-visible [&_.fd-scroll-container]:bg-transparent! [&_.fd-scroll-container]:p-0 [&_.line]:px-0! [&_.line[data-prompt-step]]:mt-3 [&_button]:hidden [&_figure]:m-0 [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:bg-transparent [&_pre]:w-full! [&_pre]:whitespace-pre-wrap [&_pre]:text-[0.8125rem] [&_pre]:leading-7">
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
        <span className={rowIconTile} aria-hidden="true">
          {icon ?? <Sparkles />}
        </span>
        <span className="grow text-sm font-medium">{title}</span>
        {guideHref && (
          <a href={withDocsBasePath(guideHref)} className={inkLink}>
            {guideTitle}
            <ArrowRight aria-hidden="true" />
          </a>
        )}
        {/* View opens a dialog rather than expanding the row, so no chevron. */}
        <button
          className={barePill}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          View
        </button>
        <button className={outlinePill} onClick={onCopy}>
          {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
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
        <span className={rowIconTile} aria-hidden="true">
          {icon ?? <Sparkles />}
        </span>
        <span className="min-w-0 grow">
          <span className="block text-sm font-medium">{title}</span>
          {description && (
            <span className="block text-xs text-fd-muted-foreground">{description}</span>
          )}
        </span>
        <button
          className={outlinePill}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
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
          <button aria-label="Close" onClick={() => setOpen(false)} className={closeButton}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-2 text-sm leading-6 text-fd-foreground/80 [&>p]:my-3 [&>p_a]:font-medium [&>p_a]:text-fd-foreground [&>p_a]:underline [&>p_a]:decoration-fd-foreground/30 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-foreground">
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
    // A quarter for the heading and description, three quarters for the
    // cards: the cards need the width to keep titles and descriptions on one
    // line. The heading matches the hero's 22px stage headings; the
    // description is the muted docs description, tighter than body copy.
    <section className="not-prose grid gap-x-12 gap-y-6 border-t py-16 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]">
      <div>
        <h2 id={id} className="scroll-m-24 text-[1.375rem] leading-8 text-fd-foreground">
          <a href={`#${id}`} className="hover:underline hover:underline-offset-4">
            {title}
          </a>
        </h2>
        {description && (
          <p className="mt-2 max-w-sm text-pretty text-[0.9375rem] leading-6 text-fd-muted-foreground">
            <InlineCode text={description} />
          </p>
        )}
      </div>
      {/* A note under a grid reads as a quiet aside (14px, muted). Links are
          ink with a cyan underline, like the hero intro: cyan link text failed
          contrast on white. */}
      <div className="prose min-w-0 max-w-none [&>div+p]:mt-4 [&>div+p]:text-sm [&>div+p]:leading-6 [&>div+p]:text-fd-muted-foreground [&>p]:leading-7 [&>p_a]:font-medium [&>p_a]:text-fd-foreground [&>p_a]:underline [&>p_a]:decoration-fd-primary/50 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-primary">
        {children}
      </div>
    </section>
  );
}

/** Grid wrapper for IconLink items. */
export function IconGrid({
  columns = 2,
  tiles = false,
  children,
}: {
  columns?: 2 | 3 | 5;
  /**
   * Compact tiles for logo + name links (the framework picker): the logo
   * centred above the name, like a row of app icons, so every name fits on
   * one line at five across. Two columns on phones, three from sm.
   */
  tiles?: boolean;
  children: ReactNode;
}) {
  return (
    // auto-rows-fr: every row as tall as the tallest card, so the cards in a
    // grid are always one size even when a title wraps.
    <div
      className={cn(
        "grid auto-rows-fr gap-4",
        tiles ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 5 && "lg:grid-cols-5",
        tiles && [
          "[&>a]:flex-col [&>a]:items-center [&>a]:justify-center [&>a]:gap-2 [&>a]:px-2 [&>a]:py-3.5 [&>a]:text-center",
          "[&>a>span:first-child]:size-8 [&>a>span:first-child]:rounded-lg [&_img]:size-[18px]",
          "[&>a>span:last-child>span:first-child]:justify-center [&>a>span:last-child>span:first-child]:whitespace-nowrap [&>a>span:last-child>span:first-child]:text-sm [&>a>span:last-child>span:first-child]:leading-5",
        ],
      )}
    >
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
  neutral,
  className,
}: {
  src?: string;
  darkSrc?: string;
  invertDark?: boolean;
  mono?: string;
  icon?: ReactNode;
  /** Ink glyph instead of cyan: the hero's Build/Deploy cards and strip. */
  neutral?: boolean;
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
        <span
          className={cn("[&_svg]:size-5", neutral ? "text-fd-foreground/70" : "text-fd-primary")}
        >
          {icon}
        </span>
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
    // The same card as the hero's WorkflowLink: page-colour fill, 16px
    // padding, neutral glyph, 15px semibold title over a 14px muted line.
    // Text wraps rather than truncating; IconGrid keeps rows one height.
    <a
      href={withDocsBasePath(href)}
      className={cn(
        "group flex gap-3.5 rounded-xl border bg-fd-background p-4 transition-colors duration-200 hover:border-fd-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary",
        description ? "items-start" : "items-center",
      )}
    >
      <IconTile
        src={src}
        darkSrc={darkSrc}
        invertDark={invertDark}
        mono={mono}
        icon={icon}
        neutral
      />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-semibold leading-6 text-fd-foreground">
          {title}
          {badge && (
            // Neutral pill: cyan text on a cyan tint was 3.0:1, below AA.
            <span className="inline-flex shrink-0 items-center rounded-full border border-fd-foreground/[0.12] px-2 py-0.5 text-[0.6875rem] font-medium leading-4 text-fd-foreground/80">
              {badge}
            </span>
          )}
        </span>
        {description && (
          <span className="block text-sm leading-6 text-fd-muted-foreground">{description}</span>
        )}
      </span>
    </a>
  );
}

/**
 * Full-width hero for the build-then-deploy overview. Children are the intro
 * paragraph(s), a WorkflowGrid, and a DeployCallout; the wrapper only supplies
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
              // Held back (13% / 9%) so the deploy strip, not this backdrop, is the
              // brightest light on the page.
              "radial-gradient(38% 45% at 78% 16%, color-mix(in srgb, var(--color-prism-cyan-400) 13%, transparent), transparent 68%)",
              // The warm bloom sits beside the Deploy column's upper rows and
              // fades out before the deploy strip, so it never pools behind
              // the strip's glass prism (which muddied the light theme).
              "radial-gradient(26% 30% at 93% 34%, color-mix(in srgb, var(--color-prism-yellow-300) 9%, transparent), transparent 66%)",
            ].join(","),
          }}
        />
        {/* No prism ray here: the brand doctrine (prisma.io/brand) makes the
            ray a state, never a static background stripe. */}
      </div>
      {/* The intro reads as the page's description, styled like every other
          docs page's (18px, muted): a ~60ch measure with pretty wrapping so it
          breaks into balanced lines, 16px under the page actions (-mt-5
          offsets the hero's top padding), and a deliberate 48px before the
          stages (gap-8 plus mb-4). "Build" / "deploy" stay in full ink as
          signposts for the two columns; links never split across lines. */}
      <div className="flex flex-col gap-8 [&>p]:max-w-[60ch] [&>p]:text-pretty [&>p]:text-lg [&>p]:leading-7 [&>p]:text-fd-muted-foreground [&>p:first-child]:-mt-5 [&>p:first-child]:mb-4 [&>p_strong]:font-semibold [&>p_strong]:text-fd-foreground [&>p_a]:whitespace-nowrap [&>p_a]:font-medium [&>p_a]:text-fd-foreground [&>p_a]:underline [&>p_a]:decoration-fd-primary/50 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-primary">
        {children}
      </div>
    </div>
  );
}

/**
 * The workflow stages as two columns: Build, then Deploy. Children are
 * WorkflowStage elements with three tiles each.
 *
 * Each stage is a subgrid spanning four shared rows (header plus three
 * tiles), so the columns line up row for row: the headers share one height,
 * and each tile matches the height of its partner across the gutter however
 * long either description runs.
 *
 * Columns follow the content column's width (a container query), not the
 * window's: with the sidebar open, a wide window can still leave a narrow
 * content column. Below 768px of it, the stages stack.
 */
export function WorkflowGrid({ children }: { children: ReactNode }) {
  return (
    <div className="@container">
      <div className="grid gap-x-8 gap-y-10 @3xl:grid-cols-2">{children}</div>
    </div>
  );
}

/**
 * One stage of the workflow: a heading, one line on what the stage is for,
 * and three WorkflowLink tiles. Keep it to three, matching the other stage:
 * the pair shares four grid rows.
 *
 * The stage is a group, not a surface: no border, fill, or halo, so the tiles
 * are the only framed objects and never sit as a card inside a card. The
 * hero's washes carry the brand light behind it.
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
    <section className="flex min-w-0 flex-col gap-2 @3xl:row-span-4 @3xl:grid @3xl:grid-rows-subgrid">
      <header className="pb-2">
        {/* Stage headings lead their cards by size: Sora at the brand's 500
            heading weight (global.css), 22px against the 15px semibold tile
            titles, so "Build" and "Deploy" read as the organising idea. */}
        <h2 id={id} className="scroll-m-24 text-[1.375rem] leading-8 text-fd-foreground">
          <a href={`#${id}`} className="hover:underline hover:underline-offset-4">
            {title}
          </a>
        </h2>
        <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{description}</p>
      </header>
      {children}
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
      className="group flex items-start gap-3.5 rounded-xl border bg-fd-background p-4 transition-colors duration-200 hover:border-fd-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
    >
      <IconTile src={src} invertDark={invertDark} icon={icon} neutral />
      {/* The whole tile is the link, so the text gets the full width: no
          trailing "docs" label. The arrow beside the title only appears on
          hover and keyboard focus, to confirm where the tile leads. */}
      <span className="min-w-0 grow">
        <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-semibold leading-6 text-fd-foreground">
          {title}
          {badge && (
            <span className="inline-flex shrink-0 items-center rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 text-[0.6875rem] font-medium leading-4 text-fd-primary">
              {badge}
            </span>
          )}
          <ArrowRight
            className="size-3.5 -translate-x-1 text-fd-primary opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
        <span className="mt-0.5 block text-sm leading-6 text-fd-muted-foreground">{children}</span>
      </span>
    </a>
  );
}

/**
 * The destination of the Build → Deploy path: the one command that ships the
 * app, with a line on what it does and the guide to read next. The command is
 * the centrepiece (large, copyable, never wrapped); the brand's glass prism
 * sits behind the panel, cropped by its edge, so the light lands where the
 * path ends. The note is the element's children so it stays in the served
 * HTML and the .md / llms output.
 */
export function DeployCallout({
  title,
  command,
  href,
  linkLabel = "Deploy guide",
  children,
}: {
  title: string;
  command: string;
  href: string;
  linkLabel?: string;
  children: ReactNode;
}) {
  const [checked, onCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(command);
    posthog.capture("docs:copy_command", { page_path: window.location.pathname, command });
  });

  return (
    <aside className="relative isolate overflow-hidden rounded-xl border bg-fd-card px-5 py-5 sm:px-6">
      {/* The brand's panel idiom (spectral wash collecting along the bottom
          edge), kept very faint: a surface quality, not a glow, so it never
          competes with the glass prism. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(45% 45% at 12% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 8%, transparent), transparent 70%)",
            "radial-gradient(40% 40% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 6%, transparent), transparent 68%)",
            "radial-gradient(45% 45% at 88% 100%, color-mix(in srgb, var(--color-prism-red-300) 6%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
      {/* Cropped by this panel's edge, behind its content (brand: glass
          lives in the background). The brand pairs tint with ground: ink
          glass (hairlines only) on white, spectral glass on the dark sheet,
          where its tinted face reads as light rather than a muddy wash.
          Placed so a single corner enters at the top right and tucks behind
          the (opaque) command field; nothing reaches the bottom edge. */}
      <GlassPrism
        tint="ink"
        className="-right-24 -top-38 -z-10 w-64 -rotate-12 max-sm:hidden dark:hidden"
      />
      <GlassPrism
        tint="spectral"
        className="-right-24 -top-38 -z-10 hidden w-64 -rotate-12 sm:dark:block"
      />
      {/* Text and the guide on the left; the command on its own on the
          right, the panel's centrepiece. Stacks below lg. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="min-w-0 lg:flex-1">
          {/* Same size as the stage headings (22px Sora), so the three read as
              one family. */}
          <h2 className="text-[1.375rem] leading-8 text-fd-foreground">{title}</h2>
          {/* A div, not a p: MDX wraps the note in its own <p>. */}
          <div className="mt-1 text-sm leading-6 text-fd-foreground/75 [&_code]:whitespace-nowrap [&_code]:rounded [&_code]:border [&_code]:border-fd-foreground/[0.09] [&_code]:bg-fd-foreground/[0.025] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-fd-foreground [&_p]:m-0">
            {children}
          </div>
          <LearnMore href={href} className="-ms-3.5 mt-1">
            {linkLabel}
          </LearnMore>
        </div>
        <div className="relative shrink-0 self-start lg:self-auto">
          {/* "Copied" floats above the field, so confirming never changes its
              width or shifts the strip. */}
          <span
            aria-live="polite"
            className={cn(
              "pointer-events-none absolute -top-6 right-1 font-sans text-xs font-medium text-fd-muted-foreground transition-opacity duration-150",
              checked ? "opacity-100" : "opacity-0",
            )}
          >
            {checked ? "Copied" : ""}
          </span>
          <div className="inline-flex h-12 items-center gap-3 rounded-lg border bg-fd-background ps-4 pe-1.5 font-mono text-base">
            {/* The prompt recedes (smaller, lighter) so the command carries
              the weight. */}
            <span className="select-none text-sm text-fd-muted-foreground/60" aria-hidden="true">
              $
            </span>
            <code className="whitespace-nowrap text-fd-foreground">{command}</code>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-fd-primary [&_svg]:size-4"
              aria-label={checked ? `Copied ${command}` : `Copy ${command}`}
            >
              {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * A short list of "situation → command → guide" rows, for a section whose
 * whole job is to hand over a command (Prisma ORM 7 on the landing page).
 * Rows sit between hairlines rather than in cards, so the commands carry the
 * weight. Each command is copyable and never wraps; the row stacks on small
 * screens. The label, command, and guide are props, so the generated .md /
 * llms output can render them as a list (see llm-markdown.ts).
 */
export function CommandRows({ children }: { children: ReactNode }) {
  return <div className="@container flex flex-col divide-y border-y">{children}</div>;
}

export function CommandRow({
  label,
  command,
  href,
  linkLabel,
}: {
  label: string;
  command: string;
  href: string;
  linkLabel: string;
}) {
  const [checked, onCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(command);
    posthog.capture("docs:copy_command", { page_path: window.location.pathname, command });
  });

  return (
    <div className="grid items-center gap-x-6 gap-y-2.5 py-4 @2xl:grid-cols-[8rem_minmax(0,1fr)_auto]">
      <span className="text-[0.9375rem] font-semibold leading-6 text-fd-foreground">{label}</span>
      <div className="relative w-fit min-w-0 max-w-full">
        {/* Same field as the Deploy command, one step smaller: "Copied" floats
            above it so confirming never changes its width. */}
        <span
          aria-live="polite"
          className={cn(
            "pointer-events-none absolute -top-5 right-1 font-sans text-xs font-medium text-fd-muted-foreground transition-opacity duration-150",
            checked ? "opacity-100" : "opacity-0",
          )}
        >
          {checked ? "Copied" : ""}
        </span>
        <div className="inline-flex h-11 max-w-full items-center gap-3 rounded-lg border bg-fd-background ps-3.5 pe-1 font-mono text-[0.9375rem]">
          <span className="select-none text-sm text-fd-muted-foreground/60" aria-hidden="true">
            $
          </span>
          <code className="whitespace-nowrap text-fd-foreground">{command}</code>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-fd-primary [&_svg]:size-4"
            aria-label={checked ? `Copied ${command}` : `Copy ${command}`}
          >
            {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          </button>
        </div>
      </div>
      {/* -mx-3 keeps the pill's hit area while its text lines up with the
          row's edge (right on desktop, left when stacked). */}
      <a
        href={withDocsBasePath(href)}
        className="group -mx-3 inline-flex h-9 w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted/60 focus-visible:outline-2 focus-visible:outline-fd-primary"
      >
        {linkLabel}
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </a>
    </div>
  );
}

type SetupPathProps = {
  label: string;
  guideHref: string;
  guideTitle?: string;
  children: ReactNode;
};

/**
 * Several setup paths, one shown at a time: the reader picks their situation
 * from a row of tabs, and the panel says what that path does, with its agent
 * prompt (copied, not shown) and its guide. Every panel stays mounted in one
 * grid cell, so the section keeps the height of the tallest panel and the
 * page never jumps when switching; inactive panels are hidden and inert but
 * still in the served HTML, prompts included. Tabs follow the WAI-ARIA tabs
 * pattern (arrow keys, Home, End).
 */
export function SetupTabs({ children }: { children: ReactNode }) {
  const paths = Children.toArray(children).filter(
    (child): child is ReactElement<SetupPathProps> =>
      isValidElement<SetupPathProps>(child) && typeof child.props.label === "string",
  );
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = paths.length - 1;
    const next =
      event.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : event.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="not-prose">
      {/* One row on every width: it scrolls sideways on phones rather than
          wrapping into a second row of tabs. */}
      <div
        role="tablist"
        aria-label="Setup paths"
        onKeyDown={onKeyDown}
        className="-mx-1 flex gap-x-5 overflow-x-auto border-b px-1 [scrollbar-width:none] sm:gap-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {paths.map((path, i) => (
          <button
            key={path.props.label}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px h-11 shrink-0 whitespace-nowrap border-b-[1.5px] text-[0.9375rem] font-medium transition-colors duration-150 motion-reduce:transition-none",
              "rounded-t-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60",
              i === active
                ? "border-fd-foreground text-fd-foreground"
                : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {path.props.label}
          </button>
        ))}
      </div>
      <div className="grid min-w-0 pt-6">
        {paths.map((path, i) => (
          <div
            key={path.props.label}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            inert={i !== active}
            className={cn(
              "col-start-1 row-start-1 flex min-w-0 flex-col transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
              i === active ? "visible opacity-100" : "invisible opacity-0",
            )}
          >
            {path}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One path inside SetupTabs. Its MDX children are the description (first
 * paragraph), an optional note (any later paragraph), and the agent prompt in
 * a <SetupPrompt>, which is copied rather than shown.
 */
type SetupPromptState = {
  open: boolean;
  onClose: () => void;
  title: string;
  checked: boolean;
  onCopy: MouseEventHandler<HTMLButtonElement>;
};
const SetupPromptContext = createContext<SetupPromptState | null>(null);

export function SetupPath({ label, guideHref, guideTitle = "Guide", children }: SetupPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [checked, onCopy] = useCopyButton(async () => {
    const prompt = ref.current?.querySelector<HTMLElement>("[data-setup-prompt]") ?? null;
    await navigator.clipboard.writeText(copyText(prompt));
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname });
  });

  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col [&>p]:m-0 [&>p]:max-w-[60ch] [&>p]:text-pretty [&>p:first-child]:text-[0.9375rem] [&>p:first-child]:leading-7 [&>p:first-child]:text-fd-foreground/80 [&>p+p]:mt-2 [&>p+p]:text-sm [&>p+p]:leading-6 [&>p+p]:text-fd-muted-foreground [&>p_a]:text-fd-foreground [&>p_a]:underline [&>p_a]:decoration-fd-primary/50 [&>p_a]:underline-offset-4 hover:[&>p_a]:decoration-fd-foreground [&>p_code]:whitespace-nowrap"
    >
      <SetupPromptContext.Provider
        value={{
          open: showPrompt,
          onClose: () => setShowPrompt(false),
          title: `Agent prompt: ${label}`,
          checked,
          onCopy,
        }}
      >
        {children}
      </SetupPromptContext.Provider>
      {/* mt-auto: the actions sit at the same height on every tab. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-2 pt-5">
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border bg-fd-background px-4 text-sm font-semibold text-fd-foreground hover:bg-fd-foreground/5 [&_svg]:size-4",
            crisp,
            focusRing,
          )}
        >
          {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span aria-live="polite">{checked ? "Copied" : "Copy agent prompt"}</span>
        </button>
        <a
          href={withDocsBasePath(guideHref)}
          className={cn(
            "group -mx-3 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-fd-foreground hover:bg-fd-foreground/5",
            crisp,
            focusRing,
          )}
        >
          {guideTitle}
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>
        {/* Quiet, after the guide: lets a reader check what the prompt will
            install, write, and run before handing it to an agent. Opens the
            same dialog as AgentPrompt's View, so the section never grows. */}
        <button
          type="button"
          onClick={() => setShowPrompt(true)}
          aria-haspopup="dialog"
          aria-expanded={showPrompt}
          className={cn(
            "-mx-3 inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-fd-muted-foreground hover:bg-fd-foreground/5 hover:text-fd-foreground",
            crisp,
            focusRing,
          )}
        >
          View prompt
        </button>
      </div>
    </div>
  );
}

/**
 * The agent prompt for a SetupPath. It lives inside a closed native <dialog>
 * that is always rendered, so the full prompt is in the served HTML for
 * crawlers and agents (and in the page's .md via llm-markdown.ts) without
 * being shown on the page; View prompt opens the dialog for readers.
 */
export function SetupPrompt({ children }: { children: ReactNode }) {
  const state = useContext(SetupPromptContext);
  if (!state) return <div data-setup-prompt>{children}</div>;
  return (
    <PromptModal
      open={state.open}
      onClose={state.onClose}
      title={state.title}
      checked={state.checked}
      onCopy={state.onCopy}
    >
      <div data-setup-prompt>{children}</div>
    </PromptModal>
  );
}

/**
 * The page's closing index: product docs and references as plain links on
 * hairlines rather than boxed cards. Three columns where there is room, two on
 * tablets, one on phones (by the column's own width).
 */
export function DocsIndex({ children }: { children: ReactNode }) {
  return (
    <div className="@container not-prose">
      <div className="grid gap-x-8 @md:grid-cols-2 @2xl:grid-cols-3">{children}</div>
    </div>
  );
}

export function IndexLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <a
      href={withDocsBasePath(href)}
      className={cn("group block rounded-sm border-t pt-4 pb-5", focusRing)}
    >
      <span className="flex items-center gap-2 text-[0.9375rem] font-semibold leading-6 text-fd-foreground">
        {icon && (
          <span className="inline-flex text-fd-muted-foreground [&_svg]:size-4" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="underline-offset-4 decoration-fd-foreground/35 group-hover:underline">
          {title}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
        />
      </span>
      {description && (
        <span
          className={cn("mt-1 block text-sm leading-6 text-fd-muted-foreground", icon && "ps-6")}
        >
          {description}
        </span>
      )}
    </a>
  );
}
