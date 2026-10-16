export const CONVEX_PATH = "/compare/convex";

export const CONVEX_TITLE =
  "Prisma Postgres vs Convex: standard Postgres or a reactive database?";

export const CONVEX_DESCRIPTION =
  "Convex is a reactive database with TypeScript queries. Prisma Postgres is PostgreSQL, and Prisma ORM is optional. Prisma makes Prisma Postgres.";

export const CHECKED = "October 2026";

export const CHOOSE_PRISMA = [
  "You want a standard SQL database. Prisma Postgres is PostgreSQL.",
  "You want to query it with SQL, or with Prisma ORM. Prisma ORM is optional.",
  "You want Prisma Compute to host the TypeScript app as HTTP services.",
  "You want a pricing page that does not list a per-developer fee.",
];

export const CHOOSE_CONVEX = [
  "You want queries written as TypeScript functions, with no SQL in the application.",
  "You want a query to rerun when the data it read changes, and the client to receive that result.",
  "You want the database and the server functions in Convex, and the frontend on a host such as Vercel or Netlify.",
  "You want file storage, text search, vector search, and auth on the same Convex plan as the database.",
];

export type CompareRow = {
  feature: string;
  convex: string;
  prisma: string;
};

/** Columns run Feature, Convex, Prisma Postgres: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Database",
    convex:
      "The Convex database. Application queries are TypeScript. Convex cloud stores data in MySQL. The open-source version can use SQLite, Postgres, or MySQL as the persistence layer.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional.",
  },
  {
    feature: "Queries",
    convex:
      "TypeScript query and mutation functions. The overview says there is no SQL to write and no ORM is required. A mutation runs as a transaction.",
    prisma:
      "SQL against PostgreSQL, or [Prisma ORM](/docs/orm). Prisma ORM 8 is a release candidate. Models live in contract.prisma.",
  },
  {
    feature: "Realtime updates",
    convex:
      "A query reruns when the data it read changes. The client library receives the new result over a WebSocket.",
    prisma:
      "No built-in reactive query sync. [Prisma Compute](/docs/compute) does not currently support WebSocket servers.",
  },
  {
    feature: "App hosting",
    convex:
      "Convex runs the database and the server functions. The hosting guide says to publish the frontend with a provider such as Vercel or Netlify.",
    prisma:
      "Prisma Compute hosts the TypeScript app as HTTP services. It is separate from Prisma Postgres. Compute has no built-in cron scheduler. Scheduled jobs can come from Composer's cron building block.",
  },
  {
    feature: "Developer fees",
    convex:
      "Professional is $25 per developer per month, for 1 to 20 developers. Free and Starter list 1 to 6 developers. Business and Enterprise list 50 or more developers and a $2,500 monthly minimum.",
    prisma: "The pricing page does not list a per-developer fee.",
  },
  {
    feature: "Free plan",
    convex:
      "Free, or $0 a month and pay as you go. The resource table includes 0.5 GB of database storage and 1 million function calls, then usage rates.",
    prisma:
      "Prisma Postgres Free is $0, with 200,000 operations a month, 2 GB of storage, and 50 databases. Prisma Compute Free includes 1 million requests a month. The Free plan says no credit card is required.",
  },
];

export const CONVEX_FITS = [
  "Subscribed queries should update the UI when the underlying documents change.",
  "Mutations should be transactions, and the client should apply subscribed results from one moment in the database.",
  "File storage, text search, vector search, and auth should sit on the Convex plan with the database.",
  "Application queries should be TypeScript functions in a convex/ folder.",
];

export const PRISMA_FITS = [
  "The database should be PostgreSQL, with SQL and the Postgres ecosystem.",
  "Prisma ORM should be available, and optional, on that database.",
  "The app should deploy as HTTP services on Prisma Compute.",
  "Adding a developer should not be a line on the pricing page.",
];

export const APART = [
  {
    title: "PostgreSQL",
    body: "Prisma Postgres is PostgreSQL. You connect with a Postgres client. Prisma ORM is optional on that connection.",
  },
  {
    title: "A contract-based ORM, when you want one",
    body: "Prisma ORM 8 is a release candidate. Models live in contract.prisma, and contract emit writes the types. You can skip it and use SQL.",
  },
  {
    title: "HTTP app hosting",
    body: "Prisma Compute hosts the TypeScript app. The current release focuses on HTTP services. WebSocket servers are not supported. Compute has no built-in cron scheduler. Scheduled jobs can come from Composer's cron building block, which adds a scheduler service.",
  },
  {
    title: "Pricing without a per-developer fee",
    body: "The pricing page lists Prisma Postgres by operations, storage, and databases, and Prisma Compute by requests, memory, CPU, and bandwidth. It does not list a per-developer fee. Starter, Pro, and Business list spend limits.",
  },
];

export const WRONG_CHOICE = [
  "You want query results pushed to the browser when data changes. Convex subscriptions use WebSockets. Prisma Postgres has no built-in reactive query sync, and Prisma Compute does not currently support WebSocket servers. See [Compute limitations](/docs/compute/limitations).",
  "You want the database, server functions, file storage, and auth in one Convex deployment, and the application should not write SQL. The [Convex overview](https://docs.convex.dev/understanding/) describes that model.",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Is Convex PostgreSQL?",
    answer:
      "The application does not write SQL. Convex cloud stores data in MySQL. The open-source version can use SQLite, Postgres, or MySQL as the persistence layer, and queries stay TypeScript functions. Source: [Convex overview](https://docs.convex.dev/understanding/), October 2026.",
  },
  {
    question: "Does Convex charge per developer?",
    answer:
      "Professional is $25 per developer per month. Free and Starter are $0, then pay as you go, and list 1 to 6 developers. Business and Enterprise have a $2,500 monthly minimum. Source: [Convex pricing](https://www.convex.dev/pricing), October 2026.",
  },
  {
    question: "Can Prisma ORM talk to Convex?",
    answer:
      "Prisma ORM connects to PostgreSQL, MongoDB, or SQLite. Convex queries are TypeScript functions against the Convex database. Prisma ORM does not speak that function API. Source: [supported databases](/docs/orm/supported-databases) and the [Convex overview](https://docs.convex.dev/understanding/), October 2026.",
  },
  {
    question: "Does Prisma Postgres push live query updates?",
    answer:
      "Prisma Postgres has no built-in reactive query sync. Convex reruns a query when its data changes and sends the result over a WebSocket. Prisma Compute does not currently support WebSocket servers. Source: [Convex overview](https://docs.convex.dev/understanding/) and [Compute limitations](/docs/compute/limitations), October 2026.",
  },
];
