import { toAuthorSlug } from "./authors";

/**
 * A social profile link. `platform` selects the icon and accessible label;
 * `url` is the destination.
 */
export type AuthorSocial = {
  platform: "x" | "linkedin" | "github" | "mastodon";
  url: string;
};

/**
 * An E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * author profile. Source of truth is the "E-E-A-T: Author Biographies" table
 * maintained by the team; each entry is copied here so the blog can render
 * bios and social links, and emit richer author structured data.
 */
export type AuthorBio = {
  /**
   * Every display-name variant that maps to this author. Blog posts reference
   * authors by the name in their frontmatter, and those names are not always
   * identical to the canonical bio name (e.g. "Will Madden" vs "William
   * Madden"). Listing all variants here keeps the slug lookup robust.
   */
  names: string[];
  bio: string;
  socials: AuthorSocial[];
};

const AUTHOR_BIOS: AuthorBio[] = [
  {
    names: ["Ankur Datta"],
    bio: "Ankur is a member of the Prisma team who works closely with the developer community, with hundreds of contributions across Prisma's open source repositories and a background that includes founding an ed-tech startup. He writes about TypeScript, Node.js, PostgreSQL, and modern application stacks.",
    socials: [
      { platform: "x", url: "https://x.com/ankur_datta_007" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/ankuratta/" },
      { platform: "github", url: "https://github.com/ankur-arch" },
    ],
  },
  {
    names: ["Alexey Orlenko"],
    bio: "Oleksii is a senior engineer at Prisma and a former Node.js core collaborator, with more than a decade of experience across the JavaScript, TypeScript and Rust ecosystems. Based in Berlin, he works on the client and CLI tooling that connects applications to their databases, as well as on application hosting. He writes about type safety, ORM design, and microVMs.",
    socials: [
      { platform: "x", url: "https://x.com/aqrln" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/oleksiiorlenko/" },
      { platform: "github", url: "https://github.com/aqrln" },
    ],
  },
  {
    names: ["Gregory Boch"],
    bio: "Gregory Boch is a product leader at Prisma focused on DevTools, agentic workflows, activation, and user research. With a background in engineering, startup founding, and computer science research, he writes from hands-on experience building developer products and turning technical decisions into better user experiences.",
    socials: [
      { platform: "x", url: "https://x.com/gr1b" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/griib/" },
      { platform: "github", url: "https://github.com/gregory-boch-prisma" },
    ],
  },
  {
    names: ["Pierantonio Cangianiello"],
    bio: "Pierantonio is an engineer at Prisma, where he works on backend systems and database infrastructure. Before Prisma, he worked at AWS in the authentication and identity space. He has more than a decade of open source experience, including work across the TypeScript and Java ecosystems, and writes about databases, backend engineering, and the low-level details that make data-heavy applications reliable.",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/p-cangianiello" },
      { platform: "github", url: "https://github.com/pcan" },
    ],
  },
  {
    names: ["Søren Bramer Schmidt", "Søren Schmidt"],
    bio: "Søren is a co-founder of Prisma and previously co-founded Graphcool, the GraphQL backend platform that grew into Prisma. Before founding companies he worked as a software architect at Trustpilot, and he has spent well over a decade building tools that simplify how developers work with data. He writes about databases, developer tooling, and the direction of modern application infrastructure.",
    socials: [
      { platform: "x", url: "https://x.com/sorenbs" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/sorenbs/" },
      { platform: "github", url: "https://github.com/sorenbs" },
    ],
  },
  {
    names: ["Serhii Tatarintsev"],
    bio: "Serhii is an engineer with more than 15 years of experience who spent several years on Prisma's core team, where he became one of the top individual contributors to the open source ORM, working across both the TypeScript client and the Rust engines. Before Prisma he built systems at companies including Sumsub and ResearchGate.",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/sevinf/" },
      { platform: "github", url: "https://github.com/SevInf" },
    ],
  },
  {
    names: ["Will Madden", "William Madden"],
    bio: "Will leads the engineering team behind Prisma's open source ORM and guides its technical direction, with more than 15 years in software and an open source trail stretching back to 2008. He has appeared on podcasts including PodRocket to discuss ORM architecture and direction, and writes about ORM design, engineering leadership, and shipping software other engineers depend on.",
    socials: [
      { platform: "x", url: "https://x.com/william_ma14406" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/willmadden/" },
      { platform: "github", url: "https://github.com/wmadden" },
    ],
  },
  {
    names: ["Tyler Benfield"],
    bio: "Tyler Benfield works on architecture and platform engineering at Prisma, with a focus on database infrastructure, application hosting, and AI infrastructure. He brings 15+ years of experience across consulting, startups, and large organizations. A regular conference speaker, he has appeared at events such as Epic Web Conf, KCDC, and All Things Open. He writes and speaks on database performance, distributed systems, and increasingly on how to get reliable, high-quality output when delegating work to AI agents.",
    socials: [
      { platform: "x", url: "https://x.com/rtbenfield" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/tylerbenfield/" },
      { platform: "github", url: "https://github.com/rtbenfield" },
    ],
  },
  {
    names: ["Matthias Oertel"],
    bio: "Matthias has been an engineer at Prisma since 2017, with thousands of commits across the tooling that powers Prisma's ORM and data platform. He has spoken at conferences including MongoDB World on building GraphQL APIs with TypeScript, and writes about query engines, performance, and database internals.",
    socials: [
      { platform: "x", url: "https://x.com/oertel_matthias" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/matthias-oertel-a9388778/" },
      { platform: "github", url: "https://github.com/do4gr" },
    ],
  },
  {
    names: ["Josh McLeod", "Joshua McLeod"],
    bio: "Josh has helped keep Prisma running since 2018, making him one of the longest-serving members of the team. With an operations background spanning startups and, earlier in his career, the German Bundestag, he writes about how modern software companies actually work day to day.",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/josh-d-mcleod/" },
      { platform: "github", url: "https://github.com/jdmachogg" },
    ],
  },
  {
    names: ["Tyler Hogarth"],
    bio: "Tyler is an engineering and product leader at Prisma who has spent most of his career building and leading software teams. He has built software across multiple stacks, languages, and systems from distributed backend systems to web and mobile applications. His current focus is building Prisma's AI-native development platform.",
    socials: [
      { platform: "x", url: "https://x.com/tylerhogarth" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/tylerhogarth/" },
      { platform: "github", url: "https://github.com/tylerhogarth" },
    ],
  },
  {
    names: ["Shane Neubauer"],
    bio: "Shane is a product leader at Prisma with more than 15 years in technology, including five years prototyping new products at Google and founding a venture-backed startup of his own. He writes about product strategy, go-to-market, and building tools developers genuinely want to use.",
    socials: [
      { platform: "x", url: "https://x.com/sneub" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/shaneneubauer/" },
      { platform: "github", url: "https://github.com/sneub" },
    ],
  },
  {
    names: ["Nurul Sundarani"],
    bio: "Nurul is a senior member of the Prisma team working directly with developers to help them succeed in production, with engineering experience spanning payment infrastructure, microservices, and full-stack product work at several companies before Prisma. Nurul's writing draws on daily conversations with teams running Prisma at scale, focused on real problems and practical fixes.",
    socials: [
      { platform: "x", url: "https://x.com/NurulSundarani" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/nurul-sundarani/" },
      { platform: "github", url: "https://github.com/nurul3101" },
    ],
  },
  {
    names: ["Sampo Lahtinen"],
    bio: "Sampo is a software engineer at Prisma who works across the whole stack, from Console UI down to the management API and database internals, and is the team's billing expert behind Prisma's Stripe billing system. He found his way into software from materials engineering over a decade ago, and builds with React, TypeScript, GraphQL, and Node with a particular eye for UX. He writes about full-stack product engineering, billing systems, and building with agents.",
    socials: [
      { platform: "x", url: "https://x.com/sampola_" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/sampolahtinen/" },
      { platform: "github", url: "https://github.com/sampolahtinen" },
    ],
  },
  {
    names: ["Aman Varshney"],
    bio: "Aman is a member of the Prisma team and the creator of Better-T-Stack, an open source scaffolding tool that developers use to spin up more than ten thousand TypeScript projects every month. He writes about TypeScript, full-stack development, and getting projects from idea to production quickly.",
    socials: [
      { platform: "x", url: "https://x.com/amanvarshney01" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/amanvarshney11/" },
      { platform: "github", url: "https://github.com/AmanVarshney01" },
    ],
  },
  {
    names: ["Martin Janse van Rensburg"],
    bio: "Martin is a member of the Prisma team who has spent his career at the intersection of people, growth, and technology. He writes about the trends and news in the developer tools industry.",
    socials: [
      { platform: "x", url: "https://x.com/vanrensbird" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/martjvr/" },
      { platform: "github", url: "https://github.com/vanrensbird" },
    ],
  },
  {
    names: ["Gemma Anible"],
    bio: "Gemma is an engineer at Prisma with more than 25 years of experience across backend systems, infrastructure, and full-stack cross-platform application development. She has a long history in the PHP and Go communities, including OSS contributions, conference talks, and podcast appearances. Gemma works on Prisma's hosted backend products and writes about the operational side of running databases at scale.",
    socials: [
      { platform: "mastodon", url: "https://void.ello.tech/@ello" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/gemma-anible/" },
      { platform: "github", url: "https://github.com/ellotheth" },
    ],
  },
  {
    names: ["Luan van der Westhuizen"],
    bio: "Luan helps shape product direction at Prisma, drawing on more than a decade across software engineering, product, and engineering leadership. He writes about developer tooling, AI-era software teams, and the systems that let builders move faster while staying close to the details that matter.",
    socials: [
      { platform: "x", url: "https://x.com/luan_vdw" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/luanvdw/" },
      { platform: "github", url: "https://github.com/luanvdw" },
    ],
  },
  {
    names: ["Kristof Siket"],
    bio: "Kristof is a senior engineer at Prisma who works on the CLI and developer workflows at the heart of the toolkit. He previously built developer products at Kinsta, where he created the DevKinsta local development app, and held senior engineering roles at Recharge. He writes about TypeScript, API design, and developer productivity.",
    socials: [
      { platform: "x", url: "https://x.com/kristofsik" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/krist%C3%B3f-siket-65689717b/" },
      { platform: "github", url: "https://github.com/kristof-siket" },
    ],
  },
  {
    names: ["Nikolas Burk"],
    bio: "Nikolas was employee #3 at Prisma and spent 9 years teaching developers about ORMs and databases. He left in October 2025 to focus on his own projects and work as an independent Software Engineer and Developer Educator.",
    socials: [
      { platform: "x", url: "https://x.com/nikolasburk" },
      { platform: "github", url: "https://github.com/nikolasburk" },
    ],
  },
  {
    names: ["Jason Procka"],
    bio: "Jason is a passionate hobbyist web developer and a longtime Prisma aficionado. Outside of his development projects, he enjoys rock climbing and culinary arts, specifically mastering the perfect steak.",
    socials: [
      { platform: "x", url: "https://x.com/pinesheet" },
      { platform: "github", url: "https://github.com/Slovakian" },
    ],
  },
];

/**
 * Maps every author slug (derived from each name variant) to its bio. Built
 * once at module load.
 */
const bioBySlug: Map<string, AuthorBio> = (() => {
  const map = new Map<string, AuthorBio>();
  for (const entry of AUTHOR_BIOS) {
    for (const name of entry.names) {
      const slug = toAuthorSlug(name);
      if (slug && !map.has(slug)) map.set(slug, entry);
    }
  }
  return map;
})();

/** Returns the bio for an author slug, or null if none exists. */
export function getAuthorBioBySlug(slug: string): AuthorBio | null {
  return bioBySlug.get(slug.toLowerCase()) ?? null;
}

/** Returns the bio for an author display name, or null if none exists. */
export function getAuthorBioByName(name: string): AuthorBio | null {
  return getAuthorBioBySlug(toAuthorSlug(name));
}

/**
 * Returns the list of social profile URLs for an author, suitable for the
 * `sameAs` property of schema.org structured data. Empty if no bio exists.
 */
export function getAuthorSameAs(name: string): string[] {
  return getAuthorBioByName(name)?.socials.map((s) => s.url) ?? [];
}
