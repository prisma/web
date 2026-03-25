import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/nestjs.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "static-data": `// app/blog/[slug]/page.tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Return a list of 'params' to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await prisma.post.findMany()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Multiple versions of this page will be statically generated
// using the 'params' returned by 'generateStaticParams'
export default async function Page({ params }: { params: { slug: string } }) {
  // Fetch the post based on slug
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  // Simple demo rendering
  return (
    <div>
      <h1>{post?.title || 'Post not found'}</h1>
      <p>{post?.content || 'No content available'}</p>
    </div>
  )
}`,
};

export const metadata: Metadata = {
  title: "Next.js Database with Prisma | Next-Generation ORM for SQL Databases",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Next.js apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/nextjs",
  },
};

export default async function NextJsPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
