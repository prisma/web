import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/react.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "react-server-components": `// UserList.tsx (Server Component)
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

export default async function UserList() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  )
}`,
  "nextjs-app-router": `// app/users/page.tsx
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return (
    <div>
      <h1>Users</h1>
      <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>
    </div>
  )
}

// app/actions.ts (Server Action)
'use server'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import { revalidatePath } from 'next/cache'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  await prisma.user.create({ data: { name, email } })
  revalidatePath('/users')
}`,
  remix: `// app/routes/users.tsx
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

export async function loader() {
  const users = await prisma.user.findMany()
  return json({ users })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  await prisma.user.create({
    data: { name: formData.get('name') as string, email: formData.get('email') as string }
  })
  return json({ success: true })
}

export default function Users() {
  const { users } = useLoaderData<typeof loader>()
  return (
    <div>
      <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>
      <Form method="post">
        <input name="name" />
        <input name="email" type="email" />
        <button type="submit">Add User</button>
      </Form>
    </div>
  )
}`,
  "react-router-7-framework": `// routes/users.tsx
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import { Form, useLoaderData } from 'react-router-dom'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

export async function loader() {
  const users = await prisma.user.findMany()
  return { users }
}

export async function action({ request }) {
  const formData = await request.formData()
  await prisma.user.create({
    data: { name: formData.get('name'), email: formData.get('email') }
  })
  return { success: true }
}

export default function Users() {
  const { users } = useLoaderData()
  return (
    <div>
      <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
      <Form method="post">
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <button type="submit">Add User</button>
      </Form>
    </div>
  )
}`,
};

export const metadata: Metadata = {
  title: "React with Prisma | Next-Generation Node.js and TypeScript ORM",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to connect React apps to MySQL, PostgreSQL, SQL Server, CockroachDB, and MongoDB databases.",
  alternates: {
    canonical: "https://www.prisma.io/react",
  },
  openGraph: {
    title: "React with Prisma | Next-Generation Node.js and TypeScript ORM",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to connect React apps to MySQL, PostgreSQL, SQL Server, CockroachDB, and MongoDB databases.",
    url: "https://www.prisma.io/react",
    images: [{ url: "/og/prisma-with/react.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "React with Prisma | Next-Generation Node.js and TypeScript ORM",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to connect React apps to MySQL, PostgreSQL, SQL Server, CockroachDB, and MongoDB databases.",
    images: ["/og/prisma-with/react.png"],
  },
};

export default async function ReactPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
