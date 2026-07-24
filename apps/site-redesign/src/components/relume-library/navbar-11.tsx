// @ts-nocheck
"use client"

import React, { useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SubMenuLink = {
  icon: ImageProps;
  title: string;
  description: string;
  url: string;
};

type NavLink = {
  title: string;
  url: string;
  subMenuLinks?: SubMenuLink[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar11Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar11 = (props: Navbar11Props) => {
  const { logo, navLinks, buttons } = {
    ...Navbar11Defaults,
    ...props,
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  return (
    <section
      id="relume"
      className="z-[999] flex w-full items-center border-b border-border-primary bg-background-primary md:min-h-18 lg:px-[5%]"
    >
      <div className="mx-auto size-full items-center justify-between lg:flex">
        <div className="grid min-h-16 grid-cols-2 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} />
          </a>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={mobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
              variants={topLineVariants}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={mobileMenuOpen ? "open" : "closed"}
              variants={middleLineVariants}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={mobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
              variants={bottomLineVariants}
            />
          </button>
        </div>
        <motion.div
          variants={{
            open: {
              height: "var(--height-open, 100dvh)",
            },
            close: {
              height: "var(--height-closed, 0)",
            },
          }}
          initial="close"
          exit="close"
          animate={mobileMenuOpen ? "open" : "close"}
          transition={{ duration: 0.3 }}
          className="overflow-hidden px-[5%] lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          <nav className="lg:flex lg:items-center">
            {navLinks.map((navLink, index) =>
              navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                <SubMenu
                  key={index}
                  subMenuLinks={navLink.subMenuLinks}
                  title={navLink.title}
                  isMobile={isMobile}
                />
              ) : (
                <a
                  key={index}
                  href={navLink.url}
                  className="block py-3 text-left text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base lg:first:pt-2"
                >
                  {navLink.title}
                </a>
              ),
            )}
          </nav>
          <div className="mt-6 flex flex-col gap-4 lg:ml-4 lg:mt-0 lg:flex-row lg:items-center">
            {buttons.map((button, index) => (
              <Button key={index} className="w-full" {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SubMenu = ({
  title,
  subMenuLinks,
  isMobile,
}: {
  title: string;
  subMenuLinks: SubMenuLink[];
  isMobile: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="flex w-full items-center justify-between gap-2 py-3 text-left text-md lg:flex-none lg:justify-start lg:px-4 lg:py-2 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <AnimatePresence>
          <motion.div
            animate={isDropdownOpen ? "rotated" : "initial"}
            variants={{
              rotated: { rotate: 180 },
              initial: { rotate: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <RxChevronDown />
          </motion.div>
        </AnimatePresence>
      </button>
      {isDropdownOpen && (
        <AnimatePresence>
          <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                visibility: "visible",
                opacity: "var(--opacity-open, 100%)",
                y: 0,
              },
              close: {
                visibility: "hidden",
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
              },
            }}
            transition={{ duration: 0.3 }}
            className="z-50 bg-background-primary lg:absolute lg:w-80 lg:border lg:border-border-primary lg:p-6 lg:[--y-close:25%]"
          >
            <div className="grid grid-cols-1 grid-rows-[max-content] gap-y-2 py-3 md:py-3 lg:gap-y-4 lg:py-0">
              {subMenuLinks.map((subMenuLinks, index) => (
                <a
                  key={index}
                  href={subMenuLinks.url}
                  className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2 lg:py-1"
                >
                  <div>
                    <img
                      className="size-6"
                      src={subMenuLinks.icon.src}
                      alt={subMenuLinks.icon.alt}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-md font-semibold lg:text-base">{subMenuLinks.title}</p>
                    <p className="hidden text-sm md:block">{subMenuLinks.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.nav>
        </AnimatePresence>
      )}
    </div>
  );
};

export const Navbar11Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Company logo",
  },
  navLinks: [
    { title: "Link One", url: "#" },
    { title: "Link Two", url: "#" },
    { title: "Link Three", url: "#" },
    {
      title: "Link Four",
      url: "#",
      subMenuLinks: [
        {
          icon: {
            src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
            alt: "Icon 1",
          },
          title: "Page one",
          description: "Lorem ipsum dolor sit amet consectetur elit",
          url: "#",
        },
        {
          icon: {
            src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
            alt: "Icon 2",
          },
          title: "Page two",
          description: "Lorem ipsum dolor sit amet consectetur elit",
          url: "#",
        },
        {
          icon: {
            src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
            alt: "Icon 3",
          },
          title: "Page three",
          description: "Lorem ipsum dolor sit amet consectetur elit",
          url: "#",
        },
        {
          icon: {
            src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
            alt: "Icon 4",
          },
          title: "Page four",
          description: "Lorem ipsum dolor sit amet consectetur elit",
          url: "#",
        },
      ],
    },
  ],
  buttons: [
    {
      title: "Button",
      variant: "secondary",
      size: "sm",
    },
    {
      title: "Button",
      size: "sm",
    },
  ],
};

const topLineVariants = {
  open: {
    translateY: 8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: -45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1 },
  },
  closed: {
    width: "1.5rem",
    transition: { delay: 0.3, duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: 45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};
