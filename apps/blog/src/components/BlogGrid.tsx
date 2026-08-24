import { PostCard } from "./PostCard";

export type BlogCardItem = {
  url: string;
  title: string;
  date: string; // ISO string
  updatedAt?: string | null; // ISO string
  excerpt?: string | null;
  author?: string | null;
  authors?: string[] | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  seriesTitle?: string | null;
  badge?: string | null;
  tags?: string[];
};

export function BlogGrid({
  items,
  featuredPost,
  currentCategory,
}: {
  items: BlogCardItem[];
  featuredPost?: BlogCardItem;
  currentCategory: string;
}) {
  return (
    <>
      {featuredPost ? (
        <div className="mb-6">
          <PostCard post={featuredPost} currentCategory={currentCategory} featured />
        </div>
      ) : null}
      {/* CF's blog skeleton: one grid, three up at desktop, 1.5rem gutters. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <PostCard key={post.url} post={post} currentCategory={currentCategory} />
        ))}
      </div>
    </>
  );
}
