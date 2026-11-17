import { PROVIDER_COMPARISON } from "../mcp-content";
import { CapabilityCard, type McpCapabilityIcon } from "./capability-cards";

export type McpCapability = {
  icon: McpCapabilityIcon;
  title: string;
  description: string;
  prompt: string;
};

export function McpCapabilitiesSection({
  capabilities,
}: {
  capabilities: readonly McpCapability[];
}) {
  return (
    <section className="bg-white px-4 pt-16 sm:px-8">
      <div className="mx-auto max-w-site">
        <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">What can I do with MCP?</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              {...capability}
              size={index < 2 ? "wide" : "compact"}
            />
          ))}
        </div>
        <p className="mt-8 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
          {PROVIDER_COMPARISON.lead}{" "}
          <a
            href={PROVIDER_COMPARISON.href}
            className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-prism-cyan-700"
          >
            {PROVIDER_COMPARISON.label}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
