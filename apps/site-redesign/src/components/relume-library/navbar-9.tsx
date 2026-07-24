// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronDown } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SubMenuLink = {
  url: string;
  image: ImageProps;
  title: string;
  description: string;
};

type LinkGroup = {
  subMenuLinks: SubMenuLink[];
};

type DropdownFooter = {
  title: string;
  link: string;
  url: string;
};

type MegaMenuProps = {
  linkGroups: LinkGroup[];
  dropdownFooter: DropdownFooter;
};

type NavLink = {
  url: string;
  title: string;
  megaMenu?: MegaMenuProps;
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar9Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar9 = (props: Navbar9Props) => {
  const { logo, navLinks, buttons } = {
    ...Navbar9Defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  return (
    <section
      id="relume"
      className="relative z-[999] flex min-h-16 w-full items-center border-b border-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        <a href={logo.url}>
          <img src={logo.src} alt={logo.alt} />
        </a>
        <div className="absolute hidden h-screen overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-24 pt-4 md:pb-0 lg:static lg:ml-6 lg:flex lg:h-auto lg:flex-1 lg:items-center lg:justify-between lg:border-none lg:bg-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center lg:flex-row">
            {navLinks.map((navLink, index) =>
              navLink.megaMenu ? (
                <SubMenu
                  key={index}
                  megaMenu={navLink.megaMenu}
                  title={navLink.title}
                  isMobile={isMobile}
                />
              ) : (
                <a
                  key={index}
                  href={navLink.url}
                  className="relative block w-auto py-3 text-md lg:inline-block lg:px-4 lg:py-6 lg:text-base"
                >
                  {navLink.title}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-4">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <button
          className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-black"
            animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
            variants={topLineVariants}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-black"
            animate={isMobileMenuOpen ? "open" : "closed"}
            variants={middleLineVariants}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-black"
            animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
            variants={bottomLineVariants}
          />
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={{
              open: { height: "100dvh" },
              close: { height: "auto" },
            }}
            animate={isMobileMenuOpen ? "open" : "close"}
            initial="close"
            exit="close"
            className="absolute left-0 right-0 top-full w-full overflow-hidden lg:hidden"
            transition={{ duration: 0.4 }}
          >
            <motion.div
              variants={{
                open: { y: 0 },
                close: { y: "-100%" },
              }}
              animate={isMobileMenuOpen ? "open" : "close"}
              initial="close"
              exit="close"
              transition={{ duration: 0.4 }}
              className="absolute left-0 right-0 top-0 block h-dvh overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-8 pt-4"
            >
              <div className="flex flex-col">
                {navLinks.map((navLink, index) =>
                  navLink.megaMenu ? (
                    <SubMenu
                      key={index}
                      megaMenu={navLink.megaMenu}
                      title={navLink.title}
                      isMobile={isMobile}
                    />
                  ) : (
                    <a key={index} href={navLink.url} className="block py-3 text-md">
                      {navLink.title}
                    </a>
                  ),
                )}
                <div className="mt-6 flex flex-col gap-4">
                  {buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SubMenu = ({
  title,
  megaMenu,
  isMobile,
}: {
  title: string;
  megaMenu: MegaMenuProps;
  isMobile: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="relative flex w-full items-center justify-between whitespace-nowrap py-3 text-md lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <motion.span
          animate={isDropdownOpen ? "rotated" : "initial"}
          variants={{
            rotated: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <RxChevronDown />
        </motion.span>
      </button>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.nav
            variants={{
              open: {
                opacity: 1,
                height: "var(--height-open, auto)",
              },
              close: {
                opacity: 0,
                height: "var(--height-close, 0)",
              },
            }}
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            transition={{ duration: 0.2 }}
            className="bottom-auto left-0 top-full w-full min-w-full max-w-full overflow-hidden bg-background-primary lg:absolute lg:w-screen lg:border-b lg:border-border-primary lg:px-[5%] lg:[--height-close:auto]"
          >
            <div className="mx-auto flex size-full max-w-full items-center justify-between">
              <div className="flex w-full flex-col lg:flex-row">
                <div className="grid flex-1 grid-cols-1 content-start items-start gap-x-8 gap-y-2 py-4 md:grid-cols-2 md:gap-y-6 md:py-8 lg:auto-cols-fr lg:grid-cols-4 lg:content-stretch lg:items-stretch lg:gap-y-0">
                  {megaMenu.linkGroups.map((linkGroup, index) => (
                    <React.Fragment key={index}>
                      {linkGroup.subMenuLinks.map((subMenuLink, index) => (
                        <a
                          key={index}
                          href={subMenuLink.url}
                          className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                        >
                          <div className="flex size-6 flex-col items-center justify-center">
                            <img
                              src={subMenuLink.image.src}
                              alt={subMenuLink.image.alt}
                              className="shrink-0"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h5 className="font-semibold">{subMenuLink.title}</h5>
                            <p className="hidden text-sm md:block">{subMenuLink.description}</p>
                          </div>
                        </a>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mb-6 flex w-full flex-col items-start justify-between p-6 sm:items-center lg:mb-0 lg:flex-row lg:px-0 lg:py-3">
              <div className="absolute -left-[50vw] -right-[50vw] bottom-0 top-0 w-[200vw] bg-background-secondary" />
              <div className="relative z-10 mr-auto flex flex-col gap-y-4 sm:mx-auto sm:grid sm:auto-cols-fr sm:grid-cols-[max-content_max-content] sm:gap-x-1">
                <p>{megaMenu.dropdownFooter.title}</p>
                <a href={megaMenu.dropdownFooter.url} className="underline">
                  {megaMenu.dropdownFooter.link}
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar9Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Logo image",
  },
  navLinks: [
    { title: "Link One", url: "#" },
    { title: "Link Two", url: "#" },
    { title: "Link Three", url: "#" },
    {
      title: "Link Four",
      url: "#",
      megaMenu: {
        linkGroups: [
          {
            subMenuLinks: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 1",
                },
                title: "Page one",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
          {
            subMenuLinks: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 2",
                },
                title: "Page two",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
          {
            subMenuLinks: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 3",
                },
                title: "Page three",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
          {
            subMenuLinks: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 4",
                },
                title: "Page four",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
        ],
        dropdownFooter: {
          title: "Looking for a new career?",
          link: "Get in touch",
          url: "#",
        },
      },
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
