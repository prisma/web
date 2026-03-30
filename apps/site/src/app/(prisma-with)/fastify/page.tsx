import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/fastify.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "rest-api": `import fastify from 'fastify'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })
const app = fastify()

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  res.json(posts)
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const post = await prisma.post.create({
    data: { title, content, published: false, author: { connect: { email: authorEmail } } },
  })
  res.json(post)
})

app.listen(3000)`,
  "prisma-in-a-fastify-plugin": `import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

declare module 'fastify' {
  interface FastifyInstance { prisma: PrismaClient }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  })
  await prisma.$connect()
  server.decorate('prisma', prisma)
  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin

// server.ts
import fastify from 'fastify'
import prismaPlugin from './plugins/prisma'

const app = fastify()
app.register(prismaPlugin)
await app.listen(3000, '0.0.0.0')`,
  "graphql-api": `import fastify from 'fastify'
import mercurius from 'mercurius'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

const app = fastify()
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

const typeDefs = \`
  type User { email: String! name: String }
  type Query { allUsers: [User!]! }
\`

const resolvers = {
  Query: { allUsers: () => prisma.user.findMany() }
}

app.register(mercurius, { schema: typeDefs, resolvers, graphiql: true })
app.listen(4000)`,
  "prisma-schema": `model User {
  id    Int     @default(autoincrement()) @id
  name  String?
  email String  @unique
  posts Post[]
}

model Post {
  id        Int      @default(autoincrement()) @id
  published Boolean? @default(false)
  title     String
  content   String?
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}`,
};

export const metadata: Metadata = {
  title: "Fastify & Prisma | Next-Generation ORM for SQL DBs",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Fastify apps with MySQL, PostgreSQL, SQL Server and MongoDB databases.",
  alternates: {
    canonical: "https://www.prisma.io/fastify",
  },
  openGraph: {
    title: "Fastify & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Fastify apps with MySQL, PostgreSQL, SQL Server and MongoDB databases.",
    url: "https://www.prisma.io/fastify",
    images: [{ url: "/og/prisma-with/fastify.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fastify & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Fastify apps with MySQL, PostgreSQL, SQL Server and MongoDB databases.",
    images: ["/og/prisma-with/fastify.png"],
  },
};

export default async function FastifyPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
