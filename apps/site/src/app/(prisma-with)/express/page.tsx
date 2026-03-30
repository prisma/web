import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/express.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "basic-crud-routes": `// src/routes/users.ts
import express from 'express';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const router = express.Router();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({ data: { name, email } });
  res.status(201).json(newUser);
});

export default router;`,
  "authentication-middleware": `// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true }
  });
  req.user = user;
  next();
};

import express from 'express';
const router = express.Router();
router.use(authenticate);`,
  transactions: `// src/routes/orders.ts
import express from 'express';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const router = express.Router();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

router.post('/', async (req, res) => {
  const { userId, items } = req.body;
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { userId, status: 'PENDING' } });
    const orderItems = await Promise.all(
      items.map(item => tx.orderItem.create({
        data: { orderId: order.id, productId: item.productId, quantity: item.quantity }
      }))
    );
    return { order, orderItems };
  });
  res.status(201).json(result);
});

export default router;`,
  "data-model-migrations": `model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}`,
};

export const metadata: Metadata = {
  title: "Express & Prisma | Next-Generation ORM for SQL DBs",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Express apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/express",
  },
  openGraph: {
    title: "Express & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Express apps with MySQL, PostgreSQL & SQL Server databases.",
    url: "https://www.prisma.io/express",
    images: [{ url: "/og/prisma-with/express.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Express & Prisma | Next-Generation ORM for SQL DBs",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Express apps with MySQL, PostgreSQL & SQL Server databases.",
    images: ["/og/prisma-with/express.png"],
  },
};

export default async function ExpressPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
