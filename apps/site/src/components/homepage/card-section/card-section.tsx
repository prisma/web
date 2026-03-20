"use client";

import { LogoGrid } from "./logo-grid";

interface TwoColumnItem {
  content: any[];
  imageUrl: string | null;
  imageAlt: string | null;
  mobileImageUrl: string | null;
  mobileImageAlt: string | null;
  logos: any[] | null;
  useDefaultLogos: boolean;
  visualPosition: "left" | "right";
  visualType: "logoGrid" | "image";
}

interface CardSectionProps {
  cardSection: TwoColumnItem[];
}

export const CardSection = ({ cardSection }: CardSectionProps) => {
  return (
    <div className="max-w-[1240px] mx-auto mt-8 px-6 overflow-visible">
      {cardSection.map((item, index) => (
        <section
          key={index}
          className="py-16 lg:py-12 md:py-8 sm:py-6 w-full overflow-visible"
        >
          <div
            className={`flex gap-16 lg:gap-12 md:gap-8 sm:gap-6 items-center overflow-visible ${
              item.visualPosition === "left"
                ? "flex-row-reverse lg:flex-col"
                : ""
            } [&_h2]:mt-0`}
          >
            <div
              className={
                item.visualType === "logoGrid"
                  ? "flex-1 min-w-0 max-w-[40%] lg:max-w-full overflow-visible"
                  : "flex-1 min-w-0 overflow-visible w-full"
              }
            >
              {item.content}
            </div>
            <div className="flex-1 min-w-0 overflow-visible w-full">
              {item.visualType === "logoGrid" && item.useDefaultLogos && (
                <LogoGrid />
              )}
              {item.visualType === "image" && item.imageUrl && (
                <>
                  <img
                    className="w-full h-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] sm:hidden"
                    src={item.imageUrl}
                    alt={item.imageAlt || ""}
                  />
                  {item.mobileImageUrl && (
                    <img
                      className="hidden sm:block w-full h-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]"
                      src={item.mobileImageUrl}
                      alt={item.mobileImageAlt || ""}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

const BlueDot = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
    >
      <g filter="url(#filter0_dddddd_1828_18323)">
        <circle cx="19" cy="19" r="3" fill="#92EFE6" />
        <circle
          cx="19"
          cy="19"
          r="2.68942"
          stroke="#2D3748"
          strokeWidth="0.621156"
        />
      </g>
      <defs>
        <filter
          id="filter0_dddddd_1828_18323"
          x="0"
          y="0"
          width="38"
          height="38"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.221381" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.106835 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1828_18323"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.532008" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.153479 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1828_18323"
            result="effect2_dropShadow_1828_18323"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.00172" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.19 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_1828_18323"
            result="effect3_dropShadow_1828_18323"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.7869" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.226521 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_1828_18323"
            result="effect4_dropShadow_1828_18323"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3.34221" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.273165 0"
          />
          <feBlend
            mode="normal"
            in2="effect4_dropShadow_1828_18323"
            result="effect5_dropShadow_1828_18323"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254902 0 0 0 0 0.764706 0 0 0 0 0.694118 0 0 0 0.38 0"
          />
          <feBlend
            mode="normal"
            in2="effect5_dropShadow_1828_18323"
            result="effect6_dropShadow_1828_18323"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect6_dropShadow_1828_18323"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
