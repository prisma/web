// @ts-nocheck
"use client"

import { useState } from "react";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Button, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { FaCirclePlay } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeaturedEvent = {
  url: string;
  image: ImageProps;
  video: string;
  duration: string;
  title: string;
  speakers: ImageProps[];
  description: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
  featuredEvents: FeaturedEvent[];
};

export type Event27Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event27 = (props: Event27Props) => {
  const { tagline, heading, description, button, featuredEvents } = {
    ...Event27Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold">{tagline}</h4>
            <h1 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="mt-5 text-base md:mt-6 md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {featuredEvents.map((event, index) => {
            return (
              <FeaturedEvent
                key={index}
                url={event.url}
                image={event.image}
                video={event.video}
                duration={event.duration}
                title={event.title}
                speakers={event.speakers}
                description={event.description}
                button={event.button}
              />
            );
          })}
        </div>
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20">
          <Button {...button}>{button.title}</Button>
        </div>
      </div>
    </section>
  );
};

const FeaturedEvent: React.FC<FeaturedEvent> = ({
  url,
  image,
  video,
  duration,
  title,
  speakers,
  description,
  button,
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative flex w-full items-center justify-center">
            <img src={image.src} alt={image.alt} className="aspect-[3/2] size-full object-cover" />
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
      <div className="mt-5 md:mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm md:mb-4">
          <MdAccessTime className="size-6 flex-none" />
          <span>{duration} minutes</span>
        </div>
        <a className="mb-2 block" href={url}>
          <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
        </a>
        <p className="mb-2">{description}</p>
        <div className="flex items-center gap-2 md:mb-4">
          <h4 className="font-semibold">Speakers:</h4>
          {speakers.length > 0 && (
            <div className="flex items-center">
              {speakers.map((speaker, index) => (
                <img
                  key={index}
                  src={speaker.src}
                  alt={speaker.alt}
                  className="-ml-2 block size-10 rounded-full border-2 border-white first-of-type:ml-0"
                />
              ))}
            </div>
          )}
        </div>
        <Button
          {...button}
          className="mt-3 flex items-center justify-center gap-x-2 text-base md:mt-4"
        >
          {button.title}
        </Button>
      </div>
    </div>
  );
};

export const Event27Defaults: Props = {
  tagline: "Tagline",
  heading: "Webinars",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: {
    variant: "secondary",
    size: "primary",
    title: "View all",
  },
  featuredEvents: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
      duration: "45",
      title: "Webinar title heading",
      speakers: [
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 1",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 2",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 3",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 4",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: {
        title: "View event",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
      duration: "45",
      title: "Webinar title heading",
      speakers: [
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 1",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 2",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 3",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 4",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: {
        title: "View event",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
      duration: "45",
      title: "Webinar title heading",
      speakers: [
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 1",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 2",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 3",
        },
        {
          src: "https://assets-global.website-files.com/624380709031623bfe4aee60/631035b9698714c1fee46997_Placeholder Small Image.svg",
          alt: "Speaker 4",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: {
        title: "View event",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
};
