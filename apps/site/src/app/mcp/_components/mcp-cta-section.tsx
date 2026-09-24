import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";

export function McpCtaSection({
  docsHref,
  readDocsHref,
}: {
  docsHref: string;
  readDocsHref: string;
}) {
  return (
    <section className="bg-white px-4 py-16 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-site">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-black/[0.06] p-8 text-center sm:p-12">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
            Start building with AI
          </h2>
          <p className="max-w-[48ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Connect the Prisma MCP server to your AI tool and choose the workspace you want to
            manage.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <PrismButton href={docsHref}>Add MCP server</PrismButton>
            <PrismButtonOutline href={readDocsHref}>Read the docs</PrismButtonOutline>
          </div>
          <p className="text-xs text-muted-foreground">Sign in with your Prisma account.</p>
        </div>
      </div>
    </section>
  );
}
