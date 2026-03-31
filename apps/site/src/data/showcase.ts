const stories = [
  {
    name: "Bucket",
    id: "bucket",
    title:
      "How Bucket Uses Prisma ORM to Make Shipping Feature Releases Faster",
    imageSrc: "/photos/showcase/stories/bucket.png",
    imageAlt: "Showcase story",
    technologies: ["prisma"],
    excerpt: `Discover how Bucket, a fast-growing feature management platform, uses Prisma ORM to simplify complex relational queries and accelerate feature releases. Learn how their lean team delivers high-quality features faster while managing evolving database needs with ease.`,
    url: "/blog/how-bucket-uses-prisma-orm",
  },
  {
    name: "Amplication",
    id: "amplication",
    title: "How Prisma helps Amplication evolutionize backend development",
    imageSrc: "/photos/showcase/stories/amplication.png",
    imageAlt: "Showcase story",
    technologies: ["nest", "postgres", "prisma", "graphql", "docker"],
    excerpt: `Amplication is an open-source development tool. It helps you develop quality Node.js applications without spending time on repetitive coding tasks. It’s perfect for both backend and fullstack developers.`,
    url: "/blog/amplication-customer-story-nmlkBNlLlxnN",
  },
  {
    name: "Formbricks",
    id: "formbricks",
    title: "Formbricks and Prisma Accelerate: Solving scalability together",
    imageSrc: "/photos/showcase/stories/formbricks.svg",
    imageAlt: "Showcase story",
    technologies: [],
    excerpt: `Formbricks, an open-source survey platform, effectively tackled scalability challenges with Prisma Accelerate and strategically integrated it to manage growing user demands and maintain high performance.`,
    url: "/blog/formbricks-and-prisma-accelerate-solving-scalability-together",
  },
  {
    name: "Solin",
    id: "solin",
    title: "How Solin uses Accelerate to serve 2.5M database queries per day",
    imageSrc: "/photos/showcase/stories/solin.svg",
    imageAlt: "Showcase story",
    technologies: [],
    excerpt: `Learn how Prisma Accelerate has contributed to Solin's success by enhancing performance and reliability with its scalable connection pool and global database cache.`,
    url: "/blog/how-solin-uses-prisma-accelerate-to-serve-2-5m-database-queries-per",
  },
  {
    name: "Elsevier",
    id: "elsevier",
    title:
      "How Elsevier piloted an innovative publication process quickly and flexibly with Prisma",
    imageSrc: "/photos/showcase/stories/elsevierstory.svg",
    imageAlt: "Showcase story",
    technologies: ["graphql", "ts", "prisma", "aws", "nexus"],
    excerpt: `Elsevier is a global leader in information and analytics in scientific publishing and helps researchers and healthcare professionals.
    With the help of Prisma, Elsevier is in the process of modernizing the scientific publishing process efficiently and with flexibility.`,
    url: "/blog/elsevier-customer-story-SsAASKagMHtN",
  },
  {
    name: "Tryg",
    id: "tryg",
    title: "How Tryg has leveraged Prisma to democratize data",
    imageSrc: "/photos/showcase/stories/tryg.png",
    imageAlt: "Showcase story",
    technologies: ["kafka", "cockroach", "graphql", "kubernetes", "prisma"],
    excerpt: `Tryg saved huge amounts of time thanks to its “360” Data Broker platform that accelerated development cycles by removing the overhead incurred by configuring environments manually. Prisma was the critical technology that enabled them to democratize billions of records from different data sources.`,
    url: "/blog/tryg-customer-story-pdmdrRhTupvd",
  },
  {
    name: "Panther",
    id: "panther",
    title: "How Panther champions talent over geography with Prisma",
    imageSrc: "/photos/showcase/stories/panther.png",
    imageAlt: "Showcase story",
    technologies: ["mysql", "mongodb", "graphql", "react", "prisma"],
    excerpt: `Panther leverages Prisma and a cutting edge tech stack to power a domain-driven architecture. This allows Panther to ensure that its customers can automate global payroll and compliance for their remote teams with one click.`,
    url: "/blog/Panther-customer-story-pdmdrRhTupsl",
  },
  {
    name: "Rapha",
    id: "rapha",
    title: "How Prisma helps Rapha manage their mobile application data",
    imageSrc: "/photos/showcase/stories/rapha.png",
    imageAlt: "Showcase story",
    technologies: ["postgres", "prisma", "nexus", "apollo", "cloudflare"],
    excerpt: `Rapha is a company dedicated to redefining comfort, performance, and style for cyclists around the world, whether beginners or World Tour professionals. Learn how Prisma helps Rapha build consistent data APIs across various teams and platforms.`,
    url: "/blog/helping-rapha-access-data-across-platforms-n3jfhtyu6rgn",
  },
  {
    name: "Grover",
    id: "grover",
    title: "How Grover moves faster with Prisma",
    imageSrc: "/photos/showcase/stories/grover.png",
    imageAlt: "Showcase story",
    technologies: ["postgres", "nest", "prisma", "nexus", "apollo"],
    excerpt: `Grover offers monthly tech product subscriptions and splits work on its services across many teams. Some teams have recently found huge productivity gains by adopting Prisma. Read on to find out how Prisma has benefited Grover and how you can benefit as well.`,
    url: "/blog/grover-customer-success-story-nxkWGcGNuvFd",
  },
  {
    name: "Invisible",
    id: "invisible",
    title: "How migrating from Sequelize to Prisma allowed Invisible to scale",
    imageSrc: "/photos/showcase/stories/invisible.png",
    imageAlt: "Showcase story",
    technologies: ["next", "trpc", "prisma", "vercel", "postgres"],
    excerpt: `Invisible is a B2B productivity startup that allows its users to automate and outsource any complex workflow or business process through Worksharing. Prisma played a crucial role in allowing Invisible to future proof their tech stack and in supporting its scale.`,
    url: "/blog/how-migrating-from-Sequelize-to-Prisma-allowed-Invisible-to-scale-i4pz2mwu6q",
  },
  {
    name: "Pearly",
    id: "pearly",
    title: "How Prisma allowed Pearly to scale quickly with an ultra-lean team",
    imageSrc: "/photos/showcase/stories/pearly.png",
    imageAlt: "Showcase story",
    technologies: ["apollo", "nexus", "prisma", "gcp", "postgres"],
    excerpt:
      "Pearly provides a platform for dentists to create better and reliable revenue streams and affordable care plans for their patients. Learn how Prisma has helped them scale quickly with an ultra-lean team. ",
    url: "/blog/pearly-plan-customer-success-pdmdrRhTupve",
  },
  {
    name: "Poppy",
    id: "poppy",
    title: "How Poppy uses Prisma Client to ship confidently",
    imageSrc: "/photos/showcase/stories/poppy.png",
    imageAlt: "Showcase story",
    technologies: ["node", "postgres", "prisma", "redis", "gcp"],
    excerpt:
      "Poppy offers rides of all kinds through its mobile app. Whether its a car, scooter, or e-step, Poppy has it. Prisma plays a vital role in helping Poppy ship quickly and confidently and is a big reason they ve just hit 1.5 million total rides taken.",
    url: "/blog/poppy-customer-success-story-swnWQcGRRvpd",
  },
  {
    name: "iopool",
    id: "iopool",
    title: "How iopool refactored their app in less than 6 months with Prisma",
    imageSrc: "/photos/showcase/stories/iopool.png",
    imageAlt: "Showcase story",
    technologies: ["cognito", "postgres", "aws", "prisma", "nexus"],
    excerpt: `In 2020, iopool realized that their architecture was slowing them down and preventing them from innovating. They decided to switch to Lambda functions and a PostgreSQL database powered by Prisma. Learn how this has helped them move fast with confidence and has greatly simplified their process.`,
    url: "/blog/iopool-customer-success-story-uLsCWvaqzXoa",
  },
];

