import { createPageMetadata } from "@/lib/page-metadata";
import * as data from "../../../data/prisma-with/cockroachdb.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

export const metadata = createPageMetadata({
  title: "Distributed data and powerful tooling with Prisma & CockroachDB",
  description:
    "Manage your data at scale with CockroachDB and Prisma – a next-generation ORM for Node.js and TypeScript.",
  path: "/cockroachdb",
  ogImage: "/og/prisma-with/cockroachdb.png",
});

export default async function CockroachDbPage() {
  return <PrismaWithLayout data={data} codeExamples={{}} />;
}
