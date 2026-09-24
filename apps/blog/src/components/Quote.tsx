"use client";

import Image from "next/image";

type QuoteProps = {
  speakerImgLink?: string;
  speakerName?: string;
  position?: string;
  companyLink?: string;
  companyName?: string;
} & React.ComponentPropsWithoutRef<"div">;

export function Quotes({
  speakerImgLink,
  speakerName,
  position,
  companyName,
  companyLink,
  children,
  ...props
}: QuoteProps) {
  return (
    <div
      className="mt-10 mb-10 rounded-square-high border border-stroke-neutral bg-paper p-8 text-foreground-neutral shadow-box-low [&_p]:mb-[30px] [&_p]:text-center [&_p]:text-xl [&_p]:leading-8 [&_p]:italic [&_p]:font-normal"
      {...props}
    >
      <div className="mb-6 text-xl leading-8 text-foreground-neutral-weak [&>*]:my-0!">
        {children}
      </div>
      <div className="flex items-center justify-center [&_img]:size-8 [&_img]:shrink-0 [&_img]:rounded-full [&_img]:object-cover [&_img]:bg-background-neutral-strong [&_img]:my-0! [&_img]:mr-4 [&_span]:font-bold [&_span]:not-italic [&_span]:text-lg [&_span]:leading-[29px] [&_span_a]:underline [&_span_a]:text-lg">
        {speakerImgLink && (
          <Image
            alt={speakerName || "Speaker photo"}
            width={50}
            height={50}
            src={speakerImgLink.startsWith("/") ? speakerImgLink : `${speakerImgLink}?w=50&h=50`}
          />
        )}
        <span>
          {speakerName && `${speakerName}${position ? "," : ""}`} {position}
          {companyName && (
            <>
              {" "}
              at <a href={companyLink}>{companyName}</a>{" "}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
