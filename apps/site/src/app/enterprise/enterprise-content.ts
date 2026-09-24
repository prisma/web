/**
 * Plain data for the /enterprise page.
 *
 * Kept React-free so both the page and its Markdown rendition
 * (`@/lib/markdown/enterprise`) can read the same copy without a route handler
 * pulling components in.
 */

// Ported (condensed) from the old site's /enterprise page. The Tally contact
// form is linked directly instead of embedded.
export const CONTACT_URL = "https://tally.so/r/3jQDNR";

export const BENEFITS = [
  {
    title: "Enterprise-level support",
    description:
      "Work directly with Prisma specialists who understand enterprise architectures, delivery timelines, and production constraints.",
  },
  {
    title: "Risk and compliance",
    description:
      "Navigate security reviews, procurement, and compliance requirements with clearer guidance and supporting documentation.",
  },
  {
    title: "Custom solutions",
    description:
      "Shape an engagement that fits your stack, internal processes, and the needs of your organization.",
  },
  {
    title: "Priority resolution",
    description:
      "Escalate urgent issues faster to reduce downtime, unblock teams, and keep releases on schedule.",
  },
  {
    title: "Advanced security",
    description:
      "Adopt secure defaults and harden database access patterns for sensitive workloads and regulated environments.",
  },
  {
    title: "Performance optimization",
    description:
      "Tune query patterns, schema design, and workflows for predictable performance under real production load.",
  },
  {
    title: "Scalability consultation",
    description:
      "Plan for growth with guidance on scaling data access, team workflows, and application architecture.",
  },
  {
    title: "Team training",
    description:
      "Upskill developers with hands-on enablement tailored to your codebase, workflows, and Prisma adoption goals.",
  },
  {
    title: "Influential feedback loop",
    description:
      "Share direct product feedback with the Prisma team and help shape the roadmap around enterprise needs.",
  },
];

export const DATABASES = [
  { name: "PostgreSQL", icon: "/enterprise/databases/postgres.svg" },
  { name: "MySQL", icon: "/enterprise/databases/mysqlsimple.svg" },
  { name: "MariaDB", icon: "/enterprise/databases/mariadb.svg" },
  { name: "SQLite", icon: "/enterprise/databases/sqlite.svg" },
  { name: "SQL Server", icon: "/enterprise/databases/sqlserver.svg" },
  { name: "CockroachDB", icon: "/enterprise/databases/cockroachdb.svg" },
  { name: "PlanetScale", icon: "/enterprise/databases/planetscale.svg" },
  { name: "MongoDB", icon: "/enterprise/databases/mongodbsimple.svg" },
];
