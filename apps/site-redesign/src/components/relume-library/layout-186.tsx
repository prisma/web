// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  icon: ImageProps;
  heading: string;
  description: string;
  image: ImageProps;
};

export type Layout186Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout186 = (props: Layout186Props) => {
  const { heading, description, image, icon } = {
    ...props,
    ...Layout186Defaults,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10 max-w-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rb-5 mb-5 flex md:mb-6">
            <img src={icon.src} className="size-12" alt={icon.alt} />
          </div>
          <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
            {heading}
          </h3>
          <p className="mt-5 text-text-alternative md:mt-6 md:text-md">{description}</p>
        </div>
        <div className="absolute inset-0 z-0">
          <img src={image.src} className="h-full w-full object-cover" alt={image.alt} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
    </section>
  );
};

export const Layout186Defaults: Props = {
  icon: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
    alt: "Relume logo 1",
  },
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume Placeholder image",
  },
};
