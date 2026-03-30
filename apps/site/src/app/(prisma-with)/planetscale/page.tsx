import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/planetscale.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

export const metadata: Metadata = {
  title: "Prisma & PlanetScale | ORM for the scaleable serverless database",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with PlanetScale",
  alternates: {
    canonical: "https://www.prisma.io/planetscale",
  },
  openGraph: {
    title: "Prisma & PlanetScale | ORM for the scaleable serverless database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with PlanetScale",
    url: "https://www.prisma.io/planetscale",
    images: [{ url: "/og/prisma-with/planetscale.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prisma & PlanetScale | ORM for the scaleable serverless database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with PlanetScale",
    images: ["/og/prisma-with/planetscale.png"],
  },
};

export default async function PlanetScalePage() {
  return <PrismaWithLayout data={data} codeExamples={{}} />;
}
