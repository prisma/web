// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  button: ButtonProps;
};

export type Navbar4Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar4 = (props: Navbar4Props) => {
  const { logo, navLinks, button } = {
    ...Navbar4Defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section
      id="relume"
      className="relative z-[999] flex min-h-16 w-full items-center border-b border-b-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full items-center justify-between">
        <a href={logo.url}>
          <img src={logo.src} alt={logo.alt} />
        </a>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <Button {...button} className="px-4 py-1 md:px-6 md:py-2">
            {button.title}
          </Button>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:mr-0"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="relative flex size-6 flex-col items-center justify-center">
              <motion.span
                className="absolute top-[3px] h-0.5 w-full bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={topLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-black"
                animate={isMobileMenuOpen ? "openSecond" : "closeSecond"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute bottom-[3px] h-0.5 w-full bg-black"
                animate={isMobileMenuOpen ? "open" : "close"}
                variants={bottomLineVariants}
              />
            </span>
          </button>
        </div>
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
            className="absolute left-0 right-0 top-full w-full overflow-hidden"
          >
            <motion.div
              variants={{
                open: { y: 0 },
                close: { y: "-100%" },
              }}
              animate={isMobileMenuOpen ? "open" : "close"}
              initial="close"
              exit="close"
              transition={{ duration: 0.5 }}
              className="absolute left-0 right-0 top-0 block h-dvh overflow-auto bg-background-primary px-[5%]"
            >
              <div className="-mt-18 flex h-full flex-col justify-center">
                {navLinks.map((navLink, index) =>
                  navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                    <SubMenu
                      key={index}
                      navLink={navLink}
                      closeMobileMenu={() => setIsMobileMenuOpen(false)}
                    />
                  ) : (
                    <a
                      key={index}
                      href={navLink.url}
                      className="static block py-3 text-xl leading-[30px] lg:my-2 lg:py-2 lg:text-2xl lg:leading-[1.5]"
                    >
                      {navLink.title}
                    </a>
                  ),
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SubMenu = ({
  navLink,
  closeMobileMenu,
}: {
  navLink: NavLink;
  closeMobileMenu: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="static flex items-center gap-4 lg:gap-6"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span className="py-3 text-xl leading-[30px] lg:my-2 lg:py-2 lg:text-2xl lg:leading-[1.5]">
          {navLink.title}
        </span>
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
            variants={{
              open: {
                height: "auto",
                width: "auto",
              },
              close: {
                height: 0,
                width: 0,
              },
            }}
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            transition={{ duration: 0.2 }}
            className="static block min-w-full overflow-hidden bg-background-primary"
            ref={menuRef}
          >
            {navLink.subMenuLinks?.map((subMenuLink, subIndex) => (
              <a
                key={subIndex}
                href={subMenuLink.url}
                className="ml-6 block py-4 text-xl leading-[30px] lg:my-2 lg:py-2 lg:text-2xl lg:leading-[1.5]"
                onClick={closeMobileMenu}
                role="button"
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

export const Navbar4Defaults: Props = {
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
    width: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" },
  },
};

const middleLineVariants = {
  open: {
    rotate: 135,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" },
  },
  close: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  openSecond: {
    rotate: 45,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" },
  },
  closeSecond: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const bottomLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" },
  },
};
