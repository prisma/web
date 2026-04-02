import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/planetscale.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

export const metadata: Metadata = {
  title: "Type-safe access and limitless scale with Prisma & PlanetScale",
  description:
    "Query data from PlanetScale with Prisma – a next-generation ORM for Node.js and TypeScript.",
  alternates: {
    canonical: "https://www.prisma.io/planetscale",
  },
  openGraph: {
    title: "Type-safe access and limitless scale with Prisma & PlanetScale",
    description:
      "Query data from PlanetScale with Prisma – a next-generation ORM for Node.js and TypeScript.",
    url: "https://www.prisma.io/planetscale",
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/prisma-with/planetscale.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prisma",
    creator: "@prisma",
    title: "Type-safe access and limitless scale with Prisma & PlanetScale",
    description:
      "Query data from PlanetScale with Prisma – a next-generation ORM for Node.js and TypeScript.",
    images: ["/og/prisma-with/planetscale.png"],
  },
};

export default async function PlanetScalePage() {
  return <PrismaWithLayout data={data} codeExamples={{}} />;
}
