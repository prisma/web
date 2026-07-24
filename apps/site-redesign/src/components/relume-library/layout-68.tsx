// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type FeaturesProps = {
  icon: ImageProps;
  description: string;
};

type Props = {
  heading: string;
  description: string;
  features: FeaturesProps[];
  image: ImageProps;
};

export type Layout68Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout68 = (props: Layout68Props) => {
  const { heading, description, features, image } = {
    ...Layout68Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-5 md:grid-cols-2 lg:gap-x-20">
          <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
            {heading}
          </h3>
          <div>
            <p className="mb-5 text-text-alternative md:mb-6 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-4 py-2">
              {features.map((feature, index) => (
                <div key={index} className="flex self-start">
                  <div className="mr-4 flex-none self-start">
                    <img className="size-6" src={feature.icon.src} alt={feature.icon.alt} />
                  </div>
                  <p className="text-text-alternative">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={image.src} className="size-full object-cover" alt={image.alt} />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout68Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  features: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 1",
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 2",
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 3",
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
