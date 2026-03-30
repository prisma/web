"use client";
import { useState } from "react";

const logoParade = [
  {
    label: "Gatsby",
    imageUrl: `/icons/companies/gatsby.svg`,
    url: "https://www.gatsbyjs.com",
    width: 107,
    height: 29,
  },
  {
    label: "Rapha",
    imageUrl: `/icons/companies/rapha.svg`,
    url: "https://www.rapha.cc/",
    width: 85,
    height: 39,
  },
  {
    label: "Poppy",
    imageUrl: `/icons/companies/poppy.svg`,
    url: "https://poppy.be/",
    width: 110,
    height: 40,
  },
  {
    label: "Twiga",
    imageUrl: `/icons/companies/twiga.svg`,
    url: "https://twiga.com/",
    width: 55,
    height: 61,
  },
  {
    label: "Panther",
    imageUrl: `/icons/companies/panther.svg`,
    url: "https://www.panther.co/",
    width: 122,
    height: 28,
  },
  {
    label: "Grover",
    imageUrl: `/icons/companies/grover.svg`,
    url: "https://www.grover.com/",
    width: 97,
    height: 26,
  },
  {
    label: "Invisible",
    imageUrl: `/icons/companies/invisible.svg`,
    url: "https://inv.tech/",
    width: 182,
    height: 36,
  },
  {
    label: "Elsevier",
    imageUrl: `/icons/companies/elsevier.svg`,
    url: "https://www.elsevier.com/",
    width: 177,
    height: 48,
  },
  {
    label: "Tryg",
    imageUrl: `/icons/companies/tryg.svg`,
    url: "https://www.tryg.com/",
    width: 105,
    height: 45,
  },
  {
    label: "IHI",
    imageUrl: `/icons/companies/ihi.svg`,
    url: "https://www.ihiterrasun.com/",
    width: 225,
    height: 55,
  },
  {
    label: "Insta",
    imageUrl: `/icons/companies/insta.svg`,
    url: "",
    width: 225,
    height: 55,
  },
  {
    label: "Outrider",
    imageUrl: `/icons/companies/outrider.svg`,
    url: "https://outrider.org/",
    width: 225,
    height: 55,
  },
  {
    label: "Oxio",
    imageUrl: `/icons/companies/oxio.svg`,
    url: "https://oxio.com/",
    width: 225,
    height: 55,
  },
  {
    label: "Southpole",
    imageUrl: `/icons/companies/southpole.svg`,
    url: "https://www.southpole.com/",
    width: 173,
    height: 32,
  },
];

const keyframes = `
  @keyframes scroll-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

export default function LogoParade() {
  const [paused, setPaused] = useState(false);
  const allItems = [...logoParade, ...logoParade];

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 overflow-hidden">
      <style>{keyframes}</style>
      {/* Ticker wrapper */}
      <div className="relative overflow-hidden max-w-[1200px] mx-auto">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-100 z-10 bg-linear-to-r from-background-default to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-100 z-10 bg-linear-to-l from-background-default to-transparent" />

        {/* Track */}
        <div
          className="flex gap-24 w-max"
          style={{
            animation: `scroll-left 110s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {allItems.map((item, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 invert-100 dark:brightness-150 dark:hover:filter-none contrast-75 grayscale hover:filter-none"
            >
              <img
                src={item.imageUrl}
                width={item.width}
                height={item.height}
                alt={item.label}
                className="w-full h-full object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
