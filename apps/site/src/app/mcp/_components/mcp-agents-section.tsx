import { ArrowRight } from "@/components/icons/forma";
import { AgentCard } from "./agent-card";
import { InkCode } from "./ink-code";

export type McpAgent = {
  name: string;
  logo: string | null;
  alt: string;
  href?: string;
  copyText?: string;
};

const TALLY_HREF = "https://tally.so/r/wA1R1N";

const MANUAL_CONFIG = JSON.stringify(
  {
    mcpServers: {
      Prisma: {
        url: "https://mcp.prisma.io/mcp",
      },
    },
  },
  null,
  2,
);

export function McpAgentsSection({ agents }: { agents: readonly McpAgent[] }) {
  return (
    <section className="bg-white px-4 pt-16 sm:px-8">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
              Works with your AI agent
            </h2>
            <p className="max-w-[52ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              Works with any AI agent, whether you prefer to use a remote or a local server,
              we&apos;ve got you.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {agents.map((agent) => (
              <AgentCard key={agent.alt} {...agent} />
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-stretch">
            <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]">
              <p className="text-sm font-semibold text-foreground">
                Or add the server to any MCP client
              </p>
              <InkCode code={MANUAL_CONFIG} ariaLabel="Copy MCP server configuration" />
            </div>
            <div className="flex flex-col justify-center gap-2 rounded-2xl bg-card-wash p-6">
              <p className="text-sm font-semibold text-foreground">Want to see your tool listed?</p>
              <a
                href={TALLY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
              >
                Tell us about it
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
