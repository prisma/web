// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type SubHeadingProps = {
  title: string;
  description: string;
  icon: ImageProps;
};

type Props = {
  heading: string;
  subHeadings: SubHeadingProps[];
  description: string;
  image: ImageProps;
};

export type Layout98Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout98 = (props: Layout98Props) => {
  const { heading, description, image, subHeadings } = {
    ...Layout98Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <div>
            <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
          </div>
          <div>
            <p className="mb-6 md:mb-8 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-6 py-2 lg:grid-cols-2">
              {subHeadings.map((subHeading, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-none self-start">
                    <img src={subHeading.icon.src} className="size-8" alt={subHeading.icon.alt} />
                  </div>
                  <div>
                    <h6 className="mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
                      {subHeading.title}
                    </h6>
                    <p>{subHeading.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <img src={image.src} className="w-full object-cover" alt={image.alt} />
      </div>
    </section>
  );
};

export const Layout98Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  subHeadings: [
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 1" },
      title: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 2" },
      title: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
  ],
};
