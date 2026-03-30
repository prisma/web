export type StackLinkItem = {
  id: string;
  name: string;
  href: string;
  icon: string;
  /** Black/monochrome marks: invert in dark mode so they stay visible on dark UI */
  invertInDark?: boolean;
};

export type StackCategory = {
  id: string;
  title: string;
  description: string;
  items: StackLinkItem[];
};

/**
 * Twelve stack routes only — grouped like the legacy /stack page:
 * Languages → Databases → Frameworks.
 */
export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    title: "Languages",
    description: "Prisma can be used in any Node.js or TypeScript backend application.",
    items: [
      {
        id: "typescript",
        name: "TypeScript",
        href: "/typescript",
        icon: "/icons/technologies/ts.svg",
      },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Prisma works seamlessly across most popular databases and service providers.",
    items: [
      {
        id: "mongodb",
        name: "MongoDB",
        href: "/mongodb",
        icon: "/icons/technologies/mongo.svg",
      },
      {
        id: "cockroachdb",
        name: "CockroachDB",
        href: "/cockroachdb",
        icon: "/icons/technologies/cockroach.svg",
      },
      {
        id: "planetscale",
        name: "PlanetScale",
        href: "/planetscale",
        icon: "/icons/technologies/planetscale.svg",
        invertInDark: true,
      },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    description: "Here is a non-exhaustive list of libraries and frameworks you can use with Prisma.",
    items: [
      { id: "nextjs", name: "Next.js", href: "/nextjs", icon: "/icons/technologies/nextjs.svg" },
      { id: "nestjs", name: "NestJS", href: "/nestjs", icon: "/icons/technologies/nestjs.svg" },
      { id: "react", name: "React", href: "/react", icon: "/icons/technologies/react.svg" },
      {
        id: "express",
        name: "Express",
        href: "/express",
        icon: "/icons/technologies/express.svg",
        invertInDark: true,
      },
      { id: "hapi", name: "Hapi", href: "/hapi", icon: "/icons/technologies/hapi.svg" },
      { id: "graphql", name: "GraphQL", href: "/graphql", icon: "/icons/technologies/graphql.svg" },
      {
        id: "fastify",
        name: "Fastify",
        href: "/fastify",
        icon: "/icons/technologies/fastify.svg",
        invertInDark: true,
      },
      { id: "apollo", name: "Apollo", href: "/apollo", icon: "/icons/technologies/apollo.svg" },
    ],
  },
];
