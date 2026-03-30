import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/typescript.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "type-safe-database-queries": `// Inferred type:
// User & {
//   posts: Post[];
// }
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    password: '0ee4808f893b8e05bdd251048d5c4c8af8bb89403676dda95619841a481f8e87',
    name: 'Alice',
    posts: {
      create: {
        title: 'Learn how to use Prisma with TypeScript',
        content: 'https://www.prisma.io/docs/',
      },
    },
  },
  include: {
    posts: true,
  },
})`,
  "generated-types": `type User = {
  id: string
  email: string
  password: string
  name: string | null
}

export type Post = {
  id: string
  createdAt: Date
  title: string
  content: string | null
  authorId: string
}`,
};

export const metadata: Metadata = {
  title: "TypeScript & Prisma | TypeScript ORM for SQL Databases",
  description:
    "Prisma is a TypeScript ORM that makes you more confident with type safe database access. It's the easiest way to access SQL databases in Node.js with TypeScript",
  alternates: {
    canonical: "https://www.prisma.io/typescript",
  },
  openGraph: {
    title: "TypeScript & Prisma | TypeScript ORM for SQL Databases",
    description:
      "Prisma is a TypeScript ORM that makes you more confident with type safe database access. It's the easiest way to access SQL databases in Node.js with TypeScript",
    url: "https://www.prisma.io/typescript",
    images: [{ url: "/og/prisma-with/typescript.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeScript & Prisma | TypeScript ORM for SQL Databases",
    description:
      "Prisma is a TypeScript ORM that makes you more confident with type safe database access. It's the easiest way to access SQL databases in Node.js with TypeScript",
    images: ["/og/prisma-with/typescript.png"],
  },
};

export default async function TypeScriptPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
