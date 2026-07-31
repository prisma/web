import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news, updates, and insights from our team.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-site px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest news, updates, and insights from our team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-site mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {post.frontmatter.tags?.[0] && (
                      <Badge variant="secondary">
                        {post.frontmatter.tags[0]}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {post.frontmatter.title}
                  </CardTitle>
                  <CardDescription>
                    {post.frontmatter.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
