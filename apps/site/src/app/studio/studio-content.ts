/**
 * Plain data for the /studio page.
 *
 * Kept React-free so both the page and its Markdown rendition
 * (`@/lib/markdown/studio`) can read the same copy without a route handler
 * pulling components in.
 */

export const CONSOLE_URL = "https://console.prisma.io/login";
export const STUDIO_DOCS_URL = "https://www.prisma.io/docs/studio";
export const TRY_STUDIO_COMMAND = `npx try-prisma@latest --template orm/starter \\
&& cd hello-prisma \\
&& npx prisma studio`;

export const FEATURE_CARDS = [
  {
    title: "Quick access to your database",
    description:
      "Connect to your Prisma Postgres database or bring your own. Prisma Studio now lives right in the Prisma Console.",
    accent: "bg-prism-yellow-200",
  },
  {
    title: "No setup required",
    description:
      "Skip installation and go straight to your data. Your whole team can access and collaborate in one place.",
    accent: "bg-prism-yellow-300",
  },
  {
    title: "Real-time collaboration",
    description:
      "Work together on the same database in real time, with no local setup or configuration.",
    accent: "bg-prism-yellow-400",
  },
] as const;

export const FEATURE_ROWS = [
  {
    eyebrow: "Runs anywhere",
    title: "Local or collaborative",
    description:
      "Access your database anywhere. Work locally for fast development or use the Console for team collaboration. Move between solo and team workflows.",
    imageSrc: "/illustrations/studio/laptop.svg",
    imageAlt: "Prisma Studio interface showing local and collaborative workflows",
    imageWidth: 522,
    imageHeight: 295,
  },
  {
    eyebrow: "Data exploration",
    title: "Understand your data",
    description:
      "Browse your database visually with filters and search. Spot patterns and find what you need for debugging or schema changes, no SQL required.",
    imageSrc: "/illustrations/studio/explore.svg",
    imageAlt: "Prisma Studio data exploration interface with highlighted filters",
    imageWidth: 570,
    imageHeight: 275,
  },
  {
    eyebrow: "Advanced filtering",
    title: "Navigate complex relationships",
    description:
      "Explore data relationships with clickable, model-aware navigation. See how your records connect so your team can understand the database structure.",
    imageSrc: "/illustrations/studio/filter.svg",
    imageAlt: "Prisma Studio advanced filtering interface",
    imageWidth: 598,
    imageHeight: 235,
  },
  {
    eyebrow: "Multiple tabs",
    title: "Switch contexts instantly",
    description:
      "Find exactly what you need with precise filtering. Combine filters and operators to surface records from complex data.",
    imageSrc: "/illustrations/studio/tabs.svg",
    imageAlt: "Prisma Studio with multiple tabs open",
    imageWidth: 561,
    imageHeight: 215,
  },
  {
    eyebrow: "Embedded data editing",
    title: "Embed in your own apps",
    description:
      "When using Prisma Postgres, you can integrate Studio directly into your own applications to give your users a data editing experience.",
    imageSrc: "/illustrations/studio/embed.svg",
    imageAlt: "Embedded Prisma Studio experience inside an app",
    imageWidth: 582,
    imageHeight: 224,
  },
] as const;
