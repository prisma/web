import { PageFooterCta } from "@/components/page-footer-cta";

export function McpCtaSection({
  docsHref,
  readDocsHref,
}: {
  docsHref: string;
  readDocsHref: string;
}) {
  return (
    <PageFooterCta
      title="Start Building with AI"
      description="Join thousands of developers, and agents, already using Prisma MCP for faster, more intuitive database workflows."
      btns={[
        { url: docsHref, text: "Add MCP Server" },
        { url: readDocsHref, text: "Read Docs" },
      ]}
      footer="2-minute setup • Works with all MCP tools"
    />
  );
}
