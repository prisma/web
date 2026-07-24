// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeatureSection = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  featureSections: FeatureSection[];
  backgroundImage: ImageProps;
  images: ImageProps[];
};

export type Layout411Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout411 = (props: Layout411Props) => {
  const { featureSections, backgroundImage, images } = {
    ...Layout411Defaults,
    ...props,
  };

  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const imageSlideTop = useTransform(scrollYProgress, [0, 1], ["0%", `-75%`]);

  return (
    <section id="relume" className="px-[5%]">
      <div className="container">
        <div className="relative grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-20">
          <div className="flex flex-col items-start" ref={sectionRef}>
            {featureSections.map((featureSection, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-center py-8 md:h-screen md:py-0"
              >
                <p className="mb-3 font-semibold md:mb-4">{featureSection.tagline}</p>
                <h1 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {featureSection.heading}
                </h1>
                <p className="md:text-md">{featureSection.description}</p>
                <div className="mt-6 flex items-center gap-4 md:mt-8">
                  {featureSection.buttons.map((button, buttonIndex) => (
                    <Button key={buttonIndex} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
                <div
                  className="mt-10 block w-full bg-black bg-opacity-50 bg-cover bg-center p-[10%] md:hidden"
                  style={{ backgroundImage: backgroundImage.src }}
                >
                  <img
                    src={featureSection.image.src}
                    alt={featureSection.image.alt}
                    className="static size-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="sticky top-0 hidden h-screen md:block">
            <div className="relative top-[10%] h-4/5 overflow-hidden">
              <motion.div className="relative z-10" style={{ y: imageSlideTop }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="flex h-screen w-full items-center justify-center pb-[20vh]"
                  >
                    <img src={image.src} alt={image.alt} className="w-4/5" />
                  </div>
                ))}
              </motion.div>
              <img
                src={backgroundImage.src}
                alt={backgroundImage.alt}
                className="absolute inset-0 -z-10 size-full object-cover brightness-50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout411Defaults: Props = {
  featureSections: [
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
  images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
      alt: "Relume placeholder image 1",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
      alt: "Relume placeholder image 2",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
      alt: "Relume placeholder image 3",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
      alt: "Relume placeholder image 4",
    },
  ],
  backgroundImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait3.svg",
    alt: "Relume placeholder backgroundimage",
  },
};
