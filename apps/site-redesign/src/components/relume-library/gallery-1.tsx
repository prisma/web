// @ts-nocheck
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

export type Gallery1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Gallery1 = (props: Gallery1Props) => {
  const { heading, description, images } = {
    ...Gallery1Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-8">
          {images.map((image, index) => (
            <a key={index} href={image.url} className="size-full">
              <div className="w-full overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-video size-full object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery1Defaults: Props = {
  heading: "Image Gallery",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  images: [
    {
      url: "#",
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },
  ],
};
