// Customer case studies, ported from apps/site (src/data/showcase.ts stories).
// Story URLs point at the blog app, which serves /blog in production, kept
// relative so they resolve on any deploy of the combined site.

export type CustomerStory = {
  company: string
  title: string
  excerpt: string
  href: string
  image: string
}

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    company: "Bucket",
    title: "How Bucket uses Prisma ORM to make shipping feature releases faster",
    excerpt:
      "Bucket, a fast-growing feature management platform, uses Prisma ORM to simplify complex relational queries and accelerate feature releases, a lean team delivering high-quality features faster while managing evolving database needs.",
    href: "/blog/how-bucket-uses-prisma-orm",
    image: "/customers/stories/bucket.png",
  },
  {
    company: "Amplication",
    title: "How Prisma helps Amplication revolutionize backend development",
    excerpt:
      "Amplication is an open-source development tool that helps you build quality Node.js applications without spending time on repetitive coding tasks.",
    href: "/blog/amplication-customer-story-nmlkBNlLlxnN",
    image: "/customers/stories/amplication.png",
  },
  {
    company: "Formbricks",
    title: "Formbricks and Prisma Accelerate: solving scalability together",
    excerpt:
      "Formbricks, an open-source survey platform, tackled scalability challenges with Prisma Accelerate, managing growing user demand while maintaining high performance.",
    href: "/blog/formbricks-and-prisma-accelerate-solving-scalability-together",
    image: "/customers/stories/formbricks.svg",
  },
  {
    company: "Solin",
    title: "How Solin uses Accelerate to serve 2.5M database queries per day",
    excerpt:
      "Prisma Accelerate contributes to Solin's success by enhancing performance and reliability with its scalable connection pool and global database cache.",
    href: "/blog/how-solin-uses-prisma-accelerate-to-serve-2-5m-database-queries-per",
    image: "/customers/stories/solin.svg",
  },
  {
    company: "Elsevier",
    title: "How Elsevier piloted an innovative publication process with Prisma",
    excerpt:
      "Elsevier, a global leader in scientific publishing, is modernizing the publication process efficiently and flexibly with Prisma's help.",
    href: "/blog/elsevier-customer-story-SsAASKagMHtN",
    image: "/customers/stories/elsevierstory.svg",
  },
  {
    company: "Tryg",
    title: "How Tryg has leveraged Prisma to democratize data",
    excerpt:
      "Tryg's \"360\" Data Broker platform accelerated development cycles by removing manual environment configuration. Prisma was the critical technology that let them democratize billions of records across data sources.",
    href: "/blog/tryg-customer-story-pdmdrRhTupvd",
    image: "/customers/stories/tryg.png",
  },
  {
    company: "Panther",
    title: "How Panther champions talent over geography with Prisma",
    excerpt:
      "Panther leverages Prisma and a cutting-edge tech stack to power a domain-driven architecture, automating global payroll and compliance for remote teams in one click.",
    href: "/blog/panther-customer-story-pdmdrrhtupsl",
    image: "/customers/stories/panther.png",
  },
  {
    company: "Rapha",
    title: "How Prisma helps Rapha manage their mobile application data",
    excerpt:
      "Rapha redefines comfort, performance, and style for cyclists worldwide. Prisma helps Rapha build consistent data APIs across teams and platforms.",
    href: "/blog/helping-rapha-access-data-across-platforms-n3jfhtyu6rgn",
    image: "/customers/stories/rapha.png",
  },
  {
    company: "Grover",
    title: "How Grover moves faster with Prisma",
    excerpt:
      "Grover offers monthly tech product subscriptions across many teams. Several found huge productivity gains by adopting Prisma.",
    href: "/blog/grover-customer-success-story-nxkWGcGNuvFd",
    image: "/customers/stories/grover.png",
  },
  {
    company: "Invisible",
    title: "How migrating from Sequelize to Prisma allowed Invisible to scale",
    excerpt:
      "Invisible, a B2B productivity startup, future-proofed its tech stack with Prisma, which played a crucial role in supporting the company's scale.",
    href: "/blog/how-migrating-from-Sequelize-to-Prisma-allowed-Invisible-to-scale-i4pz2mwu6q",
    image: "/customers/stories/invisible.png",
  },
  {
    company: "Pearly",
    title: "How Prisma allowed Pearly to scale quickly with an ultra-lean team",
    excerpt:
      "Pearly provides a platform for dentists to create reliable revenue streams and affordable care plans, scaling quickly with an ultra-lean team.",
    href: "/blog/pearly-plan-customer-success-pdmdrRhTupve",
    image: "/customers/stories/pearly.png",
  },
  {
    company: "Poppy",
    title: "How Poppy uses Prisma Client to ship confidently",
    excerpt:
      "Poppy offers shared rides of all kinds through its mobile app. Prisma plays a vital role in shipping quickly and confidently, a big reason they've hit 1.5 million total rides.",
    href: "/blog/poppy-customer-success-story-swnWQcGRRvpd",
    image: "/customers/stories/poppy.png",
  },
  {
    company: "iopool",
    title: "How iopool refactored their app in less than 6 months with Prisma",
    excerpt:
      "iopool's architecture was slowing them down, so they switched to Lambda functions and PostgreSQL powered by Prisma, moving fast with confidence and a greatly simplified process.",
    href: "/blog/iopool-customer-success-story-uLsCWvaqzXoa",
    image: "/customers/stories/iopool.png",
  },
]
