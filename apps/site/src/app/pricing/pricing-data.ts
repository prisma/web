export const symbols = {
  EUR: "€",
  AUD: "A$",
  INR: "₹",
  GBP: "£",
  CAD: "C$",
  BRL: "R$",
  JPY: "¥",
  CNY: "C¥",
  KRW: "₩",
  USD: "$",
} as const;

export type Symbol =
  | "EUR"
  | "AUD"
  | "INR"
  | "GBP"
  | "CAD"
  | "BRL"
  | "JPY"
  | "CNY"
  | "KRW"
  | "USD";

export type CurrencyMap = Record<Symbol, string>;

export type PlanPoint =
  | string
  | {
      text: string;
      price: CurrencyMap;
    }

export type PricingPlan = {
  title: string;
  subtitle: string;
  points: PlanPoint[];
  price: CurrencyMap;
};

export type UsagePricing = {
  baseMonthlyPrice: number;
  includedOperations: number;
  includedStorageGb: number;
  operationPricePerThousand: number;
  storagePricePerGb: number;
  yearlyDiscount: number;
};

/** Formats a single numeric amount with every supported currency symbol. */
export function formatAmountForAllCurrencies(
  amount: number,
  digits: number,
): CurrencyMap {
  return Object.fromEntries(
    Object.entries(symbols).map(([code, symbol]) => [
      code,
      `${symbol}${amount.toFixed(digits)}`,
    ]),
  ) as CurrencyMap;
}

/** Replaces the inline price token in a plan bullet for the active currency. */
export function renderPlanPoint(point: PlanPoint, currency: Symbol): string {
  if (typeof point === "string") {
    return point;
  }

  return point.text.replace("<price>", point.price[currency]);
}

export const planOrder = ["free", "starter", "pro", "business"] as const;
export type PricingPlanKey = (typeof planOrder)[number];
export type BillablePricingPlanKey = Exclude<PricingPlanKey, "free">;

export const planActions: Record<PricingPlanKey, string> = {
  free: "Start for Free",
  starter: "Get started",
  pro: "Start building",
  business: "Start building",
};

export const plans: Record<PricingPlanKey, PricingPlan> = {
  free: {
    title: "Free",
    subtitle: "Perfect for that weekend idea",
    points: [
      "<b>100,000</b> operations<span>*</span> included",
      "<b>500 MB</b> storage",
      "<b>5</b> databases",
      "No credit card required",
    ],
    price: formatAmountForAllCurrencies(0, 0),
  },
  starter: {
    title: "Starter",
    subtitle: "The basics you need to launch",
    points: [
      {
        text: "<b>1,000,000</b> operations<span>*</span>&nbsp; included, then <b><price> </b> per <b>1,000 </b>",
        price: formatAmountForAllCurrencies(0.008, 4),
      },
      {
        text: "<b>10 GB</b> storage included<br/>then <b><price></b> per <b>GB</b>",
        price: formatAmountForAllCurrencies(2, 2),
      },
      "<b>10</b> databases",
      "Includes spend limits <br/><b>Daily backups</b> stored for <b>7 days</b>",
    ],
    price: formatAmountForAllCurrencies(10, 0),
  },
  pro: {
    title: "Pro",
    subtitle: "Growing for business success",
    points: [
      {
        text: "<b>10,000,000</b> operations<span>*</span> included, then <b><price></b> per <b>1,000</b>",
        price: formatAmountForAllCurrencies(0.002, 4),
      },
      {
        text: "<b>50 GB</b> storage included<br/>then <b><price></b> per <b>GB</b>",
        price: formatAmountForAllCurrencies(1.5, 2),
      },
      "<b>100</b> databases",
      "Includes spend limits <br/><b>Daily backups</b> stored for <b>7 days</b>",
    ],
    price: formatAmountForAllCurrencies(49, 0),
  },
  business: {
    title: "Business",
    subtitle: "For mission-critical apps",
    points: [
      {
        text: "<b>50,000,000</b> operations<span>*</span> included, then <b><price></b> per <b>1,000</b>",
        price: formatAmountForAllCurrencies(0.001, 4),
      },
      {
        text: "<b>100 GB</b> storage included<br/>then <b><price></b> per <b>GB</b>",
        price: formatAmountForAllCurrencies(1, 2),
      },
      "<b>1000</b> databases",
      "Includes spend limits <br/><b>Daily backups</b> stored for <b>30 days</b>",
    ],
    price: formatAmountForAllCurrencies(129, 0),
  },
};

