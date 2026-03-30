import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/hapi.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "prisma-plugin": `import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import Hapi from '@hapi/hapi'

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient
  }
}

const prismaPlugin = {
  name: 'prisma',
  register: async function(server) {
    const prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    })
    server.app.prisma = prisma
    server.ext({
      type: 'onPostStop',
      method: async (server) => { server.app.prisma.$disconnect() },
    })
  },
}

export default prismaPlugin`,
  "users-plugin": `import Hapi from '@hapi/hapi'

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async function(server) {
    server.route([
      {
        method: 'POST',
        path: '/user',
        handler: createUserHandler,
      },
    ])
  },
}

export default usersPlugin

async function createUserHandler(request, h) {
  const { prisma } = request.server.app
  const payload = request.payload
  const createdUser = await prisma.user.create({
    data: { name: payload.name, email: payload.email },
  })
  return h.response(createdUser).code(201)
}`,
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
  title: "Hapi Database & Prisma | Next-Generation ORM for SQL DBs",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build hapi apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/hapi",
  },
  openGraph: {
    title: "Hapi Database & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build hapi apps with MySQL, PostgreSQL & SQL Server databases.",
    url: "https://www.prisma.io/hapi",
    images: [{ url: "/og/prisma-with/hapi.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hapi Database & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build hapi apps with MySQL, PostgreSQL & SQL Server databases.",
    images: ["/og/prisma-with/hapi.png"],
  },
};

export default async function HapiPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
