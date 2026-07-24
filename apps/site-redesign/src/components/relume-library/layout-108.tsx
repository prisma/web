// @ts-nocheck
"use client"

import { Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import clsx from "clsx";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeaturesProps = {
  icon: ImageProps;
  paragraph: string;
};

type Props = {
  heading: string;
  features: FeaturesProps[];
  description: string;
  image: ImageProps;
  video: string;
};

export type Layout108Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout108 = (props: Layout108Props) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const { heading, description, image, video, features } = {
    ...Layout108Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-20">
          <div>
            <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
          </div>
          <div>
            <p className="mb-5 md:mb-4 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-4 py-0 md:gap-6 md:py-2">
              <ul className="grid grid-cols-1 gap-4 py-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex self-start">
                    <div className="mr-4 flex-none self-start">
                      <img src={feature.icon.src} alt={feature.icon.alt} className="size-6" />
                    </div>
                    <p>{feature.paragraph}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative flex w-full items-center justify-center">
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
    </section>
  );
};

export const Layout108Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  features: [
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 1" },

      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 2" },
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 3" },
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
};
