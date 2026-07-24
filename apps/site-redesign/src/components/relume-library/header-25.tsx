// @ts-nocheck
"use client"

import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps, InputProps } from "@relume_io/relume-ui";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {
  heading: string;
  description: string;
  inputPlaceholder?: string;
  inputIcon: InputProps;
  button: ButtonProps;
};

export type Header25Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header25 = (props: Header25Props) => {
  const { heading, description, inputPlaceholder, inputIcon, button } = {
    ...Header25Defaults,
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
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto w-full max-w-lg overflow-x-auto text-center">
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
          <div className="mx-auto mt-6 w-full max-w-md md:mt-8">
            <form
              className="grid w-full max-w-md grid-cols-[1fr_max-content] gap-4 gap-y-3"
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
    </section>
  );
};

export const Header25Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  inputPlaceholder: "Search",
  button: {
    title: "Search",
  },
  inputIcon: {
    icon: <BiSearch className="size-6" />,
    iconPosition: "left",
  },
};
