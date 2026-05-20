const WORD_DISPLAY_MAP: Record<string, string> = {
  ai: "AI",
  api: "API",
  cli: "CLI",
  crud: "CRUD",
  css: "CSS",
  csv: "CSV",
  db: "DB",
  ddl: "DDL",
  dns: "DNS",
  html: "HTML",
  http: "HTTP",
  https: "HTTPS",
  iac: "IaC",
  id: "ID",
  ids: "IDs",
  json: "JSON",
  jwt: "JWT",
  mdx: "MDX",
  orm: "ORM",
  pgx: "PGX",
  pql: "PQL",
  sdk: "SDK",
  sql: "SQL",
  ssl: "SSL",
  tcp: "TCP",
  tls: "TLS",
  url: "URL",
  urls: "URLs",
  xml: "XML",
  authjs: "Auth.js",
  nextauth: "NextAuth",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  cockroachdb: "CockroachDB",
  planetscale: "PlanetScale",
};

export function formatSlugDisplayName(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const key = word.toLowerCase();
      return (
        WORD_DISPLAY_MAP[key] ??
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}
