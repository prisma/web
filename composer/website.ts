import { secretString } from "@prisma/composer/arktype";
import nextjs from "@prisma/composer/nextjs";
import { compute, envSecret, serviceOrigin } from "@prisma/composer-prisma-cloud";
import { type } from "arktype";
import { integrationCredentials } from "./integrations.ts";
import { installRequestOrigin } from "./request-origin.ts";

// A compatibility boundary for the existing Next.js apps. Composer resolves
// these values through typed input; the bootstrap writes the legacy env names
// before importing Next's server. Vercel keeps supplying those names directly.
const input = type({
  gatewayOrigin: "string",
  proxyKey: secretString(),
  "MIXEDBREAD_API_KEY?": secretString(),
  "BREVO_API_KEY?": secretString(),
  "GITHUB_EXTENSIONS_TOKEN?": secretString(),
  "GITHUB_WEBHOOK_SECRET?": secretString(),
  "BOT_TOKEN_GITHUB_PR_LINEAR_WEBHOOK?": secretString(),
  "LINEAR_API_KEY?": secretString(),
  "ORA_INGEST_KEY?": secretString(),
  "ORA_KEY?": secretString(),
  "ORA_SALT?": secretString(),
  "NEXT_PUBLIC_PRISMA_URL?": "string",
  "EXTENSIONS_REPO?": "string",
  "EXTENSIONS_BASE_BRANCH?": "string",
  "LINEAR_TEAM_ID?": "string",
  "ORA_DOMAIN_ID?": "string",
  "ORA_POLICY_URL?": "string",
  "ORA_EDGE?": "string",
  "ORA_INGEST_URL?": "string",
  "ORA_INGEST?": "string",
});

const common = { gatewayOrigin: serviceOrigin("gateway"), proxyKey: envSecret("WEB_PROXY_KEY") };
// Bind only the integrations each website consumes. Other optional input
// fields can be added explicitly when configuring the production workspace.
export const websiteInputs = {
  site: {
    ...common,
    ...integrationCredentials("site"),
  },
  docs: {
    ...common,
    ...integrationCredentials("docs"),
  },
  blog: { ...common, ...integrationCredentials("blog") },
  handbook: common,
  eclipse: common,
};

export function website(name: string, module: string, appDir: string) {
  return compute({ name, deps: {}, input, build: nextjs({ module, appDir }) });
}

export function initializeWebsite(service: ReturnType<typeof website>) {
  const { gatewayOrigin, proxyKey, ...settings } = service.input();
  installRequestOrigin(proxyKey.expose());
  for (const [name, value] of Object.entries(settings)) {
    if (value !== undefined) {
      process.env[name] = typeof value === "string" ? value : value.expose();
    } else {
      delete process.env[name];
    }
  }
  // Search uses the same gateway in every environment; no production origin
  // or localhost port is compiled into cross-zone requests.
  process.env.NEXT_SITE_ORIGIN = gatewayOrigin;
  process.env.NEXT_DOCS_ORIGIN = gatewayOrigin;
  process.env.NEXT_BLOG_ORIGIN = gatewayOrigin;
  process.env.HOSTNAME = "0.0.0.0";
}
