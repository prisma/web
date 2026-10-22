import { envSecret } from "@prisma/composer-prisma-cloud";

type Website = "site" | "docs" | "blog" | "handbook" | "eclipse";
const integrations: Record<string, { sites: Website[]; secrets: string[] }> = {
  mixedbread: {
    sites: ["site", "docs", "blog"],
    secrets: ["MIXEDBREAD_API_KEY"],
  },
  brevo: { sites: ["site", "docs", "blog"], secrets: ["BREVO_API_KEY"] },
  extensions: { sites: ["site"], secrets: ["GITHUB_EXTENSIONS_TOKEN"] },
  linear: {
    sites: ["docs"],
    secrets: ["GITHUB_WEBHOOK_SECRET", "BOT_TOKEN_GITHUB_PR_LINEAR_WEBHOOK", "LINEAR_API_KEY"],
  },
};

// A bound envSecret is required by deploy preflight even when the input schema
// is optional. Declare only explicitly enabled integrations; do not manufacture
// cloud credentials or let a typo silently disable a requested integration.
export function integrationCredentials(
  website: Website,
  setting = process.env.COMPOSER_INTEGRATIONS ?? "",
) {
  const names = new Set<string>();
  for (const name of setting
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)) {
    if (!Object.hasOwn(integrations, name)) {
      throw new Error(
        `Unknown COMPOSER_INTEGRATIONS entry ${JSON.stringify(name)}. Choose from ${Object.keys(integrations).join(", ")}.`,
      );
    }
    const integration = integrations[name];
    if (integration.sites.includes(website)) {
      for (const secret of integration.secrets) names.add(secret);
    }
  }
  return Object.fromEntries([...names].map((name) => [name, envSecret(name)]));
}
