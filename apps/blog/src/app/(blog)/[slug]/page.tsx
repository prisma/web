import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { blog } from '@/lib/source';
import Image from 'next/image';
import { withBlogBasePathForImageSrc } from '@/lib/url';
export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const MDX = page.data.body;
  const formatDate = (value: unknown) => {
    const date =
      value instanceof Date ? value : new Date((value as string) ?? '');
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const getHeroImageSrc = () => {
    const data = page.data as any;
    const rel =
      (data.heroImagePath as string | undefined) ??
      (data.metaImagePath as string | undefined);
    if (rel) {
      if (rel.startsWith('/')) return rel;
      const base = page.url.startsWith('/') ? page.url : `/${page.url}`;
      const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;
      const relClean = rel.replace(/^\.\//, '').replace(/^\/+/, '');
      return `${baseClean}/${relClean}`;
    }
    const absolute =
      (data.heroImageUrl as string | undefined) ??
      (data.metaImageUrl as string | undefined);
    return absolute ?? null;
  };
  const heroSrc = getHeroImageSrc();

  return (
    <>
      {/* Hero image */}
      {heroSrc ? (
        <div className="w-full">
          <div className="relative w-full aspect-video">
            <Image
              src={withBlogBasePathForImageSrc(heroSrc)}
              alt={(page.data as any).heroImageAlt ?? page.data.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}

      {/* Title + meta */}
      <header className="w-full max-w-350 mx-auto px-4 md:px-8 py-10">
        <Link href="/" className="text-fd-primary hover:underline text-sm">
          ← Back to Blog
        </Link>
        <h1 className="mt-3 mb-3 text-3xl md:text-4xl font-bold">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="text-fd-muted-foreground mb-3">{page.data.description}</p>
        ) : null}
        <p className="text-sm text-fd-muted-foreground">
          {page.data.authors?.length ? page.data.authors.join(', ') : null}
          {page.data.date ? (
            <>
              {' • '}
              <span>{formatDate(page.data.date)}</span>
            </>
          ) : null}
        </p>
      </header>

      {/* Body */}
      <article className="w-full max-w-350 mx-auto flex flex-col px-4 md:px-8 pb-12">
        <div className="prose min-w-0">
          <InlineTOC items={page.data.toc} />
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(blog, page)
            })}
          />
        </div>
      </article>

      {/* Newsletter CTA */}
      <div className="w-full max-w-350 mx-auto px-4 md:px-8 pb-16">
        <div className="rounded-2xl border border-fd-primary/20 bg-fd-secondary p-6 md:p-8">
          <h4 className="text-2xl font-semibold mb-2">
            Don’t miss the next post!
          </h4>
          <p className="text-fd-muted mb-4">
            Sign up for the Prisma Newsletter to stay up to date with the latest
            releases and posts.
          </p>
          <Link
            href="https://www.prisma.io/newsletter"
            className="inline-flex items-center px-4 py-2 rounded-md bg-fd-primary text-white hover:opacity-90 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