const communityProjects = [
  {
    name: "South Pole",
    id: "southpole",
    logo: "/icons/companies/southpole.svg",
    technologies: ["ts", "prisma", "react", "postgres", "nest"],
    description:
      "South Pole has been at the forefront of decarbonization since 2006, developing and implementing comprehensive strategies that turn climate action into long-term business opportunities for Fortune 500 companies, governments and organizations around the world.",
    link: "https://southpole.com/",
    externalLink: true,
    quote: {
      text: "South Pole runs database-centric projects with a complex, evolving schema at the core. Prisma allows us to declaratively design and deploy new schema iterations with ease. This enables us to rapidly roll out multiple database clients that are secure, type safe and up to date.",
      author: "Jan Cieslak",
      title: "Senior Software Engineer",
      socials: {
        linkedin: "https://www.linkedin.com/company/south-pole-global/",
        instagram: "https://www.instagram.com/southpoleglobal/",
        twitter: "https://twitter.com/southpoleglobal",
        github: "https://github.com/southpolecarbon/",
      },
    },
  },
  {
    name: "Garages near me",
    id: "garages-near-me",
    logo: "/icons/companies/garages-near-me.svg",
    technologies: ["ts", "prisma", "next", "mongodb"],
    description:
      "Garages Near Me is an online platform for drivers and parking providers. Born on the web, the platform helps people and businesses list, share, book, and pay for long-term parking spaces across Germany and beyond.",
    link: "https://garages-near-me.com",
    externalLink: true,
    quote: {
      text: "Prisma is a natural fit for us because our platform is written in end-to-end TypeScript. Our primary database is the schema-less MongoDB, so Prisma’s type safety, nested transactions, JSON fields, and logging are an absolute pleasure to work with. Prisma pairs nicely with Next.js, and together, they offer unparalleled developer experience, which is crucial for our small team to move at the speed of thought.",
      author: "Jozef Sorocin",
      title: "Founder & CEO",
      socials: {
        linkedin: "https://www.linkedin.com/company/garages-near-me",
        instagram: "https://www.instagram.com/garages_near_me/",
      },
    },
  },
  {
    name: "Wasp",
    id: "wasp",
    logo: "/icons/companies/wasp.png",
    technologies: ["react", "node", "prisma", "haskell", "ts"],
    description:
      "Wasp is the fastest way to develop full-stack web apps in React & Node.js. Describe high-level features (auth, CRUD, async jobs, …) via a simple config language, and write the rest of your logic in React, Node.js and Prisma.",
    link: "https://wasp-lang.dev/",
    externalLink: true,
    quote: {
      text: "If it weren’t for Prisma, Wasp probably wouldn’t have existed today. Prisma proved to be a perfect database abstraction layer, it’s declarative philosophy fits great into Wasp and it saved us a ton of work and allowed us to focus on the other parts of the stack. The team is also very supportive and fast to answer in case of any issues, it’s a pleasure to be a member of Prisma community.",
      author: "Matija Šošić",
      title: "CEO & Co-Founder",
      socials: {
        linkedin: "https://www.linkedin.com/company/wasp-lang/",
        github: "https://github.com/wasp-lang/wasp",
        twitter: "https://twitter.com/WaspLang",
      },
    },
  },
  {
    name: "Sunhat",
    id: "sunhat",
    logo: "/icons/companies/sunhat.svg",
    technologies: ["ts", "prisma", "angular", "nest", "postgres"],
    description:
      "Sunhat is an automation-focused software company founded to rethink sustainability compliance from the ground up. We are building an all-in-one SaaS platform to help companies automate and scale their sustainability programs.",
    link: "https://www.getsunhat.com/",
    externalLink: true,
    quote: {
      text: `Prisma is the best way for us to work with databases in microservices written with TypeScript. It makes hard things much easier to achieve and it saves us previous time which we can dedicate to the business logic instead of having to write a lot of redundant boilerplate code.
    The developer experience and the documentation are great!`,
      author: "Ali Kamalizade Sunhat",
      title: "Co-Founder & CTO",
      socials: {
        linkedin: "https://www.linkedin.com/in/alikamalizade/",
      },
    },
  },
  {
    name: "CoinRotator",
    id: "coinrotator",
    logo: "/icons/companies/coinrotator.png",
    technologies: ["postgres", "prisma", "next", "vercel"],
    description:
      "CoinRotator tracks price trends for the top 1,500 cryptocurrencies, all updated daily on a single dashboard. Instantly check the coin screener for each market using their proprietary version of the Supertrend.",
    link: "https://coinrotator.app/",
    externalLink: true,
    quote: {
      text: `We looked at popular ORM that would integrate well with our Next.js app and decided on Prisma because of its type safety and migration system that ensures that the code stays in sync with the current state of the database and the explicit query syntax that makes the code more maintainable.`,
      author: "Sascha Mayr",
      title: "Senior Full Stack Developer",
      socials: {
        twitter: "https://twitter.com/coinrotatorapp",
      },
    },
  },

  {
    name: "Gamma",
    id: "gamma",
    logo: "/icons/companies/gamma.svg",
    technologies: ["nest", "prisma", "aws", "next", "chakraui"],
    description:
      "Gamma is an alternative to slide decks - a fast, simple way to share and present your work. Create engaging presentations, memos, briefs, and docs that are easy to discuss live or share async. All in your browser, nothing to download or install.",
    link: "https://gamma.app/",
    externalLink: true,
    quote: {
      text: `We've proudly built the core of our APIs on top of Prisma, and we are very happy that we did. It's well thought out, doesn't make us jump through unnecessary hoops to get normal work done and generally just works.
    Huge shout out to the awesome team at Prisma that continues to ship product at a crazy fast pace!`,
      author: "James Fox",
      title: "Co-Founder",
      socials: {
        linkedin: "https://www.linkedin.com/company/gamma-app/",
      },
    },
  },
  {
    name: "Friday Finance",
    id: "fridayfinance",
    logo: "/icons/companies/fridayfinance.svg",
    technologies: ["ts", "graphql", "prisma"],
    description: `Friday Finance helps startups and SMEs manage and automate everything between their bank transactions and accounting software in real-time.No more spreadsheet chaos, manual inputs, and missing data.`,
    link: "https://www.fridayfinance.com/",
    externalLink: true,
    quote: {
      text: `Prisma empowers our team to be productive in evolving the data model and writing operations, while also maintaining the flexibility of writing raw SQL whenever we feel the need.`,
      author: "Patrick de Castro Neuhaus",
      title: "Co-founder & CTO",
      socials: {
        linkedin: "https://www.linkedin.com/company/fridayfinance/",
        twitter: "https://twitter.com/fridayfin",
      },
    },
    points: [
      {
        title: "Why choose Prisma",
        description: `There was never a question of whether we should use an ORM or not - writing raw SQL should be restricted to complex operations, given that few people these days possess good SQL skills and it’s way less maintainable in the long run. Since we opted for TypeScript, the obvious options were TypeORM, Sequelize, and of course Prisma.<br><br>

        What led us to go for Prisma were mainly three factors. <br>
        First, the schema file, which is much easier to work with and maintainable as a team than the class-based structure of classic ORMs, and also resembles a lot GraphQL, which is another core part of our stack. <br>
        Then, the migration management, which once again makes our database models more maintainable in a collaborative environment. <br>
        Finally, the community and team behind Prisma give us a strong sense of safety although it’s pretty new compared to the other two, and keep launching great new things that we want to incorporate into our stack.`,
      },
      {
        title: "Journey with Prisma",
        description: `Prisma has been with us since the early days of development and is at the core of all that Friday Finance has built so far. This means open banking integrations, cash flow management, cash flow forecasting, reconciliation, multiple different integrations with external services, and so on. <br>
                    We are also about to launch our own accounts and payments, which we were able to implement in record time, also in part due to the use of Prisma.`,
      },
    ],
  },
  {
    name: "Flux",
    id: "flux",
    logo: "/icons/companies/flux.svg",
    technologies: ["ts", "prisma", "next", "vercel", "mongodb"],
    description:
      "FLUX is Malaysia's #1 car subscription service for consumers & companies. It offers a multi brand all-inclusive monthly car subscription service that provides you with the ability to subscribe and swap cars as your needs change.",
    link: "https://driveflux.com/",
    externalLink: true,
    quote: {
      text: "Our philosophy is to disrupt the automotive industry using the latest technology to give us a competitive edge. We built our platform with the best tech that fits our business, but we were plagued by older MongoDB modules which were doing too much 'magic' behind the scenes that didn't work well, and was not really TS compatible. When Prisma became available for MongoDB, it was an absolute no-brainer to switch. We were amazed by its simplicity, its powerful client generating, and thorough typings. Even when we had some issues, Prisma's flexibility allowed us to rapidly build solutions around them and we couldn't be happier. It's the best thing that happened to our tech.",
      author: "Aladin Bouzerd",
      title: "Full stack developer",
      socials: {
        linkedin: "https://www.linkedin.com/company/driveflux/",
        instagram: "https://www.instagram.com/driveflux/",
        twitter: "https://twitter.com/driveflux",
      },
    },
  },
  {
    name: "Everfund",
    id: "everfund",
    logo: "/icons/companies/everfund.svg",
    technologies: ["graphql", "next", "prisma", "postgres", "redwoodjs"],
    description: `The dev-first nonprofit tool to build custom fundraising systems that help nonprofits capture more donations and grow better supporter relationships, without building from scratch.`,
    link: "https://everfund.io/",
    externalLink: true,
    quote: {
      text: `Prisma has enabled Everfund to move fast while building, migrating and scaffolding our databases. It has given us the confidence and ease of deployment of migrations throughout the dev stages to production.`,
      author: "Christopher Burns",
      title: "Co-founder & CEO",
      socials: {
        linkedin: "https://www.linkedin.com/company/everfunduk/",
        twitter: "https://twitter.com/_everfund",
      },
    },
    points: [
      {
        title: "Why choose Prisma",
        description:
          "In the early days of building your product or MVP, it is critical to go as fast as possible and stay lean with the resources you have. With Prisma, the data layer is handled quickly and efficiently to scale from startup to enterprise without switching out platforms.",
      },
      {
        title: "Journey with Prisma",
        description: `When we started Everfund we needed to move fast and agile with the little resources we had. Prisma 1 was the cornerstone of our data layer with a GraphQL server sitting in front of it using GraphQL Nexus.

        With the evolution of Prisma into what we know it as today, we made the choice to migrate to Prisma coupled with RedwoodJS. Redwood completely changes the game when it comes to code generation. Generating GraphQL SDL & functions are generated straight from the Prisma schema with RedwoodJS.`,
      },
    ],
  },
  {
    name: "Nuna",
    id: "nuna",
    logo: "/icons/companies/nuna.svg",
    technologies: ["react", "prisma", "next", "vercel"],
    description:
      "Nuna is a mental health companion that helps people understand and cope better with their emotions, thoughts and behaviour via psychological tools and chat.",
    link: "https://www.nuna.ai/",
    externalLink: true,
    quote: {
      text: "A startup is not just about scaling infrastructure with growth, but it is also about scaling the developer experience. Prisma allows us to have an end-to-end type safe ORM while also being a pleasure to write code in. In other words, Prisma scales our developer happiness as much as our infrastructure!",
      author: "Hassan Bazzi",
      title: "Co-Founder & CEO",
      socials: {
        linkedin: "https://www.linkedin.com/company/nunacompanion/",
        instagram: "https://www.instagram.com/nunacompanion/",
        facebook: "https://www.facebook.com/nunacompanion",
      },
    },
  },
  {
    name: "prosperity",
    id: "prosperity",
    logo: "/icons/companies/prosperity.png",
    technologies: ["ts", "prisma", "next", "graphql", "postgres"],
    description:
      "prosperity solutions enables financial players like robo-advisors, neo-banks, or trading-apps to offer investment-style pension insurances.",
    link: "https://prosperitysolutions.li/en",
    externalLink: true,
    quote: {
      text: "Prisma is more than just a clean and type-safe database client to us. We appreciate how it's covering the entire lifecycle. It started with a powerful introspection of our existing schema, giving us all its benefits without much upfront investment. Data-modelling is intuitive and works well with the VS Code extension. And a personal favorite: thanks to Prisma we don't have to write migrations by hand anymore.",
      author: "Stephan Bönnemann-Walenta",
      title: "Managing Director, Product & Engineering",
      socials: {
        linkedin: "https://www.linkedin.com/company/p17s/",
      },
    },
    points: [
      {
        title: "Why choose Prisma",
        description: `Prisma hits a sweet spot, where it's doing heavy lifting under the hood, while being radically focused on the developer experience and productivity.
        It's a tangible difference, that the API is specifically designed with type-safety in mind. That's why the comparison with older ORMs is almost unfair. This level of sophistication can't be patched after the fact or with external typings.`,
      },
      {
        title:
          "More about the prosperity solutions architecture and tech choices",
        description: `We are balancing the further development of our existing app that is used by almost 60.000 policy holders (who manage 400.000.000 CHF through it) and extending it with our new embedded insurance product, that we white-label and offer to other companies.
        With a team of less than five engineers we are offering powerful desktop, tablet and mobile web applications written with Next.js. We package it up for the Apple and Android stores with the help of Capacitor.js. Besides the Prisma/PostgreSQL combo, we are using apollo-server and the Redis based bullmq queue on the backend-side.
        This level of productivity wouldn't be possible without tools like TypeScript, Next.js, Vercel and Prisma, who each established a new standard of developer experience in their respective categories.`,
      },
      {
        title: "Looking at the future",
        description:
          "We are a small and profitable company with a clear plan and the ecosystem around us to make it happen. As simple as that might sound, this is naturally different to most startups already. We are engineering and product driven, with a human-centered performance culture. Everyone can move the needle and see what their work is enabling. Being in a healthy situation, especially during these turbulent times, we can further invest in our team and keep learning every day.",
      },
    ],
  },
  {
    name: "Flycode",
    id: "flycode",
    logo: "/icons/companies/flycode.png",
    technologies: ["ts", "prisma", "react", "postgres", "nest"],
    description:
      "FlyCode makes web apps editable without coding so companies can iterate and release products faster. With FlyCode, PMs can simply edit product copy in resource files or hardcoded strings, as well as images and links in the same git-based workflow that their developers use.",
    link: "https://www.flycode.com/",
    externalLink: true,
    quote: {
      text: "Very early in the development of FlyCode we realised that Prisma is the best fit for our use-case. As a growing startup, we need to iterate fast and ship often while retaining strong confidence in our production system. Prisma's type-safety and automatic migrations mechanism helped us to easily achieve these objectives.",
      author: "Iddan Aaronsohn",
      title: "Software Engineer",
      socials: {
        linkedin: "https://www.linkedin.com/company/flycodehq/",
        twitter: "https://twitter.com/FlycodeHQ",
      },
    },
  },
  {
    name: "wingfield",
    id: "wingfield",
    logo: "/icons/companies/wingfield.png",
    technologies: ["ts", "prisma", "postgres", "node", "digital-ocean"],
    description:
      "Wingfield provides smart solutions to connect modern Tennis players, coaches and clubs, extending your Tennis experience into the virtual world. Their AI-powered tennis courts are loved by over 250 clubs and 20.000 players around the world.",
    link: "https://www.wingfield.io/en",
    externalLink: true,
    quote: {
      text: "We rebuild our entire backend with Prisma and TypeScript within 6 months, making our application 4 times faster. In comparison, the development of the old version with Java and SQL took almost 3 years. With Prisma, not only we have lower overhead for development and maintenance, but we also have a great support for any questions and issues!",
      author: "Henri Kuper",
      title: "Co-Founder and Head of Software",
      socials: {
        linkedin: "https://www.linkedin.com/company/wingfield-gmbh/",
        instagram: "https://www.instagram.com/wingfieldtennis/",
        facebook: "https://www.facebook.com/wingfield.io/",
      },
    },
  },
  {
    name: "trunk",
    id: "trunk",
    logo: "/icons/companies/trunk.png",
    technologies: ["ts", "prisma", "kubernetes", "aws", "mysql"],
    description:
      "Trunk is a dev tools startup, redefining software development at scale. It simplifies checking, testing, and merging your code, allowing you to focus on writing features instead of babysitting PRs.",
    link: "https://trunk.io/",
    externalLink: true,
    quote: {
      text: "We came across Prisma early in the development of the Trunk saas offering and it was clear that we shared the same focus: building a great developer experience, with well maintained and easy to use docs and interface. Prisma is a professional enterprise ready tool, that is easy to start using, ramp up and scale. It is the type of tool developed for the software engineers of today.",
      author: "Matt Matheson",
      title: "Co-Founder",
      socials: {
        linkedin: "https://www.linkedin.com/company/trunkio/",
        twitter: "https://twitter.com/trunkio",
      },
    },
  },
  {
    name: "apideck",
    id: "apideck",
    logo: "/icons/companies/apideck.svg",
    technologies: ["ts", "open-api", "prisma", "aws", "postgres"],
    description:
      "Apideck enables developers to build integrations through a single API, delivering the integrations their customers need in record time.",
    link: "https://www.apideck.com/",
    externalLink: true,
    quote: {
      text: "At Apideck we are Typescript fanboys so it was a no brainer that we needed an ORM that was able to give us native type support. Using Prisma we're able to get that. Generating types based on the DB schema is awesome and we get a lot of type safety. Making changes in the database and running migrations is as easy as it can get using the migration tool. The well written, extensive and searchable docs get you up to speed and productive in no-time. So no doubt that Prisma is one of our favourite tools in our stack.",
      author: "Geert Wille",
      title: "Full Stack Developer",
      socials: {
        linkedin: "https://www.linkedin.com/company/apideck/",
        twitter: "https://twitter.com/apideck",
      },
    },
  },
  {
    name: "Dotworld Technologies",
    id: "Dotworld",
    logo: "/icons/companies/dotworld.png",
    technologies: ["ts", "prisma"],
    description:
      "Dotworld Technologies is made up of a creative team of robotics engineers, design enthusiasts and innovationeers, that help you solve challenges using cutting-edge technology.",
    link: "https://www.dotworld.in/about",
    externalLink: true,
    quote: {
      text: "We are using Prisma for various internal products such as MDM applications for managing our products, a robot command center, etc. Thanks to Prisma the speed of the development increased significantly, for example I was able to develop the backend for a demo application in a single night using Prisma. There are no words to express how happy we are with the rate of development!",
      author: "Naveen Sakthivel",
      title: "CTO",
      socials: {
        linkedin: "https://www.linkedin.com/company/dotworldindia/",
        twitter: "https://twitter.com/DotworldIndia",
      },
    },
  },
  {
    name: "Simpler",
    id: "simpler",
    logo: "/icons/companies/simpler.png",
    technologies: ["next", "react", "vercel", "prisma", "planetscale"],
    description:
      "simpler is a unique to-do app that helps you do what needs to get done so you can focus on what truly matters.",
    link: "https://usesimpler.com/",
    externalLink: true,
    quote: {
      text: "Prisma speeds up development by an incredible amount. Prisma is an invaluable technology for frontend, backend, and full-stack developers. So grateful to the Prisma community.",
      author: "Martin Adams",
      title: "Founder",
      socials: {
        twitter: "https://twitter.com/usesimpler",
      },
    },
  },
  {
    name: "Cal.com",
    id: "cal",
    logo: "/icons/companies/cal.svg",
    logo_light: "/icons/companies/cal_light.svg",
    technologies: ["ts", "next", "trpc", "prisma", "turborepo"],
    description:
      "Cal.com is the scheduling platform that is open-source, white-label, privacy-first and developer friendly.",
    link: "https://cal.com/",
    externalLink: true,
    quote: {
      text: "We chose Prisma because it provides us with type safety directly from the database. It has helped us tremendously to catch possible error from early on. Also it made possible to come up and launch new features with no major issues migrating, testing and deploying them.",
      author: "Omar López",
      title: "Senior Software Engineer",
      socials: {
        github: "https://github.com/calcom",
        twitter: "https://twitter.com/calcom",
      },
    },
  },
  {
    name: "Tabya!",
    id: "tabya",
    logo: "/icons/companies/tabya.png",
    technologies: ["ts", "node", "graphql", "prisma", "postgres"],
    description:
      "Tabya! serves as the link between the German construction sector and the IT sector. It provides solutions that not only address and solve specific problems, but also optimize the entire process.",
    link: "https://tabya.de",
    externalLink: true,
    quote: {
      text: "We are using Prisma since version 1. From the first minute onwards we’ve loved the type-safety on the one hand, and the simplicity of the autogenerated type on the other. A standardized and simplified way to access the data enabled our developers to write fast and maintainable software. Schema generation and migration changed from pain to joy and fast releases are a no-brainer.",
      author: "Aaron Bach",
      title: "Executive Partner",
      socials: {
        facebook: "https://www.facebook.com/tabyagmbh/",
        linkedin: "https://www.linkedin.com/company/tabya-gmbh/",
      },
    },
  },
  {
    name: "Caribou",
    id: "caribou",
    logo: "/icons/companies/caribou.png",
    technologies: ["ts", "node", "prisma", "gcp", "mysql"],
    description:
      "Caribou's mission is to ensure that healthcare does not get in the way of living. Currently we provide healthcare cost prediction and optimization tools for our customers across the US.",
    link: "https://caribouwealth.notion.site/Careers-at-Caribou-357783b6007f4d15bae8c7b9651cebf5",
    quote: {
      text: `Caribou has been using Prisma in production for over a year, and it has allowed our team to make large changes to our datamodel without fear of breaking things.`,
      author: "Giorgio Delgado",
      title: "Founding engineer",
      socials: {
        twitter: "https://twitter.com/caribou_wealth",
        linkedin: "https://www.linkedin.com/company/caribouwealth/",
      },
    },
  },
  {
    name: "Goodsouls",
    id: "Goodsouls",
    logo: "/icons/companies/goodsouls.svg",
    technologies: ["ts", "react", "prisma", "expo", "postgres"],
    description:
      "Goodsouls’ goal is to make delicious and healthy plant-based recipes accessible to everyone. Whether you are just curious about plant based cooking and baking, a vegan beginner, or a long-term vegan looking for inspiration, their recipes have been created for you!",
    link: "https://goodsoulsapp.com/",
    externalLink: true,
    quote: {
      text: `Prisma was just what I was looking for when starting a new project. It is accessible to beginners, yet, as you progress, there are more advanced features to help improve your product. I’ve used a few ORMs before, but nothing comes close to Prisma with regard to feature set and stability. The Prisma community is incredible, and I had so much support and positive feedback from the team and other members on their Slack channel.`,
      author: "Darryl Young",
      title: "Co-founder & Software Engineer",
      socials: {
        twitter: "https://twitter.com/GoodsoulsApp",
        instagram: "https://www.instagram.com/GoodsoulsApp/",
      },
    },
  },
  {
    name: "Revere",
    id: "revere",
    logo: "/icons/companies/revere.png",
    technologies: ["next", "relay", "prisma", "graphql", "postgres"],
    description:
      "Revere is a networking and deal execution platform for commercial real estate professionals, CRE Sponsors, Brokers, and Capital Providers. With information on 50K+ CRE participants, Revere is capable of matchmaking thousands of potential deal participants with one another in seconds!",
    link: "https://reverecre.com/",
    externalLink: true,
    quote: {
      text: `Prisma has made it 10x easier for our business to translate customer requirements and product roadmaps into executable code running in production! It's easy to understand the data model and view it's evolution through their terse but descriptive DSL. Prisma's engine handles all of the complexity of querying large quantities of data through their fluent/type-safe API. It's made it really easy to focus on our business and operating our software at scale rather than modeling and querying data... like it should be in 2022!`,
      author: "Pranav Sathyanarayanan",
      title: "Co-founder & Head of Engineering",
      socials: {
        linkedin: "https://www.linkedin.com/company/revere-cre",
      },
    },
  },
  {
    name: "Escape",
    id: "Escape",
    logo: "/icons/companies/escape.png",
    technologies: ["nest", "graphql", "apollo", "prisma", "postgres"],
    description:
      "Escape scans your GraphQL endpoints to find and fix their security flaws before production!",
    link: "https://escape.tech/",
    externalLink: true,
    quote: {
      text: `Using Prisma and its migration system at Escape, we can enjoy a smooth and stable backend development process. Our database can evolve in a breeze, without any downtime. Thanks to the fluent API used in our GraphQL backend, we managed to reduce the way we suffer from N+1 queries by orders of magnitude.`,
      author: "Maxence Lecanu",
      title: "Full stack web developer",
      socials: {
        twitter: "https://twitter.com/EscapeTechHQ",
        linkedin: "https://www.linkedin.com/company/escapetech/",
      },
    },
  },
  {
    name: "Questmate",
    id: "questmate",
    logo: "/icons/companies/questmate.png",
    technologies: ["ts", "react", "prisma", "aws", "aurora"],
    description:
      "Questmate makes work simple, consistent and rewarding, by combining the simplicity of to-do lists with straightforward guidance and powerful integrations of external systems and applications. Runs on iOS, Android, and Web.",
    link: "https://www.questmate.com/",
    externalLink: true,
    quote: {
      text: `We love Prisma for its amazing developer experience. Instead of being just another ORM, it really takes care of our all our data layer concerns end-to-end. Allowing us to ship customer value faster and with great confidence!`,
      author: "Sascha Reuter",
      title: "Founder",
      socials: {
        twitter: "https://twitter.com/questmateapp",
        linkedin: "https://www.linkedin.com/company/questmate",
      },
    },
  },
  {
    name: "Memberstack",
    id: "memberstack",
    logo: "/icons/companies/memberstack.svg",
    technologies: ["react", "graphql", "prisma", "aws", "postgres"],
    description:
      "Memberstack helps developers add user logins, payments and gate content on their website. Over 2,000 companies use Memberstack to accept payments and store user account data for millions of users.",
    link: "https://www.memberstack.com/",
    externalLink: true,
    quote: {
      text: `Prisma has been an absolute game changer for Memberstack. It has helped us move faster while also improving product stability. We are now able to focus all of our effort on our core product - we no longer struggle with DB migrations and maintaining DB schema types.`,
      author: "Tyler Bell",
      title: "Co-founder",
      socials: {
        twitter: "https://twitter.com/belltyler511",
        linkedin: "https://www.linkedin.com/in/tyler-bell-129711158",
      },
    },
  },
  {
    name: "Peace Mass Transit",
    id: "pmt",
    logo: "/icons/companies/pmt.svg",
    technologies: ["ts", "prisma", "redis", "mongodb", "postgres"],
    description: `Peace Mass Transit is transport service that provides the most affordable inter-city travel experience to take you to anywhere in Nigeria.`,
    link: "https://www.pmt.ng/",
    externalLink: true,
    quote: {
      text: `Prisma lives up to its promise to deliver an excellent backend developer experience. You achieve clean code design without sacrificing time. The most impressive aspect is how helpful the community to help beginners up and running.`,
      author: "Nditah Samweld",
      title: "CTO",
      socials: {
        twitter: "https://twitter.com/nditah_sammy",
        linkedin: "https://www.linkedin.com/in/nditah/",
      },
    },
  },
  {
    name: "Outrider",
    id: "outrider",
    logo: "/icons/companies/outrider.svg",
    technologies: ["ts", "graphql", "prisma", "azure", "postgres"],
    description: `Outrider, the pioneer in autonomous yard operations for logistics hubs, helps large enterprises improve safety and increase efficiency. The only company exclusively focused on automating all aspects of yard operations, Outrider eliminates manual tasks that are hazardous and repetitive.`,
    link: "https://www.outrider.ai/",
    externalLink: true,
    quote: {
      text: `Since our team adopted Prisma, we’ve been able to focus on feature development instead of technical debt. We’ve been impressed with Prisma’s tooling, documentation, and steadfast support of our team’s needs, and we look forward to new releases to the product.`,
      author: "Liz Einstein",
      title: "Software Engineer",
      socials: {
        twitter: "https://twitter.com/OutriderTech",
        linkedin: "https://www.linkedin.com/company/outridertech/",
      },
    },
  },
  {
    name: "AGVOLUTION",
    id: "agvolution",
    logo: "/icons/companies/agvolution.svg",
    technologies: ["ts", "react", "graphql", "prisma", "aws"],
    description: `AGVOLUTION is fighting for a climate-smart revolution of agriculture. It offers customer specific decision support for long-term sustainability of agriculture and for a higher profitability.`,
    link: "https://agvolution.com/",
    externalLink: true,
    quote: {
      text: `We built our architecture from the ground up with the help of Prisma and it since then not just served well as a great ORM but it liberated us from thinking too much about Databases. It also gives us the freedom to review our choices of DBs, try out other DBs or change our main DB without changing all the code – that's a game changer! What's even better, is that it perfectly integrates with our GraphQL based microservices and we learned a lot from Prisma's unique code-generation approach.`,
      author: "Sebastian Jerratsch",
      title: "Co-founder & CIO",
      socials: {
        twitter: "https://twitter.com/agvolution",
        linkedin: "https://www.linkedin.com/company/agvolution",
        github: "https://github.com/AGVOLUTION",
      },
    },
  },
  {
    name: "Avenue",
    id: "avenue",
    logo: "/icons/companies/avenue.svg",
    technologies: ["ts", "react", "nest", "prisma", "react-query"],
    description: `Avenue is the world's first operations observability platform built on the modern data stack. Avenue allows customers to set up monitors and incident response workflows on top of their database or data warehouse.`,
    link: "https://avenue.so/",
    externalLink: true,
    quote: {
      text: `Prisma has been a fundamental part of our tech stack at Avenue since our very first commit. We've loved the biweekly release cadence and extraordinary developer experience that lets us ship fast, safely, and reliably.`,
      author: "Jeff Barg",
      title: "Co-Founder & CTO",
      socials: {
        twitter: "https://twitter.com/jeffbarg/",
        linkedin: "https://www.linkedin.com/in/jeffreybarg/",
      },
    },
  },
  {
    name: "instatus",
    id: "instatus",
    logo: "/icons/companies/instatus.svg",
    technologies: ["next", "graphql", "prisma", "aws", "postgres"],
    description: `Get ready for downtime! Instatus helps you share your current status with customers. Communicating early helps you reduce support tickets, build trust, and keep your customers happy, even during downtime.`,
    link: "https://instatus.com/",
    externalLink: true,
    quote: {
      text: `I chose Prisma because of its clean API, nice developer experience and type safety. It helped me ship v1 of Instatus really fast. As we're growing, it's scaling really well, and helping us keep our backend code maintainable and clean.`,
      author: "Ali Salah",
      title: "Founder",
      socials: {
        twitter: "https://twitter.com/instatus",
        linkedin: "https://www.linkedin.com/company/instatus",
        github: "https://github.com/instatushq",
      },
    },
  },
  {
    name: "oxio",
    id: "oxio",
    logo: "/icons/companies/oxio.svg",
    technologies: ["ts", "graphql", "prisma", "aws", "aurora"],
    description: `oxio is a radically transparent, customer obsessed ISP that's here to change the way Canadians think about the internet—not as a commitment but as a utility.`,
    link: "https://oxio.ca/en",
    externalLink: true,
    quote: {
      text: `We’ve been using Prisma since the v2 beta came out. We were looking for a Typescript friendly, turnkey ORM solution that would speed up our development without compromising on flexibility, and that’s exactly what we found. Prisma evolved a lot throughout the years, always focusing on performance and developer experience. This is not a coincidence, as the Prisma team really is community driven, nimble and proactive. I admit it, we have a crush on Prisma.`,
      author: "Olivier Falardeau",
      title: "Head of Engineering",
      socials: {
        facebook: "https://www.facebook.com/oxiointernet/",
        linkedin: "https://www.linkedin.com/company/oxiointernet/",
      },
    },
  },
  {
    name: "Feather",
    id: "feather",
    logo: "/icons/companies/feather.svg",
    technologies: ["ts", "node", "prisma", "docker", "postgres"],
    description: `Insurance is overly complicated, and you’re never sure if it’s the insurance you actually need. Feather has built a solution: a digital insurance companion for Europe. Feather has helped people from over 150 countries get insurance digitally and is expanding quickly.`,
    link: "https://feather-insurance.com/",
    externalLink: true,
    quote: {
      text: `Thanks to type-safe automatic client generation, clean query API, and other cool features, Prisma has helped us rapidly kickstart multiple Typescript microservices at a low cost, both on top of existing databases and new ones.`,
      author: "Baris Sari",
      title: "Backend Engineer",
      socials: {
        linkedin: "https://www.linkedin.com/in/bayram-baris-sari/",
        github: "http://github.com/barissari",
      },
    },
  },
  {
    name: "dooboolab",
    id: "dooboolab",
    logo: "/icons/companies/dooboolab.png",
    technologies: ["ts", "apollo", "prisma", "mongodb", "graphql"],
    description: `dooboolab is a tech company located in South Korea, that provides technical support to various domestic startups and also maintains a number of open sources. Their current focus is developing Puzz, a solution for collecting videos.`,
    link: "https://dooboolab.com",
    externalLink: true,
    quote: {
      text: `By using Prisma, we could build products like Puzz blazingly fast. Prisma is a really easy tool that helps developers to communicate well. What is most cool about it is the Prisma team and we have strong faith that the Prisma product and services will continue to get better!`,
      author: "Hyo Chan Jang",
      title: "CEO",
      socials: {
        linkedin: "https://www.linkedin.com/company/18177501",
        github: "http://github.com/dooboolab",
      },
    },
  },
  {
    name: "Motionbox",
    id: "motionbox",
    logo: "/icons/companies/motionbox.svg",
    technologies: ["react", "next", "prisma", "postgres", "aws"],
    description: `Motionbox is a simple collaborative video editing tool designed to make teams and creators make better videos, faster.`,
    link: "https://motionbox.io/",
    externalLink: true,
    quote: {
      text: `Prisma was a great decision to make for the Motionbox tech stack. We took a bet on this technology and bet on it at the right time. Prisma, right out of the box, speeds up your development 10x, and when you need more control there aren’t many limitations. It’s a delight to work with, and the community is awesome. I use it for Motionbox core and I use it for other toy projects as well, I love it for the simplicity and power.`,
      author: "Michael Aubry",
      title: "CEO",
      socials: {
        twitter: "https://twitter.com/michaelaubry",
        instagram: "https://www.instagram.com/michaelaubry/",
      },
    },
  },
  {
    name: "Pabio",
    id: "pabio",
    logo: "/icons/companies/pabio.svg",
    technologies: ["ts", "prisma", "react", "nest", "remix"],
    description: `Pabio provides beautiful interior design for your home with the flexibility to rent or buy the furniture you love.`,
    link: "https://pabio.com/en-de/",
    externalLink: true,
    quote: {
      text: `Prisma is wonderful because it takes care of all the things I don't want to think about -- connection pooling, migrations, easy indexing, and of course SQL JOINs. We've been using Prisma from day 1 and will never go back!`,
      author: "Anand Chowdhary",
      title: "Co-founder & CTO",
      socials: {
        github: "https://github.com/pabio",
        twitter: "https://twitter.com/pabiohq",
        instagram: "https://www.instagram.com/pabiohq",
      },
    },
  },
  {
    name: "Antstack",
    id: "Antstack",
    logo: "/icons/companies/anstack.svg",
    technologies: ["ts", "prisma", "aws"],
    description: `Antstack is a leading full-stack serverless company aiming at disrupting the cloud computing space by providing holistic solutions to get you up and running with serverless.`,
    link: "https://www.antstack.io/",
    externalLink: true,
    quote: {
      text: `I've found Prisma ORM very productive and I can't recommend you enough to try it. When looking for an external connection pooler at Antstack we naturally gravitated towards the Prisma Data Proxy: it was very simple to use and it allowed us to immediately address scaling issues.`,
      author: "Ankit Aabad",
      title: "MTS - 2",
      socials: {
        linkedin: "https://www.linkedin.com/company/antstackio/",
        github: "https://github.com/antstackio",
        twitter: "https://twitter.com/AntStack",
      },
    },
  },
  {
    name: "Stone Giant Studio",
    id: "stonegiantstudio",
    logo: "/icons/companies/stonegiantstudio.svg",
    technologies: ["graphql", "prisma", "azure"],
    description:
      "Stone Giant Studio is a full stack development partner for Enterprises.",
    link: "https://www.stonegiantstudio.com/",
    externalLink: true,
    quote: {
      text: `We have been using Prisma with SQL Server in production for almost a year. It is almost laughable how easy Prisma makes it to set up a GraphQL or REST API with SQL Server. Autocompletion and type safety work smoothly, making Prisma a delight to work with. When we have run into issues, the community and developers are eager and ready to help. It finally feels like SQL Server is a first-class citizen in the Node.js ecosystem.`,
      author: "Jon Crowell",
      title: "Developer",
      socials: {
        linkedin: "https://www.linkedin.com/in/Jonrcrowell/",
        twitter: "https://twitter.com/jonrcrowell",
      },
    },
  },
  {
    name: "Insta Group",
    id: "insta",
    logo: "/icons/companies/insta.svg",
    technologies: ["ts", "azure", "prisma"],
    description: `Insta Group Oy is a Finnish family business expert in industrial automation, industrial digitalisation, cyber security and defence technologies that helps its customers develop and maintain their performance and profitability.`,
    link: "https://www.insta.fi/en/en/",
    externalLink: true,
    quote: {
      text: `We've been using Prisma with SQL Server on production in multiple projects and have been really happy with it. It fits nicely to our stack with TypeScript and Azure Functions. The support we received from development team during the Preview phase was amazing, our feedback was noted instantly. And the community around Prisma is extremely active!`,
      author: "Valtteri Luoma",
      title: "Senior Software Developer",
      socials: {
        linkedin: "https://www.linkedin.com/in/valtteri-luoma-0207286a/",
      },
    },
  },
  {
    name: "Travis",
    id: "travis",
    logo: "/icons/companies/travis.svg",
    technologies: ["ts", "aws", "prisma", "planetscale", "vue"],
    description: `Travis is building the most collaborative visual trip planner for millennials and Gen Zs`,
    link: "https://www.travistravis.co/",
    externalLink: true,
    quote: {
      text: "Prisma enabled our team to iterate at speed without compromising quality and maintainability. It’s also a crucial part of Prisma-AppSync, an open-source Prisma Generator to create GraphQL APIs, and currently powering our entire platform.",
      author: "Sylvain Simao",
      title: "CTO",
      socials: {
        linkedin: "https://www.linkedin.com/in/sylvainsimao/",
        twitter: "https://twitter.com/_maoosi",
        github: "https://github.com/maoosi",
      },
    },
  },
  {
    name: "Digital Speed",
    id: "digitalspeed",
    logo: "/icons/companies/digitalspeed.png",
    technologies: ["ts", "prisma", "mongodb"],
    description: `Digital Speed is an award-winning digital marketing agency partnering with some of the world's most exciting automotive companies to deliver industry-leading web development, digital marketing, and content production services.`,
    link: "https://www.digitalspeed.co.uk/",
    externalLink: true,
    quote: {
      text: "I have worked with Prisma for over a year now and most recently built the site www.autoauction.co.uk. I absolutely love using it as an ORM tool and will continue to build it into my applications going forward. It has done a great job abstracting away granular details requisite to integrating MongoDB into your application. I think the community is fantastic and full of people willing to help each other out, and I very much look forward to what Prisma 2 brings in terms of MongoDB.",
      author: "Taylor Lindores-Reeves",
      title: "Director",
      socials: {
        linkedin: "https://www.linkedin.com/company/digitalspeed/about/",
      },
    },
  },
  {
    name: "TimeNavi",
    id: "timenavi",
    logo: "/icons/companies/timenavi.svg",
    technologies: ["ts", "prisma", "next", "postgres"],
    description: `TimeNavi helps you to manage your time directly from your calendar, without the fuss of timers or complicated project management tools. Cut out switching between tools and track your time straight from your Google or Outlook Calendar`,
    link: "https://timenavi.com/",
    externalLink: true,
    quote: {
      text: `With over 150,000 users, we love Prisma because it keeps our app running smoothly and allows us to deliver a great customer experience.`,
      author: "Joshua Snyder",
      title: "CTO",
      socials: {
        linkedin: "https://www.linkedin.com/in/joshsny/",
        twitter: "https://twitter.com/joshsny",
      },
    },
  },
  {
    name: "CargOn",
    id: "cargon",
    logo: "/icons/companies/cargon.svg",
    technologies: ["node", "prisma", "react", "azure"],
    description: `CargOn is focused on developing solutions for cargo logistics operations by optimizing time, resources and costs through technology. They are the bridge between people, shippers, carriers and drivers!`,
    link: "https://cargon.com.br/",
    externalLink: true,
    quote: {
      text: `Prisma's versatility and compatibility with auto-generating types has streamlined our workflow and sped up development. The Prisma Schema also provides us granular table and field level access, so our microservices interact with just the data they need. We currently leverage Prisma for 6 microservices and have plans for many more!`,
      author: "Christian Rossetto",
      title: "Product Owner",
      socials: {
        linkedin: "https://www.linkedin.com/company/cargonlogtech/",
      },
    },
  },
  {
    name: "Everify",
    id: "everify",
    logo: "/icons/companies/everify.svg",
    technologies: ["ts", "postgres", "prisma"],
    description: `Secure SMS verification made simple. Just 8 lines of code get you automatic message translation, scalable international SMS routing and a free development sandbox.`,
    link: "https://everify.vercel.app/",
    externalLink: true,
    quote: {
      text: "Prisma gives me type safety across the stack. Combined with Prisma Migrate, I can make changes in my database schema and Typescript will immediately tell me where in my code I need to update my schema",
      author: "Jan Wilhelm",
      title: "Founder",
      socials: {
        linkedin: "https://www.linkedin.com/in/jan-wilhelm/",
        twitter: "https://twitter.com/janbhwilhelm",
      },
    },
  },
  {
    name: "Expand by Monroe Institute",
    id: "expandbymonroe",
    logo: "/icons/companies/expand.png",
    technologies: ["ts", "react", "nest", "prisma", "heroku"],
    description: `The Monroe Institute is the world's leading education center for the study of human consciousness. It uses sound technology to empower your journey of self-discovery. Expand is a meditation app unlike any you've ever experienced — relax, de-stress, improve your sleep, and rediscover feelings of joy that are buried deep inside.`,
    link: "https://info.monroeinstitute.org/get-expand-app",
    externalLink: true,
    quote: {
      text: "I’ve been a dedicated Prisma fan since the day it was released. After decades of MySQL and a few years of Firebase, Prisma became my default solution for all new projects. The ease of spinning up data models, the endless options for deployment, and the production-ready data management tools take weeks off the setup of a new project.",
      author: "Justin Handley",
      title: "Technical Lead",
      socials: {
        linkedin: "https://www.linkedin.com/in/justinhandley/",
        twitter: "https://twitter.com/justinbhandley",
        github: "https://github.com/justinhandley",
      },
    },
    points: [
      {
        title: "Prisma & Monroe Institute",
        description: `We looked at a lot of different potential data setups and ORMs when we were starting the project. While we were tempted by a few other solutions, the tradeoff of time and technical complexity couldn’t justify what little benefits they might offer.`,
      },
      {
        title: "Why choose Prisma",
        description: `
    Prisma makes it easy to define and spin up a prototype in as little as a day.  That is pretty good in and of itself.  The fact that you can then just walk the system all the way to production with minimal additional headache is a real deal sealer.`,
      },
      {
        title: "Deployment",
        description: `
        While we aren’t certain we are on our final home for our database, we currently have GitHub actions handle automatic deployments to Heroku when we merge into our main branch.  It took an hour to set up and hasn’t reached its limits yet.`,
      },
    ],
  },
  {
    name: "WeFindFlats",
    id: "wefindflats",
    logo: "/icons/companies/wefindflats.svg",
    technologies: ["ts", "postgres", "nest", "prisma", "aws"],
    description: `WeFindFlats is a B2B platform for data and tech-enabled flat searches for employees relocating for their job. They do this by flipping the marketplace around which massively reduced time and stress when finding a new home abroad.`,
    link: "https://www.wefindflats.com/",
    externalLink: true,
    quote: {
      text: `At WeFindFlats we had a tight deadline to go live and chose to go with Prisma for the promise of rapid development and type safety, but we got a lot more than that. Our whole team has been very excited by how elegant Prisma client is, as well as the rapid updates and the active community around Prisma`,
      author: "Nima Karimi",
      title: "Co-Founder & CTO",
      socials: {
        linkedin: "https://www.linkedin.com/in/kkarimi/",
        github: "https://github.com/kkarimi",
      },
    },
    points: [
      {
        title: "Prisma & WeFindFlats",
        description: `
        WeFindFlats strives to use the latest, bleeding edge technologies to give their clients and partners a seamless experience when using their services, while also continuing to quickly evolve their offering.`,
      },
      {
        title: "Why choose Prisma",
        description: `Prisma is an ideal fit because it combines a seamless developer experience and business benefits. It allows WeFindFlats to iterate very quickly and make immediate changes to their database to adapt to the market needs and to their clients' feedback - which is crucial for a young startup.

        Likewise, changes to production are validated very easily "I've never seen migrations done so easily in other ORMs, we thought live changes would be fraught with complications but with Prisma it was very straightforward. By using Prisma we get all the benefits of using a NoSQL database, but with the best practices of a SQL database".`,
      },
      {
        title: "Looking at the future",
        description: `

        WeFindFlats is looking forward to expanding their services to more cities and further increase the sophistication of their offering. In particular, they are looking forward to upcoming Prisma features such as connection pooling management, caching management, etc. to help scale their business. `,
      },
    ],
  },
  {
    name: "NachoNacho",
    id: "nachonacho",
    logo: "/icons/companies/nachonacho.svg",
    technologies: ["next", "apollo", "mysql", "prisma", "graphql"],
    description: `NachoNacho offers businesses and individuals the ability to consolidate and manage all their subscriptions (software, content, education, etc.) in one account. For example, businesses can keep track of which subscriptions they have across the whole company, and allocate spending budgets per employee and per subscription. `,
    link: "https://nachonacho.com/",
    externalLink: true,
    quote: {
      text: `Working with Prisma is so beautiful and magic! For us it’s a React level improvement for back-end`,
      author: "Alan Szternberg",
      title: "CTO/Co-founder",
      socials: {
        linkedin: "https://www.linkedin.com/in/alanszternberg/",
        twitter: "https://twitter.com/AlanSten",
        github: "https://github.com/alan345",
      },
    },
    points: [
      {
        title: "Prisma & NachoNacho",
        description: `Prisma helps us to work better as a team. We are guided by the TypeSafe ORM. We make fewer errors and and are much more efficient. `,
      },
      {
        title: "Why choose Prisma",
        description: `As a high growth tech startup, we wanted to find the best & more modern ORM to grow with us. We are not disappointed!`,
      },
      {
        title: "More about NachoNacho",
        description: `NachoNacho is a fintech enabled B2B SaaS marketplace.<br/>
        - For Businesses - <a href="https://nachonacho.com/buyer" style="text-decoration: underline">https://nachonacho.com/buyer</a>: <br/><br/>1) Consolidate all SaaS spend in 1 account. Create a separate virtual credit card for each subscription vendor, with tight limits. Businesses are saving 30% of SaaS spend. <br/>2) Get massive discounts on scores of SaaS products.<br/><br/>
        - For SaaS vendors <a href="https://nachonacho.com/buyer" style="text-decoration: underline">https://nachonacho.com/seller</a>: <br/>A new user acquisition channel. Listing is free, and no integration is required.`,
      },
    ],
  },
  {
    name: "Sequin",
    id: "sequin",
    logo: "/icons/companies/sequin.svg",
    technologies: ["elixir", "next", "postgres", "prisma", "redis"],
    description: `Sequin replicates third-party APIs to Postgres databases in real-time. With a Sequin-powered database, you can query all your data from services like Airtable and Stripe natively using Prisma.`,
    link: "https://www.sequin.io/",
    externalLink: true,
    quote: {
      text: `Imagine being able to query for any data point, from any API, all through Prisma.`,
      author: "Anthony Accomazzo",
      title: "Co-founder",
      socials: {
        linkedin: "https://www.linkedin.com/in/anthonyaccomazzo/",
        twitter: "https://twitter.com/accomazzo",
        github: "https://github.com/acco",
      },
    },
    points: [
      {
        title: "Prisma & Sequin",
        description: `Sequin replicates third-party APIs to Postgres databases in real-time. This means all your Stripe subscribers or Shopify orders sit right alongside your production data. And you can query it all using Prisma's type-safe query syntax.`,
      },
      {
        title: "Why choose Prisma",
        description: `Prisma makes building on your Sequin database easy. With type-safety, type-ahead, an ergonomic query builder, and team features, Prisma allows you to ship features on top of your third-party data faster than ever.`,
      },
      {
        title: "What next for Sequin",
        description: `Sequin is working to sync more APIs in real-time, so you never need to leave your database — or Prisma. They just added support for Stripe, with more on the way soon.

        🏗️ To get started with Sequin and Stripe, Prisma customers can add a billing portal to their app using this “plug-and-play” feature: <a href="https://github.com/syncinc-so/stripe-billing-prisma" style="text-decoration: underline">https://github.com/syncinc-so/stripe-billing-prisma</a>`,
      },
    ],
  },
  {
    name: "Superblog",
    id: "superblog",
    logo: "/icons/companies/superblog.svg",
    technologies: ["elderjs", "next", "netlify", "prisma", "jamstack"],
    description: `Superblog is a blazing fast alternative to WordPress and medium blogs. Superblog takes care of everything: optimizing your blog for speed, consistent performance, SEO, high-quality hosting, and design to rank better in search results.`,
    link: "https://superblog.ai/",
    externalLink: true,
    quote: {
      text: `Prisma makes managing the data layer of an entire blogging platform so simple that even a solo developer like me can ship new features rapidly. Add that to their fantastic community and ecosystem, switching to Prisma is easily one of the best decisions I made in 2020. `,
      author: "Sai Krishna",
      title: "Chief Super Officer",
      socials: {
        linkedin: "https://www.linkedin.com/in/s-kris/",
        twitter: "https://twitter.com/_skris",
        github: "https://github.com/s-kris",
      },
    },
    points: [
      {
        title: "Prisma & Superblog",
        description: `After exploring several solutions since 2019 for different products, Prisma was chosen when Superblog was started in the September of 2020. Prisma reduced a lot of complexity for Superblog's data schema/query. Prisma is used in all products - both consumer-facing and internal tools.`,
      },
      {
        title: "Why choose Prisma",
        description: `Working on a SQL database becomes a breeze with Prisma. We can just define the Schema and types are auto-generated. A super complex SQL query can be written in under a minute.  Handling migrations is an absolute delight. Most of all, the typed nature of Prisma reduces the mental overhead of carrying the data schema (comes along with TypeScript). As the heavy lifting is done by Prisma, time to ship is reduced drastically. The community support of Prisma is just lovely.`,
      },
      {
        title: "Looking at the future",
        description: `Superblog looks to improve the developer experience (which will lead to faster feature shipping) by looking at esbuild/vite. In addition to the auto-optimzation of Technical SEO and on-page SEO, Superblog is looking to implement Content-Level optimizations and topic research via AI. As a wise man once said, "Every company is going to be a content company in the future".`,
      },
    ],
  },
  {
    name: "Ecstatic",
    id: "ecstatic",
    logo: "/icons/companies/ecstatic.svg",
    technologies: ["js", "postgres", "next", "prisma", "vercel"],
    description: `Ecstatic is an invitation-based events platform that rewards people for growing event audiences.`,
    link: "https://ecstatic.com",
    externalLink: true,
    quote: {
      text: `For most startups, resources are stretched thin; this demands us to only focus on the essentials — the things that will make the greatest impact for our end-users. Both Prisma Client and Prisma Migrate are phenomenal tools that let us interface with our database in ways that boost our developer productivity by at least 10x compared to other tools or manual SQL queries.`,
      author: "Martin Adams",
      title: "Co-founder",
      socials: {
        linkedin: "https://www.linkedin.com/in/heymartinadams/",
        twitter: "https://twitter.com/heyMartinAdams",
        github: "https://github.com/heymartinadams",
      },
    },
    points: [
      {
        title: "Prisma & Ecstatic",
        description: `Developing good software is hard. Prisma does the database heavy lifting and lets us focus on creating a great user experience.`,
      },
      {
        title: "Why choose Prisma",
        description: `Prisma makes accessing our database both safe and easy.`,
      },
      {
        title: "Looking at the future",
        description: `We believe that in the near future apps will distinguish themselves by their speed: any app that saves the customer time, even a few hundred milliseconds, will become increasingly valued by their users. So it’s only natural that we put together a tech stack where “time is of the essence” — that tech stack includes Prisma (ORM), Next.js (framework), Vercel (hosting), and PlanetScale (database).`,
      },
    ],
  },
  {
    name: "IHI Terrasun Solutions",
    id: "ihi",
    logo: "/icons/companies/ihi.svg",
    technologies: ["docker", "kubernetes", "helm", "prisma", "postgres"],
    description: `IHI Terrasun Solutions is a solar plus storage lifecycle services provider. Terrasun provides solar + storage system integration based on advanced software and hardware capabilities. The company provides services throughout the life of the project, for example, augmentation, smart monitoring & alarming, remote software upgrades, and more.`,
    link: "https://www.ihiterrasun.com/",
    externalLink: true,
    quote: {
      text: `I love how streamlined Prisma allows me to be with creating new full-stack applications. Having a single source of truth for all my data models makes it easier to make changes with new business requirements and have confidence that definitions will propagate across my application.`,
      author: "Stephen Jensen",
      title: "Senior Fullstack Developer / Cloud Architect",
      socials: {
        linkedin: "https://www.linkedin.com/in/stephen-jensen-7018b917/",
        twitter: "https://twitter.com/DrStephenJensen",
        github: "https://github.com/CaptainChemist",
      },
    },
    points: [
      {
        title: "Prisma & IHI Energy Storage",
        description: `IHI Terrasun Solutions (Terrasun) is a solar + storage lifecycle services provider that works with customers to design the ideal system to fit their needs. Terrasun supports customers from project design through implementation, commissioning, deployment, and for the life of the system. Once the project is commissioned, we continue to help our customers succeed by offering them software that makes it easy to operate their battery storage system, understand its current status, and easily identify problems that need to be addressed. We rely on Prisma as the source of truth for our schema in our scheduling application and these definitions propagate from the website users interact with on the frontend all the way to the database on the backend.`,
      },
      {
        title: "Why choose Prisma",
        description: `We have installations that power the equivalent of thousands of homes in the US, so it is critical that our software is reliable both for the end uses and for equipment operators’ safety. When we designed new scheduling software in 2018, we had previously built GraphQL and React based apps with great success using Mongoose, but we were on a tight deadline. We utilized Prisma 1 to build the app rather than Mongoose and found that Prisma took care of all the boilerplate generation we previously had to do with Mongoose models, while also reducing our code base size by about 30%. We found further benefits when we migrated more recently to Prisma 2.`,
      },
      {
        title: "Deployment details",
        description: `We deploy Prisma 2 using Docker in a Kubernetes environment. Rancher is a Kubernetes management platform that makes it very easy to set up the cluster and once it is set up, we deploy the Prisma installation using Docker containers to the cluster using Helm charts deployed via Jenkins.`,
      },
    ],
  },
  {
    name: "Jelly",
    id: "jelly",
    logo: "/icons/companies/jelly.svg",
    technologies: ["nexus", "apollo", "aws", "prisma", "postgres"],
    description: `Jelly is the starting point to a more profitable and transparent kitchen, creating a nicer workplace environment. Jelly works with the best chefs and hottest restaurants in the independent foodservice market to create a centralised, all-in-one app. Jelly is already loved by thousands of chefs from Michelin-starred restaurants to school canteens and catering companies, in the UK and the US.`,
    link: "https://www.getjelly.co.uk/",
    externalLink: true,
    quote: {
      text: `Prisma has fantastic developer ergonomics, providing type safety for your database models and queries. This allows for rapid and stable development that scales across your whole team. Adopting Prisma allows us to rapidly implement features with little worry of instability which is crucial for a business at the stage we are.`,
      author: "Dominic Hadfield",
      title: "Tech Lead",
      socials: {
        linkedin: "https://www.linkedin.com/in/dominichadfield/",
        twitter: "https://twitter.com/DomHadfield",
        github: "https://github.com/domhadfield",
      },
    },
    points: [
      {
        title: "Prisma & Jelly",
        description: `Jelly was rebuilt from scratch to leverage best practices in architecture and data access. From using MongoDB, the team shifted to using PostgreSQL and Prisma. The results from the closed B2B sign up have proven that this was the right strategy as it provided their users with a better experience.
        This approach to technology matches Jelly's philosophy of being the change they want to see.`,
      },
      {
        title: "Why choose Prisma",
        description: `I would recommend Prisma to:

        - People who are unfamiliar with relational databases and wish to begin learning. It provides an easy pathway into learning how to write and optimise queries.
        - Applications where a large amount of the queries will be simple crud queries, it is very quick to write the queries in Prisma and the type safety means migrations to the data structure will not allow you to deploy broken queries.

        For more intensive queries, there is the flexibility to "pop the hood" and write raw sql and database functions to do some heavy lifting.`,
      },
      {
        title: "Looking at the future",
        description: `As Prisma matures and adds additional features, we will progressively refactor more of our application's logic from the database level into the application code. This will increase productivity, developer ergonomics and safety as we will no longer be relying on complex stored procedures that can only be tested through expensive integrations tests and are not strictly bound to the application's codebase.

        While the company grows, it will become easier to onboard newer developers and reduce the amount of time taken for them to maximise their value to the company. I am excited to see what third party generators can be written to allow rich documentation, database diagrams and more to be generated, all from a single source of truth.`,
      },
    ],
  },
  {
    name: "Stellate",
    id: "Stellate",
    logo: "/icons/companies/stellate.svg",
    technologies: ["next", "ts", "graphql", "prisma", "postgres"],
    description: `The GraphQL CDN with edge caching, analytics and security protection. Stellate allows you to reduce your origin traffic by up to 95% with their GraphQL edge cache and never worry about scaling again.`,
    link: "https://stellate.co/",
    externalLink: true,
    quote: {
      text: `Prisma is the best ORM I have ever used, I never want to use anything else again. The excellent developer experience with it's incredible TypeScript support sold me at first, and then the Prisma team just keeps improving it — now it even handles migrations better than any other system I've ever seen!`,
      author: "Max Stoiber",
      title: "Founder",
      socials: {
        linkedin: "https://www.linkedin.com/in/mxstbr",
        twitter: "https://www.twitter.com/mxstbr",
        github: "https://www.github.com/mxstbr",
      },
    },
    points: [
      {
        title: "Prisma & Stellate",
        description: `When we first started building Stellate (formerly GraphCDN) and thought about which ORM to use, Prisma really was the only choice for us. We've been using it exclusively for years, and even after looking around at other potential options none of them come close to the excellence of Prisma.`,
      },
      {
        title: "Why choose Prisma",
        description: `The main reason we love Prisma is it's beautiful API and excellent TypeScript support. Every name is exactly what it should be, every property is exactly where it should be, the whole thing just works. It was obviously very carefully designed and is intuitive all the way through.

        The fact that the team just keeps making it better and making our lives easier (see: migrations) means we really don't see a reason to use anything else.`,
      },
      {
        title: "Looking at the future / Deployment details",
        description: `Since our API runs fully serverless, we're really excited about the upcoming data proxy for serverless which will finally get rid of the classic db connection problems with serverless deployment.`,
      },
    ],
  },
  {
    name: "Prevalentware",
    id: "prevalentware",
    logo: "/icons/companies/prevalentware.png",
    technologies: ["next", "python", "graphql", "prisma", "postgres"],
    description: `PrevalentWare is dedicated to consulting and developing solutions based on RPA and web technologies. PrevalentWare aims to create fast, reliable, and robust solutions for aiding the digital transformation processes of their customers.`,
    link: "https://www.prevalentware.com/",
    externalLink: true,
    quote: {
      text: `We have been using Prisma since November 2020, and we think we'll never be back to other ORMs. The simplicity of the client and the reliability of the migrations make you wonder why didn't you find Prisma before. With Prisma, you can really forget difficult set-ups, difficult maintenance, difficult development and database conflicts. Everything is made just simple and plug & play.`,
      author: "Daniel Saldarriaga López",
      title: " Development Director",
      socials: {
        linkedin: "https://www.linkedin.com/in/danielsaldarriaga117/",
        twitter: "https://www.twitter.com/DanielSalda117",
        github: "https://github.com/danyel117",
      },
    },
    points: [
      {
        title: "Prisma & Prevalentware",
        description: `We started using Prisma in February 2021. So far, we have successfully implemented Prisma in 8 different projects, and we'll keep using this fantastic technology for as long as we can.

        Prisma and Next.js, have shown to increase our development times by about 60% in comparison to our older stack (React + Django-REST).

        We have developed projects for many kinds of customers. We have successfully implemented Prisma in industries like agriculture, human resources, finance, tourism and solar energy. In all such different industries, Prisma has helped us to model virtually any kind of business.`,
      },
      {
        title: "Why choose Prisma",
        description: `Prisma can indeed improve development time and can aid small teams to develop faster.

        Prisma should be chosen without a doubt. It is a fantastic technology, because of its simplicity combined with its agility. It is an ORM that is currently positively improving, with new features almost every week.

        Additionally, Prisma has a great community. When in doubt, it is easy to look for answers both in GitHub and StackOverflow. If the question is unique, you can obtain answers from experts within hours.`,
      },
      {
        title: "Looking at the future",
        description: `Next.js will continue to offer features that blur the line between front-end and back-end development. However, there will still be a significant differentiation between the two unless development teams start using tools like Prisma. Prisma is the perfect complement to a framework like Next.js because development teams will only have to maintain one project at a time. For 90% of small to medium-sized applications, we will continue to use Prisma along with Next.js and GraphQL because the automatic resolver generation allows us to have a backend ready to go just by writing the Prisma schema, which ultimately will enable us to focus on delivering strong, robust, beautiful and straightforward front-ends.`,
      },
    ],
  },
  {
    name: "Krisenchat",
    id: "Krisenchat",
    logo: "/icons/companies/krisenchat.png",
    technologies: ["ts", "graphql", "prisma", "postgres"],
    description: `Krisenchat is a chat platform of highly trained and experienced specialists to support young people in need. These specialists advise young people on their concerns and problems: at any time, free of charge and confidentially.`,
    link: "https://krisenchat.de/en",
    externalLink: true,
    quote: {
      text: "If you are using TypeScript, then Prisma feels quite like home.",
      author: "Mario Duhanic",
      title: "CTO",
      socials: {
        linkedin: "https://www.linkedin.com/in/mario-duhanic/",
      },
    },
  },
];

const showcaseData = {
  stories,
  communityProjects,
};
export default showcaseData;
