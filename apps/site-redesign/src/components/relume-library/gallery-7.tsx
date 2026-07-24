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

export type Gallery7Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Gallery7 = (props: Gallery7Props) => {
  const { heading, description, images } = {
    ...Gallery7Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr justify-center gap-6 md:grid-cols-2 md:gap-8">
          {images.map((image, index) => (
            <a
              key={index}
              href={image.url}
              className={clsx("inline-block w-full", {
                "col-start-1 col-end-2 row-start-1 row-end-3": index === 0,
              })}
            >
              <div
                className={clsx("relative size-full", {
                  "pt-[100%]": index === 0,
                  "pt-[56.25%]": index !== 0,
                })}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery7Defaults: Props = {
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
  ],
};
