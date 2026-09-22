// Long-form content for the /customers/[slug] detail pages — the redesign of the
// prisma.io/blog customer stories, rebuilt from the approved copy (Notion:
// "Customer Story Detail Page — Batch One").
//
// Separate from customers.ts, which drives the /customers INDEX (card title,
// excerpt, black logo lockup, outbound blog href). That file stays the source
// for the grid; this one carries the full story body. The two share a `slug`,
// and STORY_DETAIL_SLUGS below is what customers-grid.tsx reads to decide
// whether a card links inward (a detail page exists) or out to the live post.
//
// Icons are named against the shared PRODUCT_ICONS map (product/icons.ts) so the
// glyph vocabulary stays consistent with the product pages and the data stays
// serializable. Batch one is seven stories; we build the template on the first
// (Reflag) and fill the rest once the layout is signed off.

import type { ProductIconName } from "@/components/product/icons";

type Fact = { icon: ProductIconName; label: string; value: string };
type Reason = { icon: ProductIconName; title: string; body: string };
type Quote = {
  text: string;
  author: string;
  /** e.g. "Co-founder & CTO". */
  role: string;
  /** Company name, shown after the role. */
  company?: string;
  /** Optional link on the company name. */
  companyHref?: string;
  /** Render one size down — for long quotes. Honored by the closing quote card. */
  compact?: boolean;
};
type Result = { icon: ProductIconName; stat: string; detail: string };

export type CustomerStoryDetail = {
  slug: string;
  name: string;
  /**
   * White-on-transparent customer mark (same asset the index uses on its black
   * plate). Rendered on the hero's dark logo plate, so a white mark is correct.
   */
  logo: string;
  /** Skip the whitening filter when the mark is already white — see customers.ts. */
  logoAsIs?: boolean;

  hero: {
    title: string;
    /** Lead + supporting paragraph; both render in the hero dek. */
    lead: string;
    support?: string;
  };

  about: {
    heading: string;
    body: string;
    facts: Fact[];
  };

  challenge: {
    heading: string;
    /** Paragraphs before the constraint list. */
    body: string[];
    /** Optional pull quote shown under the intro, beside the constraints. */
    quote?: Quote;
    points: { icon: ProductIconName; title: string; body: string }[];
    /** Closing line after the constraints. */
    outro?: string;
  };

  reasons: {
    heading: string;
    intro: string;
    cards: Reason[];
  };

  /** Pull quote between "Why" and "How". Omitted when the story has no quote. */
  quote?: Quote;

  usage: {
    heading: string;
    body: string[];
  };

  results: {
    heading: string;
    intro: string;
    items: Result[];
  };

  /** Second pull quote, shown under the results. Optional. */
  closingQuote?: Quote;

  cta: {
    heading: string;
    body: string;
    /** Three ticks. Cycled through the brand spectrum in order. */
    checks: string[];
  };
};

