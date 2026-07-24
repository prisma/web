// @ts-nocheck
import clsx from "clsx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  images: ImageProps[];
};

export type Gallery9Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Gallery9 = (props: Gallery9Props) => {
  const { heading, description, images } = {
    ...Gallery9Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr grid-cols-2 grid-rows-2 gap-6 md:auto-cols-auto md:grid-cols-[2fr_1fr_1fr] md:gap-8">
          {images.map((image, index) => (
            <a
              key={index}
              href={image.url}
              className={clsx("inline-block size-full", {
                "col-start-1 col-end-2 row-start-1 row-end-3": index === 0,
              })}
            >
              <div className="size-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-square size-full object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery9Defaults: Props = {
  heading: "Image Gallery",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  images: [
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 2",
    },
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 3",
    },
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 4",
    },
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 5",
    },
  ],
};
