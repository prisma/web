// @ts-nocheck
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { RxChevronRight } from "react-icons/rx";

type TransformParams = {
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
  isTablet: boolean;
};

type ImageProps = {
  src: string;
  alt?: string;
};

type ContentProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type Props = {
  content: ContentProps;
  images: ImageProps[];
};

export type Layout425Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

const imageClasses = {
  one: "absolute -left-16 bottom-[80%] w-full max-w-[9rem] sm:-left-8 sm:max-w-[15rem] md:bottom-3/4 md:left-[20%] lg:max-w-xs",
  two: "absolute -left-8 top-[72%] w-full max-w-[9rem] sm:-left-24 sm:top-[60%] sm:max-w-[15rem] md:left-auto md:top-[65%] lg:max-w-xs",
  three:
    "absolute top-[75%] w-full max-w-[9rem] sm:top-[65%] sm:max-w-[15rem] md:-right-[80%] md:top-[80%] lg:max-w-xs",
  four: "absolute -right-8 bottom-[78%] w-full max-w-[9rem] sm:-right-24 sm:bottom-[72%] sm:max-w-[15rem] md:bottom-[70%] md:right-0 lg:max-w-xs",
  five: "absolute -right-16 bottom-[15%] flex w-full max-w-[9rem] items-center sm:-right-12 sm:bottom-[12%] sm:max-w-[15rem] md:-bottom-[5%] md:right-[10%] lg:bottom-[-15%] lg:max-w-xs",
};

export const Layout425 = (props: Layout425Props) => {
  const { content, images } = {
    ...Layout425Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 991px)");
  const { scrollYProgress } = useScroll();

  const transforms = useLayoutTransforms(scrollYProgress, isMobile, isTablet);

  return (
    <section id="relume" className="relative h-[200vh] md:pb-[12%] lg:pb-[15%]">
      <div className="sticky top-0 z-10 flex min-h-[120vh] flex-col items-center justify-center overflow-hidden md:min-h-screen md:overflow-visible">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center md:right-auto md:ml-[5%] md:w-[30%] md:justify-start">
          <motion.div className={imageClasses.one} style={transforms.imageOne}>
            <img src={images[0].src} alt={images[0].alt} className="size-full" />
          </motion.div>
          <motion.div className={imageClasses.two} style={transforms.imageTwo}>
            <img src={images[1].src} alt={images[1].alt} className="size-full" />
          </motion.div>
          <motion.div className={imageClasses.three} style={transforms.imageThree}>
            <img src={images[2].src} alt={images[2].alt} className="size-full" />
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center md:mx-[5%] md:w-[30%] md:justify-end">
          <motion.div className={imageClasses.four} style={transforms.imageFour}>
            <img src={images[3].src} alt={images[3].alt} className="size-full" />
          </motion.div>
          <motion.div className={imageClasses.five} style={transforms.imageFive}>
            <img src={images[4].src} alt={images[4].alt} className="size-full" />
          </motion.div>
        </div>
        <motion.div className="relative z-10 -mt-[20%] md:mt-0" style={transforms.content}>
          <div className="px-[5%] py-16 md:py-24 lg:py-28">
            <div className="container max-w-lg">
              <div className="text-center">
                <p className="mb-3 font-semibold md:mb-4">{content.tagline}</p>
                <h1 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {content.heading}
                </h1>
                <p className="md:text-md">{content.description}</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
                  {content.buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

const createTransform = (
  { scrollYProgress, isMobile, isTablet }: TransformParams,
  mobileValues: [string, string],
  tabletValues: [string, string],
  desktopValues: [string, string],
) => {
  const values = isMobile ? mobileValues : isTablet ? tabletValues : desktopValues;
  return useTransform(scrollYProgress, [0, 1], values);
};

export const useLayoutTransforms = (
  scrollYProgress: MotionValue<number>,
  isMobile: boolean,
  isTablet: boolean,
) => {
  const params = { scrollYProgress, isMobile, isTablet };

  return {
    content: {
      opacity: useTransform(scrollYProgress, [0, 1], [0, 1]),
      scale: useTransform(scrollYProgress, [0, 1], [0.95, 1]),
    },
    imageOne: {
      x: createTransform(params, ["60%", "0%"], ["40%", "0%"], ["90%", "0%"]),
      y: createTransform(params, ["25vh", "0%"], ["60%", "0%"], ["70%", "0%"]),
    },
    imageTwo: {
      x: createTransform(params, ["50%", "0%"], ["80%", "0%"], ["90%", "0%"]),
      y: createTransform(params, ["-20vh", "0%"], ["-40%", "0%"], ["-50%", "0%"]),
    },
    imageThree: {
      x: createTransform(params, ["0%", "0%"], ["10%", "0%"], ["10%", "0%"]),
      y: createTransform(params, ["-45vh", "0%"], ["-140%", "0%"], ["-130%", "0%"]),
    },
    imageFour: {
      x: createTransform(params, ["-50%", "0%"], ["-70%", "0%"], ["-80%", "0%"]),
      y: createTransform(params, ["20vh", "0%"], ["60%", "0%"], ["60%", "0%"]),
    },
    imageFive: {
      x: createTransform(params, ["-70%", "0%"], ["-60%", "0%"], ["-60%", "0%"]),
      y: createTransform(params, ["-20vh", "0%"], ["-60%", "0%"], ["-60%", "0%"]),
    },
  };
};

export const Layout425Defaults: Props = {
  content: {
    tagline: "Tagline",
    heading: "Medium length hero heading goes here",
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
  },
  images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 2",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 3",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 4",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 5",
    },
  ],
};
