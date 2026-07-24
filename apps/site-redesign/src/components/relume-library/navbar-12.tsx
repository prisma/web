// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SubNavLink = {
  title: string;
  description: string;
  url: string;
  image: ImageProps;
};

type SubMenu = {
  heading: string;
  subMenuLinks: SubNavLink[];
};

type NavLink = {
  url: string;
  title: string;
  subMenu?: SubMenu[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar12 = (props: Navbar12Props) => {
  const { logo, navLinks, buttons } = {
    ...Navbar12Defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  return (
    <section
      id="relume"
      className="z-[999] flex w-full items-center border-b border-border-primary bg-background-primary lg:min-h-18 lg:px-[5%]"
    >
      <div className="size-full lg:flex lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} />
          </a>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
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
        <motion.div
          variants={{
            open: {
              height: "var(--height-open, calc(100vh - 64px))",
            },
            close: {
              height: "var(--height-closed, 0)",
            },
          }}
          initial="close"
          exit="close"
          animate={isMobileMenuOpen ? "open" : "close"}
          transition={{ duration: 0.4 }}
          className="overflow-auto px-[5%] lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          <nav className="lg:flex lg:items-center">
            {navLinks.map((navLink, index) =>
              navLink.subMenu && navLink.subMenu.length > 0 ? (
                <SubMenu key={index} navLink={navLink} isMobile={isMobile} />
              ) : (
                <a
                  key={index}
                  href={navLink.url}
                  className="block py-3 text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base lg:first:pt-2"
                >
                  {navLink.title}
                </a>
              ),
            )}
          </nav>
          <div className="my-6 flex flex-col gap-4 lg:my-0 lg:ml-4 lg:flex-row lg:items-center">
            {buttons.map((button, index) => (
              <Button key={index} {...button} className="w-full">
                {button.title}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SubMenu = ({ navLink, isMobile }: { navLink: NavLink; isMobile: boolean }) => {
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
        <span>{navLink.title}</span>
        <motion.span
          variants={{
            rotated: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          animate={isDropdownOpen ? "rotated" : "initial"}
          transition={{ duration: 0.3 }}
        >
          <RxChevronDown />
        </motion.span>
      </button>
      {isDropdownOpen && (
        <AnimatePresence>
          <motion.nav
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
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            transition={{ duration: 0.2 }}
            className="bg-background-primary py-4 lg:absolute lg:right-[186px] lg:z-50 lg:max-w-[640px] lg:border lg:border-border-primary lg:p-6 lg:[--y-close:25%]"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              {navLink.subMenu?.map((item, index) => (
                <div key={index}>
                  <h4 className="mb-3 text-sm font-semibold leading-[1.3] md:mb-4">
                    {item.heading}
                  </h4>
                  <div className="flex flex-col gap-2 md:gap-4">
                    {item.subMenuLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className="my-1 flex items-start gap-x-3 text-md lg:text-base"
                      >
                        <img src={link.image.src} alt={link.image.alt} className="size-6" />
                        <div className="flex grow flex-col">
                          <p className="font-semibold">{link.title}</p>
                          <p className="hidden text-sm md:block">{link.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.nav>
        </AnimatePresence>
      )}
    </div>
  );
};

export const Navbar12Defaults: Props = {
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
      subMenu: [
        {
          heading: "Page group one",
          subMenuLinks: [
            {
              title: "Page One",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 1",
              },
            },
            {
              title: "Page Two",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 2",
              },
            },
            {
              title: "Page Three",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 3",
              },
            },
            {
              title: "Page Four",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 4",
              },
            },
          ],
        },
        {
          heading: "Page group two",
          subMenuLinks: [
            {
              title: "Page Five",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 1",
              },
            },
            {
              title: "Page Six",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 2",
              },
            },
            {
              title: "Page Seven",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 3",
              },
            },
            {
              title: "Page Eight",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              url: "#",
              image: {
                src: "relume-icon.svg",
                alt: "Sub menu link 4",
              },
            },
          ],
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
