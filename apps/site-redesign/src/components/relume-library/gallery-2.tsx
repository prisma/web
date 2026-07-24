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

export type Gallery2Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Gallery2 = (props: Gallery2Props) => {
  const { heading, description, images } = {
    ...Gallery2Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 items-start justify-center gap-6 md:grid-cols-2 md:gap-8">
          {images.map((image, index) => (
            <a key={index} href={image.url}>
              <img src={image.src} alt={image.alt} className="size-full object-cover" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery2Defaults: Props = {
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
  ],
};
