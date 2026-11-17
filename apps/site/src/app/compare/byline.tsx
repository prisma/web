import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ComparisonAuthor = {
  name: string;
  path: string;
  image: string;
};

export type ComparisonDate = {
  iso: string;
  label: string;
};

/**
 * Martin's profiles from the blog E-E-A-T author bios
 * (`apps/blog/src/lib/author-bios.ts`). GitHub was checked live: the
 * `vanrensbird` account is named Martin Janse van Rensburg and lists Prisma.
 * LinkedIn and X are the same URLs the team maintains on that bio. Do not add
 * other authors' URLs here unless they are confirmed the same way.
 */
export const MARTIN_SOCIALS = [
  { label: "X", href: "https://x.com/vanrensbird" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/martjvr/" },
  { label: "GitHub", href: "https://github.com/vanrensbird" },
] as const;

const ICON =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground/80 transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70";

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.75L5.2 22H1.93l8.02-9.16L1.5 2h6.76l4.66 6.2L18.244 2zm-1.16 18h1.8L7 3.9H5.06L17.084 20z"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  );
}

function socialIcon(label: (typeof MARTIN_SOCIALS)[number]["label"]): ReactNode {
  if (label === "LinkedIn") return <LinkedInMark />;
  if (label === "GitHub") return <GithubMark />;
  return <XMark />;
}

/** Confirmed profile URLs for Article JSON-LD `author.sameAs`. */
export function authorSameAs() {
  return MARTIN_SOCIALS.map((social) => social.href);
}

/** Person node for Article JSON-LD. `sameAs` is only the confirmed profiles. */
export function comparisonAuthorPerson(author: ComparisonAuthor, baseUrl: string) {
  return {
    "@type": "Person" as const,
    name: author.name,
    url: new URL(author.path, baseUrl).toString(),
    sameAs: authorSameAs(),
  };
}

/** Byline with reading time and Martin's profile icons. Called as a function so Markdown sees the tree. */
export function comparisonByline({
  author,
  updated,
  minutes,
}: {
  author: ComparisonAuthor;
  updated: ComparisonDate;
  minutes: number;
}) {
  return (
    <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-5 text-muted-foreground">
      <img
        src={author.image}
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-full bg-neutral-200 object-cover"
      />
      <span className="flex min-w-0 flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
        <span>
          By{" "}
          <a
            href={author.path}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {author.name}
          </a>
        </span>{" "}
        <span className="hidden text-black/25 sm:inline">·</span>{" "}
        <span>
          Updated <time dateTime={updated.iso}>{updated.label}</time>
          <span className="text-black/25"> · </span>
          {minutes} min read
        </span>
      </span>
      <TooltipProvider delayDuration={300}>
        <span role="group" aria-label={`${author.name} on the web`} className="flex items-center">
          {MARTIN_SOCIALS.map((social) => (
            <Tooltip key={social.href}>
              <TooltipTrigger asChild>
                <a
                  href={social.href}
                  rel="me noopener noreferrer"
                  target="_blank"
                  aria-label={`${author.name} on ${social.label}`}
                  className={ICON}
                >
                  {socialIcon(social.label)}
                  <span className="sr-only">{social.label}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" aria-hidden>
                {social.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </span>
      </TooltipProvider>
    </p>
  );
}
