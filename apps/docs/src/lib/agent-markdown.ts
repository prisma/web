const DOCS_BASE_PATH = "/docs";

const AGENT_USER_AGENT_PATTERNS = [
  /chatgpt-user/i,
  /gptbot/i,
  /claudebot/i,
  /claude-user/i,
  /perplexitybot/i,
  /cursor/i,
];

const SKIPPED_DOCS_PREFIXES = ["/api", "/llms", "/llms.mdx", "/og"];
const SKIPPED_DOCS_PATHS = new Set(["/favicon.ico", "/rss.xml", "/sitemap", "/sitemap.xml"]);

function stripDocsBasePath(pathname: string) {
  if (pathname === DOCS_BASE_PATH) return "/";
  if (pathname.startsWith(`${DOCS_BASE_PATH}/`)) return pathname.slice(DOCS_BASE_PATH.length);
  return pathname;
}

function getDocsBasePath(pathname: string) {
  return pathname === DOCS_BASE_PATH || pathname.startsWith(`${DOCS_BASE_PATH}/`)
    ? DOCS_BASE_PATH
    : "";
}

function normalizeDocsPath(pathname: string) {
  const docsPath = stripDocsBasePath(pathname);
  if (docsPath.length > 1 && docsPath.endsWith("/")) return docsPath.slice(0, -1);
  return docsPath;
}

export function getAgentMarkdownSignal(headers: Headers) {
  const accept = headers.get("accept")?.toLowerCase() ?? "";
  if (accept.split(",").some((value) => value.trim().startsWith("text/markdown"))) {
    return "accept";
  }

  const userAgent = headers.get("user-agent") ?? "";
  if (AGENT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return "user-agent";
  }

  return undefined;
}

export function getAgentMarkdownRewritePathname(pathname: string) {
  const docsPath = normalizeDocsPath(pathname);

  if (SKIPPED_DOCS_PATHS.has(docsPath)) return undefined;
  if (
    SKIPPED_DOCS_PREFIXES.some((prefix) => docsPath === prefix || docsPath.startsWith(`${prefix}/`))
  ) {
    return undefined;
  }
  if (/\/[^/]+\.[^/]+$/.test(docsPath)) return undefined;

  const basePath = getDocsBasePath(pathname);
  return docsPath === "/" ? `${basePath}/llms.mdx` : `${basePath}/llms.mdx${docsPath}`;
}
