// The single source for everything on /customers.
//
// Ported from apps/site (the live prisma.io source) so the redesign can't drift
// from the real showcase: `stories` and `communityProjects` come out of
// apps/site/src/data/showcase.ts, the band comes out of
// components/logo-parade.tsx. Logo files were copied into
// /public/logos/customers, preferring each company's `_light` variant — on
// prisma.io the bare filename is the dark-mode mark and `_light` is the
// light-mode one, and this site is light-only.
//
// Deliberately one module rather than three. testimonials-reveal.tsx,
// testimonials-strip.tsx and logo-cloud.tsx each keep their own private copy of
// the same customer list and have already drifted apart; every surface on this
// page reads from here instead.
//
// prisma.io has no standalone mark for several of these stories — its cards use
// pre-baked dark "X | Prisma" lockups (/photos/showcase/stories/*), which are
// unusable on a light card and are what the card-image template replaces.
// André supplied white-on-transparent marks for all of them on 2026-08-17
// (Reflag, Amplication, Formbricks, iopool, plus Poppy and Tryg replacing red
// knockout boxes). **All 13 stories now carry a real logo**; the text-wordmark
// fallback on `logo` is unused but kept for whatever gets added next.
//
// Bucket now trades as Reflag, and the mark supplied is the Reflag one, so the
// card art reads "Prisma | Reflag" while the story title beside it still says
// "How Bucket Uses Prisma ORM…" — that is the real title of the linked post.
// Unresolved: rename the story, or keep the Bucket-era wording.

export type CustomerStory = {
  slug: string;
  name: string;
  title: string;
  excerpt: string;
  /** Technologies the customer runs alongside Prisma; rendered as Marker chips. */
  stack: string[];
  /** The story itself — a prisma.io blog post until /customers/[slug] exists. */
  href: string;
  /**
   * File in /public/logos/customers. Omit to render a text wordmark instead.
   *
   * Only ever rendered on the black story art, so a white-on-transparent mark
   * is fine here — unlike BAND_LOGOS and COMMUNITY_LOGOS, which sit on white
   * tiles. Where a company appears in both (Poppy), they are deliberately two
   * different files: overwriting the shared one puts a white mark on a white
   * tile in the hero band.
   */
  logo?: string;
  /**
   * Skip the whitening filter on the black story art (story-art.tsx).
   *
   * Default (omitted) flattens the mark to pure white with `brightness-0
   * invert`, which is right for the dark-ink-on-transparent marks. Set `asis`
   * where that filter would destroy the logo, for either reason:
   *
   *  - the mark is ALREADY white — Reflag, Amplication, Formbricks, Poppy,
   *    Tryg, Solin. Inverting white gives black, i.e. invisible on the plate;
   *  - the mark is a knockout, white type inside a solid colour block, where
   *    whitening fills the block too and leaves a featureless slab. Nothing is
   *    in this state now (Tryg and Solin both were, and both have since been
   *    replaced with proper white marks), but it is why the escape hatch exists.
   *
   * Verified per logo by rendering both ways on black.
   */
  onDark?: "asis";
  /**
   * Optical size correction on the story art. Every mark is capped to a common
   * max-height, which matches them physically but not optically: a heavy
   * blocked wordmark (Poppy) reads far larger than a light one at the same
   * height. Same idea as `fit` on logo-cloud's Logo type.
   */
  markFit?: "sm" | "lg";
};

