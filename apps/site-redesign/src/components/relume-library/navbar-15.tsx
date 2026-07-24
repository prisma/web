// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RxChevronDown, RxChevronUp } from "react-icons/rx";

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
  button: ButtonProps;
};

export type Navbar15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar15 = (props: Navbar15Props) => {
  const { logo, navLinks, button } = {
    ...Navbar15Defaults,
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
    <section id="relume" className="flex h-screen items-end justify-center">
      <div className="fixed bottom-auto top-0 z-[999] mx-auto mt-5 flex w-full items-center justify-center px-[5%] md:mt-6 lg:bottom-0 lg:top-auto lg:mx-[5%] lg:mb-6 lg:w-auto">
        <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-4 border border-border-primary bg-white px-5 md:min-h-18 md:px-4 lg:w-auto">
          {isMobile ? (
            <a href={logo.url}>
              <img src={logo.src} alt={logo.alt} />
            </a>
          ) : (
            <a href={logo.url} className="flex size-10 items-center justify-center">
              <RxChevronUp className="size-6" />
            </a>
          )}
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
              className="absolute left-0 right-0 top-0 mx-auto min-w-full justify-self-center bg-background-primary px-[5%] text-center lg:static lg:inset-auto lg:mx-0 lg:px-0 lg:text-left lg:[--translate-y:0%]"
            >
              <div
                ref={menuRef}
                className="flex w-full flex-col border border-t-0 border-border-primary bg-background-primary p-5 md:p-8 lg:w-auto lg:flex-row lg:border-none lg:bg-none lg:p-0"
              >
                {navLinks.map((navLink, index) => (
                  <div key={index}>
                    {navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                      <SubMenu navLink={navLink} isMobile={isMobile} />
                    ) : (
                      <a
                        href={navLink.url}
                        className="relative block pb-4 pt-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
                      >
                        {navLink.title}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          <div className="flex items-center justify-center gap-4">
            <Button {...button} className="px-4 py-1 md:px-6 md:py-2">
              {button.title}
            </Button>
            <button
              ref={buttonRef}
              className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:hidden"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={topLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={middleLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={bottomLineVariants}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const SubMenu = ({ navLink, isMobile }: { navLink: NavLink; isMobile: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="relative flex w-full items-center justify-center gap-4 whitespace-nowrap py-3 text-center text-md lg:gap-2 lg:px-4 lg:py-2 lg:text-left lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{navLink.title}</span>
        <motion.span
          variants={{
            rotate: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          animate={isDropdownOpen ? "rotate" : "initial"}
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
                y: "var(--translate-y-open, 0%)",
                visibility: "visible",
                height: "auto",
              },
              close: {
                opacity: "var(--opacity-close, 100%)",
                y: "var(--translate-y-close, 0%)",
                visibility: "hidden",
                height: "var(--height, 0)",
              },
            }}
            transition={{ duration: 0.2 }}
            className="static flex w-full min-w-full flex-col overflow-hidden whitespace-nowrap border-0 border-border-primary bg-background-primary p-0 lg:absolute lg:bottom-full lg:overflow-visible lg:border lg:p-2 lg:[--height:auto] lg:[--opacity-close:0%] lg:[--opacity-open:100%] lg:[--translate-y-open:0%] lg:[--translate-y-close:-25%]"
          >
            {navLink.subMenuLinks?.map((subMenuLink, subIndex) => (
              <a
                key={subIndex}
                href={subMenuLink.url}
                className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
              >
                {subMenuLink.title}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar15Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Relume placeholder logo",
  },
  navLinks: [
    {
      url: "#",
      title: "Link One",
    },
    {
      url: "#",
      title: "Link Two",
    },
    {
      url: "#",
      title: "Link Three",
    },
    {
      url: "#",
      title: "Link Four",
      subMenuLinks: [
        {
          url: "#",
          title: "Link Five",
        },
        {
          url: "#",
          title: "Link Six",
        },
        {
          url: "#",
          title: "Link Seven",
        },
      ],
    },
  ],
  button: {
    title: "Button",
    size: "sm",
  },
};

const topLineVariants = {
  open: {
    translateY: 8,
    rotate: 45,
    transition: { duration: 0.3 },
  },
  close: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  close: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    rotate: -45,
    transition: { duration: 0.3 },
  },
  close: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};