export const usagePricing: Record<BillablePricingPlanKey, UsagePricing> = {
  starter: {
    baseMonthlyPrice: 10,
    includedOperations: 1_000_000,
    includedStorageGb: 10,
    operationPricePerThousand: 0.008,
    storagePricePerGb: 2,
    yearlyDiscount: 0.25,
  },
  pro: {
    baseMonthlyPrice: 49,
    includedOperations: 10_000_000,
    includedStorageGb: 50,
    operationPricePerThousand: 0.002,
    storagePricePerGb: 1.5,
    yearlyDiscount: 0.25,
  },
  business: {
    baseMonthlyPrice: 129,
    includedOperations: 50_000_000,
    includedStorageGb: 100,
    operationPricePerThousand: 0.001,
    storagePricePerGb: 1,
    yearlyDiscount: 0.25,
  },
};

export const comparisonSections = [
  {
    title: "Managed Connection Pool",
    rows: [
      ["Connection limit (direct)", "10", "10", "50", "100"],
      ["Connection limit (pooled)", "10", "100", "500", "1000"],
      ["Connection idle timeout", "60 minutes", "60 minutes", "60 minutes", "60 minutes"],
      ["Auto-scaling", "✓", "✓", "✓", "✓"],
      ["Operation response size", "unlimited", "unlimited", "unlimited", "unlimited"],
      ["Operation duration for db queries", "unlimited", "unlimited", "unlimited", "unlimited"],
      ["Operation duration for interactive", "unlimited", "unlimited", "unlimited", "unlimited"],
    ],
  },
  {
    title: "Global Cache",
    rows: [
      ["Cache tag invalidations", "-", "-", "$0.002 per 1,000, max 10,000 per day", "$0.001 per 1,000, max 100,000 per day"],
      ["Cache purge requests", "5 per hour", "5 per hour", "10 per hour", "20 per hour"],
    ],
  },
  {
    title: "Database optimizations",
    rows: [
      ["Query insights", "✓", "✓", "✓", "✓"],
    ],
  },
  {
    title: "Data management",
    rows: [["View and edit your data", "✓", "✓", "✓", "✓"]],
  },
  {
    title: "Platform",
    rows: [
      ["Support", "Community", "Community", "Standard", "Premium"],
      ["Compliance", "GDPR", "GDPR", "GDPR / HIPAA", "GDPR / HIPAA / SOC2 / ISO:27001"],
    ],
  },
] as const;

