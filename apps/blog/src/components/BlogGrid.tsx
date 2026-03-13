import { PostCard } from "./PostCard";

export type BlogCardItem = {
  url: string;
  title: string;
  date: string; // ISO string
  excerpt?: string | null;
  author?: string | null;
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
      {featuredPost && (
        <PostCard
          post={featuredPost}
          currentCategory={currentCategory}
          featured
        />
      )}
      <div className="grid gap-6 mt-12 grid-cols-1">
        {items.map((post) => (
          <PostCard key={post.url} post={post} currentCategory={currentCategory} />
        ))}
      </div>
    </>
  );
}
