"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TooltipProvider,
} from "@prisma/eclipse";

import { AgentCard } from "./agent-card";

export type McpAgent = {
  logo: string | null;
  alt: string;
  href?: string;
  copyText?: string;
};

export function McpAgentsSection({ agents }: { docsHref: string; agents: readonly McpAgent[] }) {
  const tallyHref = "https://tally.so/r/wA1R1N";

  return (
    <section className="px-4 py-12 md:px-0">
      <div className="mx-auto flex max-w-[790px] flex-col items-center gap-12 text-center">
        <div className="flex max-w-[768px] flex-col items-center gap-4">
          <h2 className="font-sans-display stretch-display font-black text-foreground-neutral text-3xl">
            Works with your AI agent
          </h2>
          <p className="text-base leading-6 text-foreground-neutral-weak">
            Works with any AI agent, whether you prefer to use a remote or a local server,
            we&apos;ve got you.
          </p>
        </div>

        <TooltipProvider>
          <div className="grid w-full max-w-[368px] grid-cols-2 justify-items-center gap-4 min-[400px]:gap-8 md:max-w-[790px] md:grid-cols-4 md:gap-8">
            {agents.map((agent) => (
              <AgentCard key={agent.alt} {...agent} />
            ))}
          </div>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="cursor-pointer text-sm font-semibold text-foreground-ppg underline"
            >
              Want to see your tool listed?
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Want to see your favorite AI tool listed on prisma.io/mcp?</DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-xl border border-stroke-neutral bg-background-neutral-weaker shadow-box-low">
              <iframe
                src={tallyHref}
                title="Tool listing request"
                width="100%"
                height="640"
                className="block min-h-[640px] w-full border-0 bg-white"
              />
            </div>
            <p className="text-sm leading-6 text-foreground-neutral-weak">
              If the form does not load,{" "}
              <a
                href={tallyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground-ppg underline"
              >
                open it in a new tab
              </a>
              .
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