export type CustomerLogo = {
  name: string;
  src: string;
  /** Omitted where prisma.io has no link for the company (Insta Group). */
  href?: string;
};

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    slug: "reflag",
    name: "Bucket",
    title: "How Bucket Uses Prisma ORM to Make Shipping Feature Releases Faster",
    excerpt:
      "Discover how Bucket, a fast-growing feature management platform, uses Prisma ORM to simplify complex relational queries and accelerate feature releases. Learn how their lean team delivers high-quality features faster while managing evolving database needs with ease.",
    stack: ["prisma"],
    href: "https://prisma.io/blog/how-bucket-uses-prisma-orm",
    logo: "/logos/customers/reflag-white.png",
    onDark: "asis",
  },
  {
    slug: "amplication",
    name: "Amplication",
    title: "How Prisma helps Amplication evolutionize backend development",
    excerpt:
      "Amplication is an open-source development tool. It helps you develop quality Node.js applications without spending time on repetitive coding tasks. It’s perfect for both backend and fullstack developers.",
    stack: ["nest", "postgres", "prisma", "graphql", "docker"],
    href: "https://prisma.io/blog/amplication-customer-story-nmlkBNlLlxnN",
    logo: "/logos/customers/amplication-white.png",
    onDark: "asis",
  },
  {
    slug: "formbricks",
    name: "Formbricks",
    title: "Formbricks and Prisma Accelerate: Solving scalability together",
    excerpt:
      "Formbricks, an open-source survey platform, effectively tackled scalability challenges with Prisma Accelerate and strategically integrated it to manage growing user demands and maintain high performance.",
    stack: [],
    href: "https://prisma.io/blog/formbricks-and-prisma-accelerate-solving-scalability-together",
    logo: "/logos/customers/formbricks-white.png",
    onDark: "asis",
  },
  {
    slug: "solin",
    name: "Solin",
    title: "How Solin uses Accelerate to serve 2.5M database queries per day",
    excerpt:
      "Learn how Prisma Accelerate has contributed to Solin's success by enhancing performance and reliability with its scalable connection pool and global database cache.",
    stack: [],
    href: "https://prisma.io/blog/how-solin-uses-prisma-accelerate-to-serve-2-5m-database-queries-per",
    logo: "/logos/customers/solin-white.png",
    onDark: "asis",
  },
  {
    slug: "elsevier",
    name: "Elsevier",
    title:
      "How Elsevier piloted an innovative publication process quickly and flexibly with Prisma",
    excerpt:
      "Elsevier is a global leader in information and analytics in scientific publishing and helps researchers and healthcare professionals. With the help of Prisma, Elsevier is in the process of modernizing the scientific publishing process efficiently and with flexibility.",
    stack: ["graphql", "ts", "prisma", "aws", "nexus"],
    href: "https://prisma.io/blog/elsevier-customer-story-SsAASKagMHtN",
    logo: "/logos/customers/elsevier.svg",
  },
  {
    slug: "tryg",
    name: "Tryg",
    title: "How Tryg has leveraged Prisma to democratize data",
    excerpt:
      "Tryg saved huge amounts of time thanks to its “360” Data Broker platform that accelerated development cycles by removing the overhead incurred by configuring environments manually. Prisma was the critical technology that enabled them to democratize billions of records from different data sources.",
    stack: ["kafka", "cockroach", "graphql", "kubernetes", "prisma"],
    href: "https://prisma.io/blog/tryg-customer-story-pdmdrRhTupvd",
    logo: "/logos/customers/tryg-white.svg",
    onDark: "asis",
  },
  {
    slug: "panther",
    name: "Panther",
    title: "How Panther champions talent over geography with Prisma",
    excerpt:
      "Panther leverages Prisma and a cutting edge tech stack to power a domain-driven architecture. This allows Panther to ensure that its customers can automate global payroll and compliance for their remote teams with one click.",
    stack: ["mysql", "mongodb", "graphql", "react", "prisma"],
    href: "https://prisma.io/blog/panther-customer-story-pdmdrrhtupsl",
    logo: "/logos/customers/panther.svg",
  },
  {
    slug: "rapha",
    name: "Rapha",
    title: "How Prisma helps Rapha manage their mobile application data",
    excerpt:
      "Rapha is a company dedicated to redefining comfort, performance, and style for cyclists around the world, whether beginners or World Tour professionals. Learn how Prisma helps Rapha build consistent data APIs across various teams and platforms.",
    stack: ["postgres", "prisma", "nexus", "apollo", "cloudflare"],
    href: "https://prisma.io/blog/helping-rapha-access-data-across-platforms-n3jfhtyu6rgn",
    logo: "/logos/customers/rapha.svg",
  },
  {
    slug: "grover",
    name: "Grover",
    title: "How Grover moves faster with Prisma",
    excerpt:
      "Grover offers monthly tech product subscriptions and splits work on its services across many teams. Some teams have recently found huge productivity gains by adopting Prisma. Read on to find out how Prisma has benefited Grover and how you can benefit as well.",
    stack: ["postgres", "nest", "prisma", "nexus", "apollo"],
    href: "https://prisma.io/blog/grover-customer-success-story-nxkWGcGNuvFd",
    logo: "/logos/customers/grover.svg",
  },
  {
    slug: "invisible",
    name: "Invisible",
    title: "How migrating from Sequelize to Prisma allowed Invisible to scale",
    excerpt:
      "Invisible is a B2B productivity startup that allows its users to automate and outsource any complex workflow or business process through Worksharing. Prisma played a crucial role in allowing Invisible to future proof their tech stack and in supporting its scale.",
    stack: ["next", "trpc", "prisma", "vercel", "postgres"],
    href: "https://prisma.io/blog/how-migrating-from-Sequelize-to-Prisma-allowed-Invisible-to-scale-i4pz2mwu6q",
    logo: "/logos/customers/invisible.svg",
  },
  {
    slug: "pearly",
    name: "Pearly",
    title: "How Prisma allowed Pearly to scale quickly with an ultra-lean team",
    excerpt:
      "Pearly provides a platform for dentists to create better and reliable revenue streams and affordable care plans for their patients. Learn how Prisma has helped them scale quickly with an ultra-lean team.",
    stack: ["apollo", "nexus", "prisma", "gcp", "postgres"],
    href: "https://prisma.io/blog/pearly-plan-customer-success-pdmdrRhTupve",
    logo: "/logos/customers/pearly.png",
  },
  {
    slug: "poppy",
    name: "Poppy",
    title: "How Poppy uses Prisma Client to ship confidently",
    excerpt:
      "Poppy offers rides of all kinds through its mobile app. Whether its a car, scooter, or e-step, Poppy has it. Prisma plays a vital role in helping Poppy ship quickly and confidently and is a big reason they ve just hit 1.5 million total rides taken.",
    stack: ["node", "postgres", "prisma", "redis", "gcp"],
    href: "https://prisma.io/blog/poppy-customer-success-story-swnWQcGRRvpd",
    logo: "/logos/customers/poppy-white.png",
    onDark: "asis",
    markFit: "sm",
  },
  {
    slug: "iopool",
    name: "iopool",
    title: "How iopool refactored their app in less than 6 months with Prisma",
    excerpt:
      "In 2020, iopool realized that their architecture was slowing them down and preventing them from innovating. They decided to switch to Lambda functions and a PostgreSQL database powered by Prisma. Learn how this has helped them move fast with confidence and has greatly simplified their process.",
    stack: ["cognito", "postgres", "aws", "prisma", "nexus"],
    href: "https://prisma.io/blog/iopool-customer-success-story-uLsCWvaqzXoa",
    logo: "/logos/customers/iopool-white.png",
    onDark: "asis",
  },
];

