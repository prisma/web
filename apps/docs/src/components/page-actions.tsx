"use client";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { ArrowUpRight, Check, ChevronDown, Copy, FileText, Heart, Zap } from "lucide-react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { destinationHrefs, type DestinationTool } from "@/lib/page-destinations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@prisma/eclipse";

const cache = new Map<string, string>();

/*
 * Page actions, after Clerk's docs: a row under the title with "Copy as
 * Markdown" and a split "Open in ChatGPT" button whose menu hands the page to
 * other assistants, editors and app builders. No page-level GitHub link: the
 * navbar links the repo and "Edit on GitHub" sits at the foot of every page.
 *
 * Styling matches the header controls: hairline pills, label a step below ink
 * at rest, full ink plus a faint tint on hover (`quiet-hover`).
 */
const pill = "inline-flex h-8 items-stretch rounded-full border border-stroke-neutral text-sm";
const pillPart =
  "quiet-hover inline-flex items-center gap-1.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60 disabled:opacity-60 [&_svg]:size-3.5 [&_svg]:shrink-0";

/** A filled single-colour brand mark (Simple Icons paths, 24×24). */
function BrandIcon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

const icons = {
  markdown:
    "M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z",
  chatgpt:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  claude:
    "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  perplexity:
    "M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z",
  cursor:
    "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23",
  zed: "M2.25 1.5a.75.75 0 0 0-.75.75v16.5H0V2.25A2.25 2.25 0 0 1 2.25 0h20.095c1.002 0 1.504 1.212.795 1.92L10.764 14.298h3.486V12.75h1.5v1.922a1.125 1.125 0 0 1-1.125 1.125H9.264l-2.578 2.578h11.689V9h1.5v9.375a1.5 1.5 0 0 1-1.5 1.5H5.185L2.562 22.5H21.75a.75.75 0 0 0 .75-.75V5.25H24v16.5A2.25 2.25 0 0 1 21.75 24H1.655C.653 24 .151 22.788.86 22.08L13.19 9.75H9.75v1.5h-1.5V9.375A1.125 1.125 0 0 1 9.375 8.25h5.314l2.625-2.625H5.625V15h-1.5V5.625a1.5 1.5 0 0 1 1.5-1.5h13.19L21.438 1.5z",
  v0: "M14.066 6.028v2.22h5.729q.075-.001.148.005l-5.853 5.752a2 2 0 0 1-.024-.309V8.247h-2.353v5.45c0 2.322 1.935 4.222 4.258 4.222h5.675v-2.22h-5.675q-.03 0-.059-.003l5.729-5.629q.006.082.006.166v5.465H24v-5.465a4.204 4.204 0 0 0-4.205-4.205zM0 8.245l8.28 9.266c.839.94 2.396.346 2.396-.914V8.245H8.19v5.44l-4.86-5.44Z",
};

export function CopyPromptButton({ fullPrompt }: { fullPrompt: string }) {
  const [checked, onClick] = useCopyButton(async () => {
    await navigator.clipboard.writeText(fullPrompt);
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname });
  });

  return (
    <span className={pill}>
      <button className={cn(pillPart, "rounded-full px-3")} onClick={onClick}>
        {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        Copy prompt
      </button>
    </span>
  );
}

function useCopyMarkdown(markdownUrl: string) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) {
      await navigator.clipboard.writeText(cached);
      posthog.capture("docs:copy_markdown", { page_path: window.location.pathname });
      return;
    }

    setLoading(true);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);
            return content;
          }),
        }),
      ]);
      posthog.capture("docs:copy_markdown", { page_path: window.location.pathname });
    } finally {
      setLoading(false);
    }
  });
  return { isLoading, checked, onClick };
}

type Destination = {
  title: string;
  description?: string;
  tool: DestinationTool | "markdown";
  href: string;
  icon: ReactNode;
};

/**
 * Where the page can be handed off, grouped as Clerk does. The hand-off URLs
 * come from `lib/page-destinations.ts`, where their formats are tested.
 */
