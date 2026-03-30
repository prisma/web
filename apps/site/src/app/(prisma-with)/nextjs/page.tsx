import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/nextjs.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "static-data": `// app/blog/[slug]/page.tsx

import { prisma } from '@/lib/prisma'

export async function generateStaticParams() {
  const posts = await prisma.post.findMany()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })
  return (
    <div>
      <h1>{post?.title || 'Post not found'}</h1>
      <p>{post?.content || 'No content available'}</p>
    </div>
  )
}`,
  "dynamic-data": `// app/dashboard/page.tsx

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id }
  })

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}`,
  "server-actions": `// app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await prisma.post.create({ data: { title, content } })
  revalidatePath('/blog')
}`,
  "api-routes": `// app/api/posts/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await prisma.post.findMany()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const json = await request.json()
  const post = await prisma.post.create({ data: json })
  return NextResponse.json(post)
}`,
  "client-components": `// app/components/PostList.tsx
'use client'

import { useState } from 'react'
import { Post } from '../generated/client'

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// app/blog/page.tsx
import { prisma } from '@/lib/prisma'
import PostList from '../components/PostList'

export default async function BlogPage() {
  const posts = await prisma.post.findMany()
  return <PostList initialPosts={posts} />
}`,
};

export const metadata: Metadata = {
  title: "Next.js Database with Prisma | Next-Generation ORM for SQL Databases",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Next.js apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/nextjs",
  },
  openGraph: {
    title: "Next.js Database with Prisma | Next-Generation ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Next.js apps with MySQL, PostgreSQL & SQL Server databases.",
    url: "https://www.prisma.io/nextjs",
    images: [{ url: "/og/prisma-with/nextjs.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Database with Prisma | Next-Generation ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Next.js apps with MySQL, PostgreSQL & SQL Server databases.",
    images: ["/og/prisma-with/nextjs.png"],
  },
};

export default async function NextJsPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