export const CUSTOMER_STORY_DETAILS: CustomerStoryDetail[] = [
  {
    slug: "reflag",
    name: "Reflag",
    logo: "/logos/customers/reflag-white.png",
    logoAsIs: true,
    hero: {
      title: "How Reflag ships reliably with a lean team on Prisma ORM",
      lead: "Reflag, a feature-management platform out of Copenhagen, runs its product on Node.js and PostgreSQL with a team of eight. It uses Prisma ORM to manage the complex relationships between features, users, and feedback without slowing development down.",
      support:
        "For a small team, the data layer can't become the work. Prisma keeps queries type-safe and migrations schema-driven, so Reflag keeps shipping features reliably as the product grows.",
    },
    about: {
      heading: "About Reflag",
      body: "Reflag is a feature-management platform for product engineering teams, bringing feature flags, user feedback, and adoption metrics together in one place. What started three years ago in Copenhagen is now a live product run by a team of eight, built on Node.js services talking to PostgreSQL on Google Cloud.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Developer tools / feature management" },
        { icon: "rocket", label: "Team size", value: "8" },
        { icon: "layers", label: "Stack", value: "Node.js, PostgreSQL, Google Cloud" },
        { icon: "database", label: "Using", value: "Prisma ORM" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Reflag's product lives on complex relationships between features, users, and the feedback tied to them. Modeling and querying that data across their Node.js services meant holding two things together that usually pull apart: moving fast, and staying type-safe as the schema kept growing.",
        "With a team of eight, there's no room for the data layer to slow things down:",
      ],
      points: [
        {
          icon: "layers",
          title: "A data model with real depth.",
          body: "Features, users, and feedback all relate to each other, and every new capability adds relationships to keep consistent.",
        },
        {
          icon: "rocket",
          title: "Velocity that can't drop.",
          body: "A small team ships often, so queries and migrations have to stay easy to change.",
        },
        {
          icon: "shield",
          title: "Type safety that has to hold.",
          body: "Mistakes caught at compile time are mistakes that never reach a customer.",
        },
      ],
      outro:
        "The database is central to the product. It just can't be the thing that slows the product down.",
    },
    reasons: {
      heading: "Why Reflag chose Prisma ORM",
      intro:
        "Reflag reached for Prisma ORM to make working with PostgreSQL fast and safe. The draw wasn't a single feature, it was how the schema, the generated client, and relational queries work together to keep a small team productive.",
      cards: [
        {
          icon: "shield",
          title: "Type-safe from the schema",
          body: "A generated, fully typed client catches mistakes before they ship, no manual setup to keep in sync.",
        },
        {
          icon: "database",
          title: "Relational queries made simple",
          body: "Prisma's include and select turn complex joins into queries that are easy to write and easy to read.",
        },
        {
          icon: "layers",
          title: "One schema the team shares",
          body: "The schema documents the data model in one place, so eight people stay aligned on how the data fits together.",
        },
      ],
    },
    quote: {
      text: "We rely on Prisma heavily for relational queries. It's so intuitive and makes complex queries easy to manage, allowing us to build advanced data retrieval patterns with minimal effort.",
      author: "Ron Cohen",
      role: "Co-founder & CTO",
      company: "Reflag",
      companyHref: "https://reflag.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Reflag uses Prisma ORM as the data-access layer across its Node.js services. As the product evolves, the team uses schema-based migrations to experiment with the database structure, then leans on Prisma's include and select to handle the relational queries the product depends on, all through a generated type-safe client.",
        "The shared schema doubles as documentation. Instead of tribal knowledge about how features, users, and feedback connect, there's one model everyone works from, which keeps a small team moving in the same direction.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "With Prisma handling the data layer, Reflag ships reliably at a size where every hour counts.",
      items: [
        {
          icon: "rocket",
          stat: "8-person team",
          detail: "Shipping features reliably without a dedicated database team.",
        },
        {
          icon: "database",
          stat: "Complex queries, simplified",
          detail: "Relational joins handled through include and select.",
        },
        {
          icon: "layers",
          stat: "One shared schema",
          detail: "The data model documented in one place the whole team works from.",
        },
      ],
    },
    closingQuote: {
      text: "Prisma makes database management incredibly easy. For example, when we needed to implement OAuth, which involved creating multiple new database tables, we just defined them in our Prisma schema, ran a migration, and everything was ready. Prisma's built-in type safety helps us avoid mistakes that happen with manual setups.",
      author: "Ron Cohen",
      role: "Co-founder & CTO",
      company: "Reflag",
      companyHref: "https://reflag.com/",
    },
    cta: {
      heading: "Build on the same stack as Reflag",
      body: "If an eight-person team can manage complex relational data and keep shipping, yours can too.",
      checks: [
        "Free to start, no credit card required",
        "One TypeScript stack your agent can operate end to end",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "amplication",
    name: "Amplication",
    logo: "/logos/customers/amplication-white.png",
    logoAsIs: true,
    hero: {
      title: "How Amplication builds Prisma into every app it generates",
      lead: "Amplication is an open-source, low-code tool that generates production-quality Node.js applications, so teams skip the repetitive setup and spend their time on real features instead. Prisma ORM and Prisma Migrate are built right into the stack Amplication generates.",
      support:
        "Amplication bet on Prisma early, back in 2020, and it became an enabler for the whole product: easy to use, strong on TypeScript, and with a migrations story that fit their long-term vision.",
    },
    about: {
      heading: "About Amplication",
      body: "Amplication is an open-source, low-code development tool that helps teams build quality Node.js applications while cutting out repetitive coding. It serves both backend and fullstack developers, generating a complete server-side stack so teams can focus on business logic instead of boilerplate. At the time of the story, Amplication had raised $6.6M in seed funding and was planning to double its team within the year.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Open-source developer tools / low-code" },
        { icon: "rocket", label: "Stage", value: "$6.6M seed, team growing" },
        {
          icon: "layers",
          label: "Stack",
          value: "Node.js, NestJS, PostgreSQL, GraphQL, Passport, Jest, Swagger UI, Docker",
        },
        { icon: "database", label: "Using", value: "Prisma ORM · Prisma Migrate" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Development teams at larger companies were spending too much time on the repetitive, error-prone work at the start of every project: standing up databases, user interfaces, and APIs by hand. That's time that should go into innovative features and complex business logic, not setup.",
        "Amplication set out to remove that friction by generating the whole foundation for a Node.js application. But to do that credibly, the code it generates has to be something developers actually trust:",
      ],
      points: [
        {
          icon: "shield",
          title: "The generated stack has to be production-quality.",
          body: "Teams inherit this code, so it has to be solid, not scaffolding they rip out.",
        },
        {
          icon: "database",
          title: "The data layer has to be easy to work with.",
          body: "Whatever Amplication generates for the database has to be approachable for the developers who take it forward.",
        },
        {
          icon: "gitBranch",
          title: "Schema changes have to stay manageable.",
          body: "As generated apps evolve, migrations can't become a source of friction.",
        },
      ],
    },
    reasons: {
      heading: "Why Amplication chose Prisma",
      intro:
        "Yuval Hazaz, CEO at Amplication, chose Prisma early, in 2020. The decision came down to three things: an easy-to-use tool with a responsive community, strong TypeScript support, and a migrations story that matched where Amplication was headed.",
      cards: [
        {
          icon: "rocket",
          title: "An enabler, easy to use",
          body: "Prisma was easy enough to adopt that Amplication could build it directly into the apps it generates.",
        },
        {
          icon: "code",
          title: "Built for TypeScript",
          body: "Type-safe from the schema, which fit Amplication's TypeScript-first generated stack.",
        },
        {
          icon: "gitBranch",
          title: "Migrations that fit the vision",
          body: "Prisma Migrate auto-generates customizable schema migrations, aligned with Amplication's long-term plans.",
        },
      ],
    },
    quote: {
      text: "Prisma was a really good bet, and it helped us a lot when working on Amplication. It was an enabler for us because we actually use Prisma in the generated app, and it is really easy to use.",
      author: "Yuval Hazaz",
      role: "CEO",
      company: "Amplication",
      companyHref: "https://amplication.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Prisma is part of the server-side stack Amplication generates, alongside NestJS, PostgreSQL, GraphQL, Passport, Jest, Swagger UI, and Docker. The Prisma Client slots into NestJS's modular architecture, carrying type safety through the application layer so the generated code is type-safe end to end.",
        "Prisma Migrate handles schema changes in that generated stack, auto-generating customizable migrations. That keeps schema evolution low-friction for the teams who take an Amplication-generated app forward, so they stay focused on building features rather than refactoring the data layer.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Prisma became a foundational part of what Amplication ships, built into every app it generates.",
      items: [
        {
          icon: "database",
          stat: "Prisma in every generated app",
          detail: "Prisma ORM and Migrate are part of Amplication's generated server stack.",
        },
        {
          icon: "code",
          stat: "TypeScript-first, type-safe",
          detail: "Type safety carried through the NestJS application layer.",
        },
        {
          icon: "gitBranch",
          stat: "Low-friction migrations",
          detail: "Prisma Migrate keeps schema changes manageable so teams build, not refactor.",
        },
      ],
    },
    closingQuote: {
      text: "Supporting and building with TypeScript was really great for us. I also think migrations are amazing.",
      author: "Yuval Hazaz",
      role: "CEO",
      company: "Amplication",
    },
    cta: {
      heading: "Build on the same stack as Amplication",
      body: "Amplication trusts Prisma enough to build it into every app it ships. See what it can do for yours.",
      checks: [
        "Free to start, no credit card required",
        "One TypeScript stack your agent can operate end to end",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "formbricks",
    name: "Formbricks",
    logo: "/logos/customers/formbricks-white.png",
    logoAsIs: true,
    hero: {
      title: "How Formbricks kept its serverless backend online under load with Prisma Accelerate",
      lead: "Formbricks, an open-source survey and feedback platform, hit a scaling wall running its cloud version on a serverless backend. A usage spike blew past its database connection limit and took the database down. Prisma Accelerate's connection pooling solved it, and the setup was simple enough to do at 3 a.m. mid-incident.",
    },
    about: {
      heading: "About Formbricks",
      body: "Formbricks is an open-source, privacy-first survey and feedback platform. It lets businesses gather user insights through in-app surveys, website surveys, link-based questionnaires, and email surveys, with prebuilt data analysis built in as an experience-management solution.",
      facts: [
        {
          icon: "layoutGrid",
          label: "Industry",
          value: "Open-source survey / experience management",
        },
        {
          icon: "server",
          label: "Deployment",
          value: "Cloud version on Vercel, serverless backend",
        },
        { icon: "database", label: "Using", value: "Prisma Accelerate (connection pooling)" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Formbricks runs its cloud version on Vercel with a serverless backend, and that architecture ran into a hard limit. Serverless functions open lots of short-lived database connections, and Formbricks exceeded its connection pool size, hitting performance bottlenecks along the way.",
        "Then a significant usage spike pushed it over the edge: the database failed and server load climbed, forcing an urgent need for something more robust.",
      ],
      points: [
        {
          icon: "server",
          title: "Serverless exhausts connections.",
          body: "Many concurrent functions meant more database connections than the pool could hold.",
        },
        {
          icon: "rocket",
          title: "A spike became an outage.",
          body: "Growing traffic tipped bottlenecks into a database failure.",
        },
        {
          icon: "swap",
          title: "Alternatives were too expensive.",
          body: "Options like AWS RDS Proxy existed, but the cost was prohibitively high.",
        },
      ],
    },
    reasons: {
      heading: "Why Formbricks chose Prisma Accelerate",
      intro:
        "Formbricks needed connection pooling built for serverless, without the price tag of the heavier alternatives. Prisma Accelerate offered an accessible, cost-effective option with a low barrier to entry, and it was straightforward enough to set up in the middle of an incident.",
      cards: [
        {
          icon: "server",
          title: "Connection pooling for serverless",
          body: "A scalable pool that manages many database connections without exhausting the limit.",
        },
        {
          icon: "swap",
          title: "Cost-effective by comparison",
          body: "A low entry barrier where alternatives like AWS RDS Proxy were prohibitively expensive.",
        },
        {
          icon: "rocket",
          title: "Simple to set up",
          body: "Create an account, swap the connection string, connect the database, done, even at 3 a.m.",
        },
      ],
    },
    quote: {
      text: "It's also possible to set up Accelerate when you're totally tired at 3 a.m. in the morning. The process was pretty straightforward – created an account, replaced the connection string, and connected the database on the Prisma Accelerate website. It was easy and worked out, even under those high-pressure circumstances.",
      author: "Matti Nannt",
      role: "Co-Founder",
      company: "Formbricks",
      companyHref: "https://formbricks.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Formbricks put Prisma Accelerate in front of its database to handle connection pooling for the serverless backend. The setup was deliberately minimal: create a Prisma Accelerate account, replace the connection string, and connect the database through the Accelerate website, which is exactly what they did during the database-failure incident at 3 a.m.",
        "With Accelerate's scalable connection pool in place, the serverless architecture could manage large numbers of database connections while holding performance during traffic surges.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "The integration resolved Formbricks' scalability problems and strengthened its serverless backend against future spikes.",
      items: [
        {
          icon: "server",
          stat: "Serverless scaling, solved",
          detail: "Connection pooling that keeps serverless from exhausting the database.",
        },
        {
          icon: "shield",
          stat: "Held up under surges",
          detail:
            "The pool manages many connections while maintaining performance during traffic spikes.",
        },
        {
          icon: "rocket",
          stat: "Set up mid-incident",
          detail: "Configured at 3 a.m. during a live database failure.",
        },
      ],
    },
    cta: {
      heading: "Build on the same stack as Formbricks",
      body: "If your serverless backend is straining its database connections, Prisma can take the pressure off.",
      checks: [
        "Free to start, no credit card required",
        "One TypeScript stack your agent can operate end to end",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "solin",
    name: "Solin",
    logo: "/logos/customers/solin-white.png",
    logoAsIs: true,
    hero: {
      title: "How Solin serves 2.5M database queries a day with Prisma",
      lead: "Solin, a fitness-creator marketplace, ran a serverless backend that kept exhausting its database connections during traffic spikes, causing failed requests and a poor experience. With Prisma ORM and Prisma Accelerate, it now serves 2.5 million database queries a day with zero connection issues.",
      support:
        "Accelerate's connection pooling ended the failures, and per-query caching made landing pages lightning fast, which fed directly into better conversion.",
    },
    about: {
      heading: "About Solin",
      body: "Solin is a fitness marketplace that connects fitness creators with consumers. Creators sell workout programs, challenges, memberships, and cookbooks, while consumers get community features and transformation-tracking tools. The platform runs a fullstack serverless app in the fitness-technology space.",
      facts: [
        {
          icon: "layoutGrid",
          label: "Industry",
          value: "Fitness technology / creator marketplace",
        },
        { icon: "layers", label: "Stack", value: "Remix, Vercel serverless, PostgreSQL on Heroku" },
        { icon: "database", label: "Using", value: "Prisma ORM · Prisma Accelerate" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Solin runs a fullstack Remix app on Vercel with serverless functions, and that setup hit a familiar serverless wall: too many database connections. As the user base and query volume grew, its PostgreSQL database on Heroku couldn't hold enough connections, and traffic spikes exhausted the limit.",
        "When the connections ran out, requests failed and the user experience suffered:",
      ],
      points: [
        {
          icon: "server",
          title: "Serverless exhausts connections.",
          body: "Many concurrent functions opened more connections than the database could sustain.",
        },
        {
          icon: "rocket",
          title: "Spikes caused failed requests.",
          body: "When the limit was hit, requests dropped and users felt it.",
        },
        {
          icon: "swap",
          title: "Growth made it worse.",
          body: "A growing audience and rising query volume kept pushing against the ceiling.",
        },
      ],
    },
    reasons: {
      heading: "Why Solin chose Prisma",
      intro:
        "Solin already used Prisma ORM to query its database. When connection limits became the bottleneck, Prisma Accelerate added the connection pooling and caching the serverless backend needed to scale, without changing how the team wrote queries.",
      cards: [
        {
          icon: "server",
          title: "Connection pooling at scale",
          body: "Accelerate's pool manages database connections so serverless functions stop exhausting the limit.",
        },
        {
          icon: "repeat",
          title: "Per-query caching",
          body: "ttl and swr options set per query, ideal for landing pages whose content rarely changes.",
        },
        {
          icon: "code",
          title: "No change to the query layer",
          body: "Accelerate layered onto the Prisma ORM queries Solin was already writing.",
        },
      ],
    },
    quote: {
      text: "Accelerate is a perfect fit for landing pages. We are able to take advantage of caching to speed up queries and reduce latency, making them lightning fast. This obviously means we have a faster landing page, leading to better conversion.",
      author: "Blake Carroll",
      role: "CTO",
      company: "Solin",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Solin's API layer uses Prisma ORM to query the database, with Prisma Accelerate's connection pool sitting in front to manage connections at scale across its serverless functions. On top of pooling, the team uses Accelerate's caching on a per-query basis, applying ttl (time-to-live) and swr (stale-while-revalidate) where it helps most, particularly on landing pages with content that rarely changes.",
        "That combination keeps the serverless backend from running out of connections during spikes, while caching keeps high-traffic pages fast.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Prisma took Solin from connection failures to serving millions of queries a day, reliably.",
      items: [
        {
          icon: "database",
          stat: "2.5M queries / day",
          detail: "Database queries served daily through Prisma.",
        },
        {
          icon: "shield",
          stat: "Zero connection issues",
          detail: "No connection problems since adopting Accelerate.",
        },
        {
          icon: "rocket",
          stat: "Faster landing pages",
          detail:
            "Cached pages load lightning fast, improving conversion, while reduced server load lowers costs.",
        },
      ],
    },
    cta: {
      heading: "Build on the same stack as Solin",
      body: "If your serverless app is straining its database connections, Prisma can pool and cache its way past the limit.",
      checks: [
        "Free to start, no credit card required",
        "One TypeScript stack your agent can operate end to end",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "elsevier",
    name: "Elsevier",
    logo: "/logos/customers/elsevier.svg",
    hero: {
      title: "How one tech lead built Elsevier's peer-review MVP in ten months with Prisma",
      lead: "Elsevier, a global leader in scientific publishing, set out to modernize a slow, manual peer-review process. Led by a single tech lead, the team built a meaningful MVP in ten months on Prisma, and it now processes real scientific publications.",
      support:
        "Prisma Client, Prisma Migrate, and Nexus let one engineer move fast, experiment with the data model, and keep frontend and database types in sync, so the product could change quickly based on user feedback.",
    },
    about: {
      heading: "About Elsevier",
      body: "Elsevier is a global leader in information and analytics for scientific publishing, helping researchers and healthcare professionals advance science and improve health outcomes. This project set out to modernize its peer-review workflow for journal publications.",
      facts: [
        {
          icon: "layoutGrid",
          label: "Industry",
          value: "Scientific publishing / information analytics",
        },
        { icon: "rocket", label: "Scale", value: "Global" },
        { icon: "layers", label: "Stack", value: "TypeScript, GraphQL, Nexus, AWS Lambda" },
        { icon: "database", label: "Using", value: "Prisma Client · Prisma Migrate · Nexus" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Elsevier's peer-review process for scientific publications was manual, outdated, and slow, a logically complex workflow that needed modernizing to stay competitive in healthcare research.",
        "Rebuilding it came with real constraints:",
      ],
      quote: {
        text: "The flexibility of moving fast and changing the product based on user feedback fast was crucial.",
        author: "Serghei Ghidora",
        role: "Tech Lead",
        company: "Elsevier",
      },
      points: [
        {
          icon: "layers",
          title: "A logically complex workflow.",
          body: "Multi-user document editing needs a nested data structure, not flat records.",
        },
        {
          icon: "rocket",
          title: "Speed of iteration mattered.",
          body: "The product had to change quickly as user feedback came in.",
        },
        {
          icon: "bot",
          title: "A very small team.",
          body: "Much of the build rested on a single tech lead, so hand-writing boilerplate wasn't an option.",
        },
      ],
    },
    reasons: {
      heading: "Why Elsevier chose Prisma",
      intro:
        "The team chose Prisma to move fast without writing and maintaining the usual boilerplate. Paired with Nexus for code-first GraphQL, Prisma removed the manual work of definitions, resolvers, schemas, and models, while keeping everything type-safe in TypeScript.",
      cards: [
        {
          icon: "layers",
          title: "GraphQL with the nested data it needed",
          body: "Nexus gave the multi-user document editing a nested structure, code-first.",
        },
        {
          icon: "code",
          title: "Less boilerplate to hand-write",
          body: "Prisma eliminated manual definitions, resolvers, schemas, and models.",
        },
        {
          icon: "checkCircle",
          title: "Frontend and database types in sync",
          body: "TypeScript throughout kept application types aligned with the database.",
        },
      ],
    },
    quote: {
      text: "Writing all that by yourself, it's a lot of work. The flexibility of moving fast and changing fast, that was crucial.",
      author: "Serghei Ghidora",
      role: "Tech Lead",
      company: "Elsevier",
      companyHref: "https://www.elsevier.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "The MVP is built around a Prisma and Nexus package that holds the schema, migrations, and generated types. AWS Lambda functions use Prisma Client to update resources directly, and the business logic backed by Prisma serves both the GraphQL API and the frontend. Everything is written in TypeScript, so database and frontend types stay synchronized.",
        "Handling schema changes is a big part of why it worked for a small team. As Serghei Ghidora put it: “When it comes to the data model experimentation, handling migrations, you run the migrations and Prisma will do everything by itself.”",
        "On type safety, they said: “Your frontend application types are always in sync with what's available on the database level. That's a big, big deal.”",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "One tech lead turned a complex, manual process into a working product that runs on real publications today.",
      items: [
        {
          icon: "rocket",
          stat: "MVP in 10 months",
          detail: "A meaningful MVP delivered in ten months.",
        },
        {
          icon: "bot",
          stat: "Built by 1 tech lead",
          detail: "A large, complex product driven largely by a single engineer.",
        },
        {
          icon: "checkCircle",
          stat: "Live on real publications",
          detail:
            "Processing real scientific publications, holding up with few critical bugs as it moves toward full production.",
        },
      ],
    },
    closingQuote: {
      text: "Prisma is one of the bricks of that foundation.",
      author: "Serghei Ghidora",
      role: "Tech Lead",
      company: "Elsevier",
    },
    cta: {
      heading: "Build on the same stack as Elsevier",
      body: "Prisma helped one tech lead take a complex workflow from MVP to real publications. Start building on it today.",
      checks: [
        "Free to start, no credit card required",
        "One TypeScript stack your agent can operate end to end",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "tryg",
    name: "Tryg",
    logo: "/logos/customers/tryg-white.svg",
    logoAsIs: true,
    hero: {
      title: "How Tryg unified decades of insurance data with Prisma",
      lead: "Tryg, one of the Nordic region's largest non-life insurers, handles over a million claims a year across data sources spread between countries and built up over decades. It uses Prisma to power Tryg 360, the in-house data-broker platform that pulls all of it into one model.",
      support:
        "Prisma auto-generates database clients and GraphQL APIs straight from the schema, even for data models that run to 10,000 lines, so Tryg's developers iterate quickly and data becomes reachable for people without SQL expertise.",
    },
    about: {
      heading: "About Tryg",
      body: "Tryg is one of the Nordic region's largest non-life insurance companies, covering private, commercial, and corporate markets and handling more than a million claims a year. To make its data accessible across the business, Tryg built Tryg 360, a proprietary data-broker platform, with Prisma as a core enabling technology.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Non-life insurance" },
        { icon: "rocket", label: "Scale", value: "Nordic's largest, 1M+ claims/year" },
        {
          icon: "layers",
          label: "Stack",
          value: "CockroachDB, Kubernetes, Helm, Apache Kafka, GraphQL, Pal.js",
        },
        {
          icon: "database",
          label: "Using",
          value: "Prisma Client · Prisma Schema (generator API)",
        },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Tryg's data had accumulated across different countries over decades, in systems that were never designed to work together. The result was a harmonization problem at scale:",
      ],
      points: [
        {
          icon: "layers",
          title: "Incompatible models.",
          body: "Data sources across countries used models built independently over many years.",
        },
        {
          icon: "swap",
          title: "Conflicting definitions.",
          body: "The same concept meant different things in different systems, creating redundancy and workarounds.",
        },
        {
          icon: "settings",
          title: "Slow, error-prone integration.",
          body: "Bringing it all together by hand was time-consuming and easy to get wrong.",
        },
        {
          icon: "database",
          title: "Locked behind SQL.",
          body: "The goal was to make data accessible to everyone who needed it, including people without SQL expertise.",
        },
      ],
    },
    reasons: {
      heading: "Why Tryg chose Prisma",
      intro:
        "Tryg chose Prisma as a critical enabler for Tryg 360 because it could generate the data-access layer from the schema and hold up under models far larger than most tools handle.",
      cards: [
        {
          icon: "database",
          title: "Clients generated from the schema",
          body: "Prisma auto-generates database clients directly from the Prisma schema.",
        },
        {
          icon: "code",
          title: "GraphQL APIs, auto-generated",
          body: "Paired with Pal.js, the platform auto-generates GraphQL resolvers and type definitions for developers to work against.",
        },
        {
          icon: "layers",
          title: "Built for extreme complexity",
          body: "Prisma handles very complex models and massive datasets, with schema files up to 10,000 lines and over a million characters.",
        },
      ],
    },
    quote: {
      text: "Prisma is a huge technical enabler for us.",
      author: "Artur Mrozowski",
      role: "Data Engineer",
      company: "Tryg",
      companyHref: "https://www.tryg.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Tryg 360 is a data broker that streams live data from multiple sources into one place, without transforming it up front. Data synchronizes through a Time-Aware MirrorMaker built on Apache Kafka into a local Kafka cluster for selective loading, and lands in CockroachDB, which speaks the PostgreSQL wire protocol, as unified storage.",
        "Prisma Client accesses CockroachDB, and from the Prisma schema the platform generates the database client and, with Pal.js, the GraphQL resolvers and type definitions. Whole environments spin up in one click through Kubernetes and Helm charts, so there's no manual configuration between a developer and a working environment.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Tryg turned decades of scattered, incompatible data into one model developers can build on quickly.",
      items: [
        {
          icon: "layers",
          stat: "Many sources, one schema",
          detail: "Multiple data sources unified into a single schema and data model.",
        },
        {
          icon: "rocket",
          stat: "One-click environments",
          detail: "Kubernetes and Helm provision whole environments without manual setup.",
        },
        {
          icon: "code",
          stat: "Faster development",
          detail: "Generating clients and APIs from code lets developers iterate quickly.",
        },
      ],
    },
    closingQuote: {
      text: "Our setup with Prisma enabled us to generate everything from code and ensure our developers can iterate very quickly.",
      author: "Lasse Abelsen",
      role: "DevOps Engineer",
      company: "Tryg",
    },
    cta: {
      heading: "Build on the same stack as Tryg",
      body: "Tryg unified decades of insurance data on Prisma. See what it can do for your data model.",
      checks: [
        "Free to start, no credit card required",
        "Clients and GraphQL APIs generated from your schema",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "panther",
    name: "Panther",
    logo: "/logos/customers/panther.svg",
    hero: {
      title: "How Panther keeps data consistent across microservices in 160+ countries with Prisma",
      lead: "Panther, a global payroll and compliance platform, runs a distributed microservices architecture behind a federated GraphQL API. It uses Prisma ORM to guarantee that the data flowing through that API is valid and correctly shaped, no matter which service it came from.",
      support:
        "Prisma lets Panther's independent service teams move fast while keeping data consistent across the whole platform, giving them faster time to market with type safety end to end.",
    },
    about: {
      heading: "About Panther",
      body: "Panther is a global payroll and compliance platform that helps organizations hire remote talent across borders. Operating in over 160 countries, it handles hiring, onboarding, payroll, benefits administration, and labor-law compliance. Panther is a 100% remote company in a period of significant growth, having raised $2.5M in its latest funding round.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Global payroll & compliance" },
        { icon: "rocket", label: "Scale", value: "160+ countries, 100% remote, $2.5M raised" },
        {
          icon: "layers",
          label: "Stack",
          value: "TypeScript, Node.js, MySQL, MongoDB, GraphQL (Apollo Federation), React",
        },
        { icon: "database", label: "Using", value: "Prisma ORM · Prisma Data Proxy" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Panther set out to build a complex platform from multiple independent services, and needed to keep data consistent across a distributed microservices architecture. Its domain-driven design and federated GraphQL API depended on reliable database interaction underneath.",
      ],
      points: [
        {
          icon: "server",
          title: "Many independent services.",
          body: "Each team owns its own service, but the data has to stay consistent across all of them.",
        },
        {
          icon: "code",
          title: "A federated GraphQL API.",
          body: "Data from many services funnels into one API, and its shape has to be guaranteed.",
        },
        {
          icon: "database",
          title: "Reliable database interaction.",
          body: "A distributed architecture across borders needs database tooling teams can depend on.",
        },
      ],
    },
    reasons: {
      heading: "Why Panther chose Prisma",
      intro:
        "Before committing, co-founder and CTO Vasil Popovski looked hard at whether Prisma was a technology Panther could rely on for the long run, weighing its backing, community, and documentation. On the product side, the draw was faster time to market, developer productivity, type safety, and guaranteed data structures through the GraphQL API.",
      cards: [
        {
          icon: "shield",
          title: "A technology to rely on",
          body: "Backing, community, and complete documentation that made Prisma safe to standardize on.",
        },
        {
          icon: "checkCircle",
          title: "Guaranteed data shape",
          body: "Type safety that ensures the data reaching the GraphQL API is valid and correctly shaped.",
        },
        {
          icon: "rocket",
          title: "Faster time to market",
          body: "Developer productivity that helps independent teams ship quickly.",
        },
      ],
    },
    quote: {
      text: "I did a lot of investigation on whether Prisma was going to be supported by its creators, whether it's something we can rely on and will be here in the long run. I also looked at the community, which is an important factor when switching to a new technology, and finally the completeness of the documentation.",
      author: "Vasil Popovski",
      role: "Co-founder & CTO",
      company: "Panther",
      companyHref: "https://www.panther.co/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Panther's platform is built in TypeScript and Node.js, with MySQL and MongoDB behind the services, a React frontend, and a federated GraphQL API using Apollo Federation, with Dataloaders batching and caching requests. Prisma ORM sits in the services as the database layer, guaranteeing the shape of the data that funnels through the main GraphQL API. Prisma Data Proxy handles database connections for serverless without exhausting them.",
        "This lets individual microservice teams keep their freedom while the platform maintains data consistency across the federated GraphQL layer.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Panther built a complex, distributed platform where independent teams ship freely and the data stays consistent across all of it.",
      items: [
        {
          icon: "layoutGrid",
          stat: "160+ countries",
          detail: "Automated global payroll and compliance across more than 160 countries.",
        },
        {
          icon: "server",
          stat: "Independent teams, consistent data",
          detail: "Microservice teams keep their freedom while data stays consistent.",
        },
        {
          icon: "code",
          stat: "One federated GraphQL API",
          detail: "Data from many services funnels through one API with a guaranteed shape.",
        },
      ],
    },
    closingQuote: {
      text: "We have to rely on a lot of internal APIs, and Prisma guarantees that the data and the shape of the data that gets funnelled through the main GraphQL API at the end is valid and is of a specific shape.",
      author: "Vasil Popovski",
      role: "Co-founder & CTO",
      company: "Panther",
    },
    cta: {
      heading: "Build on the same stack as Panther",
      body: "Panther keeps data consistent across a global microservices platform. See what Prisma can do for yours.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe data across every service",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "rapha",
    name: "Rapha",
    logo: "/logos/customers/rapha.svg",
    hero: {
      title: "How Rapha keeps data consistent across mobile, web, and its clubhouses with Prisma",
      lead: "Rapha, a global cycling apparel and lifestyle company, meets customers across iOS and Android apps, an e-commerce site, blog content, and physical clubhouses around the world. Its mobile team uses Prisma to manage the data behind all of it, changing the schema quickly and safely while keeping a stable interface across every platform.",
      support:
        "With Prisma 2 and Prisma Migrate, changes flow from one schema file through to the GraphQL API its apps consume, tracked in version control and applied through CI/CD.",
    },
    about: {
      heading: "About Rapha",
      body: "Rapha is a cycling apparel and lifestyle company redefining comfort, performance, and style for cyclists everywhere, from beginners to World Tour professionals. Beyond activewear, it organizes and sponsors rides and events, founded the Rapha Cycling Club in 2015, and runs the Rapha Foundation to support cycling non-profits. Its customers reach Rapha across mobile apps, the web, its blog, and physical clubhouses worldwide.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Cycling apparel & lifestyle" },
        { icon: "rocket", label: "Scale", value: "Global, beginners to World Tour pros" },
        {
          icon: "layers",
          label: "Stack",
          value:
            "PostgreSQL (Amazon RDS), Nexus Schema, Apollo Server, Contentful, Docker on ECS, SQS, Lambda, Cloudflare",
        },
        { icon: "database", label: "Using", value: "Prisma 2 (ORM) · Prisma Migrate" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Rapha's mobile team needed to develop against their database quickly and safely, while keeping schema changes between the database and their GraphQL API organized across platforms.",
      ],
      points: [
        {
          icon: "rocket",
          title: "Fast, safe database work.",
          body: "The team needed tooling to build against the database without risky, manual changes.",
        },
        {
          icon: "gitBranch",
          title: "Organized schema changes.",
          body: "Changes had to stay in sync between the backing database and the GraphQL API that feeds iOS and Android.",
        },
        {
          icon: "swap",
          title: "Room to change storage later.",
          body: "They wanted the flexibility to evaluate or switch data storage options without breaking the stable interfaces their apps depend on.",
        },
      ],
    },
    reasons: {
      heading: "Why Rapha chose Prisma ORM",
      intro:
        "Rapha adopted Prisma 2 as its ORM and Prisma Migrate to manage schema changes across development and production. Prisma gave the team a typed way to work with the database and a decoupled interface, so the apps stay stable even as the data layer evolves.",
      cards: [
        {
          icon: "code",
          title: "A typed ORM for Node and TypeScript",
          body: "Prisma 2 lets the team build against the database quickly and safely.",
        },
        {
          icon: "gitBranch",
          title: "Managed schema changes",
          body: "Prisma Migrate keeps changes organized and consistent across dev and production.",
        },
        {
          icon: "layers",
          title: "A stable interface across platforms",
          body: "The data layer stays decoupled, so iOS and Android see a consistent interface even if storage changes.",
        },
      ],
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "The team makes data-model changes in the Prisma schema file, which updates the underlying database tables and feeds into the GraphQL API consumed by the iOS and Android apps. Prisma Migrate detects schema changes, generates SQL migration files stored in version control, and applies them automatically through the CI/CD pipeline or a manual deploy.",
        "Prisma sits inside a wider stack: a PostgreSQL database on Amazon RDS, Nexus Schema for type definitions, Apollo Server for the GraphQL API, Contentful for content, Docker containers on Amazon ECS, Amazon SQS for queuing, AWS Lambda for asynchronous tasks, and Cloudflare for edge acceleration.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Prisma gives Rapha's mobile team an organized, version-controlled way to evolve the data behind every platform.",
      items: [
        {
          icon: "layers",
          stat: "One schema, every platform",
          detail:
            "Data-model changes flow from the Prisma schema through to the GraphQL API the apps consume.",
        },
        {
          icon: "gitBranch",
          stat: "Version-controlled migrations",
          detail:
            "Prisma Migrate generates SQL migrations tracked in version control and applied via CI/CD.",
        },
        {
          icon: "swap",
          stat: "Storage flexibility",
          detail: "A decoupled interface keeps the apps stable even if storage options change.",
        },
      ],
    },
    cta: {
      heading: "Build on the same stack as Rapha",
      body: "Rapha manages data across mobile, web, and its clubhouses on Prisma. See what Prisma can do for your stack.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe ORM with version-controlled migrations",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "grover",
    name: "Grover",
    logo: "/logos/customers/grover.svg",
    hero: {
      title: "How Grover standardized database access across mixed-stack teams with Prisma",
      lead: "Grover, a tech-product subscription service with over 800,000 users, runs 14 services across independent teams and multiple languages behind a federated GraphQL API. Prisma gives those teams one standardized, type-safe way to work with their databases.",
      support:
        "It started with a single engineer in 2020 and spread across the org from there. With Prisma Client, Migrate, and Studio, developers get end-to-end type safety and a consistent workflow for queries, migrations, and viewing data, no matter which stack their service runs on.",
    },
    about: {
      heading: "About Grover",
      body: "Grover is a tech-product subscription service that rents phones, tablets, and computers by the month, built around sustainable, circular consumption of consumer electronics. With more than 800,000 users and €60M raised in Series B funding, Grover runs a federated architecture where multiple independent teams own their own services.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Consumer electronics subscription" },
        { icon: "rocket", label: "Scale", value: "800,000+ users, €60M Series B" },
        {
          icon: "layers",
          label: "Stack",
          value: "TypeScript, Ruby, Python, federated GraphQL, TypeGraphQL, Nexus",
        },
        {
          icon: "database",
          label: "Using",
          value: "Prisma Client · Prisma Migrate · Prisma Studio",
        },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Grover runs with multiple independent development teams, each managing its own services inside a federated GraphQL API. That's 14 unique services spread across different technology stacks, TypeScript, Ruby, and Python, using frameworks like TypeGraphQL and Nexus.",
        "The tension was keeping teams autonomous while still integrating data cohesively:",
      ],
      points: [
        {
          icon: "server",
          title: "Every team works its own way.",
          body: "Independent teams own their services and pick their own tools, so there's no shared approach to data.",
        },
        {
          icon: "code",
          title: "Several languages in the mix.",
          body: "Services run across TypeScript, Ruby, and Python, with no common default for database access.",
        },
        {
          icon: "layers",
          title: "One API has to unify it all.",
          body: "However each team builds, the data still has to come together in a single federated GraphQL layer.",
        },
      ],
    },
    reasons: {
      heading: "Why Grover chose Prisma",
      intro:
        "Prisma spread through Grover organically. Software Engineer Ricardo Almeida started experimenting with it in 2020, saw immediate results, and shared what he learned in cross-team sessions until other teams picked it up too. The draw was a low learning curve paired with end-to-end type safety.",
      cards: [
        {
          icon: "rocket",
          title: "Low learning curve",
          body: "Teams could adopt Prisma quickly without a steep ramp-up.",
        },
        {
          icon: "shield",
          title: "End-to-end type safety",
          body: "The Prisma Schema Language defines the models and auto-generates TypeScript types.",
        },
        {
          icon: "repeat",
          title: "One standardized workflow",
          body: "Queries, migrations, and data viewing work the same way across every team.",
        },
      ],
    },
    quote: {
      text: "Prisma has a low learning curve. Productivity becomes higher because it gets combined with end-to-end type-safety using TypeScript.",
      author: "Ricardo Almeida",
      role: "Software Engineer",
      company: "Grover",
      companyHref: "https://www.grover.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Across Grover's mixed-stack environment, the Prisma Schema Language defines the database models and automatically generates TypeScript types. Developers use single commands to generate the schema and run migrations, and it fits into their CI/CD pipelines. Prisma Client handles type-safe database access, Prisma Migrate manages schema changes, and Prisma Studio gives teams a browser-based way to view their data, all out of the box.",
        "As Ricardo Almeida put it: “Prisma provides a more standardized way to access databases, carry out migrations, and view data, all out of the box. Prisma provides a single and standardised way to build queries, where we're sure not to face issues with grouping data, worry about joins, or glue different libraries together.”",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Prisma became a shared standard across Grover's teams, one consistent way to work with data in an otherwise mixed-stack, federated setup.",
      items: [
        {
          icon: "rocket",
          stat: "800,000+ users",
          detail: "Serving a large user base across a federated architecture.",
        },
        {
          icon: "layers",
          stat: "14 services",
          detail: "One standardized data workflow across services and stacks.",
        },
        {
          icon: "repeat",
          stat: "Adopted team by team",
          detail: "Spread organically from a single engineer to teams across the org.",
        },
      ],
    },
    closingQuote: {
      text: "I would be very interested in seeing other teams migrate to use Prisma, since I can only see benefits in using it.",
      author: "Ricardo Almeida",
      role: "Software Engineer",
      company: "Grover",
    },
    cta: {
      heading: "Build on the same stack as Grover",
      body: "Grover standardized data access across independent teams and stacks on Prisma. See what Prisma can do for yours.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe access, migrations, and data viewing out of the box",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "invisible",
    name: "Invisible",
    logo: "/logos/customers/invisible.svg",
    hero: {
      title: "How migrating from Sequelize to Prisma let Invisible scale with zero downtime",
      lead: "Invisible, a B2B automation startup whose revenue quadrupled over the past year, outgrew Sequelize as it scaled. It migrated to Prisma gradually and with zero downtime, while hundreds of agents kept working around the clock and customers saw no interruption.",
      support:
        "Prisma gave the team auto-generated types, a modern fluent API, and a fully type-safe stack. Paired with tRPC and Vercel, it drastically simplified their architecture and sped up how fast they ship features.",
    },
    about: {
      heading: "About Invisible",
      body: "Invisible is a B2B productivity company in the operational-efficiency and automation space. Its “Worksharing” platform lets customers automate and outsource complex workflows, combining elements of business process outsourcing and robotic process automation while keeping human discretion in the loop. Over the past year, Invisible's revenue quadrupled, with hundreds of agents working globally, 24/7.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Business automation / productivity" },
        { icon: "rocket", label: "Scale", value: "Revenue 4x in a year, hundreds of agents 24/7" },
        {
          icon: "layers",
          label: "Stack",
          value: "React/Next.js, Node.js, tRPC, TypeScript, NX, Vercel, PostgreSQL",
        },
        { icon: "database", label: "Using", value: "Prisma ORM" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Invisible started on Sequelize, but as the platform grew, the ORM became a constraint:",
      ],
      points: [
        {
          icon: "code",
          title: "Too much boilerplate.",
          body: "Creating models required extensive boilerplate code.",
        },
        {
          icon: "shield",
          title: "Types that didn't keep up.",
          body: "Type definitions didn't update dynamically based on what a query actually selected.",
        },
        {
          icon: "settings",
          title: "Not flexible enough.",
          body: "Sequelize lacked the flexibility the team needed for complex backend logic.",
        },
      ],
    },
    reasons: {
      heading: "Why Invisible chose Prisma",
      intro:
        "Prisma fit where Sequelize fell short: types generated from the actual query, a modern and learnable API, and a foundation the team could build on for the long term.",
      cards: [
        {
          icon: "shield",
          title: "Types from your query",
          body: "Prisma auto-generates types based on what each query selects, so the types always match the data.",
        },
        {
          icon: "code",
          title: "A modern, fluent API",
          body: "An API that's quick to learn and pleasant to work in, a step up from Sequelize and TypeORM.",
        },
        {
          icon: "layers",
          title: "Future-proof foundation",
          body: "A modern data layer the team could standardize on as the stack evolved.",
        },
      ],
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Invisible migrated gradually, with zero downtime. The team stood up a Prisma client alongside the existing Sequelize client in their Heroku-hosted API monolith, then used Prisma introspect to build a new schema from the existing database. From there they built a new serverless GraphQL API on Vercel using Postgres with Prisma exclusively, migrating simple data models and business logic first and moving high-volume requests onto new serverless functions to reduce load. They're now migrating the remaining queries off Sequelize, aiming to deprecate it fully within a year.",
        "Today Prisma is abstracted into a shared library across their microservices, managing database connections automatically for serverless functions. The wider stack is React and Next.js on the frontend, Node.js APIs, a highly relational PostgreSQL data model through Prisma, and tRPC in place of GraphQL and Apollo, all in a fully type-safe TypeScript codebase.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Invisible moved off Sequelize without disrupting a 24/7 operation, and came out with a simpler, faster stack.",
      items: [
        {
          icon: "shield",
          stat: "Zero downtime",
          detail:
            "Migrated with no service interruption while hundreds of agents worked around the clock.",
        },
        {
          icon: "rocket",
          stat: "Revenue 4x in a year",
          detail: "Scaled through a period of rapid growth.",
        },
        {
          icon: "layers",
          stat: "A simpler, faster stack",
          detail:
            "Drastically simplified architecture and faster feature deployment than with Sequelize.",
        },
      ],
    },
    closingQuote: {
      text: "Prisma's approach to type-safe ORM is next-level compared to Sequelize and even TypeORM. The tRPC + Prisma combo is insanely easy to get going with. It provides full type-safety without any codegen or messy types and interfaces to write and maintain. Prisma generates the types, tRPC consumes them and passes them down, and we don't even need to maintain any API servers. With Next.js and Vercel we also get great DX and UX at a fraction of the cost we'd usually have to pay to run our own stateful servers.",
      author: "Pieter Venter",
      role: "Sr. Software Engineer",
      company: "Invisible",
      compact: true,
    },
    cta: {
      heading: "Build on the same stack as Invisible",
      body: "Invisible migrated off Sequelize to Prisma with zero downtime and came out faster. See what Prisma can do for your stack.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe ORM with types generated from your queries",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "pearly",
    name: "Pearly",
    logo: "/logos/customers/pearly-white.webp",
    logoAsIs: true,
    hero: {
      title: "How one developer built and scaled two dental fintech products with Prisma",
      lead: "Pearly, a HIPAA-compliant dental financial platform, built both of its products, Pearly Pay and Pearly Plan, with a single developer. Prisma abstracted away the database work, so one engineer could iterate fast on market feedback and still scale after launch.",
      support:
        "From day one, Prisma Client and Prisma Migrate let the team prototype schemas quickly, ship features in a fraction of the time, and keep the whole stack type-safe.",
    },
    about: {
      heading: "About Pearly",
      body: "Pearly is a dental financial engagement platform that helps dentists build reliable revenue streams and offer patients affordable care. It runs two products: Pearly Pay, which automates payments for dental practices, and Pearly Plan, which gives patients access to affordable care plans through their dentist. The platform is HIPAA-compliant for handling sensitive patient information.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Dental fintech / patient financing" },
        { icon: "shield", label: "Compliance", value: "HIPAA" },
        {
          icon: "layers",
          label: "Stack",
          value:
            "GraphQL (Apollo), GraphQL Nexus, GCP serverless, PostgreSQL, TypeScript, Stripe, Firebase",
        },
        { icon: "database", label: "Using", value: "Prisma Client · Prisma Migrate" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Pearly needed to move fast with an ultra-lean team without painting itself into a corner. The initial versions of both products were built by a single developer, who had to balance two things at once:",
      ],
      points: [
        {
          icon: "rocket",
          title: "Iterate fast on feedback.",
          body: "Ship and adjust quickly as the market responded.",
        },
        {
          icon: "layers",
          title: "Still scale after launch.",
          body: "Build in a way that would hold up as the products grew.",
        },
        {
          icon: "shield",
          title: "Handle sensitive data carefully.",
          body: "Everything runs under HIPAA compliance.",
        },
      ],
      outro: "For one developer, that left no room to spend time hand-managing the database.",
    },
    reasons: {
      heading: "Why Pearly chose Prisma",
      intro:
        "Sean Emmer, CTO and co-founder, chose Prisma from day one because it abstracted database management and let him focus on the features that mattered most. It fit Pearly's lean approach: reduce risk quickly, then iterate.",
      cards: [
        {
          icon: "database",
          title: "Database work, abstracted",
          body: "Prisma handled the database layer so a single developer could focus on core features.",
        },
        {
          icon: "rocket",
          title: "Built for fast iteration",
          body: "A workflow that matched a lean, feedback-driven way of building.",
        },
        {
          icon: "shield",
          title: "Type-safe end to end",
          body: "Type safety across frontend and backend cut down on compile-time bugs.",
        },
      ],
    },
    quote: {
      text: "We've been really happy with our decision to use Prisma. We've been iterating very fast.",
      author: "Sean Emmer",
      role: "CTO & Co-Founder",
      company: "Pearly",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Prisma Client gives Pearly a clean API for database access, and Prisma Migrate manages schema changes. Early on, the team could prototype schemas rapidly with prisma db push, iterating on the data model without migration versioning until it settled.",
        "Prisma sits in a TypeScript stack front to back: a GraphQL API with Apollo and GraphQL Nexus abstracts multiple third-party services, with the schema registered in Apollo's registry so the frontend gets generated types. The rest runs on Google Cloud's serverless platform with PostgreSQL, plus Stripe and Firebase integrations.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "With Prisma handling the data layer, one developer shipped and scaled two products, and shipped features far faster.",
      items: [
        {
          icon: "rocket",
          stat: "Half the build time",
          detail: "Features that used to take a day or two now take half a day.",
        },
        {
          icon: "bot",
          stat: "Two products, one developer",
          detail: "A single developer built and scaled both Pearly Pay and Pearly Plan.",
        },
        {
          icon: "shield",
          stat: "Type-safe, fewer bugs",
          detail: "End-to-end type safety reduced compile-time bugs.",
        },
      ],
    },
    closingQuote: {
      text: "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend working on things. Not only that, but I've also been able to say yes to a lot of new incremental features, that used to be a 1-2 day thing and that are now a half-day thing.",
      author: "Sean Emmer",
      role: "CTO & Co-Founder",
      company: "Pearly",
    },
    cta: {
      heading: "Build on the same stack as Pearly",
      body: "Pearly built and scaled two products with one developer on Prisma. See what Prisma can do for your team.",
      checks: [
        "Free to start, no credit card required",
        "A clean, type-safe data layer that scales with you",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "poppy",
    name: "Poppy",
    logo: "/logos/customers/poppy-white.png",
    logoAsIs: true,
    hero: {
      title: "How Poppy runs a multi-vehicle mobility service with Prisma",
      lead: "Poppy, a Belgian mobility-sharing service, offers shared cars, e-scooters, and e-steps across three cities through a single app, and has served 1.5 million rides. Prisma Client gives its engineers a type-safe way to manage the complex data behind that simple experience.",
      support:
        "Every engineer at Poppy develops with Prisma in production. Type safety, together with thorough integration tests, gives the team the confidence to refactor critical parts of the codebase as they scale.",
    },
    about: {
      heading: "About Poppy",
      body: "Poppy is a mobility-sharing service based in Belgium, operating in Antwerp, Brussels, and Mechelen. Through its mobile app, riders can access over 500 shared cars, 400 e-scooters, and 200 e-steps. By mid-2021, Poppy had reached 1.5 million total rides, serving thousands of rides every week.",
      facts: [
        { icon: "layoutGrid", label: "Industry", value: "Mobility / vehicle sharing" },
        {
          icon: "rocket",
          label: "Scale",
          value: "500+ cars, 400 e-scooters, 200 e-steps, 1.5M rides",
        },
        {
          icon: "layers",
          label: "Stack",
          value:
            "Node.js (Fastify), React Native, PostgreSQL + PostGIS, Redis, Twilio, Docker, GCP, BigQuery",
        },
        { icon: "database", label: "Using", value: "Prisma Client" },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "Behind Poppy's simple app is a lot of moving architecture. Running a shared fleet across multiple cities means handling:",
      ],
      points: [
        {
          icon: "server",
          title: "Location awareness.",
          body: "Knowing where every vehicle is, across a distributed network.",
        },
        {
          icon: "repeat",
          title: "Payments and notifications.",
          body: "Processing rides and keeping riders informed.",
        },
        {
          icon: "layers",
          title: "Multiple vehicle types.",
          body: "Cars, e-scooters, and e-steps, each with their own logic.",
        },
      ],
      outro:
        "Keeping all of that manageable, without the codebase becoming its own obstacle, was the challenge.",
    },
    reasons: {
      heading: "Why Poppy chose Prisma",
      intro:
        "Poppy's team had followed Prisma since its early graph.cool days. When they started a greenfield project, they gave Prisma 2's early release a shot and were quickly convinced, largely because of how well it integrated with TypeScript.",
      cards: [
        {
          icon: "rocket",
          title: "A team already sold on the DX",
          body: "Early graph.cool fans who'd watched Prisma evolve and trusted the developer experience.",
        },
        {
          icon: "code",
          title: "Great TypeScript integration",
          body: "Prisma 2 fit their TypeScript stack so well the choice was easy on a greenfield build.",
        },
        {
          icon: "shield",
          title: "Type-safe database access",
          body: "Typed queries reduced coding errors across a complex system.",
        },
      ],
    },
    quote: {
      text: "Two of us in the team were early graph.cool fans and were super impressed by the quality and developer experience. I remember checking Prisma 1 at the time but was a bit reluctant to add an additional server to set it up. Then when came the time to start on a greenfield project we gave Prisma 2's early release a shot and were immediately convinced we had to use it as it integrated TypeScript so well.",
      author: "Thibaut Nguyen",
      role: "CTO",
      company: "Poppy",
      companyHref: "https://poppy.be/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "Every engineer at Poppy builds with Prisma Client in production. It sits in a Node.js and Fastify backend serving a React Native app, on top of PostgreSQL with the PostGIS extension for the geospatial queries that power location awareness. Around it, the stack uses Redis, Twilio for notifications, Docker, and Google Cloud, with Google BigQuery holding IoT data streaming from the vehicles.",
        "Type-safe database access keeps errors down across all of that complexity and gives the team the confidence to change critical code without fear of breaking it.",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "Prisma lets Poppy move fast on a genuinely complex system, and refactor it safely as it grows.",
      items: [
        {
          icon: "rocket",
          stat: "1.5M rides",
          detail: "Served across cars, e-scooters, and e-steps in three cities.",
        },
        {
          icon: "code",
          stat: "Every engineer on Prisma",
          detail: "The whole team develops with Prisma in production.",
        },
        {
          icon: "shield",
          stat: "Confident refactoring",
          detail: "Type safety plus strong test coverage makes critical refactors safe.",
        },
      ],
    },
    closingQuote: {
      text: "The combination of Prisma, TypeScript and our pretty thorough coverage with integration tests gives us the confidence to refactor critical parts of our code.",
      author: "Thibaut Nguyen",
      role: "CTO",
      company: "Poppy",
    },
    cta: {
      heading: "Build on the same stack as Poppy",
      body: "Poppy runs a complex, multi-vehicle mobility service on Prisma. See what Prisma can do for your stack.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe database access, even for complex systems",
        "Trusted by 500K+ developers",
      ],
    },
  },
  {
    slug: "iopool",
    name: "iopool",
    logo: "/logos/customers/iopool-white.png",
    logoAsIs: true,
    hero: {
      title: "How iopool refactored a two-year project in under six months with Prisma",
      lead: "iopool, maker of a smart pool-management system, was buried in technical debt: 16 microservices with no consistency, a NoSQL database faking its relationships, and no way to test locally. It had less than six months to refactor two years of work before its June high season. Prisma made it possible.",
      support:
        "With Prisma as its core ORM, iopool rebuilt on a relational foundation, set up type-safe database access within a week, and went from shipping every few weeks to multiple times a week.",
    },
    about: {
      heading: "About iopool",
      body: "iopool offers a complete pool-management solution for private pools, jacuzzis, and hot tubs. Its system combines a smart pool sensor, a mobile app, and products that help owners keep their water safe and clean. Behind the simple experience is a connected-hardware platform handling water-quality data at scale.",
      facts: [
        {
          icon: "layoutGrid",
          label: "Industry",
          value: "Connected hardware / pool management (IoT)",
        },
        { icon: "settings", label: "Product", value: "Smart pool sensor and app" },
        {
          icon: "layers",
          label: "Stack",
          value:
            "React Native, GraphQL (Apollo), AWS Lambda, Nexus, PostgreSQL, DynamoDB, TypeScript",
        },
        {
          icon: "database",
          label: "Using",
          value: "Prisma Client · Prisma Schema · Prisma Migrate",
        },
      ],
    },
    challenge: {
      heading: "The challenge",
      body: [
        "By 2020, iopool's technical debt was threatening its growth. The team had built up problems that made every change harder than it should be:",
      ],
      quote: {
        text: "It was a developer's nightmare.",
        author: "Luc Matagne",
        role: "Lead Software Engineer",
        company: "iopool",
      },
      points: [
        {
          icon: "server",
          title: "16 microservices, no consistency.",
          body: "File structures, code organization, and tooling all varied service to service.",
        },
        {
          icon: "database",
          title: "A NoSQL database faking relations.",
          body: "Relationships were managed artificially, with “fake relations” holding the data together.",
        },
        {
          icon: "settings",
          title: "No local testing.",
          body: "Services had to be deployed to the cloud just to test them.",
        },
        {
          icon: "rocket",
          title: "A hard deadline.",
          body: "They needed to refactor a two-year project in under six months, before their June high season.",
        },
      ],
    },
    reasons: {
      heading: "Why iopool chose Prisma",
      intro:
        "iopool set five requirements for a new ORM: speed with a minimal learning curve, flexibility for frequent releases, ease of use, reliability for robust unit testing, and the comfort of being able to test locally. Prisma met them, and gave the team the confidence to take on the full rebuild.",
      cards: [
        {
          icon: "rocket",
          title: "Fast to adopt",
          body: "A minimal learning curve meant the team could move quickly under a tight deadline.",
        },
        {
          icon: "settings",
          title: "Local testing back",
          body: "Prisma let engineers test locally instead of deploying to the cloud first.",
        },
        {
          icon: "shield",
          title: "Reliable and type-safe",
          body: "Type-safe access made robust unit testing across the backend possible.",
        },
      ],
    },
    quote: {
      text: "Because we found Prisma, we decided to start the refactor for the full project.",
      author: "Luc Matagne",
      role: "Lead Software Engineer",
      company: "iopool",
      companyHref: "https://iopool.com/",
    },
    usage: {
      heading: "How they use Prisma",
      body: [
        "iopool rebuilt on a relational foundation with PostgreSQL as its primary database, accessed through Prisma Client for type safety. They use the Prisma schema to iterate on the database quickly and Prisma Migrate to manage schema changes collaboratively across the team.",
        "Prisma sits in a new stack: a React Native app, a GraphQL API with Apollo and Nexus, AWS Lambda for serverless functions, and DynamoDB alongside PostgreSQL for water-quality data at scale, all in TypeScript. As Luc Matagne put it: “When we're editing or making a change to the schema, we know that if we're using Prisma, it's going to work.”",
      ],
    },
    results: {
      heading: "The results",
      intro:
        "iopool shipped the refactor on time and came out shipping far faster, with the confidence to change critical code safely.",
      items: [
        {
          icon: "rocket",
          stat: "Type-safe access in a week",
          detail: "Type-safe database access up and running within a week of adopting Prisma.",
        },
        {
          icon: "repeat",
          stat: "Shipping multiple times a week",
          detail:
            "Release frequency jumped from once every few weeks to multiple times a week, with feature work going from weeks to days.",
        },
        {
          icon: "checkCircle",
          stat: "Refactor shipped on time",
          detail: "The two-year rebuild landed on schedule for the June high season.",
        },
      ],
    },
    closingQuote: {
      text: "Without Prisma we would never had iopool 2.0 ready on time. We can now sleep soundly after each new commit, with Prisma the margin of error is so very small.",
      author: "Luc Matagne",
      role: "Lead Software Engineer",
      company: "iopool",
    },
    cta: {
      heading: "Build on the same stack as iopool",
      body: "iopool rebuilt two years of work on Prisma in under six months. See what Prisma can do for your team.",
      checks: [
        "Free to start, no credit card required",
        "Type-safe access, rapid schema iteration, and safe migrations",
        "Trusted by 500K+ developers",
      ],
    },
  },
];

const BY_SLUG = new Map(CUSTOMER_STORY_DETAILS.map((s) => [s.slug, s]));

export function getCustomerStory(slug: string): CustomerStoryDetail | undefined {
  return BY_SLUG.get(slug);
}

/** Slugs with a built detail page — customers-grid uses this to link inward. */
export const STORY_DETAIL_SLUGS = new Set(BY_SLUG.keys());
