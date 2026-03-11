export type BlogSearchResult = {
    id: string;
    type: "page";
    content: string;
    url: string;
    description: string;
    heroImagePath: string;
    tags: string[];
  };