function useDestinations(markdownUrl: string) {
  // The prompt needs the absolute Markdown URL, and the server has no origin,
  // so it is read after hydration rather than during render.
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => setOrigin(window.location.origin), []);

  return useMemo(() => {
    const href = destinationHrefs(markdownUrl, origin);

    const chatgpt: Destination = {
      title: "Open in ChatGPT",
      tool: "chatgpt",
      href: href.chatgpt,
      icon: <BrandIcon d={icons.chatgpt} />,
    };

    const groups: { label: string; items: Destination[] }[] = [
      {
        label: "AI assistants",
        items: [
          chatgpt,
          {
            title: "Open in Claude",
            // claude.ai shows a caution banner on any link-prefilled prompt and
            // waits for the user to confirm; the description sets that expectation.
            description: "Claude shows the prompt first",
            tool: "claude",
            href: href.claude,
            icon: <BrandIcon d={icons.claude} />,
          },
          {
            title: "Open in Perplexity",
            tool: "perplexity",
            href: href.perplexity,
            icon: <BrandIcon d={icons.perplexity} />,
          },
        ],
      },
      {
        label: "Editors",
        items: [
          {
            title: "Open in Cursor",
            tool: "cursor",
            href: href.cursor,
            icon: <BrandIcon d={icons.cursor} />,
          },
          {
            title: "Open in Zed",
            description: "Needs Zed installed",
            tool: "zed",
            href: href.zed,
            icon: <BrandIcon d={icons.zed} />,
          },
        ],
      },
      {
        label: "App builders",
        items: [
          { title: "Open in v0", tool: "v0", href: href.v0, icon: <BrandIcon d={icons.v0} /> },
          {
            title: "Open in Bolt",
            tool: "bolt",
            href: href.bolt,
            icon: <Zap aria-hidden="true" />,
          },
          {
            title: "Open in Lovable",
            tool: "lovable",
            href: href.lovable,
            icon: <Heart aria-hidden="true" />,
          },
        ],
      },
    ];

    return { chatgpt, groups };
  }, [markdownUrl, origin]);
}

function track(tool: string) {
  posthog.capture("docs:open_external_tool", { page_path: window.location.pathname, tool });
}

export function PageActions({
  markdownUrl,
  canCopy = true,
}: {
  /** URL of the page's raw Markdown rendition. */
  markdownUrl: string;
  /** False where the page has no useful Markdown to copy (REST endpoint pages). */
  canCopy?: boolean;
}) {
  const copy = useCopyMarkdown(markdownUrl);
  const { chatgpt, groups } = useDestinations(markdownUrl);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCopy && (
        <span className={pill}>
          <button
            className={cn(pillPart, "rounded-full px-3")}
            disabled={copy.isLoading}
            onClick={copy.onClick}
          >
            {copy.checked ? <Check aria-hidden="true" /> : <BrandIcon d={icons.markdown} />}
            Copy as Markdown
          </button>
        </span>
      )}

      <span className={pill}>
        <a
          href={chatgpt.href}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(pillPart, "rounded-s-full ps-3 pe-2.5")}
          onClick={() => track(chatgpt.tool)}
        >
          {chatgpt.icon}
          {chatgpt.title}
        </a>
        <span aria-hidden="true" className="my-1.5 w-px bg-stroke-neutral" />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More ways to open this page"
            className={cn(pillPart, "rounded-e-full px-2 data-[state=open]:text-fd-foreground")}
          >
            <ChevronDown aria-hidden="true" />
          </DropdownMenuTrigger>
          {/* Same compact panel as the sidebar's version menu. */}
          <DropdownMenuContent
            align="start"
            className="min-w-60 rounded-(--radius-square) border-stroke-neutral p-1 shadow-box-low"
          >
            {groups.map((group, i) => (
              <Fragment key={group.label}>
                {i > 0 && <DropdownMenuSeparator className="bg-stroke-neutral" />}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 pt-1.5 pb-1 text-xs font-medium text-fd-muted-foreground">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.items.map((item) => (
                    <DestinationItem key={item.tool} item={item} />
                  ))}
                </DropdownMenuGroup>
              </Fragment>
            ))}
            <DropdownMenuSeparator className="bg-stroke-neutral" />
            <DestinationItem
              item={{
                title: "View as Markdown",
                tool: "markdown",
                href: markdownUrl,
                icon: <FileText aria-hidden="true" />,
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
}

function DestinationItem({ item }: { item: Destination }) {
  return (
    <DropdownMenuItem
      asChild
      className="mb-0 cursor-pointer gap-2.5 rounded-[calc(var(--radius-square)-4px)] px-2 py-1.5 text-sm text-fd-foreground/80 focus:bg-fd-foreground/5 focus:text-fd-foreground [&_svg]:size-3.5"
    >
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => track(item.tool)}
      >
        {item.icon}
        <span className="flex min-w-0 flex-col">
          <span>{item.title}</span>
          {item.description && (
            <span className="text-xs text-fd-muted-foreground">{item.description}</span>
          )}
        </span>
        <ArrowUpRight className="ms-auto text-fd-muted-foreground" aria-hidden="true" />
      </a>
    </DropdownMenuItem>
  );
}
