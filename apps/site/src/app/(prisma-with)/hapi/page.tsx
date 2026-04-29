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
  title: "The perfect ORM for hapi developers",
  description:
    "Query data from MySQL, PostgreSQL & SQL Server databases in hapi apps with Prisma – a better ORM for JavaScript and TypeScript.",
  alternates: {
    canonical: "https://www.prisma.io/hapi",
  },
  openGraph: {
    title: "The perfect ORM for hapi developers",
    description:
      "Query data from MySQL, PostgreSQL & SQL Server databases in hapi apps with Prisma – a better ORM for JavaScript and TypeScript.",
    url: "https://www.prisma.io/hapi",
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/prisma-with/hapi.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prisma",
    creator: "@prisma",
    title: "The perfect ORM for hapi developers",
    description:
      "Query data from MySQL, PostgreSQL & SQL Server databases in hapi apps with Prisma – a better ORM for JavaScript and TypeScript.",
    images: ["/og/prisma-with/hapi.png"],
  },
};

export default async function HapiPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
