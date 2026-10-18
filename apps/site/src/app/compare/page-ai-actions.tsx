"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getBaseUrl } from "@/lib/url";
import { COPIED_VISIBLE_MS } from "./copied";

const cache = new Map<string, string>();

const COPY =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70 disabled:opacity-60";

const LOGO =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70";

/** Prompt every Open-with-AI logo prefills. `{PAGE_MD_URL}` is the page's `.md` alternate. */
export function choosePrompt(pageMdUrl: string) {
  return `Read this article and treat it as the source of truth:

${pageMdUrl}

I am choosing between Prisma ORM and Kysely for a TypeScript app. Using only what the article states, plus my answers:

1. Tell me which tool fits if I already have SQL I like vs if I want a schema-first workflow.
2. Call out the real tradeoffs (type safety, migrations, raw SQL, dialects) without selling.
3. Give me the first commands to try the one you recommend.

Ask me up to three short questions if you need my database, team size, or whether I already write SQL.`;
}

function toolLinks(markdownUrl: string) {
  const q = choosePrompt(markdownUrl);
  return [
    {
      name: "ChatGPT",
      href: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q })}`,
      tooltip: "Opens ChatGPT with this comparison and a prompt to help you choose.",
      icon: <ChatGptMark />,
    },
    {
      name: "Claude",
      href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
      tooltip: "Opens Claude with this comparison and a prompt to help you choose.",
      icon: <ClaudeMark />,
    },
    {
      name: "Gemini",
      href: `https://gemini.google.com/app?${new URLSearchParams({ q })}`,
      tooltip: "Opens Gemini with this comparison and a prompt to help you choose.",
      icon: <GeminiMark />,
    },
    {
      name: "Perplexity",
      href: `https://www.perplexity.ai/search/new?${new URLSearchParams({ q })}`,
      tooltip: "Opens Perplexity with this comparison and a prompt to help you choose.",
      icon: <PerplexityMark />,
    },
    {
      name: "Grok",
      href: `https://grok.com/?${new URLSearchParams({ q })}`,
      tooltip: "Opens Grok with this comparison and a prompt to help you choose.",
      icon: <GrokMark />,
    },
  ];
}

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      {children}
    </svg>
  );
}

/** OpenAI mark from the docs page-actions. */
function ChatGptMark() {
  return (
    <Mark>
      <path
        fill="currentColor"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      />
    </Mark>
  );
}

/** Anthropic mark from the docs page-actions. */
function ClaudeMark() {
  return (
    <Mark>
      <path
        fill="currentColor"
        d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"
      />
    </Mark>
  );
}

function GeminiMark() {
  return (
    <Mark>
      <path
        fill="currentColor"
        d="M12 2c.35 3.55 2.2 6.4 6.5 8-4.3 1.6-6.15 4.45-6.5 8-.35-3.55-2.2-6.4-6.5-8C9.8 8.4 11.65 5.55 12 2Z"
      />
    </Mark>
  );
}

function PerplexityMark() {
  return (
    <Mark>
      <path
        fill="currentColor"
        d="M12 2.25 13.2 8.4 19.5 6l-3.6 5.25 5.85 2.25-5.85 2.25 3.6 5.25-6.3-2.4L12 21.75l-1.2-3.15-6.3 2.4 3.6-5.25L2.25 13.5l5.85-2.25L4.5 6l6.3 2.4L12 2.25Z"
      />
    </Mark>
  );
}

function GrokMark() {
  return (
    <Mark>
      <path
        fill="currentColor"
        d="M4.4 4.4 12 10.2l7.6-5.8-5.8 7.6 5.8 7.6L12 13.8l-7.6 5.8 5.8-7.6z"
      />
    </Mark>
  );
}

/** Copy page plus a labelled row of AI logos. No dropdown. */
export function PageAiActions({ markdownPath }: { markdownPath: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setOrigin(window.location.origin);
    return () => clearTimeout(timer.current);
  }, []);

  const tools = useMemo(() => {
    const markdownUrl = new URL(markdownPath, origin || getBaseUrl()).toString();
    return toolLinks(markdownUrl);
  }, [markdownPath, origin]);

  async function copyPage() {
    setLoading(true);
    try {
      let text = cache.get(markdownPath);
      if (!text) {
        const response = await fetch(markdownPath);
        if (!response.ok) return;
        text = await response.text();
        cache.set(markdownPath, text);
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={copyPage} disabled={loading} className={COPY}>
          {copied ? (
            <Check className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Copy className="size-3.5" strokeWidth={2} aria-hidden />
          )}
          {copied ? "Copied" : "Copy page"}
          <span role="status" className="sr-only">
            {copied ? "Page copied" : ""}
          </span>
        </button>
        <div className="flex flex-col items-start gap-y-0.5 sm:flex-row sm:items-center sm:gap-1">
          <span className="pr-1 text-sm text-muted-foreground">Open with AI</span>
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Tooltip key={tool.name}>
                <TooltipTrigger asChild>
                  <a
                    href={tool.href}
                    rel="noreferrer noopener"
                    target="_blank"
                    aria-label={tool.tooltip}
                    className={LOGO}
                  >
                    {tool.icon}
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[16rem]">
                  {tool.tooltip}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
