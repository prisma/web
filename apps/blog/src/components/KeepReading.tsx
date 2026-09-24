import { PostCard } from "./PostCard";
import type { BlogCardItem } from "./BlogGrid";

export function KeepReading({ posts }: { posts: BlogCardItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-label="Keep reading" className="my-16">
      <h2 className="type-title-2xl mb-8 text-center text-foreground-neutral-strong">
        Keep reading
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.url} post={post} currentCategory="show-all" vertical />
        ))}
      </div>
    </section>
  );
}
