import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/cockroachdb.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

export const metadata: Metadata = {
  title: "Distributed data and powerful tooling with Prisma & CockroachDB",
  description:
    "Manage your data at scale with CockroachDB and Prisma – a next-generation ORM for Node.js and TypeScript.",
  alternates: {
    canonical: "https://www.prisma.io/cockroachdb",
  },
  openGraph: {
    title: "Distributed data and powerful tooling with Prisma & CockroachDB",
    description:
      "Manage your data at scale with CockroachDB and Prisma – a next-generation ORM for Node.js and TypeScript.",
    url: "https://www.prisma.io/cockroachdb",
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/prisma-with/cockroachdb.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prisma",
    creator: "@prisma",
    title: "Distributed data and powerful tooling with Prisma & CockroachDB",
    description:
      "Manage your data at scale with CockroachDB and Prisma – a next-generation ORM for Node.js and TypeScript.",
    images: ["/og/prisma-with/cockroachdb.png"],
  },
};

export default async function CockroachDbPage() {
  return <PrismaWithLayout data={data} codeExamples={{}} />;
}
