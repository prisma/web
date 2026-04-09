export type SupportChannel = {
  platformPlan: string;
  supportPlan: string;
  discord: boolean;
  console: boolean;
  email: boolean;
  dedicatedContact: boolean;
};

export const supportChannels: SupportChannel[] = [
  {
    platformPlan: "Starter",
    supportPlan: "Community",
    discord: true,
    console: false,
    email: false,
    dedicatedContact: false,
  },
  {
    platformPlan: "Pro",
    supportPlan: "Standard",
    discord: true,
    console: true,
    email: true,
    dedicatedContact: false,
  },
  {
    platformPlan: "Business",
    supportPlan: "Business",
    discord: true,
    console: true,
    email: true,
    dedicatedContact: false,
  },
  {
    platformPlan: "Enterprise",
    supportPlan: "Dedicated",
    discord: true,
    console: true,
    email: true,
    dedicatedContact: true,
  },
];

export type ResponseTime = {
  platformPlan: string;
  supportPlan: string;
  responseTime: string;
};

export const responseTimes: ResponseTime[] = [
  {
    platformPlan: "Starter",
    supportPlan: "Community",
    responseTime:
      "No guaranteed response time. We strive to reply to all requests within 3 business days.",
  },
  {
    platformPlan: "Pro",
    supportPlan: "Standard",
    responseTime: "2 business days",
  },
  {
    platformPlan: "Business",
    supportPlan: "Business",
    responseTime: "1 business hour",
  },
  {
    platformPlan: "Enterprise",
    supportPlan: "Dedicated",
    responseTime: "Custom",
  },
];

export type SeverityLevel = {
  level: string;
  definition: string;
};

export const severityLevels: SeverityLevel[] = [
  {
    level: "P1 - Urgent priority",
    definition:
      "Critical issue. Defect resulting in full or partial system outage or a condition that makes the affected Prisma product unusable or unavailable in production for all of the customer's users.",
  },
  {
    level: "P2 - High priority",
    definition:
      "Significant disruption. Issue resulting in impacted major functionality or significant performance degradation, impacting a significant portion of the user base.",
  },
  {
    level: "P3 - Normal priority",
    definition:
      "Minor feature or functional issue / general question. Issue resulting in a Prisma component not performing as expected or documented, or an inquiry regarding a general technical issue or general question.",
  },
  {
    level: "P4 - Low priority",
    definition:
      "Minor issue / feature request. An information request about Prisma or a feature request.",
  },
];

export const publicHolidays = [
  "New Year's Day (January 1)",
  "International Women's Day (March 8)",
  "Good Friday",
  "Easter Monday",
  "Labour Day (May 1)",
  "Ascension Day",
  "Whit Monday",
  "Day of German Unity (October 3)",
  "Christmas Day and Boxing Day (December 25 and 26)",
];
