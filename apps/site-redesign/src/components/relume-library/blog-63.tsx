// @ts-nocheck
import { ButtonProps } from "@relume_io/relume-ui";
import { Button } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type BlogPost = {
  url: string;
  image: ImageProps;
  category: string;
  readTime: string;
  title: string;
  description: string;
  avatar: ImageProps;
  fullName: string;
  date: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
  blogPosts: BlogPost[];
};

export type Blog63Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog63 = (props: Blog63Props) => {
  const { tagline, heading, description, blogPosts, button } = {
    ...Blog63Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:mb-20 lg:grid-cols-2 lg:gap-x-20">
          <div className="rb-12 flex flex-col md:items-end md:justify-between">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex flex-wrap items-center justify-start md:mt-8">
                <Button {...button}>{button.title}</Button>
              </div>
            </div>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 items-start gap-12 md:gap-y-16">
            {blogPosts.map((post, index) => (
              <div key={index}>
                <div className="flex flex-col items-start gap-x-8 gap-y-6 md:flex-row md:gap-y-4">
                  <a className="w-full flex-shrink-0 flex-grow basis-2/5 overflow-hidden">
                    <img
                      src={post.image.src}
                      alt={post.image.alt}
                      className="aspect-square size-full object-cover"
                    />
                  </a>
                  <div className="flex w-full flex-col justify-center">
                    <div className="mb-2">
                      <p className="inline-block text-sm font-semibold">{post.category}</p>
                    </div>
                    <a className="mb-2" href={post.url}>
                      <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
                    </a>
                    <p className="line-clamp-2">{post.description}</p>
                    <div className="mt-5 flex items-center md:mt-6">
                      <div className="mr-4 flex-shrink-0">
                        <img
                          src={post.avatar.src}
                          alt={post.avatar.alt}
                          className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold">{post.fullName}</h6>
                        <div className="flex items-center">
                          <p className="text-sm">{post.date}</p>
                          <span className="mx-2">•</span>
                          <p className="text-sm">{post.readTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const blogPost: BlogPost = {
  url: "#",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  category: "Category",
  readTime: "5 min read",
  title: "Blog title heading will go here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder avatar",
  },
  fullName: "Full name",
  date: "11 Jan 2022",
};

export const Blog63Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost],
};
