"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Marquee } from "@/components/marquee";

const logoParade = [
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
    height: 26,
  },
  {
    label: "Insta",
    imageUrl: `/icons/companies/insta.svg`,
    url: "",
    width: 150,
    height: 46,
  },
  {
    label: "Outrider",
    imageUrl: `/icons/companies/outrider.svg`,
    url: "https://outrider.org/",
    width: 201,
    height: 40,
  },
  {
    label: "Oxio",
    imageUrl: `/icons/companies/oxio.svg`,
    url: "https://oxio.com/",
    width: 200,
    height: 37,
  },
  {
    label: "Southpole",
    imageUrl: `/icons/companies/southpole.svg`,
    url: "https://www.southpole.com/",
    width: 173,
    height: 32,
  },
];

export default function LogoParade() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        <Marquee
          pauseOnHover
          fade
          fillContainer={false}
          className="max-w-full"
          innerClassName="w-max items-center"
          style={{ "--duration": "110s", "--gap": "6rem" } as CSSProperties}
        >
          {logoParade.map((item) => {
            const className = `relative 
              shrink-0 
              rounded-lg 
              overflow-hidden 
              transition-[transform,filter] 
              duration-200
              
              grayscale  
              invert-84
              sepia-5
              saturate-625
              hue-rotate-179
              brightness-77
              contrast-88
            
              hover:filter-none`;

            const logo = (
              <Image
                src={item.imageUrl}
                width={item.width}
                height={item.height}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-contain object-center"
              />
            );

            return item.url ? (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} cursor-pointer`}
              >
                {logo}
              </a>
            ) : (
              <div key={item.label} className={className}>
                {logo}
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