export const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What is an operation?",
    answer:
      "<p>Each action you perform, whether it’s a create, read, update, or delete query against your Prisma Postgres database counts as a single operation. Even if Prisma issues multiple database queries behind the scenes to fulfill your request, it’s still billed as one operation.</p><p>By treating simple lookups and complex queries the same, you can directly correlate your database usage and costs with your product usage and user behavior. There’s no need to track write-heavy workloads or worry about bandwidth per operation: each of them is counted and billed the same, making your usage and budgeting simple and straightforward. You can learn more about <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/blog/operations-based-billing#what-is-an-operation\">our operations-based pricing model</a> in our blog post.</p>",
  },
  {
    question: "How many operations do I need for my project?",
    answer:
      "<p>While the answer to this question will vary from project to project, there are a couple of ways to get an idea of what you will need:</p><ul><li>If you already have a database with another provider, you can often look in their dashboard to see your current usage. The number of queries will be a good hint to the approximate number of operations you’ll use.</li><li>If you already use the Prisma ORM, you can enable the <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/metrics\">metrics</a> feature to begin tracking your usage, which is an easy and accurate way to see your current usage.</li><li>If you’re starting a new project, we encourage you to just get started and see how many queries you typically use. We offer a free plan with 100,000 operations <strong>per month</strong>, meaning you can confidently get started without paying anything. From our experience, 100,000 operations per month is more than enough to get started with a project and serve your first users.</li></ul><p>You can find an <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/blog/operations-based-billing#calculation-example\">example calculation </a>for a medium-sized workload in our blog post about our operations-based pricing model.</p>",
  },
  {
    question: "Can I use Prisma Postgres for free?",
    answer:
      "<p>We include a free threshold of 100,000 database operations <strong>per month</strong> on the Free plan, meaning you can use Prisma for free, and only pay if you exceed the threshold. From our experience, 100,000 operations per month is more than enough to get started.</p><p>We always send usage notifications to let you know when you’re approaching the threshold, so that you’re always in control of your spending.</p>",
  },
  {
    question: "Can I set spending limits to control my budget?",
    answer:
      "<p>Yes, you can set limits to ensure you never get a surprise bill. We’ll send you alerts when you reach 75% of your set limit, and if you reach 100% we’ll pause access to your database. This ensures you’ll never have an unexpected bill, and you can always be in complete control of your spending.</p>",
  },
  {
    question: "Why do you count usage on account level, rather than database level?",
    answer:
      "<p>We record usage at the account level because it gives you, the developer, the most flexibility. You can spin up one database or 20 databases without any extra cost — pay only for the operations you make and storage you use across all of them.</p><p>This makes experimenting, prototyping and testing ideas super easy and seamless, because you don't have to think about how many databases you create.</p>",
  },
  {
    question: "What’s the difference between usage pricing and traditional database pricing?",
    answer:
      "<p>Traditional pricing is where you choose a fixed database size and price, and the amount you pay is generally predictable. But that comes at the expense of flexibility, meaning it’s much harder to scale up and down with your application’s demands. This is usually fine for a small test database, but for production workloads, it can be burdensome: If you have low-traffic periods, and high-traffic periods (most production apps do) then you either under-provision and risk having downtime in busy periods, or you over-provision and pay a lot more for your database.</p><p>With usage pricing, you only pay for what you need, when you need it. If your app has a quiet period, you’ll pay less. If things get busy, we can simply scale up to handle it for you. Prisma Postgres comes with budget controls, so you can always stay in control of your spending, while taking advantage of the flexibility. You can learn more <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/blog/operations-based-billing#why-is-an-operations-based-pricing-model-better?utm_source=pricing_website&amp;utm_content=faq\">on why operations-based pricing is better</a> in our blog post.</p>",
  },
  {
    question: "How is Prisma’s pricing different to others?",
    answer:
      "<p>Prisma’s pricing is designed to provide maximum flexibility to developers, while aiming to be as intuitive as possible.</p><p>We charge primarily by <em>operation</em>, which is counted each time you invoke the Prisma ORM client to create, read, update or delete a record. Additionally we also charge for <em>storage</em>. All with a very generous free threshold each month.</p><p>We don’t charge by data transfer (bandwidth) or by compute/memory hours, simply because we felt that these metrics are more difficult to grasp as a developer.</p><p>We created a pricing model to more closely match how you use your database as a developer, not how the infrastructure works. You can learn more about our <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/blog/operations-based-billing#a-simpler-approach-to-database-pricing\">approach to an operations-based database pricing model in this blog post</a>.</p>",
  },
  {
    question: "How can I compare Prisma pricing to other providers?",
    answer:
      "<p>Because we only charge you for what you actually use, the best way to see a comparison is to run your application on Prisma, and that’s why we offer a free threshold every month.</p><p>However, as a simple comparison, the average database <em>operation</em> size from current Prisma users is 10kb (measured from over 15b queries). Some providers charge by bandwidth used, meaning 5GB of bandwidth might equate to approximately 500,000 database operations.</p>",
  },
  {
    question: "Can I get the power of Prisma with my own database?",
    answer:
      "<p>You can also connect your own database to Prisma's global caching and connection pooling, also known as Prisma Accelerate.</p><p>Click the &quot;Bring your own database&quot; toggle at the top of this page to see more<br />detail.</p>",
  },
  {
    question: "I'm an early stage startup, do you offer any discounts?",
    answer:
      "<p>Building a startup is hard. Prisma helps you stay laser-focused on what matters the most, which is building features and winning users.</p><p>We offer $10k in credits to eligible startups. Learn more at <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://prisma.io/startups\">prisma.io/startups</a>.</p>",
  },
  {
    question: "How do I upgrade my plan if I am using Prisma Postgres via Vercel?",
    answer:
      "<p>If you're using Prisma Postgres via Vercel, your billing is handled directly by Vercel. To upgrade your plan, you'll need to do so in the Vercel Dashboard. The instructions are available in our <a class=\"underline underline-offset-2 decoration-[var(--color-foreground-ppg)] text-foreground-neutral hover:text-foreground-neutral-weak\" href=\"https://www.prisma.io/docs/postgres/more/faq#how-do-i-upgrade-my-plan-if-i-am-using-prisma-postgres-via-vercel\">docs</a>.</p>",
  },
];
