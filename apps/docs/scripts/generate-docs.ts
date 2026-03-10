import { generateFiles } from "fumadocs-openapi";
import matter from "gray-matter";
import { openapi } from "@/lib/openapi";

void generateFiles({
  input: openapi,
  output: "./content/docs/management-api/endpoints",
  includeDescription: true,
  per: "operation",
  groupBy: "tag",
  name: (output, document) => {
    if (output.type === "operation") {
      // @ts-ignore
      const operation = document.paths![output.item.path]![output.item.method]!;

      const operationId = operation.operationId || "";

      const cleanName = operationId
        .replace(/V\d+/g, "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();

      return cleanName;
    }

    return output.item.name;
  },
  beforeWrite(files) {
    const operationByFilePath = new Map<string, {
      path: string;
      method: string;
      title: string;
      description?: string;
    }>();

    for (const entries of Object.values(this.generatedEntries)) {
      for (const entry of entries) {
        if (entry.type !== "operation") continue;
        operationByFilePath.set(entry.path, {
          path: entry.item.path,
          method: entry.item.method.toUpperCase(),
          title: entry.info.title,
          description: entry.info.description,
        });
      }
    }

    for (const file of files) {
      const operation = operationByFilePath.get(file.path);
      if (!operation) continue;

      const parsed = matter(file.content);
      const data = parsed.data as Record<string, unknown>;

      let changed = false;

      const openapiData =
        typeof data._openapi === "object" && data._openapi !== null
          ? (data._openapi as Record<string, unknown>)
          : {};

      if (data._openapi !== openapiData) {
        data._openapi = openapiData;
        changed = true;
      }

      if (openapiData.path !== operation.path) {
        openapiData.path = operation.path;
        changed = true;
      }

      if (openapiData.method !== operation.method) {
        openapiData.method = operation.method;
        changed = true;
      }

      const normalizedPath = file.path
        .replace(/\\/g, "/")
        .replace(/\.mdx$/, "")
        .replace(/^management-api\/endpoints\//, "");
      const url = `/management-api/endpoints/${normalizedPath}`;

      if (data.url !== url) {
        data.url = url;
        changed = true;
      }

      const title =
        typeof data.title === "string" && data.title.trim().length > 0
          ? data.title.trim()
          : operation.title;
      const metaTitle = `${operation.method} ${operation.path} | ${title}`;

      if (data.metaTitle !== metaTitle) {
        data.metaTitle = metaTitle;
        changed = true;
      }

      const description =
        typeof operation.description === "string" && operation.description.trim().length > 0
          ? operation.description.trim()
          : `${operation.method} ${operation.path}.`;
      const metaDescription = description.startsWith("Management API:")
        ? description
        : `Management API: ${description}`;

      if (data.metaDescription !== metaDescription) {
        data.metaDescription = metaDescription;
        changed = true;
      }

      if (!changed) continue;

      file.content = matter.stringify(parsed.content, data, {
        lineWidth: -1,
      } as Parameters<typeof matter.stringify>[2]);
    }
  },
});
