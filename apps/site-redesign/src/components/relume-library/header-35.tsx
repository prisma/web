// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps, InputProps } from "@relume_io/relume-ui";
import { BiSearch } from "react-icons/bi";

type Props = {
  heading: string;
  description: string;
  video: string;
  videoType: string;
  inputPlaceholder?: string;
  inputIcon: InputProps;
  button: ButtonProps;
};

export type Header35Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header35 = (props: Header35Props) => {
  const { heading, description, video, videoType, inputPlaceholder, inputIcon, button } = {
    ...Header35Defaults,
    ...props,
  };

  const [searchInput, setSearchInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      searchInput,
    });
  };

  return (
    <section id="relume" className="relative px-[5%]">
      <div className="container relative z-10">
        <div className="mx-auto flex max-h-[60rem] min-h-svh w-full max-w-lg flex-col items-center justify-center overflow-x-auto text-center">
          <div className="py-16 md:py-24 lg:py-28">
            <h1 className="mb-5 text-6xl font-bold text-text-alternative md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <p className="text-text-alternative md:text-md">{description}</p>
            <div className="mx-auto mt-6 w-full max-w-md md:mt-8">
              <form
                className="rb-4 grid w-full max-w-md grid-cols-[1fr_max-content] gap-4 gap-y-3"
                onSubmit={handleSubmit}
              >
                <Input
                  id="search"
                  type="search"
                  placeholder={inputPlaceholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  {...inputIcon}
                />
                <Button {...button}>{button.title}</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <video className="absolute inset-0 aspect-video size-full object-cover" autoPlay loop muted>
          <source src={video} type={videoType} />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Header35Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  inputPlaceholder: "Search",
  button: {
    title: "Search",
  },
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
  inputIcon: {
    icon: <BiSearch className="size-6" />,
    iconPosition: "left",
  },
};
