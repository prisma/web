"use client";
import { Fragment, useMemo, useState, type ReactNode } from "react";
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
 * Page actions: a compact "Copy" split button in the page's top-right
 * corner. "Copy" copies the page as Markdown; its menu views the Markdown or
 * hands the page to assistants, editors and app builders. No page-level GitHub link: the
 * navbar links the repo and "Edit on GitHub" sits at the foot of every page.
 *
 * Styling matches the header controls: hairline pills, label a step below ink
 * at rest, full ink plus a faint tint on hover (`quiet-hover`).
 */
/** The top-right split button: a hairline box with softly rounded corners. */
const splitButton = "inline-flex h-8 items-stretch rounded-lg border border-stroke-neutral text-sm";
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
  // Claude's starburst (Simple Icons "claude"), not the Anthropic wordmark.
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
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
    <span className={splitButton}>
      <button className={cn(pillPart, "rounded-lg px-3")} onClick={onClick}>
        {checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        Copy prompt
      </button>
    </span>
  );
}

function useCopyMarkdown(markdownUrl: string) {
  const [isLoading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    try {
      if (cached) {
        await navigator.clipboard.writeText(cached);
      } else {
        setLoading(true);
        await navigator.clipboard.write([
          new ClipboardItem({
            // The write starts inside the click's user gesture (Safari needs
            // this) and the fetch streams in as the item's content.
            "text/plain": fetch(markdownUrl).then(async (res) => {
              if (!res.ok) throw new Error(`${res.status} ${markdownUrl}`);
              const content = await res.text();
              cache.set(markdownUrl, content);
              return content;
            }),
          }),
        ]);
      }
      setFailed(false);
      posthog.capture("docs:copy_markdown", { page_path: window.location.pathname });
    } catch (error) {
      console.warn("Copy as Markdown failed", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  });
  return { isLoading, failed, checked, onClick };
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
function useDestinations(absoluteMarkdownUrl: string) {
  return useMemo(() => {
    const href = destinationHrefs(absoluteMarkdownUrl);

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
  }, [absoluteMarkdownUrl]);
}

function track(tool: string) {
  posthog.capture("docs:open_external_tool", { page_path: window.location.pathname, tool });
}

export function PageActions({
  markdownUrl,
  absoluteMarkdownUrl,
  canCopy = true,
}: {
  /** Path of the page's raw Markdown rendition, fetched same-origin for copying. */
  markdownUrl: string;
  /** The same rendition as an absolute URL, resolved on the server, for the AI hand-offs. */
  absoluteMarkdownUrl: string;
  /** False where the page has no useful Markdown to copy (REST endpoint pages). */
  canCopy?: boolean;
}) {
  const copy = useCopyMarkdown(markdownUrl);
  const { groups } = useDestinations(absoluteMarkdownUrl);

  // One compact split button in the page's top-right corner: "Copy" copies
  // the page as Markdown; the chevron opens every other hand-off. On pages
  // with nothing to copy, the chevron half stands alone as "Open".
  return (
    <span className={splitButton}>
      {canCopy && (
        <>
          <button
            aria-label={copy.failed ? "Copy failed, try again" : "Copy page as Markdown"}
            className={cn(pillPart, "rounded-s-lg px-3")}
            disabled={copy.isLoading}
            onClick={copy.onClick}
          >
            {copy.checked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copy.failed ? "Copy failed" : copy.checked ? "Copied" : "Copy"}
          </button>
          <span aria-hidden="true" className="w-px bg-stroke-neutral" />
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="More ways to use this page"
          className={cn(
            pillPart,
            canCopy ? "rounded-e-lg px-2" : "rounded-lg px-3",
            "data-[state=open]:text-fd-foreground",
          )}
        >
          {!canCopy && "Open"}
          <ChevronDown aria-hidden="true" />
        </DropdownMenuTrigger>
        {/* Same compact panel as the sidebar's version menu, opening leftward
            from the corner. */}
        <DropdownMenuContent
          align="end"
          className="min-w-60 rounded-(--radius-square) border-stroke-neutral p-1 shadow-box-low"
        >
          <DestinationItem
            item={{
              title: "View as Markdown",
              tool: "markdown",
              href: markdownUrl,
              icon: <FileText aria-hidden="true" />,
            }}
          />
          {groups.map((group) => (
            <Fragment key={group.label}>
              <DropdownMenuSeparator className="bg-stroke-neutral" />
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
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
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

const listRow =
  "inline-flex h-8 w-full items-center gap-2.5 rounded-md text-sm text-fd-muted-foreground transition-colors duration-[120ms] ease-out outline-none hover:text-fd-foreground hover:duration-0 focus-visible:ring-2 focus-visible:ring-fd-foreground/60 disabled:opacity-60 motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0";

/**
 * The same actions as a quiet vertical list, for the top of the "On this
 * page" column: three rows in the TOC's own muted style, so the column reads
 * as one list. Only the hand-offs people use (PostHog, 30 days: Copy as
 * Markdown 683 people, ChatGPT 218, Claude 92, Cursor and Perplexity 1 each)
 * get a row; the rest sit under "More". Pages with an agent prompt get a
 * "Copy prompt" row first.
 */
export function PageActionsList({
  markdownUrl,
  absoluteMarkdownUrl,
  canCopy = true,
  fullPrompt,
}: {
  markdownUrl: string;
  absoluteMarkdownUrl: string;
  canCopy?: boolean;
  /** The page's agent prompt, when it has one: adds a "Copy prompt" row. */
  fullPrompt?: string;
}) {
  const copy = useCopyMarkdown(markdownUrl);
  const { groups } = useDestinations(absoluteMarkdownUrl);
  const [promptChecked, onCopyPrompt] = useCopyButton(async () => {
    if (!fullPrompt) return;
    await navigator.clipboard.writeText(fullPrompt);
    posthog.capture("docs:copy_prompt", { page_path: window.location.pathname });
  });

  const all = groups.flatMap((group) => group.items);
  const openIn = (["chatgpt", "claude"] as const)
    .map((tool) => all.find((item) => item.tool === tool))
    .filter((item): item is Destination => item !== undefined);
  const more = all.filter((item) => !openIn.includes(item));

  return (
    <div className="flex flex-col">
      {fullPrompt && (
        <button className={listRow} onClick={onCopyPrompt}>
          {promptChecked ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          Copy prompt
        </button>
      )}
      {canCopy && (
        <button className={listRow} disabled={copy.isLoading} onClick={copy.onClick}>
          {copy.checked ? <Check aria-hidden="true" /> : <BrandIcon d={icons.markdown} />}
          {copy.failed ? "Copy failed — try again" : copy.checked ? "Copied" : "Copy Markdown"}
        </button>
      )}
      {openIn.map((item) => (
        <a
          key={item.tool}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          title={item.description}
          onClick={() => track(item.tool)}
          className={listRow}
        >
          {item.icon}
          {item.title}
        </a>
      ))}
      {/* Every other hand-off, one click away, so their use still shows up in
          PostHog (each item is tracked) and can earn a row later. */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(listRow, "data-[state=open]:text-fd-foreground")}
          aria-label="More ways to open this page"
        >
          <ChevronDown aria-hidden="true" />
          More
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-56 rounded-(--radius-square) border-stroke-neutral p-1 shadow-box-low"
        >
          {more.map((item) => (
            <DestinationItem key={item.tool} item={item} />
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
    </div>
  );
}
