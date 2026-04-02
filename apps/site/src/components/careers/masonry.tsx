"use client";

import Image from "next/image";
import { useState } from "react";

const gutterClasses: Record<string, string> = {
  "10px": "[column-gap:10px]",
  "16px": "[column-gap:16px]",
};

export const MasonryPict = ({
  images,
  gutter,
}: {
  images: any[];
  gutter: string;
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => new Set(prev).add(idx));
  };

  return (
    <div className="w-full">
      <div className="max-w-[1232px] w-full p-4 mx-auto">
        <div
          className={`mx-auto columns-1 text-center min-[350px]:columns-2 min-[750px]:columns-3 min-[940px]:columns-4 min-[1124px]:columns-5 ${gutterClasses[gutter] ?? gutterClasses["16px"]}`}
        >
          {images.map((e: any, idx: number) => (
            <div key={idx} className="mx-auto mb-4 break-inside-avoid">
              <Image
                src={e.imageUrl}
                width={400}
                height={400}
                alt={`img-${idx}`}
                className={`mx-auto h-auto w-full rounded-lg shadow-[0px_18px_42px_0px_rgba(23,43,77,0.08),0px_4px_26px_0px_rgba(23,43,77,0.05),0px_0px_46px_0px_rgba(23,43,77,0.01)] transition-opacity duration-500 ${
                  loadedImages.has(idx) ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
