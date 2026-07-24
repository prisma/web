// @ts-nocheck
"use client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  useMediaQuery,
  VideoIframe,
} from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt: string;
};

type Props = {
  title: string;
  description: string;
  buttons: ButtonProps[];
  video: string;
  image: ImageProps;
};

export type Header109Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header109 = (props: Header109Props) => {
  const { title, description, buttons, video, image } = {
    ...Header109Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 991px)");

  const { scrollYProgress } = useScroll();

  const createTransform = (
    mobileValues: string[],
    tabletValues: string[] | null,
    desktopValues: string[],
  ) =>
    useTransform(
      scrollYProgress,
      [0, 1],
      isMobile ? mobileValues : isTablet && tabletValues ? tabletValues : desktopValues,
    );

  const videoDialogMotion = {
    y: useTransform(scrollYProgress, [0.5, 1], ["0vh", "40vh"]),
    width: createTransform(["100%", "50%"], ["100%", "25%"], ["100%", "10%"]),
    height: createTransform(["100%", "25%"], ["100%", "30%"], ["100%", "20%"]),
    top: createTransform(["0%", "37.5%"], ["0%", "35%"], ["0%", "40%"]),
    left: createTransform(["0%", "25%"], ["0%", "37.5%"], ["0%", "45%"]),
  };

  return (
    <section id="relume" className="relative flex h-[300vh] flex-col items-center">
      <div className="sticky top-0 flex w-full flex-col items-center justify-center">
        <div className="relative z-10 flex h-screen w-full items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                style={videoDialogMotion}
                className="absolute inset-0 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center"
              >
                <img src={image.src} alt={image.alt} className="size-full object-cover" />
                <FaCirclePlay className="absolute z-20 size-16 text-white" />
                <span className="absolute inset-0 z-10 bg-black/50" />
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <VideoIframe video={video} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative py-16 md:py-24 lg:pb-28 lg:pt-6">
          <div className="px-[5%]">
            <div className="container max-w-lg">
              <div className="mx-auto w-full max-w-lg text-center">
                <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                  {title}
                </h1>
                <p className="md:text-md">{description}</p>
                <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
                  {buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

export const Header109Defaults: Props = {
  title: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    {
      title: "Button",
    },
    {
      title: "Button",
      variant: "secondary",
    },
  ],
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
};
