/**
 * Customer quotes rendered by sections/testimonials-reveal.tsx.
 *
 * They live in a React-free module so the Markdown renditions of the pages
 * that carry this section (src/lib/markdown/*) can read the same array instead
 * of holding a second copy of the quotes.
 *
 * Quotes sourced verbatim (trimmed) from prisma.io customer case studies
 * (Bucket, Solin, Grover, Invisible, Poppy, Pearly Plan) and the showcase's
 * community quotes (Cal.com, Gamma, Stellate, Trunk, Memberstack, Instatus).
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Prisma makes database management incredibly easy. Prisma's built-in type safety helps us avoid mistakes that happen with manual setups.",
    name: "Ron Cohen",
    role: "Co-founder & CTO",
    company: "Bucket",
  },
  {
    quote:
      "We are able to take advantage of caching to speed up queries and reduce latency, making them lightning fast.",
    name: "Blake Carroll",
    role: "CTO",
    company: "Solin",
    logo: "/logos/customers/solin.png",
  },
  {
    quote:
      "Prisma has a low learning curve. Productivity becomes higher because it gets combined with end-to-end type-safety using TypeScript.",
    name: "Ricardo Almeida",
    role: "Software Engineer",
    company: "Grover",
    logo: "/logos/customers/grover.png",
  },
  {
    quote:
      "Prisma's approach to type-safe ORM is next-level. It provides full type-safety without any codegen or messy types and interfaces to write and maintain.",
    name: "Pieter Venter",
    role: "Sr. Software Engineer",
    company: "Invisible",
    logo: "/logos/customers/invisible.png",
  },
  {
    quote:
      "The combination of Prisma, TypeScript and our pretty thorough coverage with integration tests gives us the confidence to refactor critical parts of our code.",
    name: "Thibaut Nguyen",
    role: "CTO",
    company: "Poppy",
    logo: "/logos/customers/poppy.png",
  },
  {
    quote:
      "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend.",
    name: "Sean Emmer",
    role: "CTO & Co-Founder",
    company: "Pearly Plan",
    logo: "/logos/customers/pearly.png",
  },
  {
    quote:
      "We chose Prisma because it provides us with type safety directly from the database. It has helped us tremendously to catch possible errors early on.",
    name: "Omar López",
    role: "Sr. Software Engineer",
    company: "Cal.com",
  },
  {
    quote:
      "We've proudly built the core of our APIs on top of Prisma, and we are very happy that we did. It doesn't make us jump through unnecessary hoops to get normal work done and generally just works.",
    name: "James Fox",
    role: "Co-Founder",
    company: "Gamma",
  },
  {
    quote:
      "Prisma is the best ORM I have ever used, I never want to use anything else again. The excellent developer experience with its incredible TypeScript support sold me at first.",
    name: "Max Stoiber",
    role: "Founder",
    company: "Stellate",
  },
  {
    quote:
      "Prisma is a professional enterprise-ready tool that is easy to start using, ramp up and scale. It is the type of tool developed for the software engineers of today.",
    name: "Matt Matheson",
    role: "Co-Founder",
    company: "Trunk",
  },
  {
    quote:
      "Prisma has been an absolute game changer for Memberstack. It has helped us move faster while also improving product stability.",
    name: "Tyler Bell",
    role: "Co-founder",
    company: "Memberstack",
  },
  {
    quote:
      "I chose Prisma because of its clean API, nice developer experience and type safety. It helped me ship v1 of Instatus really fast.",
    name: "Ali Salah",
    role: "Founder",
    company: "Instatus",
  },
];
