// @ts-nocheck
"use client"

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { Button, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  video: string;
  image: ImageProps;
};

export type Header75Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header75 = (props: Header75Props) => {
  const { heading, description, buttons, video, image } = {
    ...Header75Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const halfViewportHeight = typeof window !== "undefined" ? window.innerHeight * 0.5 : 100;
  const { scrollY } = useScroll();

  const contentMotion = {
    scale: useTransform(scrollY, [0, halfViewportHeight], [1, 0.95]),
    opacity: useTransform(scrollY, [0, halfViewportHeight], [1, 0]),
  };

  return (
    <section id="relume" className="px-[5%]">
      <div className="container">
        <div className="relative flex h-[300vh] flex-col">
          <motion.div
            className="sticky top-0 z-0 mx-auto flex min-h-[80vh] max-w-lg items-center justify-center py-16 text-center md:py-24 lg:py-28"
            style={contentMotion}
          >
            <div className="w-full max-w-xl text-center">
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                {heading}
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
          </motion.div>
          <div className="sticky top-0 z-10 flex h-screen flex-col justify-center lg:top-[10vh] lg:justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex w-full items-center justify-center">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-[80vh] max-h-[25rem] w-full object-cover sm:max-h-[30rem] md:max-h-[40rem] lg:max-h-none"
                  />
                  <FaCirclePlay className="absolute z-20 size-16 text-white" />
                  <span className="absolute inset-0 z-10 bg-black/50" />
                </button>
              </DialogTrigger>
              <DialogContent>
                {!isIframeLoaded && (
                  <CgSpinner className="mx-auto size-16 animate-spin text-white" />
                )}
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
          </div>
          <div className="absolute inset-0 -z-10 mt-[100vh]" />
        </div>
      </div>
    </section>
  );
};

export const Header75Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
};
