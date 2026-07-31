import { openapi } from "@/lib/openapi";
import { createAPIPage } from "fumadocs-openapi/ui";
import type { ComponentProps } from "react";
import client from "./api-page.client";

const BaseAPIPage = createAPIPage(openapi, {
  client,
  playground: {
    enabled: false,
  },
});

// data-markdown-ignore: the interactive OpenAPI explorer (per-language code
// samples, auth widgets, collapsible schemas) is the human-facing rendering of
// the endpoint. The markdown version of these pages carries the equivalent
// generated API reference (see formatApiPage in src/lib/llm-markdown.ts), so
// the explorer must be excluded from HTML/markdown parity comparisons.
export function APIPage(props: ComponentProps<typeof BaseAPIPage>) {
  return (
    <div data-markdown-ignore>
      <BaseAPIPage {...props} />
    </div>
  );
}
