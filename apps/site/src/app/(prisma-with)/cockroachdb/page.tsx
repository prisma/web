import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/cockroachdb.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

export const metadata: Metadata = {
  title: "Prisma & CockroachDB | ORM for the cloud-distributed database",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with CockroachDB.",
  alternates: {
    canonical: "https://www.prisma.io/cockroachdb",
  },
  openGraph: {
    title: "Prisma & CockroachDB | ORM for the cloud-distributed database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with CockroachDB.",
    url: "https://www.prisma.io/cockroachdb",
    images: [{ url: "/og/prisma-with/cockroachdb.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prisma & CockroachDB | ORM for the cloud-distributed database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with CockroachDB.",
    images: ["/og/prisma-with/cockroachdb.png"],
  },
};

export default async function CockroachDbPage() {
  return <PrismaWithLayout data={data} codeExamples={{}} />;
}
