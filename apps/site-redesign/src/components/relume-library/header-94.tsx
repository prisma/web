// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
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
  image: ImageProps;
  video: string;
};

export type Header94Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header94 = (props: Header94Props) => {
  const { heading, description, buttons, image, video } = {
    ...Header94Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 border border-border-primary lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex size-full items-center justify-center">
                  <img src={image.src} alt={image.alt} className="size-full object-cover" />
                  <span className="absolute inset-0 z-10 bg-black/50" />
                  <FaCirclePlay className="absolute z-20 size-16 text-white" />
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
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header94Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "primary" },
    { title: "Button", variant: "secondary" },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
};
