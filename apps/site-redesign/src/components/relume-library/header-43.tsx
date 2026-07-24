// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import clsx from "clsx";
import type { ButtonProps } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  image: ImageProps;
  video: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
};

export type Header43Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header43 = (props: Header43Props) => {
  const { heading, description, image, video, inputPlaceholder, button, termsAndConditions } = {
    ...Header43Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

  return (
    <section
      id="relume"
      className="grid grid-cols-1 items-center gap-y-16 overflow-x-auto pt-16 md:pt-24 lg:grid-cols-2 lg:pt-0"
    >
      <div className="order-last lg:order-first">
        <div className="w-full object-cover lg:h-screen lg:max-h-[60rem]">
          <Dialog>
            <DialogTrigger asChild>
              <button className="relative flex size-full items-center justify-center">
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
      </div>
      <div className="mx-[5%] sm:max-w-md md:justify-self-start lg:ml-20 lg:mr-[5vw] lg:justify-self-start">
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
        <p className="md:text-md">{description}</p>
        <div className="mt-6 w-full max-w-sm md:mt-8">
          <form
            className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
            onSubmit={handleSubmit}
          >
            <Input
              id="email"
              type="email"
              placeholder={inputPlaceholder}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button {...button}>{button.title}</Button>
          </form>
          <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
        </div>
      </div>
    </section>
  );
};

export const Header43Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
  inputPlaceholder: "Enter your email",
  button: {
    title: "Sign up",
  },
  termsAndConditions: `
  <p class='text-xs'>
    By clicking Sign Up you're confirming that you agree with our
    <a href='#' class='underline'>Terms and Conditions</a>.
  </p>
  `,
};
