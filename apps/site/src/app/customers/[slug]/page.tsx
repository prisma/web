import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomerStory } from "@/components/sections/customer-story";
import { CUSTOMER_STORY_DETAILS, getCustomerStory } from "@/data/customer-stories";
import { createPageMetadata } from "@/lib/page-metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CUSTOMER_STORY_DETAILS.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getCustomerStory(slug);
  if (!story) return {};

  const metadata = createPageMetadata({
    title: story.hero.title,
    description: story.hero.lead,
    path: `/customers/${slug}`,
    ogKicker: "Customers",
  });

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article" },
  };
}

// Long-form customer stories, built from the approved copy (Notion: "Customer
// Story Detail Page", batches one and two). The index at /customers links here
// for every story that has an entry in data/customer-stories.ts.
export default async function CustomerStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getCustomerStory(slug);
  if (!story) notFound();

  return <CustomerStory story={story} />;
}
