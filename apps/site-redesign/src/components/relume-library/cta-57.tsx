// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  headers: string[];
  description: string;
  buttons: ButtonProps[];
};

export type Cta57Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta57 = (props: Cta57Props) => {
  const { headers, description, buttons } = {
    ...Cta57Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto w-full max-w-lg text-center">
          <h1>
            {headers.map((heading, index) => (
              <motion.span
                key={index}
                initial={{ x: index % 2 === 0 ? "-50%" : "50%" }}
                animate={{ x: "0%" }}
                transition={{ type: "spring", bounce: 0 }}
                className={clsx("block text-6xl font-bold md:text-9xl lg:text-10xl", {
                  "mb-5 md:mb-6": index !== 0,
                })}
              >
                {heading}
              </motion.span>
            ))}
          </h1>
          <p className="md:text-md">{description}</p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Cta57Defaults: Props = {
  headers: ["Medium length CTA", "heading goes here"],
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
};
