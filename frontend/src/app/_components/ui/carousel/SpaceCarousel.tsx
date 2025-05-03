import useEndOfCarousel from "@/app/_libs/hooks/useEndOfCarousel";
import Image from "next/image";
import { useRef } from "react";
import CarouselArrow from "./CarouselArrow";

export function SpacedCarousel({ dataURLs }: { dataURLs: string[] }) {
  const { leftRef, rightRef, leftDisabled, rightDisabled } = useEndOfCarousel();
  const imageGroupRef = useRef<HTMLDivElement>(null);

  const handleClick = (leftOrRight: -1 | 1) => {
    if (!imageGroupRef || !imageGroupRef.current) return;
    const node = imageGroupRef.current;
    // snap auto applied to change
    const change = node.offsetHeight;
    imageGroupRef.current.scrollLeft += change * leftOrRight;
  };

  return (
    <div className="w-full h-full relative flex justify-center items-center px-carousel-arrow-width">
      <div
        className="overflow-scroll scroll-smooth h-full w-full flex scrollbar-none smGb:scroll-p-carousel-scroll-padding"
        ref={imageGroupRef}
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div ref={leftRef} />
        <div className="grid grid-rows-1 grid-flow-col gap-carousel-image-gap h-full w-fit m-auto">
          {dataURLs.map((url: string, i) => {
            return (
              <div
                key={i}
                className="relative h-full aspect-1"
                style={{ scrollSnapAlign: "start" }}
              >
                <Image
                  src={url}
                  className="object-cover w-full h-full"
                  alt="post image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          })}
        </div>
        <div ref={rightRef} />
      </div>
      {!leftDisabled && (
        <CarouselArrow
          onClick={() => handleClick(-1)}
          direction="l"
          className="absolute left-0 h-full rounded-md"
        />
      )}
      {!rightDisabled && (
        <CarouselArrow
          onClick={() => handleClick(1)}
          direction="r"
          className="absolute right-0 h-full rounded-md"
        />
      )}
    </div>
  );
}
