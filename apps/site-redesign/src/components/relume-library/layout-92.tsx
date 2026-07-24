// @ts-nocheck
"use client"

import { Dialog, DialogContent, DialogTrigger, VideoIframe } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  image: ImageProps;
  video: string;
};

export type Layout92Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout92 = (props: Layout92Props) => {
  const { heading, description, image, video } = {
    ...Layout92Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-8 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
          <p className="md:text-md">{description}</p>
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
          <VideoIframe video={video} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export const Layout92Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
};
