export type SiteSearchResult = {
  id: string;
  type: "page";
  source: "blog" | "docs";
  content: string;
  url: string;
  description: string;
  heroImagePath: string;
  tags: string[];
};
