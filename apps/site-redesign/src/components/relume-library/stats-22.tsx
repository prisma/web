// @ts-nocheck
import { Dialog, DialogTrigger, DialogContent } from "@relume_io/relume-ui";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  video: string;
  stats: StatsProps[];
  image: ImageProps;
};

export type Stats22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats22 = (props: Stats22Props) => {
  const { tagline, heading, description, stats, image, video } = {
    ...Stats22Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 md:gap-y-0 lg:grid-cols-[0.5fr_1fr]">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 md:p-8 lg:grid-cols-1 lg:gap-x-0 lg:p-12">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="mb-2 text-6xl font-bold leading-[1.2] md:text-9xl lg:text-10xl">
                  {stat.percentage}
                </p>
                <h3 className="text-md font-bold leading-[1.4] md:text-xl">{stat.heading}</h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex size-full w-full items-center justify-center">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[3/2] size-full object-cover"
                  />
                  <span className="absolute inset-0 z-10 bg-black/50" />
                  <FaCirclePlay className="absolute z-20 size-16 text-white" />
                </button>
              </DialogTrigger>
              <DialogContent>
                {!isIframeLoaded && (
                  <CgSpinner className="mx-auto size-16 animate-spin text-white" />
                )}
                <iframe
                  className={clsx(
                    "z-0 mx-auto aspect-video h-full w-full md:w-[738px] lg:w-[940px]",
                    {
                      visible: isIframeLoaded,
                      hidden: !isIframeLoaded,
                    },
                  )}
                  src={video}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsIframeLoaded(true)}
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stats22Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  stats: [
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
  ],
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://assets-global.website-files.com/624380709031623bfe4aee60/6243807090316259584aee68_placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
};
