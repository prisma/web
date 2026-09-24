import { openapi } from "@/lib/openapi";
import type { OpenAPIPageProps_Preloaded } from "fumadocs-openapi/ui";
import { BaseAPIPage } from "./api-page.client";

// data-markdown-ignore: the interactive OpenAPI explorer (per-language code
// samples, auth widgets, collapsible schemas) is the human-facing rendering of
// the endpoint. The markdown version of these pages carries the equivalent
// generated API reference (see formatApiPage in src/lib/llm-markdown.ts), so
// the explorer must be excluded from HTML/markdown parity comparisons.
export async function APIPage({
  document,
  ...props
}: Omit<OpenAPIPageProps_Preloaded, "preloaded">) {
  const { bundled } = await openapi.getSchema(document);
  return (
    <div data-markdown-ignore>
      <BaseAPIPage {...props} payload={{ bundled, proxyUrl: openapi.options.proxyUrl }} />
    </div>
  );
}
