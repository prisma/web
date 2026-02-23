import { docs, docsV6 } from "../../.source/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapiPlugin } from "fumadocs-openapi/server";
import { type Version } from "./version";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin()],
});

// v6 source - URLs with /v6/ prefix
export const sourceV6 = loader({
  baseUrl: "/v6",
  source: docsV6.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Get the appropriate source for a version
export function getSource(version: Version) {
  return version === "v6" ? sourceV6 : source;
}


export function getPageImage(
  page: InferPageType<typeof source> | InferPageType<typeof sourceV6>
) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source> | InferPageType<typeof sourceV6>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
