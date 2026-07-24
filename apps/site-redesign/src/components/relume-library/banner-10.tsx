// @ts-nocheck
"use client"

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

type Props = {
  link: {
    url: string;
    title: string;
  };
  headingStart: string;
  headingEnd: string;
};

export type Banner10Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner10 = (props: Banner10Props) => {
  const { headingStart, link, headingEnd } = {
    ...Banner10Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section id="relume" className="border-b border-border-primary bg-neutral-white px-[5%]">
      <div className="relative flex items-center justify-start py-2">
        <div className="mr-4 flex-1 md:ml-12 md:mr-0 md:text-center">
          <span>
            {headingStart}{" "}
            <a href={link.url} className="underline">
              {link.title}
            </a>{" "}
            {headingEnd}
          </span>
        </div>
        <button className="md:ml-4">
          <RxCross2 className="size-8 p-1" onClick={() => setIsVisible(false)} />
        </button>
      </div>
    </section>
  );
};

export const Banner10Defaults: Props = {
  headingStart: "Medium length banner heading",
  link: {
    url: "#",
    title: "with link",
  },
  headingEnd: "goes here",
};
