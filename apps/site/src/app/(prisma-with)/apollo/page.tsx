import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/apollo.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "apollo-server-sdl-first": `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import { ApolloServer } from 'apollo-server'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const typeDefs = \`
  type User {
    email: String!
    name: String
  }

  type Query {
    allUsers: [User!]!
  }
\`;

const resolvers = {
  Query: {
    allUsers: () => {
      return prisma.user.findMany();
    }
  }
};

const server = new ApolloServer({ resolvers, typeDefs });
server.listen({ port: 4000 });`,
  "nexus-code-first": `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import {
  queryType,
  objectType,
  makeSchema
} from '@nexus/schema';
import { ApolloServer } from 'apollo-server'

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

const schema = makeSchema({
  types: [User, Query]
});

const server = new ApolloServer({ schema });
server.listen({ port: 4000 });`,
  "typegraphql-code-first": `import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import { ObjectType, Field, buildSchemaSync, Resolver, Query } from 'type-graphql'
import { ApolloServer } from 'apollo-server'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

@ObjectType()
export class User {
  @Field()
  email: string

  @Field((type) => String, { nullable: true })
  name?: string | null
}

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User], { nullable: true })
  async allUsers() {
    return prisma.user.findMany()
  }
}

const schema = buildSchemaSync({
  resolvers: [UserResolver],
})
const server = new ApolloServer({ schema });
server.listen({ port: 4000 });`,
};

export const metadata: Metadata = {
  title: "Easy, type-safe database access with Prisma & Apollo",
  description:
    "Query data from MySQL, PostgreSQL & SQL Server databases in GraphQL with Prisma – a better ORM for JavaScript and TypeScript.",
  alternates: {
    canonical: "https://www.prisma.io/apollo",
  },
  openGraph: {
    title: "Easy, type-safe database access with Prisma & Apollo",
    description:
      "Query data from MySQL, PostgreSQL & SQL Server databases in GraphQL with Prisma – a better ORM for JavaScript and TypeScript.",
    url: "https://www.prisma.io/apollo",
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/prisma-with/apollo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prisma",
    creator: "@prisma",
    title: "Easy, type-safe database access with Prisma & Apollo",
    description:
      "Query data from MySQL, PostgreSQL & SQL Server databases in GraphQL with Prisma – a better ORM for JavaScript and TypeScript.",
    images: ["/og/prisma-with/apollo.png"],
  },
};

export default async function ApolloPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
