import { Button } from "@prisma/eclipse";

import { AgentCard } from "./agent-card";

export type McpAgent = {
  logo: string | null;
  alt: string;
  icon: string | null;
  href: string;
};

export function McpAgentsSection({
  docsHref,
  agents,
}: {
  docsHref: string;
  agents: readonly McpAgent[];
}) {
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

        <div className="grid w-full max-w-[368px] grid-cols-2 justify-items-center gap-4 min-[400px]:gap-8 md:max-w-[790px] md:grid-cols-4 md:gap-8">
          {agents.map(({ logo, alt, icon, href }) => (
            <AgentCard key={alt} logo={logo} alt={alt} icon={icon} href={href} />
          ))}
        </div>

        <Button
          href={docsHref}
          variant={"link"}
          className="text-sm font-semibold text-foreground-ppg underline"
        >
          Want to see your tool listed?
        </Button>
      </div>
    </section>
  );
}