export const BAND_LOGOS: CustomerLogo[] = [
  {
    name: "Rapha",
    src: "/logos/customers/rapha.svg",
    href: "https://www.rapha.cc/",
  },
  {
    name: "Poppy",
    src: "/logos/customers/poppy.svg",
    href: "https://poppy.be/",
  },
  {
    name: "Panther",
    src: "/logos/customers/panther.svg",
    href: "https://www.panther.co/",
  },
  {
    name: "Grover",
    src: "/logos/customers/grover.svg",
    href: "https://www.grover.com/",
  },
  {
    name: "Invisible",
    src: "/logos/customers/invisible.svg",
    href: "https://inv.tech/",
  },
  {
    name: "Elsevier",
    src: "/logos/customers/elsevier.svg",
    href: "https://www.elsevier.com/",
  },
  {
    name: "Tryg",
    src: "/logos/customers/tryg.svg",
    href: "https://www.tryg.com/",
  },
  {
    name: "IHI",
    src: "/logos/customers/ihi.svg",
    href: "https://www.ihiterrasun.com/",
  },
  {
    name: "Insta",
    src: "/logos/customers/insta.svg",
  },
  {
    name: "Outrider",
    src: "/logos/customers/outrider.svg",
    href: "https://outrider.org/",
  },
  {
    name: "Oxio",
    src: "/logos/customers/oxio.svg",
    href: "https://oxio.com/",
  },
  {
    name: "Southpole",
    src: "/logos/customers/southpole.svg",
    href: "https://www.southpole.com/",
  },
];

