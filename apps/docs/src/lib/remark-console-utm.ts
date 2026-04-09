import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const CONSOLE_HOST = "console.prisma.io";

const remarkConsoleUtm: Plugin<[], Root> = () => (tree, vfile) => {
  const filePath = vfile.path ?? "";
  const isV6 = filePath.includes("content/docs.v6/");
  const utmSource = isV6 ? "docs-v6" : "docs";

  const sectionMatch = filePath.match(/content\/docs(?:\.v6)?\/([^/]+)/);
  const section = sectionMatch?.[1] ?? "unknown";

  visit(tree, "link", (node) => {
    let url: URL;
    try {
      url = new URL(node.url);
    } catch {
      return;
    }

    if (url.hostname !== CONSOLE_HOST) return;
    if (url.searchParams.has("utm_source")) return;

    url.searchParams.set("utm_source", utmSource);
    url.searchParams.set("utm_medium", "content");
    url.searchParams.set("utm_content", section);
    node.url = url.toString();
  });
};

export default remarkConsoleUtm;
