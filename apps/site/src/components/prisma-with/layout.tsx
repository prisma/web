import { Hero } from "./hero";
import { WhySection } from "./why-section";
import { HowSection } from "./how-section";
import { ResourcesSection } from "./resources-section";
import { QuoteSection } from "./quote-section";
import { CommunitySection } from "./community-section";

export type PrismaWithData = {
  hero: {
    tech: string;
    eyebrow: string;
    icon: string;
    imageUrl: string;
    imageUrlLight?: string;
    title: string;
    description: string;
    btns: Array<{
      label: string;
      icon?: string;
      url: string;
    }>;
  };
  why: {
    title: string;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  how: {
    title: string;
    description: string;
    tabs: {
      defaultValue: string;
      head: Array<{
        title: string;
        value: string;
      }>;
      body: Array<{
        value: string;
        content: string;
      }>;
    };
  };
  why_prisma: {
    title: string;
    cards: Array<{
      image: string;
      url: string;
      badge: string;
      date: string;
      title: string;
      description: string;
      author: {
        name: string;
        avatar: string;
      };
    }>;
  };
  quote: {
    text: string;
    author: {
      name: string;
      imageUrl: string;
      title: string;
      company: string;
    };
  };
  community: {
    title: string;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
      btn: {
        label: string;
        url: string;
      };
    }>;
  };
};

export async function PrismaWithLayout({
  data,
  codeExamples,
}: {
  data: PrismaWithData;
  codeExamples: Record<string, string>;
}) {
  return (
    <main className="w-screen overflow-hidden">
      <Hero data={data.hero} />
      <WhySection data={data.why} />
      <HowSection data={data.how} codeExamples={codeExamples} />
      <ResourcesSection data={data.why_prisma} />
      <QuoteSection data={data.quote} />
      <CommunitySection data={data.community} />
    </main>
  );
}
