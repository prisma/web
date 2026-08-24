import { createElement } from "react";
import { docs } from "../../.source/server";
import { type InferPageType, type LoaderPlugin, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapiPlugin } from "fumadocs-openapi/server";
import { BucketIcon } from "../components/icons/bucket";

// Icons meta.json can name that lucide does not ship. Runs before
// lucideIconsPlugin, which leaves already-resolved (non-string) icons alone.
const customIcons = {
  Bucket: BucketIcon,
} as const;

function customIconsPlugin(): LoaderPlugin {
  function replaceIcon<Node extends { icon?: unknown }>(node: Node): Node {
    if (typeof node.icon === "string" && node.icon in customIcons) {
      node.icon = createElement(customIcons[node.icon as keyof typeof customIcons]);
    }
    return node;
  }
  return {
    name: "docs:custom-icons",
    transformPageTree: { file: replaceIcon, folder: replaceIcon, separator: replaceIcon },
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: [customIconsPlugin(), lucideIconsPlugin(), openapiPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}
