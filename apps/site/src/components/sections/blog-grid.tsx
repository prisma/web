import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type BlogPost = {
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    initials: string;
  };
  date: string;
};

const posts: BlogPost[] = [
  {
    title: "How we reduced onboarding time by 60% with smart defaults",
    excerpt:
      "Most SaaS products ask too many questions upfront. We flipped the script and let users start with sensible defaults, then customize as they go.",
    category: "Product",
    author: { name: "Alex Chen", initials: "AC" },
    date: "Feb 12, 2026",
  },
  {
    title: "The hidden cost of building auth from scratch",
    excerpt:
      "We spent three months building a custom auth system before realizing we should have used an off-the-shelf solution. Here is what we learned.",
    category: "Engineering",
    author: { name: "Sarah Kim", initials: "SK" },
    date: "Feb 5, 2026",
  },
  {
    title: "Why we switched from per-seat to usage-based pricing",
    excerpt:
      "Per-seat pricing was leaving money on the table and frustrating small teams. Usage-based pricing aligned our incentives with our customers.",
    category: "Growth",
    author: { name: "Priya Patel", initials: "PP" },
    date: "Jan 28, 2026",
  },
];

export function BlogGrid() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Latest from the blog
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Lessons learned building and scaling SaaS products. No fluff, just practical advice from
            the trenches.
          </p>
        </div>

        {/* Blog cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.title}
              className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/9] w-full bg-muted" />

              <CardHeader className="gap-3 pt-5">
                <Badge variant="secondary" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="text-lg font-semibold leading-snug text-card-foreground">
                  {post.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </CardContent>

              <CardFooter className="mt-auto flex items-center justify-between border-t border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs">{post.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Read more
                  <ArrowRight className="size-3.5" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View all posts link */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all posts
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
