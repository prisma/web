import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Action, Button, Card } from "@prisma/eclipse";
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
      <div className="hero relative w-full -mt-33 pt-45 pb-8 flex flex-col gap-8">
        <div className="bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] absolute inset-0 z-0 overflow-hidden opacity-20" />
        <div className="flex flex-col gap-4 relative z-1">
          <h5 className="stretch-display font-sans-display mx-auto w-fit my-0 text-foreground-orm-strong uppercase">
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
          {/*<Button
            variant="default-stronger"
            size="3xl"
            href="https://playground.prisma.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Playground</span>
          </Button>*/}
        </div>
      </div>
      <div className="px-4 mb-12">
        <div className="max-w-[1200px] mx-auto pb-12">
          <HeroCode steps={migrateSteps} />
        </div>
      </div>
      <div className="px-4 my-12">
        <div className="max-w-[1200px] mx-auto py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]">
              <div className="flex gap-2 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-file-binary text-xl" />
                </Action>
                <h4 className="text-xl text-foreground-neutral font-sans-display font-extrabold">
                  Auto-generated
                </h4>
              </div>
              <p className="text-foreground-neutral-weak">
                Migrations are automatically generated so you don't have to
                write the SQL by hand.
              </p>
            </Card>
            <Card className="bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]">
              <div className="flex gap-2 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-file-binary text-xl" />
                </Action>
                <h4 className="text-xl text-foreground-neutral font-sans-display font-extrabold">
                  Deterministic / Repeatable
                </h4>
              </div>
              <p className="text-foreground-neutral-weak">
                Migrate generates SQL migrations, ensuring migrations will
                always result in the same database schema across environments.
              </p>
            </Card>
            <Card className="bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]">
              <div className="flex gap-2 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-file-binary text-xl" />
                </Action>
                <h4 className="text-xl text-foreground-neutral font-sans-display font-extrabold">
                  Customizable
                </h4>
              </div>
              <p className="text-foreground-neutral-weak">
                Generated SQL migrations can be fully customized giving you full
                control over the exact changes.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <div className="px-4 my-12">
        <div className="max-w-[1200px] mx-auto py-8">
          <div className="grid md:grid-cols-2 gap-18">
            <div>
              <h5 className="stretch-display font-sans-display w-fit my-0 text-background-orm-reverse uppercase">
                Iteration
              </h5>
              <h3 className="text-[48px] text-foreground-neutral font-bold mt-4 mb-8 leading-13">
                Fast in development
              </h3>
              <ul className="list-none space-y-6">
                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      Prototype fast without migrations
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      While prototyping you can create the database schema
                      quickly using the prisma db push command without creating
                      migrations.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      Integrated seeding
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      Quickly seed your database with data by defining a seed
                      script in JavaScript, TypeScript or Shell.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      Smart problem resolution
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      Migrate detects database schema drift and assists you in
                      resolving them.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="stretch-display font-sans-display w-fit my-0 text-background-orm-reverse uppercase">
                Deployment
              </h5>
              <h3 className="text-[48px] text-foreground-neutral font-bold mt-4 mb-8 leading-13">
                Reliable in Production
              </h3>
              <ul className="list-none space-y-6">
                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      Dedicated production workflows
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      Migrate supports dedicated workflows for carrying out
                      migrations safely in production.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      CI/CD Integration
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      Migrate can be integrated into CI/CD pipelines, e.g.
                      GitHub Actions, to automate applying migrations before
                      deployment.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <i className="fa-solid fa-circle-check text-background-orm-reverse text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-2xl mb-3 text-foreground-neutral font-bold">
                      Conflict detection and resolution
                    </h4>
                    <p className="text-base text-foreground-neutral-weak">
                      Migrate keeps track of applied migrations and provides
                      tools to detect and resolve conflicts and drifts between
                      migrations and the database schema.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 my-12">
        <div className="max-w-[1200px] mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Card 1 */}
            <Card className="bg-background-default justify-start md:col-span-2 lg:col-span-3">
              <div className="flex gap-4 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-terminal text-xl" />
                </Action>
                <h3 className="text-xl font-bold text-foreground-neutral font-sans-display">
                  Seamless integration with Prisma Client
                </h3>
              </div>
              <p className="text-foreground-neutral-weak">
                When using Prisma Migrate with Prisma Client, schema changes are
                type checked in your application code. This eliminates errors
                that arise when database schema changes require changes to the
                application code.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="bg-background-default justify-start md:col-span-2 lg:col-span-3">
              <div className="flex gap-4 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-messages text-xl" />
                </Action>
                <h3 className="text-xl font-bold text-foreground-neutral font-sans-display">
                  Declarative data modelling
                </h3>
              </div>
              <p className="text-foreground-neutral-weak">
                Prisma Migrate generates migrations based on changes in the
                Prisma schema – a human-readable declarative definition of your
                database schema. This allows you to focus on your desired
                database schema rather than the steps to get there.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="bg-background-default justify-start md:col-span-2 lg:col-span-2">
              <div className="flex gap-4 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-code-branch text-xl" />
                </Action>
                <h3 className="text-xl font-bold text-foreground-neutral font-sans-display">
                  Version control for your database
                </h3>
              </div>
              <p className="text-foreground-neutral-weak">
                With Prisma Migrate, generated migrations are tracked in your
                Git repository, allowing you to make changes to your database
                schema in tandem with your application code.
              </p>
            </Card>

            {/* Card 4 */}
            <Card className="bg-background-default justify-start md:col-span-2 lg:col-span-2">
              <div className="flex gap-4 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-users text-xl" />
                </Action>
                <h3 className="text-xl font-bold text-foreground-neutral font-sans-display">
                  Streamlined collaboration
                </h3>
              </div>
              <p className="text-foreground-neutral-weak">
                With Prisma Migrate, generated migrations are tracked in your
                Git repository, allowing you to make changes to your database
                schema in tandem with your application code.
              </p>
            </Card>

            {/* Card 5 */}
            <Card className="bg-background-default justify-start md:col-span-2 lg:col-span-2">
              <div className="flex gap-4 items-center">
                <Action color="orm" size="4xl">
                  <i className="fa-regular fa-hand-pointer text-xl" />
                </Action>
                <h3 className="text-xl font-bold text-foreground-neutral font-sans-display">
                  Bring your own project
                </h3>
              </div>
              <p className="text-foreground-neutral-weak">
                Prisma Migrate can be adopted in any existing project that uses
                PostgreSQL, MySQL, MariaDB, SQL Server, CockroachDB or SQLite.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
