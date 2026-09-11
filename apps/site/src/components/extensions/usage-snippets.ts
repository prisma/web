import { isDatabase, isMiddleware, type ExtensionEntry } from "@prisma-docs/ui/data/extensions";

export type UsageSnippet = { title: string; file: string; code: string };

const middlewareRegistration = (importLine: string, call: string): UsageSnippet[] => [
  {
    title: "Register it on the client",
    file: "src/prisma/db.ts",
    code: `${importLine}
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [${call}],
});`,
  },
];

const HAND_WRITTEN: Record<string, UsageSnippet[]> = {
  postgresql: [
    {
      title: "Configure the database",
      file: "prisma.config.ts",
      code: `import { definePrismaConfig } from 'prisma/config';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});`,
    },
    {
      title: "Create the client",
      file: "src/prisma/db.ts",
      code: `import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});`,
    },
  ],
  mongodb: [
    {
      title: "Configure the database",
      file: "prisma.config.ts",
      code: `import { definePrismaConfig } from 'prisma/config';
import { defineConfig as ormConfig } from '@prisma/orm-mongo/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: process.env['MONGODB_URL']!,
    },
  }),
});`,
    },
    {
      title: "Create the client",
      file: "src/prisma/db.ts",
      code: `import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = mongo<Contract>({
  contractJson,
  url: process.env['MONGODB_URL']!,
  dbName: 'app',
});`,
    },
  ],
  sqlite: [
    {
      title: "Configure the database",
      file: "prisma.config.ts",
      code: `import { definePrismaConfig } from 'prisma/config';
import { defineConfig as ormConfig } from '@prisma/orm-sqlite/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: './app.db',
    },
  }),
});`,
    },
    {
      title: "Create the client",
      file: "src/prisma/db.ts",
      code: `import sqlite from '@prisma/orm-sqlite/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = sqlite<Contract>({
  contractJson,
  path: './app.db',
});`,
    },
  ],
  pgvector: [
    {
      title: "Declare a vector column",
      file: "src/prisma/contract.prisma",
      code: `types {
  Embedding1536 = pgvector.Vector(1536)
}

model Post {
  id        String         @id @default(uuid())
  title     String
  embedding Embedding1536?
}`,
    },
    {
      title: "Query by similarity",
      file: "src/prisma/similarity-search.ts",
      code: `const plan = db.sql.public.post
  .select('id', 'title')
  .select('distance', (f, fns) => fns.cosineDistance(f.embedding, queryVector))
  .orderBy((f, fns) => fns.cosineDistance(f.embedding, queryVector), { direction: 'asc' })
  .limit(10)
  .build();

const similar = await db.runtime().query(plan);`,
    },
  ],
  postgis: [
    {
      title: "Declare a geometry column",
      file: "src/prisma/contract.prisma",
      code: `types {
  Point4326 = postgis.Geometry(4326)
}

model Place {
  id       String    @id @default(uuid())
  name     String
  location Point4326
}`,
    },
  ],
  supabase: [
    {
      title: "Register it in the config",
      file: "prisma.config.ts",
      code: `import { definePrismaConfig } from 'prisma/config';
import supabasePack from '@prisma/orm-extension-supabase/pack';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    extensions: [supabasePack],
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});`,
    },
    {
      title: "Create the role-bound client",
      file: "src/prisma/db.ts",
      code: `import { supabase } from '@prisma/orm-extension-supabase/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = supabase<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  jwtSecret: process.env['SUPABASE_JWT_SECRET']!,
});

// Per request: db.asUser(jwt), db.asAnon(), or db.asServiceRole().`,
    },
  ],
  "middleware-cache": middlewareRegistration(
    "import { createCacheMiddleware } from '@prisma/orm-extension-middleware-cache';",
    "createCacheMiddleware({ maxEntries: 1_000 })",
  ),
};

/**
 * Registration snippets shown on an extension's detail page. Official
 * extension packs share one layout (a `/control` and a `/runtime` entrypoint),
 * so those are generated. Middleware and database packages register
 * differently and use the hand-written snippets. Community packages document
 * their own layout, so the page links to their README instead.
 */
export function getUsageSnippets(entry: ExtensionEntry): UsageSnippet[] {
  const handWritten = HAND_WRITTEN[entry.slug] ?? [];
  if (entry.source !== "official") return handWritten;
  if (isMiddleware(entry) || isDatabase(entry)) return handWritten;
  // Supabase ships a `/pack` entrypoint and its own client factory instead of
  // the `/control` + `/runtime` pair, so its snippets are hand-written above.
  if (entry.slug === "supabase") return handWritten;

  const identifier = entry.slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
  return [
    {
      title: "Register it in the config",
      file: "prisma.config.ts",
      code: `import { definePrismaConfig } from 'prisma/config';
import ${identifier} from '${entry.package}/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    extensions: [${identifier}],
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});`,
    },
    {
      title: "Register it on the client",
      file: "src/prisma/db.ts",
      code: `import ${identifier} from '${entry.package}/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  extensions: [${identifier}],
});`,
    },
    ...handWritten,
  ];
}
