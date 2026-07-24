// @ts-nocheck
"use client"

import { Button, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
  video: string;
  videoImage: ImageProps;
};

export type Header139Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header139 = (props: Header139Props) => {
  const { heading, description, buttons, image, video, videoImage } = {
    ...Header139Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const { scrollYProgress } = useScroll();

  const containerMotion = {
    y: useTransform(scrollYProgress, [0, 0.4], ["0vh", "-5vh"]),
    width: useTransform(scrollYProgress, [0, 0.4], ["90%", "100%"]),
    height: useTransform(scrollYProgress, [0, 0.4], ["90vh", "100vh"]),
  };

  const imageTranslate = {
    y: useTransform(scrollYProgress, [0.4, 1], ["0%", "70%"]),
  };

  const videoDialogTranslate = {
    y: useTransform(scrollYProgress, [0.3, 0.4], ["0%", "200%"]),
  };

  return (
    <section id="relume" className="relative flex h-[150vh] flex-col items-center">
      <motion.div
        className="sticky top-[5vh] z-10 mb-[-5vh] mt-[5vh] flex h-[90vh] w-[90%] flex-col items-start justify-center overflow-hidden"
        style={containerMotion}
      >
        <div className="px-[5%] py-16 md:py-24 lg:py-28">
          <div className="container relative z-10 max-w-md">
            <h1 className="mb-5 text-6xl font-bold text-text-alternative md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <p className="text-text-alternative md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <motion.div className="absolute inset-0 z-0" style={imageTranslate}>
          <img src={image.src} alt={image.alt} className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
        <Dialog>
          <DialogTrigger className="hidden md:flex" asChild>
            <motion.button
              className="absolute bottom-[5%] right-[5%] flex w-full items-center justify-center md:max-w-[14rem] lg:max-w-xxs"
              style={videoDialogTranslate}
            >
              <img src={videoImage.src} alt={videoImage.alt} className="size-full object-cover" />
              <FaCirclePlay className="absolute z-20 size-16 text-white" />
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            {!isIframeLoaded && <CgSpinner className="mx-auto size-16 animate-spin text-white" />}
            <iframe
              className={clsx("z-0 mx-auto aspect-video size-full md:w-[738px] lg:w-[940px]", {
                visible: isIframeLoaded,
                hidden: !isIframeLoaded,
              })}
              src={video}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsIframeLoaded(true)}
            ></iframe>
          </DialogContent>
        </Dialog>
      </motion.div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

export const Header139Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  videoImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
};
