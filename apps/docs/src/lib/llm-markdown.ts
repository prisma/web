import { readFileSync } from "node:fs";
import { join } from "node:path";

type OpenApiSpec = {
  paths?: Record<string, Record<string, OpenApiOperation | undefined>>;
};

type OpenApiOperation = {
  summary?: string;
  description?: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    content?: Record<string, { schema?: JsonSchema } | undefined>;
  };
  responses?: Record<string, { description?: string } | undefined>;
};

type OpenApiParameter = {
  name?: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: JsonSchema;
};

type JsonSchema = {
  type?: string | string[];
  description?: string;
  default?: unknown;
  enum?: unknown[];
  properties?: Record<string, JsonSchema | undefined>;
  required?: string[];
  $ref?: string;
};

type ApiPageOperation = {
  path?: string;
  method?: string;
};

let openApiSpecCache: OpenApiSpec | null | undefined;

function getAttribute(attrs: string, name: string) {
  const pattern = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*"([^"]*)"\\s*\\}|\\{\\s*'([^']*)'\\s*\\})`,
  );
  const match = attrs.match(pattern);
  return match?.slice(1).find((value) => value !== undefined);
}

function cleanInlineText(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim();
}

function formatDefaultValue(value: unknown) {
  if (value === undefined) return undefined;
  return typeof value === "string" ? value : JSON.stringify(value);
}

function formatSchemaType(schema: JsonSchema | undefined) {
  if (!schema) return undefined;
  if (schema.$ref) return schema.$ref.split("/").at(-1);
  if (Array.isArray(schema.type)) return schema.type.join(" | ");
  if (schema.type) return schema.type;
  if (schema.enum) return "enum";
  if (schema.properties) return "object";
  return undefined;
}

function getJsonSchema(content: OpenApiOperation["requestBody"] | undefined) {
  return content?.content?.["application/json"]?.schema;
}

function loadOpenApiSpec() {
  if (openApiSpecCache !== undefined) return openApiSpecCache;

  for (const cachePath of [
    join(process.cwd(), "cache", "openapi.json"),
    join(process.cwd(), "apps/docs/cache/openapi.json"),
  ]) {
    try {
      openApiSpecCache = JSON.parse(readFileSync(cachePath, "utf8")) as OpenApiSpec;
      return openApiSpecCache;
    } catch {}
  }

  openApiSpecCache = null;
  return openApiSpecCache;
}

function getOpenApiOperation(path: string, method: string) {
  const spec = loadOpenApiSpec();
  return spec?.paths?.[path]?.[method.toLowerCase()];
}

function formatParameter(parameter: OpenApiParameter) {
  const name = parameter.name ?? "parameter";
  const location = parameter.in ? `${parameter.in}` : "parameter";
  const required = parameter.required ? "required" : "optional";
  const type = formatSchemaType(parameter.schema);
  const details = [location, type, required].filter(Boolean).join(", ");
  const description = cleanInlineText(parameter.description ?? parameter.schema?.description);
  const suffix = description ? `: ${description}` : "";

  return `- \`${name}\`${details ? ` (${details})` : ""}${suffix}`;
}

function formatRequestBody(operation: OpenApiOperation) {
  const schema = getJsonSchema(operation.requestBody);
  const properties = schema?.properties;
  if (!properties) return "";

  const required = new Set(schema.required ?? []);
  const lines = Object.entries(properties).map(([name, property]) => {
    const type = formatSchemaType(property);
    const defaultValue = formatDefaultValue(property?.default);
    const description = cleanInlineText(property?.description);
    const details = [type, required.has(name) ? "required" : "optional"].filter(Boolean).join(", ");
    const metadata = [
      description,
      defaultValue !== undefined ? `Default: \`${defaultValue}\`.` : undefined,
    ].filter(Boolean);

    return `- \`${name}\`${details ? ` (${details})` : ""}${metadata.length > 0 ? `: ${metadata.join(" ")}` : ""}`;
  });

  return lines.length > 0 ? `\n\n#### Request body\n\n${lines.join("\n")}` : "";
}

function formatResponses(operation: OpenApiOperation) {
  const responses = operation.responses;
  if (!responses) return "";

  const lines = Object.entries(responses).map(([status, response]) => {
    const description = cleanInlineText(response?.description);
    return `- \`${status}\`${description ? `: ${description}` : ""}`;
  });

  return lines.length > 0 ? `\n\n#### Responses\n\n${lines.join("\n")}` : "";
}

function parseApiPageOperations(value: string): ApiPageOperation[] {
  const match = value.match(/operations=\{\s*(\[[\s\S]*?\])\s*\}/);
  if (!match) return [];

  try {
    const operations = JSON.parse(match[1]) as ApiPageOperation[];
    return Array.isArray(operations) ? operations : [];
  } catch {
    return [];
  }
}

