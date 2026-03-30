import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/mongodb.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  read: `const usersWithProfile = await prisma.user.findMany({
  where: {
    profile: {
      isSet: true,
    },
  },
  select: {
    id: true,
    profile: {
      select: {
        profilePicture: true,
      },
    },
    posts: {
      where: {
        published: true,
      },
    },
  },
  take: 10,
  orderBy: {
    profile: {
      firstName: "asc",
    },
  },
});`,
  create: `await prisma.post.create({
  data: {
    title: "My New Post",
    author: {
      connectOrCreate: {
        create: {
          email: "sam@prisma.io",
          profile: {
            firstName: "Sam",
            lastName: "Smith",
          },
        },
        where: {
          email: "sam@prisma.io",
        },
      },
    },
  },
});`,
  update: `await prisma.user.update({
  where: {
    email: "smith@prisma.io",
  },
  data: {
    email: "harper@prisma.io",
    profile: {
      upsert: {
        update: {
          lastName: "Harper",
          maidenName: "Smith",
        },
        set: {
          firstName: "Sam",
          lastName: "Harper",
        },
      },
    },
  },
});`,
  delete: `await prisma.user.deleteMany({
  where: {
    profile: {
      isSet: false
    }
  },
});`,
  schema: `model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  email     String?  @unique
  posts     Post[]
  profile   Profile?
}

model Post {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(references: [id], fields: [authorId], onDelete: Cascade)
  authorId  String  @db.ObjectId
}

type Profile {
  firstName      String
  lastName       String
  maidenName     String?
  profilePicture String?
  department     Department?
}

enum Department {
  Marketing
  Sales
  Engineering
}`,
};

export const metadata: Metadata = {
  title: "Prisma & MongoDB | ORM for the scaleable serverless database",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with MongoDB.",
  alternates: {
    canonical: "https://www.prisma.io/mongodb",
  },
  openGraph: {
    title: "Prisma & MongoDB | ORM for the scaleable serverless database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with MongoDB.",
    url: "https://www.prisma.io/mongodb",
    images: [{ url: "/og/prisma-with/mongodb.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prisma & MongoDB | ORM for the scaleable serverless database",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build applications with MongoDB.",
    images: ["/og/prisma-with/mongodb.png"],
  },
};

export default async function MongoDbPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
