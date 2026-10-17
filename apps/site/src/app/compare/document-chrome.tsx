"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { ArrowLeft, ArrowRight, ChevronLeft, Copy, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { COMPARISONS, type ComparisonSlug } from "./comparisons";

export type CompareSlug = ComparisonSlug | "index";

const NAV_LINK =
  "flex rounded-lg px-2 py-1.5 font-medium transition-colors text-foreground/75 hover:bg-black/[0.04] hover:text-foreground";

const NAV_CURRENT =
  "spectrum-border spectrum-border-on flex rounded-lg px-2 py-1.5 font-medium text-foreground";

export function CompareNav({
  current,
  onNavigate,
}: {
  current: CompareSlug;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/compare"
        onClick={onNavigate}
        aria-current={current === "index" ? "page" : undefined}
        className={cn(
          "flex items-center gap-1.5 px-2 font-semibold transition-colors hover:text-foreground/70",
          current === "index" ? "text-foreground" : "text-foreground",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden />
        All comparisons
      </Link>
      <ul className="flex flex-col gap-0.5">
        {COMPARISONS.map((entry) => {
          const active = entry.slug === current;
          return (
            <li key={entry.slug}>
              <Link
                href={`/compare/${entry.slug}`}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={active ? NAV_CURRENT : NAV_LINK}
              >
                {entry.competitor}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchButton({ compact = false }: { compact?: boolean }) {
  const { setOpenSearch } = useSearchContext();

  if (compact) {
    return (
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpenSearch(true)}
        className="inline-flex size-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground md:hidden"
      >
        <Search className="size-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={() => setOpenSearch(true)}
      className="hidden h-8 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/70 px-2.5 text-muted-foreground transition-colors hover:border-black/15 hover:bg-white md:inline-flex"
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="inline-flex gap-0.5">
        <kbd className="inline-flex min-w-[1.15rem] items-center justify-center rounded border border-black/10 bg-white px-1 py-0.5 font-mono text-[0.65rem] leading-none text-muted-foreground">
          ⌘
        </kbd>
        <kbd className="inline-flex min-w-[1.15rem] items-center justify-center rounded border border-black/10 bg-white px-1 py-0.5 font-mono text-[0.65rem] leading-none text-muted-foreground">
          K
        </kbd>
      </span>
    </button>
  );
}

export function CompareHeader({ current }: { current: CompareSlug }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/55 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Prisma home">
            {/* The document header uses the same mark as the docs template. */}
            <Image src="/logo/full-color.svg" alt="Prisma" width={96} height={24} priority />
          </Link>
          <span aria-hidden className="text-lg text-muted-foreground/50">
            /
          </span>
          <Link href="/compare" className="text-sm font-semibold text-foreground">
            compare
          </Link>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <SearchButton />
          <div className="hidden items-center gap-1.5 md:flex">
            <a
              href="https://github.com/prisma"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex size-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
            >
              <GithubMark />
            </a>
            <a
              href="https://pris.ly/discord"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Discord"
              className="inline-flex size-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
            >
              <DiscordMark />
            </a>
            <Button asChild size="sm">
              <a href="https://console.prisma.io/login?utm_source=compare&utm_medium=login">
                Login
              </a>
            </Button>
          </div>
          <SearchButton compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open Sidebar"
                className="inline-flex size-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              >
                <Menu className="size-[1.05rem]" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[18rem] bg-white">
              <SheetHeader>
                <SheetTitle>Comparisons</SheetTitle>
              </SheetHeader>
              <nav aria-label="Comparisons" className="px-4 text-sm">
                <CompareNav current={current} onNavigate={() => setOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function CompareToc({ items }: { items: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block">
      <nav aria-label="On this page" className="sticky top-20 pt-2 text-sm">
        <p className="mb-3 font-medium text-foreground">On this page</p>
        <ul className="border-l border-black/[0.08]">
          {items.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "relative block py-1.5 pl-3 leading-snug transition-colors",
                    current ? "text-prism-red-600" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export function ArticleActions({
  markdownPath,
  sourcePath,
}: {
  markdownPath: string;
  sourcePath: string;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://www.prisma.io");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const markdownUrl = `${origin}${markdownPath}.md`;
  const prompt = `Read ${markdownUrl}, I want to ask questions about it.`;
  const tools = [
    {
      label: "Open in ChatGPT",
      href: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`,
      icon: <ChatGptMark />,
    },
    {
      label: "Open in Claude",
      href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      icon: <ClaudeMark />,
    },
    {
      label: "Open in GitHub",
      href: `https://github.com/prisma/web/blob/main/${sourcePath}`,
      icon: <GithubMark />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Open in</span>
        <div className="flex items-center gap-1.5">
          {tools.map((tool) => (
            <Button key={tool.label} asChild variant="outline" size="icon-sm">
              <a href={tool.href} target="_blank" rel="noreferrer noopener" aria-label={tool.label}>
                {tool.icon}
              </a>
            </Button>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={async () => {
          const response = await fetch(`${markdownPath}.md`);
          const text = await response.text();
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }}
      >
        <Copy className="size-3.5" aria-hidden />
        {copied ? "Copied" : "Copy Markdown"}
      </Button>
    </div>
  );
}

const PAGER =
  "group flex flex-col rounded-xl border border-black/[0.06] bg-gradient-to-br from-prism-cyan-50/50 via-card to-card p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[box-shadow,border-color] hover:border-black/10 hover:shadow-[0_1px_2px_rgba(21,21,21,0.04),0_14px_28px_-20px_rgba(21,21,21,0.25)]";

export function ArticlePager({
  previous,
  next,
}: {
  previous?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  if (!previous && !next) return null;
  return (
    <footer className="mt-12 border-t border-black/[0.06] pt-8">
      <nav aria-label="Pagination" className="grid gap-4 sm:grid-cols-2">
        {previous ? (
          <Link href={previous.href} className={cn(PAGER, "items-start")}>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <ArrowLeft
                className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
              {previous.label}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className={cn(PAGER, "items-end text-right sm:col-start-2")}>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {next.label}
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </span>
          </Link>
        ) : null}
      </nav>
    </footer>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[1.15rem]">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.445.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function ChatGptMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.015-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.459a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223 2.291-5.945 2.292 5.945Z" />
    </svg>
  );
}
