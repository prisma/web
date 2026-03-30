import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/graphql.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "graphql-tools-sdl-first": `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const typeDefs = \`
  type User { email: String! name: String }
  type Query { allUsers: [User!]! }
\`;

const resolvers = {
  Query: {
    allUsers: () => prisma.user.findMany()
  }
};

export const schema = makeExecutableSchema({ resolvers, typeDefs });

const app = express();
app.use('/graphql', graphqlHTTP({ schema }));
app.listen(4000);`,
  "nexus-code-first": `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import { queryType, objectType, makeSchema } from '@nexus/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const User = objectType({
  name: 'User',
  definition(t) {
    t.string('email');
    t.string('name', { nullable: true });
  }
});

const Query = queryType({
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve: () => prisma.user.findMany()
    });
  }
});

const schema = makeSchema({ types: [User, Query] });
const app = express();
app.use('/graphql', graphqlHTTP({ schema }));
app.listen(4000);`,
  "typegraphql-code-first": `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import { ObjectType, Field, Resolver, Query, buildSchemaSync } from 'type-graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

@ObjectType()
export class User {
  @Field() email: string
  @Field((type) => String, { nullable: true }) name?: string | null
}

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User], { nullable: true })
  async allUsers() { return prisma.user.findMany() }
}

const schema = buildSchemaSync({ resolvers: [UserResolver] });
const app = express();
app.use('/graphql', graphqlHTTP({ schema }));
app.listen(4000);`,
};

export const metadata: Metadata = {
  title: "GraphQL with Database & Prisma | Next-Generation ORM for SQL Databases",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build GraphQL servers with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/graphql",
  },
  openGraph: {
    title: "GraphQL with Database & Prisma | Next-Generation ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build GraphQL servers with MySQL, PostgreSQL & SQL Server databases.",
    url: "https://www.prisma.io/graphql",
    images: [{ url: "/og/prisma-with/graphql.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GraphQL with Database & Prisma | Next-Generation ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build GraphQL servers with MySQL, PostgreSQL & SQL Server databases.",
    images: ["/og/prisma-with/graphql.png"],
  },
};

export default async function GraphQlPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
