import { CapabilityCard } from "./capability-cards";

export type McpCapability = {
  icon: string;
  title: string;
  description: string;
  prompt: string;
  mobileTall?: boolean;
};

export function McpCapabilitiesSection({
  capabilities,
}: {
  capabilities: readonly McpCapability[];
}) {
  return (
    <section className="py-element-4xl">
      <div className="mx-auto max-w-300 px-4 py-10 md:px-0 md:py-12">
        <h2 className="text-center font-sans-display stretch-display font-black text-foreground-neutral text-3xl">
          What can I do with MCP?
        </h2>

        <div className="mx-auto mt-6 grid max-w-92 grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-2 xl:max-w-300 xl:grid-cols-6 xl:gap-[16px]">
          {capabilities.map((cap, index) => {
            const size = index < 2 ? "wide" : "compact";
            return <CapabilityCard key={cap.title} {...cap} size={size} />;
          })}
        </div>
      </div>
    </section>
  );
}