function formatApiOperation(operation: ApiPageOperation) {
  if (!operation.path || !operation.method) return "";

  const method = operation.method.toUpperCase();
  const apiOperation = getOpenApiOperation(operation.path, operation.method);
  const summary = cleanInlineText(apiOperation?.summary);
  const description = cleanInlineText(apiOperation?.description);
  const parameters = apiOperation?.parameters ?? [];
  const parameterText =
    parameters.length > 0
      ? `\n\n#### Parameters\n\n${parameters.map(formatParameter).join("\n")}`
      : "";
  const requestBodyText = apiOperation ? formatRequestBody(apiOperation) : "";
  const responsesText = apiOperation ? formatResponses(apiOperation) : "";
  const title = summary ? `### ${summary}` : `### ${method} ${operation.path}`;
  const endpoint = `\`${method} ${operation.path}\``;

  return `${title}\n\n${endpoint}${description ? `\n\n${description}` : ""}${parameterText}${requestBodyText}${responsesText}`;
}

function formatApiPage(value: string) {
  const operations = parseApiPageOperations(value);
  const text = operations.map(formatApiOperation).filter(Boolean).join("\n\n");

  if (!text) return "## API reference\n\n_API reference details unavailable in markdown output._";

  return `## API reference\n\n${text}`;
}

function trimComponentContent(value: string) {
  const lines = value.replace(/^\n+|\n+$/g, "").split("\n");
  const indent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((minimum, line) => Math.min(minimum, line.match(/^ */)?.[0].length ?? 0), Infinity);

  return lines
    .map((line) => (Number.isFinite(indent) ? line.slice(indent) : line))
    .join("\n")
    .trim();
}

function cleanCalloutContent(value: string) {
  return trimComponentContent(value)
    .replace(
      /<Callout(?:Title|Description)>([\s\S]*?)<\/Callout(?:Title|Description)>/g,
      (_match, content: string) => trimComponentContent(content),
    )
    .replace(/<\/?(?:CalloutTitle|CalloutDescription)>/g, "")
    .replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");
}

function formatCallout(type: string, content: string) {
  const labelMap: Record<string, string> = {
    danger: "CAUTION",
    error: "CAUTION",
    info: "NOTE",
    note: "NOTE",
    ppg: "NOTE",
    success: "TIP",
    tip: "TIP",
    warn: "WARNING",
    warning: "WARNING",
  };
  const label = labelMap[type.trim().toLowerCase()] ?? "NOTE";
  const text = cleanCalloutContent(content);
  if (!text) return "";

  return `> [!${label}]\n${text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")}`;
}

function formatCodeBlockTab(value: string, content: string) {
  const text = trimComponentContent(content);
  if (!text) return "";

  return `#### ${value.trim()}\n\n${text}`;
}

function formatSectionComponent(attrs: string, content: string, fallbackTitle: string) {
  const title = getAttribute(attrs, "title") ?? getAttribute(attrs, "value") ?? fallbackTitle;
  const text = trimComponentContent(content);

  return text ? `### ${title}\n\n${text}` : `### ${title}`;
}

function formatYoutube(attrs: string) {
  const videoId = getAttribute(attrs, "videoId");
  const title = getAttribute(attrs, "title") ?? "Watch video";
  if (!videoId) return title;

  return `[${title}](https://www.youtube.com/watch?v=${videoId})`;
}

function convertHtmlLinks(value: string) {
  return value.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (_match, attrs: string, content: string) => {
    const href = getAttribute(attrs, "href");
    const label = trimComponentContent(content).replace(/\s+/g, " ");
    return href ? `[${label}](${href})` : label;
  });
}