export const COMMUNITY_LOGOS: CustomerLogo[] = [
  {
    name: "South Pole",
    src: "/logos/customers/southpole.svg",
    href: "https://southpole.com/",
  },
  {
    name: "Garages near me",
    src: "/logos/customers/garages-near-me.svg",
    href: "https://garages-near-me.com",
  },
  {
    name: "Wasp",
    src: "/logos/customers/wasp.svg",
    href: "https://wasp.sh/",
  },
  {
    name: "Sunhat",
    src: "/logos/customers/sunhat.svg",
    href: "https://www.getsunhat.com/",
  },
  {
    name: "CoinRotator",
    src: "/logos/customers/coinrotator.png",
    href: "https://coinrotator.app/",
  },
  {
    name: "Gamma",
    src: "/logos/customers/gamma.svg",
    href: "https://gamma.app/",
  },
  {
    name: "Flux",
    src: "/logos/customers/flux.svg",
    href: "https://driveflux.com/",
  },
  {
    name: "Nuna",
    src: "/logos/customers/nuna.png",
    href: "https://www.nuna.ai/",
  },
  {
    name: "prosperity",
    src: "/logos/customers/prosperity.svg",
    href: "https://prosperity.app/en",
  },
  {
    name: "Flycode",
    src: "/logos/customers/flycode.svg",
    href: "https://www.flycode.com/",
  },
  {
    name: "wingfield",
    src: "/logos/customers/wingfield.svg",
    href: "https://www.wingfield.io/en",
  },
  {
    name: "trunk",
    src: "/logos/customers/trunk.svg",
    href: "https://trunk.io/",
  },
  {
    name: "apideck",
    src: "/logos/customers/apideck.svg",
    href: "https://www.apideck.com/",
  },
  {
    name: "Dotworld Technologies",
    src: "/logos/customers/dotworld.webp",
    href: "https://www.dotworld.in/",
  },
  {
    name: "Cal.com",
    src: "/logos/customers/cal.svg",
    href: "https://cal.com/",
  },
  {
    name: "Tabya",
    src: "/logos/customers/tabya.svg",
    href: "https://tabya.de",
  },
  {
    name: "Caribou",
    src: "/logos/customers/caribou.png",
    href: "https://caribouwealth.notion.site/Careers-at-Caribou-357783b6007f4d15bae8c7b9651cebf5",
  },
  {
    name: "Revere",
    src: "/logos/customers/revere.svg",
    href: "https://reverecre.com/",
  },
  {
    name: "Escape",
    src: "/logos/customers/escape.svg",
    href: "https://escape.tech/",
  },
  {
    name: "Questmate",
    src: "/logos/customers/questmate.png",
    href: "https://www.questmate.com/",
  },
  {
    name: "Memberstack",
    src: "/logos/customers/memberstack.svg",
    href: "https://www.memberstack.com/",
  },
  {
    name: "Peace Mass Transit",
    src: "/logos/customers/pmt.svg",
    href: "https://www.pmt.ng/",
  },
  {
    name: "AGVOLUTION",
    src: "/logos/customers/agvolution.svg",
    href: "https://agvolution.com/",
  },
  {
    name: "Avenue",
    src: "/logos/customers/avenue.svg",
    href: "https://avenue.app/",
  },
  {
    name: "instatus",
    src: "/logos/customers/instatus.png",
    href: "https://instatus.com/",
  },
  {
    name: "oxio",
    src: "/logos/customers/oxio.svg",
    href: "https://oxio.ca/en",
  },
  {
    name: "Feather",
    src: "/logos/customers/feather.svg",
    href: "https://feather-insurance.com/",
  },
  {
    name: "Motionbox",
    src: "/logos/customers/motionbox.svg",
    href: "https://motionbox.io/",
  },
  {
    name: "Antstack",
    src: "/logos/customers/antstack.svg",
    href: "https://www.antstack.com/",
  },
  {
    name: "Stone Giant Studio",
    src: "/logos/customers/stonegiantstudio.svg",
    href: "https://www.stonegiantstudio.com/",
  },
  {
    name: "Insta Group",
    src: "/logos/customers/insta.svg",
    href: "https://www.insta.fi/en/",
  },
  {
    name: "Digital Speed",
    src: "/logos/customers/digitalspeed.svg",
    href: "https://www.digitalspeed.co.uk/",
  },
  {
    name: "TimeNavi",
    src: "/logos/customers/timenavi.svg",
    href: "https://timenavi.com/",
  },
  {
    name: "CargOn",
    src: "/logos/customers/cargon.svg",
    href: "https://cargon.com.br/",
  },
  {
    name: "Everify",
    src: "/logos/customers/everify.svg",
    href: "https://everify.vercel.app/",
  },
  {
    name: "Expand by Monroe Institute",
    src: "/logos/customers/expandbymonroe.svg",
    href: "https://info.monroeinstitute.org/get-expand-app",
  },
  {
    name: "WeFindFlats",
    src: "/logos/customers/wefindflats.png",
    href: "https://www.wefindflats.com/",
  },
  {
    name: "NachoNacho",
    src: "/logos/customers/nachonacho.svg",
    href: "https://nachonacho.com/",
  },
  {
    name: "Superblog",
    src: "/logos/customers/superblog.png",
    href: "https://superblog.ai/",
  },
  {
    name: "IHI Terrasun Solutions",
    src: "/logos/customers/ihi.svg",
    href: "https://www.ihiterrasun.com/",
  },
  {
    name: "Jelly",
    src: "/logos/customers/jelly.png",
    href: "https://www.getjelly.co.uk/",
  },
  {
    name: "Stellate",
    src: "/logos/customers/stellate.svg",
    href: "https://stellate.co/",
  },
  {
    name: "Prevalentware",
    src: "/logos/customers/prevalentware.png",
    href: "https://www.prevalentware.com/",
  },
  {
    name: "Krisenchat",
    src: "/logos/customers/krisenchat.svg",
    href: "https://krisenchat.de/en",
  },
];
