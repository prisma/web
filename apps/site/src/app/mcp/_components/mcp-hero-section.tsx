import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";
import { CheckBold } from "@/components/icons/forma";

export type McpHeroFeature = {
  text: string;
};

// Wrapped-panel hero in the redesign language: paper surface, hairline
// border, a single cyan wash along the bottom edge (one accent per page),
// and the feature list as a quiet checked row instead of icon tiles.
export function McpHeroSection({
  docsHref,
  features,
}: {
  docsHref: string;
  features: readonly McpHeroFeature[];
}) {
  return (
    <section className="bg-card px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-foreground/[0.06] bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background: "var(--paper)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-transparent" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
            <RoleKicker color="bg-prism-cyan-400" className="justify-center">
              Prisma MCP server
            </RoleKicker>
            <h1 className="isolate mt-4 max-w-[22ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
              Your database workflow, powered by AI
            </h1>
            <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp,
              ChatGPT, and other AI agents. Works great with Prisma Postgres.
            </p>
            <div className="mt-8">
              <PrismButton href={docsHref}>Add MCP server</PrismButton>
            </div>

            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckBold className="size-3.5 shrink-0 text-prism-cyan-700" aria-hidden />
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
