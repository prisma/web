import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button } from "@prisma/eclipse";
import HeroCode, { HeroCodeStep } from "@/components/migrate/hero-code";

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

const migrateSteps: HeroCodeStep[] = [
  {
    title: "Creating a new model",
    migrateFileName: "init/20210211160000_init/migration.sql",
    schema: `model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`.trim(),
    migrateFileContents: `-- CreateTable
CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,

  PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" IN "User"("email");`.trim(),
    arrowOffset: {
      x: -60,
      y: 0,
      rotation: 0,
    },
  },
  {
    title: "Adding a model",
    migrateFileName: "init/20210325160100_add_post/migration.sql",
    schema: `
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
+  posts Post[]
}
+
+model Post {
+  id        Int      @id @default(autoincrement())
+  created   DateTime @default(now())
+  title     String   @db.VarChar(70)
+  content   String
+  author    User?    @relation(fields: [authorId], references: [id])
+  authorId  Int
+}`.trim(),
    migrateFileContents: `
-- CreateTable
CREATE TABLE "Post" (
  "id" SERIAL NOT NULL,
  "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "title" VARCHAR(70) NOT NULL,
  "content" TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("authorId") REFERENCES
"User"("id") ON DELETE CASCADE ON UPDATE CASCADE;`.trim(),
    arrowOffset: {
      x: 190,
      y: -20,
      rotation: -70,
    },
  },
];

export default function Migrate() {
  return (
    <main className="flex-1 w-screen bg-background-default">
      <div className="hero relative w-full -mt-33 pt-45 block pb-12 flex flex-col gap-8">
        <div className="bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] absolute inset-0 z-0 overflow-hidden opacity-20" />
        <div className="flex flex-col gap-4 relative z-1">
          <h5 className="stretch-display font-sans-display mx-auto w-fit my-0 text-background-orm-reverse uppercase">
            Prisma Migrate
          </h5>
          <h1 className="stretch-display text-6xl font-bold text-center font-sans-display z-2 relative">
            Hassle-free
            <br />
            Database Migrations
          </h1>
        </div>
        <p className="max-w-200 w-full mx-auto text-center relative z-1">
          Prisma Migrate uses Prisma schema changes to automatically generate
          fully customizable database schema migrations
        </p>
        <div className="flex gap-4 mx-auto relative z-1">
          <Button
            variant="orm"
            size="3xl"
            href="/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql"
          >
            <span>Install Prisma</span>
          </Button>
          <Button
            variant="default-stronger"
            size="3xl"
            href="https://playground.prisma.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Playground</span>
          </Button>
        </div>
      </div>
      <div className="px-4">
        <div className="max-w-[1200px] mx-auto">
          <HeroCode steps={migrateSteps} />
        </div>
      </div>
    </main>
  );
}
