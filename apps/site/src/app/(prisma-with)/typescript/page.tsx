import { createPageMetadata } from "@/lib/page-metadata";
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

export const metadata = createPageMetadata({
  title: "TypeScript ORM with zero-cost type-safety for your database",
  description:
    "Query data from MySQL, PostgreSQL & SQL Server databases with Prisma – a type-safe TypeScript ORM for Node.js",
  path: "/typescript",
  ogImage: "/og/prisma-with/typescript.png",
});

export default async function TypeScriptPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
