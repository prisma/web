// @ts-nocheck
type SubHeadingProps = {
  title: string;
  description: string;
};

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  subHeadings: SubHeadingProps[];
  image: ImageProps;
};

export type Layout50Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout50 = (props: Layout50Props) => {
  const { heading, description, subHeadings, image } = {
    ...Layout50Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-20">
          <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
            {heading}
          </h3>
          <div>
            <p className="mb-6 text-text-alternative md:mb-8 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-6 py-2 sm:grid-cols-2 sm:gap-y-8">
              {subHeadings.map((subHeading, index) => (
                <div key={index}>
                  <h6 className="mb-3 text-md font-bold leading-[1.4] text-text-alternative md:mb-4 md:text-xl">
                    {subHeading.title}
                  </h6>
                  <p className="text-text-alternative">{subHeading.description}</p>
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

export const Layout50Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  subHeadings: [
    {
      title: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      title: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