function stripJsxTags(value: string) {
  return convertHtmlLinks(value)
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?>/g, "")
    .replace(/<\/?a(?:\s[^>]*)?>/g, "")
    .replace(/\{["']\s*["']\}/g, " ")
    .trim();
}

function formatCard(attrs: string, content: string) {
  const title = getAttribute(attrs, "title") ?? "Card";
  const href = getAttribute(attrs, "href");
  const text = stripJsxTags(trimComponentContent(content)).replace(/\n+/g, " ");
  const label = href ? `[${title}](${href})` : title;

  return `- ${label}${text ? `: ${text}` : ""}`;
}

function formatButton(_attrs: string, content: string) {
  return stripJsxTags(trimComponentContent(content));
}

function findOpeningTagEnd(value: string, startIndex: number) {
  let quote: string | undefined;
  let braceDepth = 0;

  for (let index = startIndex; index < value.length; index++) {
    const char = value[index];
    const previous = value[index - 1];

    if (quote) {
      if (char === quote && previous !== "\\") quote = undefined;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === "{") {
      braceDepth++;
      continue;
    }

    if (char === "}" && braceDepth > 0) {
      braceDepth--;
      continue;
    }

    if (char === ">" && braceDepth === 0) return index;
  }

  return -1;
}

function isComponentTag(value: string, index: number, name: string) {
  const next = value[index + name.length + 1];
  return value.startsWith(`<${name}`, index) && !/[A-Za-z0-9]/.test(next ?? "");
}

function replaceComponentBlocks(
  markdown: string,
  name: string,
  format: (attrs: string, content: string) => string,
) {
  let result = "";
  let cursor = 0;

  while (cursor < markdown.length) {
    const start = markdown.indexOf(`<${name}`, cursor);
    if (start === -1) {
      result += markdown.slice(cursor);
      break;
    }

    if (!isComponentTag(markdown, start, name)) {
      result += markdown.slice(cursor, start + 1);
      cursor = start + 1;
      continue;
    }

    const openingEnd = findOpeningTagEnd(markdown, start);
    if (openingEnd === -1) {
      result += markdown.slice(cursor);
      break;
    }

    const openingTag = markdown.slice(start, openingEnd + 1);
    const attrs = openingTag
      .replace(new RegExp(`^<${name}\\b`), "")
      .replace(/\/?>$/, "")
      .trim();
    const isSelfClosing = openingTag.replace(/\s+$/, "").endsWith("/>");

    result += markdown.slice(cursor, start);

    if (isSelfClosing) {
      result += format(attrs, "");
      cursor = openingEnd + 1;
      continue;
    }

    const closingTag = `</${name}>`;
    const closingStart = markdown.indexOf(closingTag, openingEnd + 1);
    if (closingStart === -1) {
      result += openingTag;
      cursor = openingEnd + 1;
      continue;
    }

    result += format(attrs, markdown.slice(openingEnd + 1, closingStart));
    cursor = closingStart + closingTag.length;
  }

  return result;
}

function protectFencedCodeBlocks(markdown: string) {
  const blocks: string[] = [];
  const protectedMarkdown = markdown.replace(
    /^([ \t]*)([`~]{3,})[^\n]*\n[\s\S]*?^\1\2\s*$/gm,
    (match) => {
      const token = `__LLM_FENCED_CODE_BLOCK_${blocks.length}__`;
      blocks.push(match);
      return token;
    },
  );

  return {
    markdown: protectedMarkdown,
    restore(value: string) {
      return blocks.reduce(
        (text, block, index) => text.replace(`__LLM_FENCED_CODE_BLOCK_${index}__`, block),
        value,
      );
    },
  };
}

export function normalizeProcessedMarkdown(markdown: string) {
  const componentMarkdown = markdown
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(
      /<CalloutContainer\s+type="([^"]+)"[^>]*>([\s\S]*?)<\/CalloutContainer>/g,
      (_match, type: string, content: string) => formatCallout(type, content),
    )
    .replace(/<CodeBlockTabsList>[\s\S]*?<\/CodeBlockTabsList>/g, "")
    .replace(
      /<CodeBlockTab\s+value="([^"]+)"[^>]*>([\s\S]*?)<\/CodeBlockTab>/g,
      (_match, value: string, content: string) => formatCodeBlockTab(value, content),
    )
    .replace(/<\/?CodeBlockTabs[^>]*>/g, "")
    .replace(
      /<Tab\s+value="([^"]+)"[^>]*>([\s\S]*?)<\/Tab>/g,
      (_match, value: string, content: string) => formatCodeBlockTab(value, content),
    )
    .replace(/<Tabs(?:List|Trigger)[\s\S]*?<\/Tabs(?:List|Trigger)>/g, "")
    .replace(/<\/?(?:Tabs|TabsContent)[^>]*>/g, "")
    .replace(
      /<Accordion\b([^>]*)>([\s\S]*?)<\/Accordion>/g,
      (_match, attrs: string, content: string) =>
        formatSectionComponent(attrs, content, "Accordion"),
    )
    .replace(/<\/?Accordions[^>]*>/g, "")
    .replace(/<Step\b([^>]*)>([\s\S]*?)<\/Step>/g, (_match, attrs: string, content: string) =>
      formatSectionComponent(attrs, content, "Step"),
    )
    .replace(/<\/?Steps[^>]*>/g, "")
    .replace(/<SharedContent\b[^>]*>([\s\S]*?)<\/SharedContent>/g, (_match, content: string) =>
      trimComponentContent(content),
    )
    .replace(/<SharedContent\b[^>]*\/>/g, "");

  const protectedCode = protectFencedCodeBlocks(componentMarkdown);
  const withoutJsxComponents = replaceComponentBlocks(
    replaceComponentBlocks(protectedCode.markdown, "Card", formatCard)
      .replace(/<\/?Cards[^>]*>/g, "")
      .replace(/<APIPage\b([\s\S]*?)\/>/g, (match: string) => formatApiPage(match))
      .replace(/<Youtube\b([\s\S]*?)\/>/g, (_match, attrs: string) => formatYoutube(attrs)),
    "Button",
    formatButton,
  );

  return protectedCode
    .restore(withoutJsxComponents)
    .replace(/^[ \t]+(#{3,4} )/gm, "$1")
    .replace(/^[ \t]+(- \[)/gm, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
