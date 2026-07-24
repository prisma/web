// @ts-nocheck
"use client"

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

type Props = {
  headingStart: string;
  link: {
    url: string;
    title: string;
  };
  headingEnd: string;
};

export type Banner5Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner5 = (props: Banner5Props) => {
  const { headingStart, link, headingEnd } = {
    ...Banner5Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section id="relume" className="px-[5%]">
      <div className="container relative flex items-center justify-start border border-border-primary bg-neutral-white py-2 pl-4 pr-2 md:px-4">
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

export const Banner5Defaults: Props = {
  headingStart: "Medium length banner heading",
  link: {
    url: "#",
    title: "with link",
  },
  headingEnd: "goes here",
};
