// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
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
  video: string;
  image: ImageProps;
};

export type Header13Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header13 = (props: Header13Props) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const { heading, description, buttons, video, image } = {
    ...Header13Defaults,
    ...props,
  };
  return (
    <section id="relume" className="flex h-svh min-h-svh flex-col">
      <div className="relative flex-1">
        <Dialog>
          <DialogTrigger asChild>
            <button className="absolute inset-0 flex size-full items-center justify-center object-cover">
              <img src={image.src} alt={image.alt} className="size-full object-cover" />
              <span className="absolute inset-0 z-10 bg-black/50" />
              <FaCirclePlay className="absolute z-20 size-16 text-white" />
            </button>
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
      </div>
      <div className="px-[5%]">
        <div className="container">
          <div className="grid grid-rows-1 items-start gap-y-5 py-12 md:grid-cols-2 md:gap-x-12 md:gap-y-8 md:py-18 lg:gap-x-20 lg:gap-y-16 lg:py-20">
            <h1 className="text-6xl font-bold text-text-primary md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <div>
              <p className="text-base text-text-primary md:text-md">{description}</p>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
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
    </section>
  );
};

export const Header13Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
};
