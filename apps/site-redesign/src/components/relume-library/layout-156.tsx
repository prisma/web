// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  image: ImageProps;
};

export type Layout156Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout156 = (props: Layout156Props) => {
  const { heading, description, image } = {
    ...Layout156Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div>
            <img src={image.src} className="size-full object-cover" alt={image.alt} />
          </div>
          <div className="rb-12 mt-12 md:mt-18 lg:mt-20">
            <div className="mx-auto max-w-lg text-center">
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                {heading}
              </h3>
              <p className="md:text-md">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout156Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
};
