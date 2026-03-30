"use client";
// @ts-ignore - no types available for react-responsive-masonry
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";

export const MasonryPict = ({
  images,
  gutter,
}: {
  images: any[];
  gutter: string;
}) => {
  return (
    <div className="w-full">
      <div className="max-w-[1232px] w-full p-4 mx-auto [&_>_div_>_div]:items-center!">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 3, 940: 4, 1124: 5 }}
        >
          <Masonry gutter={gutter} center>
            {images.map((e: any, idx: number) => (
              <Image
                key={idx}
                src={e.imageUrl}
                width={400}
                height={400}
                alt={`img-${idx}`}
                className="w-full rounded-lg shadow-[0px_18px_42px_0px_rgba(23,43,77,0.08),0px_4px_26px_0px_rgba(23,43,77,0.05),0px_0px_46px_0px_rgba(23,43,77,0.01)]"
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
};
