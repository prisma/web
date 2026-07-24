// @ts-nocheck
"use client"

import { useEffect, useRef, useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar14Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar14 = (props: Navbar14Props) => {
  const { logo, navLinks, buttons } = {
    ...Navbar14Defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      id="relume"
      className="fixed inset-0 bottom-auto z-[999] mx-auto mt-5 flex w-full bg-white px-[5%] md:mt-6 lg:mx-[5%] lg:w-auto lg:px-0"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-xxl items-center justify-between gap-x-4 gap-y-4 border border-black bg-white px-5 md:min-h-18 md:px-8">
        <a href={logo.url}>
          <img src={logo.src} alt={logo.alt} />
        </a>
        <button
          ref={buttonRef}
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
        <motion.div
          variants={{
            open: { height: "var(--height, 100vh)" },
            close: { height: "auto" },
          }}
          initial="close"
          exit="close"
          animate={isMobileMenuOpen ? "open" : "close"}
          className="absolute left-0 right-0 top-full w-full overflow-hidden lg:static lg:left-auto lg:right-auto lg:top-auto lg:w-auto lg:overflow-visible lg:[--height:auto]"
        >
          <motion.div
            variants={{
              open: { y: 0 },
              close: { y: "var(--translate-y, -100%)" },
            }}
            animate={isMobileMenuOpen ? "open" : "close"}
            initial="close"
            exit="close"
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-0 mx-auto min-w-[200px] justify-self-center bg-white px-[5%] text-center lg:static lg:inset-auto lg:mx-0 lg:px-0 lg:text-left lg:[--translate-y:0%]"
          >
            <div
              ref={menuRef}
              className="flex w-full flex-col border border-t-0 border-black bg-white p-5 md:p-8 lg:w-auto lg:flex-row lg:border-none lg:bg-none lg:p-0"
            >
              {navLinks.map((navLink, index) =>
                navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                  <SubMenu key={index} navLink={navLink} isMobile={isMobile} />
                ) : (
                  <a
                    key={index}
                    href={navLink.url}
                    className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
                  >
                    {navLink.title}
                  </a>
                ),
              )}
              <div className="rt-4 mt-4 flex flex-col items-center gap-4 lg:ml-8 lg:mt-0 lg:flex-row">
                {buttons.map((button, index) => (
                  <Button key={index} {...button} className="w-full">
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
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
        className="flex w-full items-center justify-center gap-4 py-3 text-left text-md lg:flex-none lg:justify-start lg:gap-2 lg:px-4 lg:py-2 lg:text-base"
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
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                opacity: "var(--opacity-open, 100%)",
                y: 0,
                visibility: "visible",
                height: "auto",
              },
              close: {
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
                visibility: "hidden",
                height: "var(--height, 0)",
              },
            }}
            transition={{ duration: 0.2 }}
            className="bg-white lg:absolute lg:z-50 lg:border lg:border-black lg:p-2 lg:[--y-close:25%] lg:[--height:auto]"
          >
            {navLink.subMenuLinks?.map((navLink, index) => (
              <a
                key={index}
                href={navLink.url}
                className="block py-3 text-center lg:px-4 lg:py-2 lg:text-left lg:text-base"
              >
                {navLink.title}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar14Defaults: Props = {
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
      subMenuLinks: [
        { title: "Link Five", url: "#" },
        { title: "Link Six", url: "#" },
        { title: "Link Seven", url: "#" },
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
