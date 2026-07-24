// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "@relume_io/relume-ui";
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
  inputPlaceholder: string;
  button: ButtonProps;
  termsAndConditions: string;
  video: string;
  image: ImageProps;
};

export type Header14Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header14 = (props: Header14Props) => {
  const { heading, description, inputPlaceholder, button, termsAndConditions, video, image } = {
    ...Header14Defaults,
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
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header14Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  inputPlaceholder: "Enter your email",
  button: { title: "Sign up" },
  termsAndConditions: `
      <p class='text-xs'>
        By clicking Sign Up you're confirming that you agree with our
        <a href='#' class='underline'>Terms and Conditions</a>.
      </p>
      `,
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
    alt: "Relume placeholder image",
  },
};
