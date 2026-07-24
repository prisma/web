// @ts-nocheck
"use client"

import React, { useState } from "react";
import { BiSolidStar } from "react-icons/bi";
import { FaCirclePlay } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";
import { Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  numberOfStars: number;
  quote: string;
  image: ImageProps;
  video: string;
  name: string;
  position: string;
  logo: ImageProps;
};

export type Testimonial14Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial14 = (props: Testimonial14Props) => {
  const { numberOfStars, quote, image, video, name, position, logo } = {
    ...Testimonial14Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
          <div className="order-last md:order-first">
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex w-full items-center justify-center">
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
          <div className="flex flex-col items-start">
            <div>
              <div className="mb-6 flex md:mb-8">
                {Array(numberOfStars)
                  .fill(null)
                  .map((_, starIndex) => (
                    <BiSolidStar key={starIndex} className="size-6" />
                  ))}
              </div>
              <blockquote className="text-xl font-bold md:text-2xl">{quote}</blockquote>
            </div>
            <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
              <div>
                <p className="font-semibold">{name}</p>
                <p>{position}</p>
              </div>
              <div className="mx-4 w-px self-stretch bg-background-alternative sm:mx-0" />
              <div>
                <img src={logo.src} alt={logo.alt} className="max-h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Testimonial14Defaults: Props = {
  numberOfStars: 5,
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  name: "Name Surname",
  position: "Position, Company name",
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
};
